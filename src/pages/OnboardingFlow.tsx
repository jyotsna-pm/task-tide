import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Zap, 
  Target, 
  Clock,
  MessageCircle,
  Mail,
  Bell,
  Smartphone,
  Check,
  Plus,
  Brain,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/App";

type OnboardingStep = 
  | "verification"
  | "welcome" 
  | "emotional-profile" 
  | "communication-preferences" 
  | "first-mood-check" 
  | "task-walkthrough" 
  | "add-first-task"
  | "add-second-task" 
  | "add-third-task"
  | "ai-processing"
  | "task-prioritization"
  | "tutorial-overlays"
  | "complete";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { setHasCompletedOnboarding, setIsAuthenticated } = useAppContext();
  
  const initialStep = (searchParams.get("step") as OnboardingStep) || "welcome";
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [verificationCode, setVerificationCode] = useState("");
  const [userName, setUserName] = useState("");
  const [emotionalProfile, setEmotionalProfile] = useState<string[]>([]);
  const [communicationPrefs, setCommunicationPrefs] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [currentMood, setCurrentMood] = useState(3);
  const [tasks, setTasks] = useState<Array<{title: string, category: string, estimatedTime?: number}>>([]);
  const [currentTaskInput, setCurrentTaskInput] = useState("");
  const [currentTaskCategory, setCurrentTaskCategory] = useState("Work");
  const [prioritizedTasks, setPrioritizedTasks] = useState<any[]>([]);
  const [tutorialStep, setTutorialStep] = useState(0);

  const steps: OnboardingStep[] = [
    "verification", "welcome", "emotional-profile", "communication-preferences", 
    "first-mood-check", "task-walkthrough", "add-first-task", "add-second-task", 
    "add-third-task", "ai-processing", "task-prioritization", "tutorial-overlays", "complete"
  ];

  useEffect(() => {
    const currentIndex = steps.indexOf(currentStep);
    setProgress((currentIndex / (steps.length - 1)) * 100);
  }, [currentStep]);

  const overwhelmOptions = [
    { id: "choices", label: "Too many choices" },
    { id: "perfectionism", label: "Perfectionism paralysis" },
    { id: "priorities", label: "Unclear priorities" },
    { id: "guilt", label: "Feeling guilty about delays" }
  ];

  const communicationOptions = [
    { id: "whatsapp", label: "WhatsApp reminders", recommended: true },
    { id: "email", label: "Email notifications" },
    { id: "app", label: "App notifications only" }
  ];

  const taskCategories = ["Work", "Personal", "Learning", "Health"];

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleVerification = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Verification Successful!",
        description: "Welcome to TaskTide! 🌊",
      });
      setIsLoading(false);
      handleNext();
    }, 1500);
  };

  const handleEmotionalProfileToggle = (optionId: string) => {
    setEmotionalProfile(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleAddTask = () => {
    if (!currentTaskInput.trim()) {
      toast({
        title: "Task Required",
        description: "Please enter a task description.",
        variant: "destructive",
      });
      return;
    }

    const newTask = {
      title: currentTaskInput,
      category: currentTaskCategory,
      estimatedTime: Math.floor(Math.random() * 60) + 15 // Random time for demo
    };

    setTasks(prev => [...prev, newTask]);
    setCurrentTaskInput("");
    toast({
      title: "Task Added!",
      description: `"${newTask.title}" added to your list.`,
    });
    
    handleNext();
  };

  const handleAIProcessing = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate AI prioritization
      const prioritized = tasks.map((task, index) => ({
        ...task,
        priority: index + 1,
        difficulty: currentMood <= 2 ? "Easy" : currentMood >= 4 ? "Complex" : "Medium",
        aiReason: currentMood <= 2 ? "Starting with easy wins for your energy level" : 
                 currentMood >= 4 ? "Perfect energy for challenging tasks!" : 
                 "Balanced approach for your current mood"
      }));
      
      setPrioritizedTasks(prioritized);
      setIsLoading(false);
      handleNext();
    }, 3000);
  };

  const handleCompleteOnboarding = () => {
    // Save all onboarding data
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("userName", userName);
    localStorage.setItem("emotionalProfile", JSON.stringify(emotionalProfile));
    localStorage.setItem("communicationPrefs", communicationPrefs);
    localStorage.setItem("whatsappNumber", whatsappNumber);
    localStorage.setItem("initialTasks", JSON.stringify(prioritizedTasks));
    
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
    
    toast({
      title: "Welcome to TaskTide! 🌊",
      description: "Your mindful productivity journey begins now!",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "verification":
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Code</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to your email/phone
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              
              <Button 
                onClick={handleVerification} 
                className="w-full" 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code? 
                <button className="text-blue-600 hover:text-blue-700 ml-1">
                  Resend
                </button>
              </p>
            </div>
          </Card>
        );

      case "welcome":
        return (
          <Card className="p-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Hi! Ready to make productivity feel supportive?
              </h2>
              <p className="text-gray-600">
                Let's set up your personalized experience in just a few steps
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="What should we call you?"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center"
              />
              
              <Button 
                onClick={handleNext} 
                className="w-full"
                disabled={!userName.trim()}
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case "emotional-profile":
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                What usually overwhelms you most?
              </h2>
              <p className="text-gray-600 text-sm">
                Select all that apply - this helps us support you better
              </p>
            </div>

            <div className="space-y-3">
              {overwhelmOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleEmotionalProfileToggle(option.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    emotionalProfile.includes(option.id)
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2"></span>
                      {emotionalProfile.includes(option.id) && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full mt-6"
              disabled={emotionalProfile.length === 0}
            >
              Next
            </Button>
          </Card>
        );

      case "communication-preferences":
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                How should we support you?
              </h2>
              <p className="text-gray-600 text-sm">
                Choose how you'd like to receive gentle reminders
              </p>
            </div>

            <div className="space-y-3">
              {communicationOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setCommunicationPrefs(option.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    communicationPrefs === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">{option.label}</span>
                      {option.recommended && (
                        <Badge variant="secondary" className="ml-2">Recommended</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500"></span>
                  </div>
                </button>
              ))}
            </div>

            {communicationPrefs === "whatsapp" && (
              <div className="mt-4">
                <Input
                  type="tel"
                  placeholder="Your WhatsApp number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <Button 
              onClick={handleNext} 
              className="w-full mt-6"
              disabled={!communicationPrefs || (communicationPrefs === "whatsapp" && !whatsappNumber)}
            >
              Next
            </Button>
          </Card>
        );

      case "first-mood-check":
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                How's your energy right now?
              </h2>
              <p className="text-gray-600 text-sm">
                This helps us match tasks to your current state
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Low</span>
                <span className="text-sm text-gray-500">High</span>
              </div>
              
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setCurrentMood(level)}
                    className={`w-16 h-16 rounded-full border-2 transition-all ${
                      currentMood === level
                        ? "border-blue-500 bg-blue-100 text-blue-800"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {currentMood === 1 && "Taking it gentle today ✨"}
                  {currentMood === 2 && "Starting slow is perfectly fine 🌱"}
                  {currentMood === 3 && "Feeling balanced and ready 💫"}
                  {currentMood === 4 && "Great energy for meaningful work 🚀"}
                  {currentMood === 5 && "Amazing! You're ready for anything ⭐"}
                </p>
              </div>
            </div>

            <Button onClick={handleNext} className="w-full mt-6">
              Continue
            </Button>
          </Card>
        );

      case "task-walkthrough":
        return (
          <Card className="p-6 text-center">
            <div className="mb-6">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Let's add what's on your mind
              </h2>
              <p className="text-gray-600">
                We'll start with 3 tasks to understand your workflow
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Add Your First Task</span>
              </div>
              <p className="text-sm text-blue-600">
                Don't worry about details - just capture what's in your head
              </p>
            </div>

            <Button onClick={handleNext} className="w-full">
              Let's Start
            </Button>
          </Card>
        );

      case "add-first-task":
      case "add-second-task":
      case "add-third-task":
        const taskNumber = currentStep.includes("first") ? 1 : currentStep.includes("second") ? 2 : 3;
        const isLastTask = taskNumber === 3;
        
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Task {taskNumber} of 3
              </h2>
              <p className="text-gray-600 text-sm">
                {taskNumber === 1 && "What's the first thing on your mind?"}
                {taskNumber === 2 && "Great! What else needs to be done?"}
                {taskNumber === 3 && "One more task to complete your initial list"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What needs to be done?
                </label>
                <Textarea
                  placeholder="e.g., Review presentation for Monday meeting"
                  value={currentTaskInput}
                  onChange={(e) => setCurrentTaskInput(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {taskCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setCurrentTaskCategory(category)}
                      className={`p-3 rounded-lg border transition-all ${
                        currentTaskCategory === category
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleAddTask} 
                className="w-full"
                disabled={!currentTaskInput.trim()}
              >
                {isLastTask ? "Add Task & Continue" : "Add Task"}
              </Button>

              {tasks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Added so far:</p>
                  <div className="space-y-2">
                    {tasks.map((task, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{task.title}</span>
                          <Badge variant="outline">{task.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );

      case "ai-processing":
        return (
          <Card className="p-6 text-center">
            <div className="mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-spin">
                  <div className="w-full h-full rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Analyzing your emotional context and tasks...
              </h2>
              <p className="text-gray-600">
                Our AI is matching your {tasks.length} tasks to your current energy level
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Understanding your mood patterns
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Analyzing task complexity
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Creating optimal sequence
              </div>
            </div>

            {!isLoading && (
              <Button onClick={handleAIProcessing} className="w-full">
                Start Analysis
              </Button>
            )}

            {isLoading && (
              <div className="text-sm text-gray-500">
                This usually takes a few seconds...
              </div>
            )}
          </Card>
        );

      case "task-prioritization":
        return (
          <Card className="p-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Based on your mood, here's what we suggest:
              </h2>
              <p className="text-gray-600 text-sm">
                Optimized for your current energy level ({currentMood}/5)
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {prioritizedTasks.map((task, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        task.difficulty === "Easy" ? "bg-green-100 text-green-600" :
                        task.difficulty === "Medium" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-medium">{task.title}</span>
                        <div className="text-sm text-gray-500">{task.estimatedTime} min • {task.difficulty}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 ml-11">
                    {task.aiReason}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleNext} className="flex-1">
                Looks good!
              </Button>
              <Button variant="outline" className="flex-1">
                Let me adjust
              </Button>
            </div>
          </Card>
        );

      case "tutorial-overlays":
        const tutorialSteps = [
          {
            title: "Tap any task to see micro-steps",
            description: "Breaking down overwhelming tasks into tiny, manageable actions",
            icon: Target
          },
          {
            title: "Swipe left to reschedule", 
            description: "Easily move tasks when your energy or priorities change",
            icon: Clock
          },
          {
            title: "Your mood affects task difficulty",
            description: "We automatically adjust recommendations based on how you feel",
            icon: Heart
          },
          {
            title: "Check WhatsApp for gentle reminders",
            description: "Supportive nudges that feel like a friend, not pressure",
            icon: MessageCircle
          }
        ];

        const currentTutorial = tutorialSteps[tutorialStep];
        const Icon = currentTutorial.icon;

        return (
          <Card className="p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {currentTutorial.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentTutorial.description}
              </p>
            </div>

            {/* Tutorial Progress */}
            <div className="flex justify-center mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === tutorialStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              {tutorialStep < tutorialSteps.length - 1 ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Skip tutorial
                  </Button>
                  <Button 
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="flex-1"
                  >
                    Next tip
                  </Button>
                </>
              ) : (
                <Button onClick={handleNext} className="w-full">
                  Got it! Let's start
                </Button>
              )}
            </div>
          </Card>
        );

      case "complete":
        return (
          <Card className="p-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to TaskTide, {userName}! 🌊
              </h2>
              <p className="text-gray-600 mb-2">
                Your mindful productivity journey is ready to begin
              </p>
              <p className="text-sm text-gray-500">
                Everything is set up based on your preferences and energy patterns
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-blue-800 space-y-1">
                <div>✓ {emotionalProfile.length} overwhelm patterns identified</div>
                <div>✓ {communicationPrefs === "whatsapp" ? "WhatsApp" : communicationPrefs} reminders enabled</div>
                <div>✓ {tasks.length} tasks prioritized by AI</div>
                <div>✓ Mood-based recommendations activated</div>
              </div>
            </div>

            <Button onClick={handleCompleteOnboarding} className="w-full">
              Enter TaskTide
            </Button>
          </Card>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={currentStep === "verification" ? () => navigate("/signup") : handleBack}
            disabled={currentStep === "welcome"}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="text-sm text-gray-500">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Skip Button for non-essential steps */}
        {["tutorial-overlays"].includes(currentStep) && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setCurrentStep("complete")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip and go to app
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
