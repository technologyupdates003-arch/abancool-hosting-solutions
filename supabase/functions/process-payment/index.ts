import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const INTASEND_BASE_URL = "https://payment.intasend.com/api/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const INTASEND_SECRET_KEY = Deno.env.get("INTASEND_SECRET_KEY");
    const INTASEND_API_KEY = Deno.env.get("INTASEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!INTASEND_SECRET_KEY || !INTASEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "IntaSend API keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get auth user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
    ).auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "initiate_card") {
      return await handleCardPayment(body, user, supabase, INTASEND_API_KEY, INTASEND_SECRET_KEY);
    } else if (action === "initiate_mpesa") {
      return await handleMpesaSTK(body, user, supabase, INTASEND_API_KEY, INTASEND_SECRET_KEY);
    } else if (action === "check_status") {
      return await checkPaymentStatus(body, supabase, INTASEND_API_KEY, INTASEND_SECRET_KEY);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleCardPayment(
  body: any,
  user: any,
  supabase: any,
  apiKey: string,
  secretKey: string
) {
  const { order_id, amount, currency, redirect_url } = body;

  if (!order_id || !amount) {
    return new Response(
      JSON.stringify({ error: "order_id and amount are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Get user profile for email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, first_name, last_name, phone")
    .eq("id", user.id)
    .single();

  // Create IntaSend checkout session for card payment
  const response = await fetch(`${INTASEND_BASE_URL}/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      public_key: apiKey,
      amount: amount,
      currency: currency || "KES",
      email: profile?.email || user.email,
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone_number: profile?.phone || "",
      api_ref: order_id,
      redirect_url: redirect_url || `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/order-confirmation`,
      comment: `Order #${order_id}`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("IntaSend card error:", data);
    return new Response(
      JSON.stringify({ error: "Failed to initiate card payment", details: data }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Record payment transaction
  await supabase.from("payment_transactions").insert({
    order_id,
    payment_method: "card",
    amount,
    currency: currency || "KES",
    status: "pending",
    transaction_id: data.id || data.invoice?.invoice_id,
    gateway_response: data,
  });

  return new Response(
    JSON.stringify({
      success: true,
      checkout_url: data.url,
      invoice_id: data.id || data.invoice?.invoice_id,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleMpesaSTK(
  body: any,
  user: any,
  supabase: any,
  apiKey: string,
  secretKey: string
) {
  const { order_id, amount, phone_number, currency } = body;

  if (!order_id || !amount || !phone_number) {
    return new Response(
      JSON.stringify({ error: "order_id, amount, and phone_number are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Format phone number (ensure 254 prefix)
  let formattedPhone = phone_number.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");
  if (!formattedPhone.startsWith("254")) {
    formattedPhone = "254" + formattedPhone;
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, first_name, last_name")
    .eq("id", user.id)
    .single();

  // Initiate M-Pesa STK push via IntaSend
  const response = await fetch(`${INTASEND_BASE_URL}/payment/mpesa-stk-push/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      public_key: apiKey,
      amount: amount,
      phone_number: formattedPhone,
      api_ref: order_id,
      narrative: `Payment for Order #${order_id}`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("IntaSend M-Pesa error:", data);
    return new Response(
      JSON.stringify({ error: "Failed to initiate M-Pesa payment", details: data }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Record payment transaction
  await supabase.from("payment_transactions").insert({
    order_id,
    payment_method: "mpesa",
    amount,
    currency: currency || "KES",
    status: "pending",
    transaction_id: data.invoice?.invoice_id || data.id,
    gateway_response: data,
  });

  return new Response(
    JSON.stringify({
      success: true,
      invoice_id: data.invoice?.invoice_id || data.id,
      message: "STK push sent to your phone. Please enter your M-Pesa PIN.",
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function checkPaymentStatus(body: any, supabase: any, apiKey: string, secretKey: string) {
  const { invoice_id, order_id } = body;

  if (!invoice_id) {
    return new Response(
      JSON.stringify({ error: "invoice_id is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check status with IntaSend
  const response = await fetch(`${INTASEND_BASE_URL}/payment/status/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      public_key: apiKey,
      invoice_id: invoice_id,
    }),
  });

  const data = await response.json();

  if (data.invoice?.state === "COMPLETE") {
    // Update payment transaction
    await supabase
      .from("payment_transactions")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
        gateway_response: data,
      })
      .eq("transaction_id", invoice_id);

    // Update order status
    if (order_id) {
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      // Create invoice
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", order_id)
        .single();

      if (order) {
        await supabase.from("invoices").insert({
          user_id: order.user_id,
          order_id: order.id,
          amount: order.total,
          currency: order.currency || "KSh",
          status: "paid",
          due_date: new Date().toISOString(),
          paid_at: new Date().toISOString(),
        });

        // Trigger DirectAdmin provisioning
        try {
          await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/provision-directadmin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              },
              body: JSON.stringify({ order_id: order.id }),
            }
          );
        } catch (provisionError) {
          console.error("DirectAdmin provisioning trigger failed:", provisionError);
        }
      }
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      status: data.invoice?.state || "PENDING",
      data: data,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
