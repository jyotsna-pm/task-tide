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
  Trophy
} from "lucide-react";

interface EveningReflectionProps {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  morningMood: number;
  completedTaskTitles: string[];
  onComplete: (reflectionData: {
    eveningMood: number;
    reflection: string;
    tomorrowPriority: string;
    gratitude: string;
  }) => void;
}

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
  onComplete
}: EveningReflectionProps) {
  const [eveningMood, setEveningMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [tomorrowPriority, setTomorrowPriority] = useState("");
  const [gratitude, setGratitude] = useState("");

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  const moodImprovement = eveningMood && morningMood ? eveningMood - morningMood : 0;

  const handleComplete = () => {
    if (eveningMood) {
      onComplete({
        eveningMood,
        reflection,
        tomorrowPriority,
        gratitude
      });
    }
  };

  const getEncouragementMessage = () => {
    if (completionPercentage === 100) {
      return "Perfect day! You completed everything you set out to do! 🌟";
    } else if (completionPercentage >= 75) {
      return "Excellent progress! You accomplished most of your goals today! 🚀";
    } else if (completionPercentage >= 50) {
      return "Solid work today! You're building great momentum! 💪";
    } else if (completedTasks > 0) {
      return "Every step counts! You made progress and that's what matters! 🌊";
    } else {
      return "Tomorrow is a fresh start! Sometimes rest days are exactly what we need! 🌱";
    }
  };

  const getMoodChangeMessage = () => {
    if (moodImprovement > 0) {
      return "Your mood improved throughout the day! 📈";
    } else if (moodImprovement === 0) {
      return "You maintained your energy well today! ⚖️";
    } else {
      return "Rest well tonight - tomorrow brings new opportunities! 🌙";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto shadow-ocean animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center">
            <Moon className="text-white w-10 h-10" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-ocean-deep">
            Evening Reflection
          </CardTitle>
          
          <CardDescription>
            Take a moment to reflect on your day and prepare for tomorrow
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Day Summary */}
          <div className="bg-ocean-mist rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-ocean-deep flex items-center gap-2">
              <Trophy className="w-4 h-4 text-encourage-warm" />
              Today's Achievements
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-ocean-deep">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-gentle">{currentStreak}</div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Daily Progress</span>
                <span className="font-medium text-ocean-deep">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <p className="text-sm text-center text-ocean-medium">
              {getEncouragementMessage()}
            </p>

            {completedTaskTitles.length > 0 && (
              <div>
                <p className="text-sm font-medium text-ocean-deep mb-2">What you accomplished:</p>
                <div className="space-y-1">
                  {completedTaskTitles.map((title, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-success-gentle" />
                      <span className="text-ocean-medium">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Evening Mood Check */}
          <div>
            <h3 className="font-semibold text-ocean-deep mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-encourage-warm" />
              How are you feeling now?
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-3">
              {moodEmojis.map((mood) => (
                <Button
                  key={mood.value}
                  variant="mood"
                  size="mood"
                  onClick={() => setEveningMood(mood.value)}
                  className={`
                    transition-all duration-300
                    ${eveningMood === mood.value 
                      ? 'ring-2 ring-primary scale-105 shadow-encourage' 
                      : 'hover:scale-105'
                    }
                  `}
                  title={mood.label}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>

            {eveningMood && moodImprovement !== 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  {getMoodChangeMessage()}
                </Badge>
              </div>
            )}
          </div>

          {/* Reflection Questions */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ocean-deep mb-2 block">
                What went well today? (optional)
              </label>
              <Textarea
                placeholder="I'm proud that I..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[60px] border-ocean-light focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ocean-deep mb-2 block">
                What's one thing you're grateful for today? (optional)
              </label>
              <Textarea
                placeholder="I'm grateful for..."
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="min-h-[60px] border-ocean-light focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ocean-deep mb-2 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Tomorrow's main priority? (optional)
              </label>
              <Textarea
                placeholder="Tomorrow I want to focus on..."
                value={tomorrowPriority}
                onChange={(e) => setTomorrowPriority(e.target.value)}
                className="min-h-[60px] border-ocean-light focus:border-primary"
              />
            </div>
          </div>

          {/* Complete Button */}
          <Button
            variant="ocean"
            size="lg"
            onClick={handleComplete}
            disabled={!eveningMood}
            className="w-full"
          >
            Complete Reflection
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Encouragement */}
          <div className="text-center p-3 bg-gradient-encourage rounded-lg">
            <Star className="w-4 h-4 mx-auto mb-2 text-encourage-warm" />
            <p className="text-sm text-encourage-warm font-medium">
              "Rest well tonight. Tomorrow holds new possibilities for growth and joy."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}