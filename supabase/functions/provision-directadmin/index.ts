import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const DIRECTADMIN_URL = Deno.env.get("DIRECTADMIN_URL");
    const DIRECTADMIN_USERNAME = Deno.env.get("DIRECTADMIN_USERNAME");
    const DIRECTADMIN_PASSWORD = Deno.env.get("DIRECTADMIN_PASSWORD");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", order.user_id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each hosting item in the order
    const hostingItems = (order.order_items || []).filter(
      (item: any) => item.type === "hosting"
    );

    // Also check the items JSON field
    const jsonItems = Array.isArray(order.items)
      ? (order.items as any[]).filter((item: any) => item.type === "hosting")
      : [];

    const itemsToProvision = hostingItems.length > 0 ? hostingItems : jsonItems;

    const results = [];

    for (const item of itemsToProvision) {
      const planId = item.plan_id || item.planId;

      // Get hosting plan details
      let planData = null;
      if (planId) {
        const { data } = await supabase
          .from("hosting_plans")
          .select("*")
          .eq("id", planId)
          .single();
        planData = data;
      }

      // Generate DirectAdmin credentials
      const username = generateUsername(profile.email, profile.first_name);
      const password = generatePassword();
      const domain = item.domain || `${username}.abancool.com`;

      // Determine package name based on plan
      const packageName = mapPlanToPackage(planData?.name || item.name);

      // Create service record
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .insert({
          user_id: order.user_id,
          plan_id: planId,
          domain: domain,
          status: "pending",
          billing_cycle: item.billing_cycle || item.billingCycle || "monthly",
          next_due_date: calculateNextDueDate(item.billing_cycle || item.billingCycle || "monthly"),
        })
        .select()
        .single();

      if (serviceError) {
        console.error("Error creating service:", serviceError);
        results.push({ error: serviceError.message, item: item.name });
        continue;
      }

      // Attempt DirectAdmin API provisioning
      let daAccountCreated = false;
      let serverIp = "server1.abancool.com";

      if (DIRECTADMIN_URL && DIRECTADMIN_USERNAME && DIRECTADMIN_PASSWORD) {
        try {
          const daResult = await createDirectAdminAccount({
            url: DIRECTADMIN_URL,
            adminUser: DIRECTADMIN_USERNAME,
            adminPass: DIRECTADMIN_PASSWORD,
            username,
            password,
            domain,
            packageName,
            email: profile.email,
          });

          daAccountCreated = true;
          serverIp = DIRECTADMIN_URL.replace("https://", "").replace("http://", "").split(":")[0];
          console.log("DirectAdmin account created:", daResult);
        } catch (daError) {
          console.error("DirectAdmin API error:", daError);
          // Continue - account will be provisioned manually
        }
      } else {
        console.log("DirectAdmin credentials not configured - service created for manual provisioning");
      }

      // Create DirectAdmin account record
      await supabase.from("directadmin_accounts").insert({
        user_id: order.user_id,
        order_id: order.id,
        service_id: service.id,
        username,
        domain,
        package_name: packageName,
        server_ip: serverIp,
        status: daAccountCreated ? "active" : "pending",
      });

      // Update service status
      await supabase
        .from("services")
        .update({ status: daAccountCreated ? "active" : "pending" })
        .eq("id", service.id);

      // Create service provisioning record
      await supabase.from("service_provisioning").insert({
        order_id: order.id,
        service_id: service.id,
        plan_id: planId,
        domain,
        status: daAccountCreated ? "completed" : "pending",
        provisioning_data: {
          username,
          password: daAccountCreated ? "sent_via_email" : password,
          server_ip: serverIp,
          package_name: packageName,
        },
        provisioned_at: daAccountCreated ? new Date().toISOString() : null,
      });

      // Queue welcome email with credentials
      await supabase.from("email_queue").insert({
        to_email: profile.email,
        subject: `Your Hosting Account is Ready - ${domain}`,
        html_content: generateWelcomeEmail(
          profile.first_name || profile.email.split("@")[0],
          domain,
          username,
          password,
          serverIp,
          packageName
        ),
        template_name: "hosting_welcome",
        template_data: { domain, username, package_name: packageName },
        status: "pending",
        scheduled_at: new Date().toISOString(),
      });

      results.push({
        success: true,
        service_id: service.id,
        domain,
        username,
        da_provisioned: daAccountCreated,
      });
    }

    // Update order status to completed
    await supabase
      .from("orders")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Provisioning error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Provisioning failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function createDirectAdminAccount(config: {
  url: string;
  adminUser: string;
  adminPass: string;
  username: string;
  password: string;
  domain: string;
  packageName: string;
  email: string;
}) {
  const { url, adminUser, adminPass, username, password, domain, packageName, email } = config;

  // Determine if this is a reseller or user account
  const isReseller = packageName.toLowerCase().includes("reseller");

  const endpoint = isReseller
    ? `${url}/CMD_API_ACCOUNT_RESELLER`
    : `${url}/CMD_API_ACCOUNT_USER`;

  const params = new URLSearchParams({
    action: "create",
    add: "Submit",
    username,
    email,
    passwd: password,
    passwd2: password,
    domain,
    package: packageName,
    ip: "shared",
    notify: "yes",
  });

  if (isReseller) {
    params.set("overselling", "ON");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${adminUser}:${adminPass}`),
    },
    body: params.toString(),
  });

  const text = await response.text();

  if (text.includes("error=1") || text.includes("Error")) {
    throw new Error(`DirectAdmin API error: ${text}`);
  }

  return { success: true, response: text };
}

function generateUsername(email: string, firstName?: string | null): string {
  const base = firstName
    ? firstName.toLowerCase().replace(/[^a-z0-9]/g, "")
    : email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return (base.substring(0, 8) + suffix).substring(0, 12);
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function mapPlanToPackage(planName: string): string {
  const name = planName.toLowerCase();
  if (name.includes("starter") || name.includes("basic")) return "starter_hosting";
  if (name.includes("business") || name.includes("professional")) return "business_hosting";
  if (name.includes("enterprise") || name.includes("premium")) return "enterprise_hosting";
  if (name.includes("reseller")) return "reseller_hosting";
  return "starter_hosting";
}

function calculateNextDueDate(billingCycle: string): string {
  const now = new Date();
  switch (billingCycle) {
    case "monthly":
      now.setMonth(now.getMonth() + 1);
      break;
    case "quarterly":
      now.setMonth(now.getMonth() + 3);
      break;
    case "annually":
      now.setFullYear(now.getFullYear() + 1);
      break;
    case "biennial":
      now.setFullYear(now.getFullYear() + 2);
      break;
    default:
      now.setMonth(now.getMonth() + 1);
  }
  return now.toISOString();
}

function generateWelcomeEmail(
  name: string,
  domain: string,
  username: string,
  password: string,
  serverIp: string,
  packageName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Your Hosting Account is Ready!</h1>
    <p style="color: #94a3b8; margin-top: 8px;">Welcome to Abancool Technology</p>
  </div>
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
    <p style="color: #334155; font-size: 16px;">Hi <strong>${name}</strong>,</p>
    <p style="color: #334155;">Your hosting account has been successfully provisioned. Here are your login details:</p>
    
    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e293b; margin-top: 0;">🔐 Account Credentials</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Control Panel:</td><td style="color: #1e293b; font-weight: bold;">https://${serverIp}:2222</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Username:</td><td style="color: #1e293b; font-weight: bold;">${username}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Password:</td><td style="color: #1e293b; font-weight: bold;">${password}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Domain:</td><td style="color: #1e293b; font-weight: bold;">${domain}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Package:</td><td style="color: #1e293b; font-weight: bold;">${packageName}</td></tr>
      </table>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #92400e; margin: 0; font-size: 14px;">
        ⚠️ <strong>Important:</strong> Please change your password after your first login for security.
      </p>
    </div>

    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h4 style="color: #166534; margin-top: 0;">🚀 Getting Started</h4>
      <ol style="color: #166534; margin: 0; padding-left: 20px;">
        <li>Login to your control panel using the credentials above</li>
        <li>Point your domain's nameservers to our servers</li>
        <li>Upload your website files via File Manager or FTP</li>
        <li>Set up your email accounts</li>
      </ol>
    </div>

    <p style="color: #334155;">Need help? Our support team is available 24/7:</p>
    <ul style="color: #334155;">
      <li>Email: support@abancool.com</li>
      <li>Support Portal: <a href="https://abancool.com/support" style="color: #3b82f6;">abancool.com/support</a></li>
    </ul>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
      © ${new Date().getFullYear()} Abancool Technology. All rights reserved.
    </p>
  </div>
</body>
</html>`;
}
