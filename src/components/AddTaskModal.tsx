import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, Zap, Plus, Mic } from "lucide-react";
import { Task } from "@/components/TaskCard";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

const categories = [
  "Work", "Personal", "Health", "Learning", "Creative", "Social", "Maintenance"
];

const difficultyLevels = [
  { value: 1, label: "Easy", description: "Quick wins", emoji: "🌊" },
  { value: 2, label: "Medium", description: "Moderate effort", emoji: "⚡" },
  { value: 3, label: "Hard", description: "Deep work", emoji: "🔥" }
];

const priorityLevels = [
  { value: 1, label: "High", description: "Urgent & Important" },
  { value: 2, label: "Medium", description: "Important, not urgent" },
  { value: 3, label: "Low", description: "Nice to have" }
];

export function AddTaskModal({ open, onOpenChange, onAddTask }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: 1 as 1 | 2 | 3,
    priority: 2 as 1 | 2 | 3,
    estimatedTime: 30,
    dueDate: "",
    microTasks: [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const newTask: Omit<Task, 'id' | 'completed'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category || "Personal",
      difficulty: formData.difficulty,
      priority: formData.priority,
      estimatedTime: formData.estimatedTime,
      dueDate: formData.dueDate || undefined,
      microTasks: formData.microTasks.filter(task => task.trim()).length > 0 
        ? formData.microTasks.filter(task => task.trim()) 
        : undefined,
      progress: 0
    };

    onAddTask(newTask);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: 1,
      priority: 2,
      estimatedTime: 30,
      dueDate: "",
      microTasks: [""]
    });
    
    onOpenChange(false);
  };

  const addMicroTask = () => {
    setFormData(prev => ({
      ...prev,
      microTasks: [...prev.microTasks, ""]
    }));
  };

  const updateMicroTask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      microTasks: prev.microTasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeMicroTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      microTasks: prev.microTasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ocean-deep">Add New Task</DialogTitle>
          <DialogDescription>
            Create a task that fits your current capacity and goals
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-ocean-deep">Task Title *</Label>
              <div className="relative mt-1">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                  title="Voice input (coming soon)"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-ocean-deep">Description</Label>
              <div className="relative mt-1">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add more details about this task..."
                  className="min-h-[80px] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                  title="Voice input (coming soon)"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-ocean-deep">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedTime" className="text-ocean-deep flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Estimated Time (minutes)
              </Label>
              <Input
                id="estimatedTime"
                type="number"
                min="5"
                max="480"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Difficulty & Priority */}
          <div className="space-y-4">
            <div>
              <Label className="text-ocean-deep flex items-center gap-1 mb-2">
                <Zap className="w-3 h-3" />
                Difficulty Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyLevels.map((level) => (
                  <Button
                    key={level.value}
                    type="button"
                    variant={formData.difficulty === level.value ? "ocean" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value as 1 | 2 | 3 }))}
                    className="h-auto py-3 px-2 flex-col space-y-1"
                  >
                    <span className="text-lg">{level.emoji}</span>
                    <span className="font-medium">{level.label}</span>
                    <span className="text-xs opacity-80">{level.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-ocean-deep flex items-center gap-1 mb-2">
                <Target className="w-3 h-3" />
                Priority Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {priorityLevels.map((level) => (
                  <Button
                    key={level.value}
                    type="button"
                    variant={formData.priority === level.value ? "ocean" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, priority: level.value as 1 | 2 | 3 }))}
                    className="h-auto py-3 px-2 flex-col space-y-1"
                  >
                    <span className="font-medium">{level.label}</span>
                    <span className="text-xs opacity-80">{level.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-ocean-deep flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due Date (optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Micro Tasks */}
          <div>
            <Label className="text-ocean-deep mb-2 block">Break it down (optional)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Add smaller steps to make this task less overwhelming
            </p>
            
            <div className="space-y-2">
              {formData.microTasks.map((microTask, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={microTask}
                    onChange={(e) => updateMicroTask(index, e.target.value)}
                    placeholder={`Step ${index + 1}...`}
                    className="flex-1"
                  />
                  {formData.microTasks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMicroTask(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMicroTask}
                className="w-full"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Step
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="ocean"
              className="flex-1"
              disabled={!formData.title.trim()}
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}