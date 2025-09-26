import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  ArrowLeft,
  Clock,
  Target,
  Zap
} from "lucide-react";
import { Task } from "@/components/TaskCard";

interface TaskTimerProps {
  task: Task;
  onComplete: (task: Task) => void;
  onBack: () => void;
}

export function TaskTimer({ task, onComplete, onBack }: TaskTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(task.estimatedTime * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentMicroTask, setCurrentMicroTask] = useState(0);
  const [completedMicroTasks, setCompletedMicroTasks] = useState<boolean[]>(
    new Array(task.microTasks?.length || 0).fill(false)
  );

  const totalTime = task.estimatedTime * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicroTaskComplete = (index: number) => {
    setCompletedMicroTasks(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const completedMicroTaskCount = completedMicroTasks.filter(Boolean).length;
  const microTaskProgress = task.microTasks 
    ? (completedMicroTaskCount / task.microTasks.length) * 100 
    : 0;

  const handleComplete = () => {
    const updatedTask = {
      ...task,
      progress: 100,
      completed: true
    };
    onComplete(updatedTask);
  };

  const difficultyConfig = {
    1: { label: "Easy", color: "bg-success-gentle", emoji: "🌊" },
    2: { label: "Medium", color: "bg-warning-soft", emoji: "⚡" },
    3: { label: "Hard", color: "bg-destructive", emoji: "🔥" },
  };

  const difficulty = difficultyConfig[task.difficulty];

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-gentle">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-lg text-ocean-deep">{task.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {task.category}
                  </Badge>
                  <Badge className={`text-xs text-white ${difficulty.color}`}>
                    {difficulty.emoji} {difficulty.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Timer */}
        <Card className="shadow-gentle">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              
              {/* Time Display */}
              <div className="relative">
                <div className="text-6xl font-mono font-bold text-ocean-deep">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {timeRemaining === 0 ? "Time's up!" : "Time remaining"}
                </p>
              </div>

              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted stroke-current"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 - (progress / 100) * 339.292}
                    className="text-primary stroke-current transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-ocean-deep">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2">
                <Button
                  variant={isRunning ? "destructive" : "ocean"}
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={timeRemaining === 0}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsRunning(false);
                    setTimeRemaining(totalTime);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Micro Tasks */}
        {task.microTasks && task.microTasks.length > 0 && (
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="text-lg text-ocean-deep flex items-center gap-2">
                <Target className="w-4 h-4" />
                Break it Down
              </CardTitle>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-ocean-deep">
                  {completedMicroTaskCount}/{task.microTasks.length}
                </span>
              </div>
              <Progress value={microTaskProgress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {task.microTasks.map((microTask, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      completedMicroTasks[index] 
                        ? 'bg-success-gentle/20 border-success-gentle' 
                        : 'bg-ocean-mist border-ocean-light'
                    }`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMicroTaskComplete(index)}
                      className={`h-6 w-6 rounded-full ${
                        completedMicroTasks[index] 
                          ? 'bg-success-gentle text-white' 
                          : 'border border-muted-foreground'
                      }`}
                    >
                      {completedMicroTasks[index] && <CheckCircle className="w-3 h-3" />}
                    </Button>
                    <span className={`text-sm ${
                      completedMicroTasks[index] 
                        ? 'line-through text-muted-foreground' 
                        : 'text-ocean-deep'
                    }`}>
                      {microTask}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Task */}
        <Button
          variant="celebration"
          size="lg"
          onClick={handleComplete}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </Button>

        {/* Encouragement */}
        <Card className="shadow-gentle bg-gradient-encourage">
          <CardContent className="pt-6">
            <div className="text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-encourage-warm" />
              <p className="text-sm text-encourage-warm font-medium">
                "Focus on progress, not perfection. Every minute counts!"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}