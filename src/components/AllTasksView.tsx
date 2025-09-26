import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard, Task } from "@/components/TaskCard";
import { Search, Filter, SortAsc, ArrowLeft, Plus, Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";

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
type CategoryFilter = "all" | string;
type DateFilter = "all" | "today" | "tomorrow" | "this-week" | "overdue" | "no-date";
type TabOption = "today" | "upcoming" | "completed" | "all";

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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [activeTab, setActiveTab] = useState<TabOption>("today");

  // Safety check for tasks array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Helper functions for date comparisons
  const isToday = (date: string | undefined) => {
    if (!date) return false;
    
    // Handle special string cases
    if (date.toLowerCase() === "today") return true;
    
    // Handle actual date strings
    try {
      const today = new Date();
      const taskDate = new Date(date);
      return taskDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  };

  const isTomorrow = (date: string | undefined) => {
    if (!date) return false;
    
    // Handle special string cases
    if (date.toLowerCase() === "tomorrow") return true;
    
    // Handle actual date strings
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const taskDate = new Date(date);
      return taskDate.toDateString() === tomorrow.toDateString();
    } catch {
      return false;
    }
  };

  const isThisWeek = (date: string | undefined) => {
    if (!date) return false;
    
    // Handle special string cases
    if (date.toLowerCase().includes("this week") || date.toLowerCase().includes("week")) return true;
    
    // Handle actual date strings
    try {
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      const taskDate = new Date(date);
      return taskDate <= endOfWeek && taskDate > today;
    } catch {
      return false;
    }
  };

  const isYesterday = (date: string | undefined) => {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const taskDate = new Date(date);
    return taskDate.toDateString() === yesterday.toDateString();
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    
    // Handle special string cases - these are never overdue
    const lowerDate = task.dueDate.toLowerCase();
    if (lowerDate === "today" || lowerDate === "tomorrow" || lowerDate.includes("week")) {
      return false;
    }
    
    // Handle actual date strings
    try {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate < today;
    } catch {
      return false;
    }
  };

  // Organize tasks by categories
  const organizeTasks = () => {
    const incompleteTasks = safeTasks.filter(t => !t.completed);
    const completedTasks = safeTasks.filter(t => t.completed);

    return {
      // Today Tab
      priorityTasks: incompleteTasks
        .filter(t => t.priority === 1)
        .sort((a, b) => (a.difficulty || 999) - (b.difficulty || 999))
        .slice(0, 3),
      
      todayTasks: incompleteTasks.filter(t => isToday(t.dueDate) && t.priority !== 1),
      
      overdueTasks: incompleteTasks.filter(t => isOverdue(t)),

      // Upcoming Tab
      tomorrowTasks: incompleteTasks.filter(t => isTomorrow(t.dueDate)),
      thisWeekTasks: incompleteTasks.filter(t => isThisWeek(t.dueDate) && !isTomorrow(t.dueDate)),
      laterTasks: incompleteTasks.filter(t => {
        if (!t.dueDate) return true;
        const taskDate = new Date(t.dueDate);
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        return taskDate > endOfWeek;
      }),

      // Completed Tab
      todayCompleted: completedTasks.filter(t => isToday(t.dueDate)),
      yesterdayCompleted: completedTasks.filter(t => isYesterday(t.dueDate)),
      otherCompleted: completedTasks.filter(t => !isToday(t.dueDate) && !isYesterday(t.dueDate)),

      // All tasks for the All tab
      allTasks: safeTasks
    };
  };

  const organizedTasks = organizeTasks();

  // Filter and sort logic for "All" tab
  const getFilteredAndSortedTasks = () => {
    if (activeTab !== "all") return [];
    
    const filteredTasks = safeTasks.filter(task => {
      if (!task || typeof task !== 'object') return false;
      
      // Search filter - search through title, description, category, and micro tasks
      const matchesSearch = searchQuery === "" || [
        task.title || '',
        task.description || '',
        task.category || '',
        ...(task.microTasks || [])
      ].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Status filter (completed/incomplete/priority)
      const matchesStatusFilter = (() => {
        switch (filter) {
          case "completed": return Boolean(task.completed);
          case "incomplete": return !task.completed;
          case "high": return task.priority === 1;
          case "medium": return task.priority === 2;
          case "low": return task.priority === 3;
          default: return true;
        }
      })();

      // Category filter
      const matchesCategoryFilter = categoryFilter === "all" || 
        (task.category && task.category === categoryFilter);

      // Date filter
      const matchesDateFilter = (() => {
        switch (dateFilter) {
          case "today": return isToday(task.dueDate);
          case "tomorrow": return isTomorrow(task.dueDate);
          case "this-week": return isThisWeek(task.dueDate);
          case "overdue": return isOverdue(task);
          case "no-date": return !task.dueDate;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatusFilter && matchesCategoryFilter && matchesDateFilter;
    });

    return [...filteredTasks].sort((a, b) => {
      try {
        switch (sortBy) {
          case "priority":
            return (a.priority || 999) - (b.priority || 999);
          case "difficulty":
            return (a.difficulty || 999) - (b.difficulty || 999);
          case "estimatedTime":
            return (a.estimatedTime || 999) - (b.estimatedTime || 999);
          case "dueDate":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case "category":
            return (a.category || '').localeCompare(b.category || '');
          default:
            return 0;
        }
      } catch (error) {
        console.error('Error sorting tasks:', error);
        return 0;
      }
    });
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks();

  // Task stats
  const taskStats = {
    total: safeTasks.length,
    completed: safeTasks.filter(t => t && t.completed).length,
    incomplete: safeTasks.filter(t => t && !t.completed).length,
    highPriority: safeTasks.filter(t => t && t.priority === 1 && !t.completed).length,
    overdue: organizedTasks.overdueTasks.length,
    today: organizedTasks.todayTasks.length + organizedTasks.priorityTasks.length
  };

  // Helper component for rendering task sections
  const TaskSection = ({ title, tasks, icon, emptyMessage, className = "" }: {
    title: string;
    tasks: Task[];
    icon: React.ReactNode;
    emptyMessage: string;
    className?: string;
  }) => {
    if (tasks.length === 0) return null;

    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-medium text-ocean-deep">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary" className="ml-auto">
            {tasks.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="animate-fade-in">
              <TaskCard
                task={task}
                onStart={onTaskStart}
                onComplete={onTaskComplete}
                onBreakdown={onTaskBreakdown}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const categories = [...new Set(safeTasks.map(t => t?.category || 'Uncategorized').filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20 space-y-6">
        
        {/* Header */}
        <Card className="shadow-gentle">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-lg text-ocean-deep">Task Overview</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Organize and manage your tasks efficiently
                  </p>
                </div>
              </div>
              <Button variant="ocean" size="sm" onClick={onAddTask}>
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-ocean-deep">{taskStats.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{taskStats.today}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-destructive">{taskStats.highPriority}</div>
                <p className="text-xs text-muted-foreground">Priority</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-warning-soft">{taskStats.overdue}</div>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-success-gentle">{taskStats.completed}</div>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="text-center">
                <div className="text-lg font-bold text-ocean-medium">{taskStats.incomplete}</div>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabOption)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              All
            </TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6">
            {organizedTasks.overdueTasks.length > 0 && (
              <Card className="shadow-gentle border-l-4 border-l-destructive">
                <CardContent className="pt-4 pb-4 px-4">
                  <TaskSection
                    title="Overdue Tasks"
                    tasks={organizedTasks.overdueTasks}
                    icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
                    emptyMessage=""
                    className="text-destructive"
                  />
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Don't worry - let's tackle these gently, one at a time 🌊
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-6 space-y-6">
                <TaskSection
                  title="Priority Tasks"
                  tasks={organizedTasks.priorityTasks}
                  icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
                  emptyMessage="No priority tasks today"
                />

                <TaskSection
                  title="Other Tasks Due Today"
                  tasks={organizedTasks.todayTasks}
                  icon={<Calendar className="w-4 h-4 text-primary" />}
                  emptyMessage="No other tasks due today"
                />

                {organizedTasks.priorityTasks.length === 0 && organizedTasks.todayTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No tasks scheduled for today. Great job staying on top of things!
                    </p>
                    <Button variant="ocean" onClick={onAddTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add a Task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-6 space-y-6">
                <TaskSection
                  title="Tomorrow"
                  tasks={organizedTasks.tomorrowTasks}
                  icon={<Calendar className="w-4 h-4 text-primary" />}
                  emptyMessage="Nothing scheduled for tomorrow"
                />

                <TaskSection
                  title="This Week"
                  tasks={organizedTasks.thisWeekTasks}
                  icon={<Clock className="w-4 h-4 text-ocean-medium" />}
                  emptyMessage="No tasks scheduled for this week"
                />

                <TaskSection
                  title="Later"
                  tasks={organizedTasks.laterTasks}
                  icon={<Clock className="w-4 h-4 text-muted-foreground" />}
                  emptyMessage="No future tasks scheduled"
                />

                {organizedTasks.tomorrowTasks.length === 0 && 
                 organizedTasks.thisWeekTasks.length === 0 && 
                 organizedTasks.laterTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No upcoming tasks scheduled. Perfect time to plan ahead!
                    </p>
                    <Button variant="ocean" onClick={onAddTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Plan a Task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-6 space-y-6">
                <TaskSection
                  title="Today's Completed"
                  tasks={organizedTasks.todayCompleted}
                  icon={<CheckCircle className="w-4 h-4 text-success-gentle" />}
                  emptyMessage="No tasks completed today yet"
                />

                <TaskSection
                  title="Yesterday's Completed"
                  tasks={organizedTasks.yesterdayCompleted}
                  icon={<CheckCircle className="w-4 h-4 text-success-gentle" />}
                  emptyMessage="No tasks completed yesterday"
                />

                <TaskSection
                  title="Previously Completed"
                  tasks={organizedTasks.otherCompleted}
                  icon={<CheckCircle className="w-4 h-4 text-success-gentle" />}
                  emptyMessage="No other completed tasks"
                />

                {organizedTasks.todayCompleted.length === 0 && 
                 organizedTasks.yesterdayCompleted.length === 0 && 
                 organizedTasks.otherCompleted.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No completed tasks yet. Start working on your tasks to see your progress here!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Search and Filters - Only show in All tab */}
            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search tasks, descriptions, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  {/* Primary Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status Filter */}
                    <Select value={filter} onValueChange={(value: FilterOption) => setFilter(value)}>
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <SelectValue placeholder="Status Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="incomplete">📝 Incomplete</SelectItem>
                        <SelectItem value="completed">✅ Completed</SelectItem>
                        <SelectItem value="high">🔴 High Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="low">🟢 Low Priority</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4" />
                          <SelectValue placeholder="Sort By" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="estimatedTime">Time Estimate</SelectItem>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Secondary Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={(value: CategoryFilter) => setCategoryFilter(value)}>
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <Badge className="w-4 h-4" />
                          <SelectValue placeholder="Category" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Date Filter */}
                    <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <SelectValue placeholder="Date Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">📅 Today</SelectItem>
                        <SelectItem value="tomorrow">🔜 Tomorrow</SelectItem>
                        <SelectItem value="this-week">📆 This Week</SelectItem>
                        <SelectItem value="overdue">⚠️ Overdue</SelectItem>
                        <SelectItem value="no-date">📋 No Date Set</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Filters Display */}
                  {(searchQuery || filter !== "all" || categoryFilter !== "all" || dateFilter !== "all") && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                      
                      {searchQuery && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                          Search: "{searchQuery}" ×
                        </Badge>
                      )}
                      
                      {filter !== "all" && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilter("all")}>
                          Status: {filter} ×
                        </Badge>
                      )}
                      
                      {categoryFilter !== "all" && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategoryFilter("all")}>
                          Category: {categoryFilter} ×
                        </Badge>
                      )}
                      
                      {dateFilter !== "all" && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => setDateFilter("all")}>
                          Date: {dateFilter} ×
                        </Badge>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSearchQuery("");
                          setFilter("all");
                          setCategoryFilter("all");
                          setDateFilter("all");
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* All Tasks Results */}
            <Card className="shadow-gentle">
              <CardContent className="pt-6 pb-6 px-6">
                {filteredAndSortedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-6 text-base">
                      {searchQuery || filter !== "all" || categoryFilter !== "all" || dateFilter !== "all"
                        ? "No tasks match your current filters. Try adjusting your search criteria." 
                        : "No tasks yet. Ready to add your first one?"
                      }
                    </p>
                    {(searchQuery || filter !== "all" || categoryFilter !== "all" || dateFilter !== "all") ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("");
                          setFilter("all");
                          setCategoryFilter("all");
                          setDateFilter("all");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    ) : (
                      <Button variant="ocean" size="lg" onClick={onAddTask}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Task
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredAndSortedTasks.length} of {safeTasks.length} tasks
                        {(searchQuery || filter !== "all" || categoryFilter !== "all" || dateFilter !== "all") && (
                          <span className="ml-2 text-primary">
                            (filtered)
                          </span>
                        )}
                      </p>
                      <Button variant="outline" size="sm" onClick={onAddTask}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Task
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredAndSortedTasks.map(task => (
                        <div key={task.id} className="animate-fade-in">
                          <TaskCard
                            task={task}
                            onStart={onTaskStart}
                            onComplete={onTaskComplete}
                            onBreakdown={onTaskBreakdown}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}