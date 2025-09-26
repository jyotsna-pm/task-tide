import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Waves, Heart, Target, Sparkles } from "lucide-react";

const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to TaskTide",
    description: "Your emotionally-intelligent task companion",
    icon: <Waves className="w-12 h-12 text-ocean-deep" />
  },
  {
    id: "philosophy",
    title: "Our Philosophy",
    description: "Forgiveness over punishment. Progress over perfection.",
    icon: <Heart className="w-12 h-12 text-success-gentle" />
  },
  {
    id: "how-it-works",
    title: "How It Works",
    description: "We adapt your tasks based on your emotional state",
    icon: <Target className="w-12 h-12 text-primary" />
  },
  {
    id: "personalize",
    title: "Let's Personalize",
    description: "Tell us a bit about yourself",
    icon: <Sparkles className="w-12 h-12 text-encourage-warm" />
  }
];

interface OnboardingProps {
  onComplete: (userData: { name: string; goals: string[] }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    goals: [] as string[]
  });

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const goalOptions = [
    "Better work-life balance",
    "Reduce overwhelm",
    "Build consistent habits",
    "Improve productivity",
    "Manage stress better",
    "Complete important projects"
  ];

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-ocean animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-ocean rounded-full w-20 h-20 flex items-center justify-center">
            {currentStepData.icon}
          </div>
          
          <CardTitle className="text-2xl font-bold text-ocean-deep">
            {currentStepData.title}
          </CardTitle>
          
          <CardDescription className="text-ocean-medium">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          {currentStepData.id === "welcome" && (
            <div className="text-center space-y-4">
              <p className="text-ocean-medium">
                TaskTide helps you manage tasks while honoring your emotional state. 
                No more overwhelming to-do lists or guilt about incomplete tasks.
              </p>
            </div>
          )}

          {currentStepData.id === "philosophy" && (
            <div className="space-y-4">
              <div className="bg-ocean-mist rounded-lg p-4">
                <h4 className="font-semibold text-ocean-deep mb-2">🌊 Gentle Approach</h4>
                <p className="text-sm text-ocean-medium">
                  Missed tasks don't break your streak. Life happens, and we understand.
                </p>
              </div>
              <div className="bg-ocean-mist rounded-lg p-4">
                <h4 className="font-semibold text-ocean-deep mb-2">🎯 Smart Prioritization</h4>
                <p className="text-sm text-ocean-medium">
                  Maximum 3 tasks at a time, sized for your current capacity.
                </p>
              </div>
            </div>
          )}

          {currentStepData.id === "how-it-works" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-3xl">😊</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-3xl">📋</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-3xl">🎉</span>
                </div>
                <p className="text-sm text-ocean-medium">
                  Daily check-in → Smart task selection → Celebration
                </p>
              </div>
            </div>
          )}

          {currentStepData.id === "personalize" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-ocean-deep">What should we call you?</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-ocean-deep mb-3 block">What are your goals? (select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2">
                  {goalOptions.map((goal) => (
                    <Button
                      key={goal}
                      variant={userData.goals.includes(goal) ? "ocean" : "outline"}
                      size="sm"
                      onClick={() => handleGoalToggle(goal)}
                      className="justify-start text-left h-auto py-2 px-3"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ocean"
            size="lg"
            onClick={handleNext}
            disabled={currentStepData.id === "personalize" && !userData.name.trim()}
            className="w-full"
          >
            {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}