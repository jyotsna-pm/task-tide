import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Sparkles, 
  Trophy, 
  Target, 
  TrendingUp,
  Share,
  ArrowRight,
  Heart
} from "lucide-react";

interface ProgressCelebrationProps {
  completedTask: {
    title: string;
    category: string;
    difficulty: number;
    estimatedTime: number;
  };
  currentStreak: number;
  tasksCompletedToday: number;
  totalTasksToday: number;
  onContinue: () => void;
  onShare?: () => void;
}

export function ProgressCelebration({ 
  completedTask, 
  currentStreak,
  tasksCompletedToday,
  totalTasksToday,
  onContinue,
  onShare
}: ProgressCelebrationProps) {
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  
  useEffect(() => {
    setShowConfetti(true);
    
    // Check for achievements
    if (tasksCompletedToday === totalTasksToday && totalTasksToday > 0) {
      setAchievement("Perfect Day! All tasks completed! 🌟");
    } else if (currentStreak >= 7) {
      setAchievement("Week Warrior! 7 days strong! 🔥");
    } else if (currentStreak >= 3) {
      setAchievement("Momentum Master! 3 day streak! ⚡");
    } else if (completedTask.difficulty === 3) {
      setAchievement("Challenge Crusher! Tough task conquered! 💪");
    }
    
    // Auto-hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const completionPercentage = Math.round((tasksCompletedToday / totalTasksToday) * 100);
  
  const getEncouragementMessage = () => {
    if (completionPercentage === 100) {
      return "Incredible work! You've completed everything planned for today!";
    } else if (completionPercentage >= 75) {
      return "You're on fire! Almost there - fantastic progress today!";
    } else if (completionPercentage >= 50) {
      return "Great momentum! You're making solid progress today!";
    } else {
      return "Every step counts! You're building positive momentum!";
    }
  };

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty === 3) return { label: "Hard Challenge", color: "bg-destructive", emoji: "🔥" };
    if (difficulty === 2) return { label: "Medium Task", color: "bg-warning-soft", emoji: "⚡" };
    return { label: "Quick Win", color: "bg-success-gentle", emoji: "🌊" };
  };

  const difficultyInfo = getDifficultyBadge(completedTask.difficulty);

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float absolute top-10 left-10 text-2xl">🎉</div>
          <div className="animate-float absolute top-20 right-20 text-2xl" style={{animationDelay: '0.5s'}}>⭐</div>
          <div className="animate-float absolute bottom-20 left-20 text-2xl" style={{animationDelay: '1s'}}>🌟</div>
          <div className="animate-float absolute bottom-10 right-10 text-2xl" style={{animationDelay: '1.5s'}}>✨</div>
          <div className="animate-float absolute top-1/2 left-1/3 text-2xl" style={{animationDelay: '0.8s'}}>🎊</div>
        </div>
      )}

      <Card className="w-full max-w-md mx-auto shadow-ocean animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-success rounded-full w-20 h-20 flex items-center justify-center animate-celebration">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-ocean-deep mb-2">
            Task Completed! 
          </CardTitle>
          
          {achievement && (
            <Badge className="bg-gradient-encourage text-encourage-warm mb-3 animate-pulse-gentle">
              <Trophy className="w-3 h-3 mr-1" />
              {achievement}
            </Badge>
          )}
          
          <p className="text-ocean-medium">
            {getEncouragementMessage()}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Completed Task Details */}
          <div className="bg-ocean-mist rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs text-white ${difficultyInfo.color}`}>
                {difficultyInfo.emoji} {difficultyInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {completedTask.category}
              </Badge>
            </div>
            
            <h3 className="font-semibold text-ocean-deep mb-1">
              {completedTask.title}
            </h3>
            
            <p className="text-sm text-ocean-medium">
              Estimated: {completedTask.estimatedTime}min
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <p className="text-xl font-bold text-ocean-deep">
                {tasksCompletedToday}/{totalTasksToday}
              </p>
              <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-success-gentle" />
                <span className="text-sm text-muted-foreground">Streak</span>
              </div>
              <p className="text-xl font-bold text-ocean-deep">
                {currentStreak} days
              </p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="ocean"
              size="lg"
              onClick={onContinue}
              className="w-full"
            >
              Continue Your Flow
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            {onShare && (
              <Button
                variant="encourage"
                size="lg"
                onClick={onShare}
                className="w-full"
              >
                <Share className="w-4 h-4" />
                Share Your Victory
              </Button>
            )}
          </div>

          {/* Encouragement Quote */}
          <div className="text-center p-3 bg-gradient-encourage rounded-lg">
            <Heart className="w-4 h-4 mx-auto mb-2 text-encourage-warm" />
            <p className="text-sm text-encourage-warm font-medium">
              "Progress, not perfection. Every completed task is a step forward!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}