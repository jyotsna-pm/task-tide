import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TaskCard, Task } from "@/components/TaskCard";
import { Search, Filter, SortAsc, ArrowLeft, Plus } from "lucide-react";

interface AllTasksViewProps {
  tasks: Task[];
  onTaskStart: (task: Task) => void;
  onTaskComplete: (task: Task) => void;
  onTaskBreakdown: (task: Task) => void;
  onAddTask: () => void;
  onBack: () => void;
}

type SortOption = "priority" | "difficulty" | "estimatedTime" | "dueDate" | "category";
type FilterOption = "all" | "completed" | "incomplete" | "high" | "medium" | "low";

export function AllTasksView({ 
  tasks, 
  onTaskStart, 
  onTaskComplete, 
  onTaskBreakdown, 
  onAddTask,
  onBack 
}: AllTasksViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [filter, setFilter] = useState<FilterOption>("all");

  // Filter tasks based on search and filter criteria
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = (() => {
      switch (filter) {
        case "completed": return task.completed;
        case "incomplete": return !task.completed;
        case "high": return task.priority === 1;
        case "medium": return task.priority === 2;
        case "low": return task.priority === 3;
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return a.priority - b.priority;
      case "difficulty":
        return a.difficulty - b.difficulty;
      case "estimatedTime":
        return a.estimatedTime - b.estimatedTime;
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    incomplete: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 1 && !t.completed).length
  };

  const categories = [...new Set(tasks.map(t => t.category))];

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="max-w-md mx-auto px-3 py-4 space-y-4">
        
        {/* Header */}
        <Card className="shadow-gentle">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-lg text-ocean-deep">All Tasks</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage and organize your tasks
                  </p>
                </div>
              </div>
              <Button variant="ocean" size="sm" onClick={onAddTask}>
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">Add</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-gentle">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="text-center">
                <div className="text-xl font-bold text-ocean-deep">{taskStats.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="text-center">
                <div className="text-xl font-bold text-success-gentle">{taskStats.completed}</div>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-gentle">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{taskStats.incomplete}</div>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="text-center">
                <div className="text-xl font-bold text-destructive">{taskStats.highPriority}</div>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-gentle">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="space-y-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Filters and Sort */}
              <div className="grid grid-cols-2 gap-2">
                <Select value={filter} onValueChange={(value: FilterOption) => setFilter(value)}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      <SelectValue placeholder="Sort" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="estimatedTime">Time</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Categories:</span>
                  {categories.map(category => (
                    <Badge key={category} variant="secondary" className="cursor-pointer text-xs px-2 py-1">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-4">
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4 text-sm">
                    {searchQuery || filter !== "all" 
                      ? "No tasks match your current filters" 
                      : "No tasks yet. Ready to add your first one?"
                    }
                  </p>
                  <Button variant="ocean" size="sm" onClick={onAddTask}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-muted-foreground">
                  Showing {sortedTasks.length} of {tasks.length} tasks
                </p>
              </div>
              
              <div className="space-y-2">
                {sortedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={onTaskStart}
                    onComplete={onTaskComplete}
                    onBreakdown={onTaskBreakdown}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}