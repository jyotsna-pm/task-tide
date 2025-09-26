import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Waves, Sparkles, Heart } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Simulate app loading
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Splash Screen Effect */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-8">
              <Waves className="w-24 h-24 text-blue-500 mx-auto animate-pulse" />
              <Sparkles className="w-8 h-8 text-purple-400 absolute -top-2 -right-2 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">TaskTide</h1>
            <p className="text-gray-600 animate-pulse">Loading your peaceful productivity space...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Waves className="w-12 h-12 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">TaskTide</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center p-6">
            <Card className="max-w-md w-full p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur">
              <div className="mb-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Transform overwhelm into focus
                </h2>
                
                <p className="text-gray-600 mb-2">
                  Let productivity feel supportive, not stressful
                </p>
                <p className="text-sm text-gray-500">
                  AI-powered task management that adapts to your emotional state
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transform transition hover:scale-105"
                  disabled={isLoading}
                >
                  Get Started
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium"
                >
                  Already have account?
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>10k+ users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span>4.8★ rating</span>
                  </div>
                </div>
              </div>
            </Card>
          </main>

          {/* Footer */}
          <footer className="p-6 text-center">
            <p className="text-sm text-gray-500">
              Your journey to mindful productivity starts here
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;
