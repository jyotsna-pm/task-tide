import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Verification Code Sent!",
        description: `We've sent a code to your ${signupMethod === "email" ? "email" : "phone"}`,
      });
      
      // Store user data and navigate to verification
      localStorage.setItem("pendingUser", JSON.stringify({
        ...formData,
        method: signupMethod
      }));
      
      navigate("/onboarding?step=verification");
      setIsLoading(false);
    }, 2000);
  };

  const handleSocialSignUp = (provider: string) => {
    toast({
      title: `${provider} Sign Up`,
      description: "Social sign-up integration would happen here",
    });
    // For demo, go straight to onboarding
    setTimeout(() => {
      navigate("/onboarding");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/landing")}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        </div>

        {/* Sign Up Card */}
        <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Join TaskTide
            </h2>
            <p className="text-gray-600 text-sm">
              Start your journey to mindful productivity
            </p>
          </div>

          {/* Method Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                signupMethod === "email"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setSignupMethod("email")}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                signupMethod === "phone"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setSignupMethod("phone")}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Email or Phone Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {signupMethod === "email" ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <Input
                type={signupMethod === "email" ? "email" : "tel"}
                placeholder={signupMethod === "email" ? "Enter your email" : "Enter your phone number"}
                value={signupMethod === "email" ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(signupMethod, e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Social Sign Up */}
          <div className="mt-6">
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => handleSocialSignUp("Google")}
                className="w-full py-3 rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSocialSignUp("Apple")}
                className="w-full py-3 rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.86 11.35 7.75 12.1 7.75C12.83 7.75 14.3 6.68 15.87 6.84C16.58 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
