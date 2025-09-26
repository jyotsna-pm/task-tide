import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  MoreVertical, 
  Zap,
  Calendar,
  Target
} from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  category: string;
  priority: 1 | 2 | 3; // 1=high, 2=medium, 3=low
  completed: boolean;
  progress?: number; // 0-100
  microTasks?: string[];
  dueDate?: string;
}

interface TaskCardProps {
  task: Task;
  onStart: (task: Task) => void;
  onComplete: (task: Task) => void;
  onBreakdown: (task: Task) => void;
}

const difficultyConfig = {
  1: { label: "Easy", color: "bg-success-gentle", icon: "🌊" },
  2: { label: "Medium", color: "bg-warning-soft", icon: "⚡" },
  3: { label: "Hard", color: "bg-destructive", icon: "🔥" },
};

const priorityConfig = {
  1: { label: "High", color: "border-l-destructive" },
  2: { label: "Medium", color: "border-l-warning-soft" },
  3: { label: "Low", color: "border-l-success-gentle" },
};

export function TaskCard({ task, onStart, onComplete, onBreakdown }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Safety check for task object
  if (!task || typeof task !== 'object') {
    return null;
  }
  
  // Safety checks for configuration objects
  const difficulty = difficultyConfig[task.difficulty] || difficultyConfig[2]; // Default to medium
  const priority = priorityConfig[task.priority] || priorityConfig[2]; // Default to medium

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card 
      className={`
        w-full transition-all duration-300 hover:shadow-gentle hover:scale-[1.01]
        border-l-4 ${priority?.color || 'border-l-gray-300'}
        ${task.completed ? 'opacity-60 bg-success-gentle/10' : ''}
      `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {task.category || 'Uncategorized'}
              </Badge>
              <Badge 
                className={`text-xs text-white ${difficulty?.color || 'bg-gray-500'}`}
              >
                {difficulty?.icon || '📝'} {difficulty?.label || 'Unknown'}
              </Badge>
            </div>
            
            <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-ocean-deep'}`}>
              {task.title || 'Untitled Task'}
            </CardTitle>
            
            <CardDescription className="mt-1">
              {task.description || 'No description provided'}
            </CardDescription>
          </div>
          
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(task.estimatedTime || 0)}
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.dueDate}
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {priority?.label || 'Unknown'} Priority
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {task.progress && task.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-ocean-deep">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          {task.completed ? (
            <Button variant="celebration" className="flex-1" disabled>
              <CheckCircle className="w-4 h-4" />
              Completed!
            </Button>
          ) : (
            <>
              <Button 
                variant="ocean" 
                className="flex-1"
                onClick={() => onStart(task)}
              >
                <PlayCircle className="w-4 h-4" />
                Start Task
              </Button>
              
              <Button 
                variant="calm"
                onClick={() => onBreakdown(task)}
              >
                <Zap className="w-4 h-4" />
                Break Down
              </Button>
            </>
          )}
        </div>

        {task.microTasks && isExpanded && (
          <div className="mt-4 p-3 bg-ocean-mist rounded-lg animate-slide-up">
            <p className="text-sm font-medium text-ocean-deep mb-2">Micro-tasks:</p>
            <ul className="space-y-1">
              {task.microTasks.map((microTask, index) => (
                <li key={index} className="text-sm text-ocean-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-ocean-medium rounded-full" />
                  {microTask}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}