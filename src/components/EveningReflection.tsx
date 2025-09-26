import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Heart, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Calendar,
  Trophy,
  Clock,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Mic,
  SkipForward,
  Lightbulb,
  Timer,
  ArrowLeft
} from "lucide-react";

interface EveningReflectionProps {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  morningMood: number;
  completedTaskTitles: string[];
  focusedTime?: number; // in minutes
  onComplete: (reflectionData: {
    eveningMood: number;
    reflection: string;
    challenges: string;
    tomorrowPriority: string;
    gratitude: string;
    skipReflection: boolean;
  }) => void;
  onBack?: () => void; // Optional back handler to return to dashboard
}

type ReflectionStep = "summary" | "questions" | "tomorrow" | "goodnight";

const moodEmojis = [
  { emoji: "😫", label: "Drained", value: 1 },
  { emoji: "😞", label: "Tired", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😄", label: "Energized", value: 5 },
];

export function EveningReflection({
  completedTasks,
  totalTasks,
  currentStreak,
  morningMood,
  completedTaskTitles,
  focusedTime = 45,
  onComplete,
  onBack
}: EveningReflectionProps) {
  const [currentStep, setCurrentStep] = useState<ReflectionStep>("summary");
  const [eveningMood, setEveningMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [challenges, setChallenges] = useState("");
  const [tomorrowPriority, setTomorrowPriority] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skipReflection, setSkipReflection] = useState(false);

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const moodImprovement = eveningMood && morningMood ? eveningMood - morningMood : 0;

  const getMoodImprovementIcon = () => {
    if (moodImprovement > 0) return <ArrowUp className="w-4 h-4 text-success-gentle" />;
    if (moodImprovement < 0) return <ArrowDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-ocean-medium" />;
  };

  const getMoodImprovementText = () => {
    if (moodImprovement > 0) return "Mood improved";
    if (moodImprovement < 0) return "Mood dipped";
    return "Mood stable";
  };

  const getSuggestedTasks = () => {
    const energyLevel = eveningMood || 3;
    
    if (energyLevel <= 2) {
      return {
        easy: { task: "Check emails", time: "10 min" },
        medium: { task: "Light organizing", time: "20 min" },
        power: { task: "Rest and recover", time: "60 min" }
      };
    } else if (energyLevel === 3) {
      return {
        easy: { task: "Send follow-up emails", time: "15 min" },
        medium: { task: "Review presentation", time: "30 min" },
        power: { task: "Strategic planning", time: "60 min" }
      };
    } else {
      return {
        easy: { task: "Quick task cleanup", time: "15 min" },
        medium: { task: "Creative brainstorming", time: "45 min" },
        power: { task: "Deep work session", time: "90 min" }
      };
    }
  };

  const handleComplete = (skipReflections: boolean = false) => {
    console.log('Reflection handleComplete called');
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      onComplete({
        eveningMood: eveningMood || 3,
        reflection: skipReflections ? "" : reflection,
        challenges: skipReflections ? "" : challenges,
        tomorrowPriority,
        gratitude: skipReflections ? "" : gratitude,
        skipReflection: skipReflections
      });
      setIsSubmitting(false);
    }, 500);
  };

  const handleSkipReflections = () => {
    setSkipReflection(true);
    setCurrentStep("tomorrow");
  };

  const handleNext = () => {
    switch (currentStep) {
      case "summary":
        setCurrentStep("questions");
        break;
      case "questions":
        setCurrentStep("tomorrow");
        break;
      case "tomorrow":
        setCurrentStep("goodnight");
        break;
      case "goodnight":
        handleComplete(skipReflection);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "questions":
        setCurrentStep("summary");
        break;
      case "tomorrow":
        setCurrentStep("questions");
        break;
      case "goodnight":
        setCurrentStep("tomorrow");
        break;
      case "summary":
      default:
        // If on first step, go back to dashboard if handler provided
        if (onBack) {
          onBack();
        }
        break;
    }
  };

  // Step 1: Achievement Summary
  const renderSummaryStep = () => (
    <Card className="w-full max-w-lg mx-auto shadow-ocean animate-fade-in">
      <CardHeader className="text-center relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center">
          <Trophy className="text-white w-10 h-10" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-ocean-deep">
          Today's Wins
        </CardTitle>
        
        <CardDescription>
          Let's celebrate what you accomplished today
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Task Completion */}
          <div className="flex items-center gap-3 p-3 bg-ocean-mist rounded-lg">
            <CheckCircle className="w-5 h-5 text-success-gentle" />
            <span className="font-medium text-ocean-deep">
              Completed {completedTasks}/{totalTasks} tasks
            </span>
          </div>

          {/* Mood Tracking */}
          {eveningMood && (
            <div className="flex items-center gap-3 p-3 bg-ocean-mist rounded-lg">
              {getMoodImprovementIcon()}
              <span className="font-medium text-ocean-deep">
                {getMoodImprovementText()}
              </span>
            </div>
          )}

          {/* Streak */}
          <div className="flex items-center gap-3 p-3 bg-ocean-mist rounded-lg">
            <Zap className="w-5 h-5 text-encourage-warm" />
            <span className="font-medium text-ocean-deep">
              {currentStreak}-day streak maintained
            </span>
          </div>

          {/* Focus Time */}
          <div className="flex items-center gap-3 p-3 bg-ocean-mist rounded-lg">
            <Timer className="w-5 h-5 text-primary" />
            <span className="font-medium text-ocean-deep">
              Focused for {focusedTime} minutes
            </span>
          </div>
        </div>

        {/* Completed Tasks List */}
        {completedTaskTitles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-ocean-deep">Tasks you conquered:</p>
            {completedTaskTitles.map((title, index) => (
              <div key={index} className="flex items-center gap-2 text-sm bg-success-gentle/10 p-2 rounded">
                <CheckCircle className="w-3 h-3 text-success-gentle" />
                <span className="text-ocean-medium">{title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mood Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-ocean-deep text-center">How are you feeling now?</h3>
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant="ghost"
                size="lg"
                onClick={() => setEveningMood(mood.value)}
                className={`
                  h-12 transition-all duration-300 text-2xl
                  ${eveningMood === mood.value 
                    ? 'ring-2 ring-primary scale-105 bg-primary/10' 
                    : 'hover:scale-105'
                  }
                `}
                title={mood.label}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!eveningMood}
          className="w-full"
          variant="ocean"
          size="lg"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  // Step 2: Reflection Questions
  const renderQuestionsStep = () => (
    <Card className="w-full max-w-lg mx-auto shadow-ocean animate-fade-in">
      <CardHeader className="text-center relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center">
          <Heart className="text-white w-10 h-10" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-ocean-deep">
          Reflection Time
        </CardTitle>
        
        <CardDescription>
          Take a moment to reflect on your day (optional)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ocean-deep mb-2 block">
              What went well today?
            </label>
            <div className="space-y-2">
              <Textarea
                placeholder="I'm proud that I..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[80px] border-ocean-light focus:border-primary"
              />
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Mic className="w-3 h-3 mr-1" />
                Voice note (coming soon)
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ocean-deep mb-2 block">
              What felt challenging?
            </label>
            <div className="space-y-2">
              <Textarea
                placeholder="I found it difficult when..."
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="min-h-[80px] border-ocean-light focus:border-primary"
              />
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Mic className="w-3 h-3 mr-1" />
                Voice note (coming soon)
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            className="flex-1"
            variant="ocean"
            size="lg"
          >
            Save reflections
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={handleSkipReflections}
            variant="ghost"
            size="lg"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Tomorrow's Preview
  const renderTomorrowStep = () => {
    const suggestions = getSuggestedTasks();
    
    return (
      <Card className="w-full max-w-lg mx-auto shadow-ocean animate-fade-in">
        <CardHeader className="text-center relative">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center">
            <Lightbulb className="text-white w-10 h-10" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-ocean-deep">
            Tomorrow's Preview
          </CardTitle>
          
          <CardDescription>
            Based on today's energy, tomorrow we suggest:
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success-gentle/10 rounded-lg border-l-4 border-l-success-gentle">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-success-gentle rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Start with:</p>
                <p className="font-medium text-ocean-deep">{suggestions.easy.task}</p>
                <p className="text-xs text-muted-foreground">({suggestions.easy.time})</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border-l-4 border-l-primary">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">When energized:</p>
                <p className="font-medium text-ocean-deep">{suggestions.medium.task}</p>
                <p className="text-xs text-muted-foreground">({suggestions.medium.time})</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-encourage-warm/10 rounded-lg border-l-4 border-l-encourage-warm">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-encourage-warm rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Power hour:</p>
                <p className="font-medium text-ocean-deep">{suggestions.power.task}</p>
                <p className="text-xs text-muted-foreground">({suggestions.power.time})</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ocean-deep mb-2 block">
              Any adjustments for tomorrow?
            </label>
            <Textarea
              placeholder="Tomorrow I want to focus on..."
              value={tomorrowPriority}
              onChange={(e) => setTomorrowPriority(e.target.value)}
              className="min-h-[60px] border-ocean-light focus:border-primary"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleNext}
              className="flex-1"
              variant="ocean"
              size="lg"
            >
              Looks good
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={handleNext}
              variant="ghost"
              size="lg"
              className="px-6"
            >
              I'll adjust tomorrow
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 4: Good Night Message
  const renderGoodnightStep = () => (
    <Card className="w-full max-w-lg mx-auto shadow-ocean animate-fade-in">
      <CardHeader className="text-center relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center">
          <Moon className="text-white w-10 h-10" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-ocean-deep">
          Good Night
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg">
            <Star className="w-6 h-6 mx-auto mb-3 text-encourage-warm" />
            <p className="text-lg font-medium text-ocean-deep mb-2">
              "Rest well! Tomorrow is a fresh start 🌟"
            </p>
            <p className="text-sm text-ocean-medium">
              You've done great today. Let your mind and body recharge for tomorrow's adventures.
            </p>
          </div>

          {!skipReflection && reflection && (
            <div className="text-left p-4 bg-ocean-mist rounded-lg">
              <p className="text-sm font-medium text-ocean-deep mb-2">Today's reflection:</p>
              <p className="text-sm text-ocean-medium italic">"{reflection}"</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => handleComplete()}
          disabled={isSubmitting}
          className="w-full"
          variant="ocean"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sweet dreams...
            </>
          ) : (
            <>
              Sweet dreams
              <Moon className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      {currentStep === "summary" && renderSummaryStep()}
      {currentStep === "questions" && renderQuestionsStep()}
      {currentStep === "tomorrow" && renderTomorrowStep()}
      {currentStep === "goodnight" && renderGoodnightStep()}
    </div>
  );
}