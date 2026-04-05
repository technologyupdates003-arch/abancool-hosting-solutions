import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Eye, EyeOff, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuestCheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (guestData: GuestFormData) => void;
  loading?: boolean;
}

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
  password: string;
  confirmPassword: string;
}

export function GuestCheckoutForm({ isOpen, onClose, onSubmit, loading }: GuestCheckoutFormProps) {
  const [formData, setFormData] = useState<GuestFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postCode: "",
    country: "Kenya",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password, confirmPassword: password });
    setPasswordStrength("strong");
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    toast({
      title: "Password Copied",
      description: "Password has been copied to clipboard",
    });
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    
    // Simple password strength check
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create new account with your order</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h3 className="font-semibold mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex">
                    <Select defaultValue="+254">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+254">🇰🇪</SelectItem>
                        <SelectItem value="+27">🇿🇦</SelectItem>
                        <SelectItem value="+1">🇺🇸</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 rounded-l-none"
                      placeholder="700 000 000"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div>
              <h3 className="font-semibold mb-4">Billing information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postCode">Post Code</Label>
                  <Input
                    id="postCode"
                    value={formData.postCode}
                    onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="font-semibold mb-4">Account Security</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generatePassword}
                        title="Generate Password"
                      >
                        🎲
                      </Button>
                      {formData.password && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={copyPassword}
                          title="Copy Password"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {passwordStrength && (
                    <p className={`text-xs mt-1 ${
                      passwordStrength === 'strong' ? 'text-green-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      Password is {passwordStrength}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}