import { useState } from "react";
import { TaskCard, Task } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Target, 
  TrendingUp,
  Sparkles,
  Plus,
  ChevronRight,
  Flame
} from "lucide-react";

interface TaskDashboardProps {
  tasks: Task[];
  userMood: number;
  userName: string;
  currentStreak: number;
  onTaskStart: (task: Task) => void;
  onTaskComplete: (task: Task) => void;
  onTaskBreakdown: (task: Task) => void;
  onAddTask: () => void;
  onViewAllTasks: () => void;
}

export function TaskDashboard({ 
  tasks, 
  userMood, 
  userName, 
  currentStreak,
  onTaskStart, 
  onTaskComplete, 
  onTaskBreakdown,
  onAddTask,
  onViewAllTasks
}: TaskDashboardProps) {
  
  // Filter and prioritize tasks based on mood
  const adaptTasksForMood = (tasks: Task[], mood: number) => {
    let filteredTasks = [...tasks].filter(t => !t.completed);
    
    if (mood <= 2) {
      // Low mood: prioritize easy, quick tasks
      filteredTasks = filteredTasks
        .filter(t => t.difficulty <= 2 && t.estimatedTime <= 30)
        .sort((a, b) => a.difficulty - b.difficulty);
    } else if (mood >= 4) {
      // Good mood: can handle more challenging tasks
      filteredTasks = filteredTasks
        .sort((a, b) => a.priority - b.priority || b.difficulty - a.difficulty);
    } else {
      // Neutral mood: balanced approach
      filteredTasks = filteredTasks
        .sort((a, b) => a.priority - b.priority);
    }
    
    return filteredTasks.slice(0, 3);
  };

  const prioritizedTasks = adaptTasksForMood(tasks, userMood);
  const completedToday = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  const getMoodMessage = (mood: number) => {
    if (mood <= 2) return "Let's take it gentle today with some easy wins 🌊";
    if (mood === 3) return "Ready for a balanced day of productivity ⚖️";
    if (mood === 4) return "Great energy! Let's tackle some meaningful tasks 🚀";
    return "Fantastic mood! You're ready to conquer challenges! ⭐";
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["", "😫", "😞", "😐", "🙂", "😄"];
    return emojis[mood] || "🙂";
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-ocean-deep mb-2">
            Welcome back, {userName}! {getMoodEmoji(userMood)}
          </h1>
          <p className="text-ocean-medium text-lg">
            {getMoodMessage(userMood)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-gentle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-ocean rounded-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-ocean-deep">{currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-success rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold text-ocean-deep">{completedToday}/{totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-encourage rounded-lg">
                  <TrendingUp className="w-5 h-5 text-encourage-warm" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-ocean-deep">{Math.round(completionRate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {completionRate > 0 && (
          <Card className="shadow-gentle">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ocean-deep">Today's Progress</span>
                <span className="text-sm text-muted-foreground">{completedToday} of {totalTasks} completed</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Smart Task Recommendations */}
        <Card className="shadow-ocean">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl text-ocean-deep">
                  Your Focus for Today
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-primary-soft text-primary">
                Mood-Adapted
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {prioritizedTasks.length > 0 ? (
              <>
                {prioritizedTasks.map((task) => (
                  <div key={task.id} className="animate-fade-in">
                    <TaskCard
                      task={task}
                      onStart={onTaskStart}
                      onComplete={onTaskComplete}
                      onBreakdown={onTaskBreakdown}
                    />
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="encourage"
                    onClick={onAddTask}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Task
                  </Button>
                  
                  <Button 
                    variant="calm"
                    onClick={onViewAllTasks}
                  >
                    View All Tasks
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 p-4 bg-gradient-success rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-ocean-deep mb-2">All caught up!</h3>
                <p className="text-muted-foreground mb-4">
                  Great work! You've completed all your tasks for today.
                </p>
                <Button variant="encourage" onClick={onAddTask}>
                  <Plus className="w-4 h-4" />
                  Add New Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ocean" size="lg" className="h-14">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </Button>
          <Button variant="calm" size="lg" className="h-14">
            <TrendingUp className="w-5 h-5" />
            Progress Report
          </Button>
        </div>
      </div>
    </div>
  );
}