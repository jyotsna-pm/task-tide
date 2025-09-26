import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { TaskDashboard } from "@/components/TaskDashboard";
import { ProgressCelebration } from "@/components/ProgressCelebration";
import { AllTasksView } from "@/components/AllTasksView";
import { EveningReflection } from "@/components/EveningReflection";
import { Navigation } from "@/components/Navigation";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskTimer } from "@/components/TaskTimer";
import { Task } from "@/components/TaskCard";
import { mockTasks, mockUserProfile } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Zap, 
  Target, 
  Star, 
  Calendar, 
  Clock, 
  MessageCircle, 
  CheckCircle,
  Play, 
  ArrowLeft 
} from "lucide-react";
import heroWave from "@/assets/hero-wave.jpg";

type AppState = 
  | "landing"
  | "mood-check" 
  | "dashboard" 
  | "all-tasks" 
  | "celebration" 
  | "reflection" 
  | "task-timer"
  | "task-detail";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasCompletedOnboarding } = useAppContext();
  const [appState, setAppState] = useState<AppState>("dashboard"); // Force dashboard for testing
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [moodContext, setMoodContext] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [userName, setUserName] = useState(mockUserProfile.name);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(3);
  const [todayProgress, setTodayProgress] = useState({ completed: 2, total: 3 });
  const { toast } = useToast();

  // Debug: Monitor appState changes
  useEffect(() => {
    console.log('appState changed to:', appState);
  }, [appState]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/landing");
      return;
    }

    if (!hasCompletedOnboarding) {
      navigate("/onboarding");
      return;
    }

    initializeApp();
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  const initializeApp = () => {
    const savedUserName = localStorage.getItem("userName");
    const savedGoals = localStorage.getItem("userGoals");
    const initialTasks = localStorage.getItem("initialTasks");
    
    if (savedUserName) {
      setUserName(savedUserName);
    }
    
    if (savedGoals) {
      setUserGoals(JSON.parse(savedGoals));
    }

    if (initialTasks) {
      const parsedTasks = JSON.parse(initialTasks);
      setTasks(prevTasks => [...parsedTasks, ...prevTasks.slice(parsedTasks.length)]);
    }
    
    // Check if user has already checked in today
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem("lastMoodCheckIn");
    
    if (lastCheckIn === today) {
      setHasCheckedInToday(true);
      setAppState("dashboard");
      const savedMood = localStorage.getItem("todayMood");
      if (savedMood) {
        setCurrentMood(parseInt(savedMood));
      }
    } else {
      // Show morning check-in
      showMorningCheckIn();
    }
  };

  const showMorningCheckIn = () => {
    setAppState("mood-check");
    toast({
      title: "Good morning! ☀️",
      description: "Ready to focus today? Let's check in with your energy.",
    });
  };

  const handleMoodSelected = (mood: number, context?: string) => {
    setCurrentMood(mood);
    setMoodContext(context || "");
    
    // Save mood check-in for today
    const today = new Date().toDateString();
    localStorage.setItem("lastMoodCheckIn", today);
    localStorage.setItem("todayMood", mood.toString());
    setHasCheckedInToday(true);
    
    // Reorder tasks based on mood
    const reorderedTasks = reorderTasksByMood(tasks, mood);
    setTasks(reorderedTasks);
    
    setAppState("dashboard");
    
    // Show encouraging toast based on mood
    const moodMessages = {
      1: "Taking it gentle today - every small step counts! 🌊",
      2: "Starting with easy wins to build momentum 💪",
      3: "Ready for a balanced, productive day! ⚖️",
      4: "Great energy - let's make meaningful progress! 🚀",
      5: "Amazing mood! You're ready to tackle anything! ⭐"
    };
    
    const moodTaskSuggestion = {
      1: "Perfect energy for tackling that simple task! 💫",
      2: "Great start - your first task looks perfect! 🌱",
      3: "Balanced energy perfect for steady progress! ⚖️",
      4: "Excellent energy for that important task! 🚀",
      5: "Amazing! You're ready for your biggest challenge! ⭐"
    };

    toast({
      title: "Mood Registered! 😊",
      description: moodMessages[mood as keyof typeof moodMessages] || moodMessages[3],
    });

    // Follow up with task suggestion after a moment
    setTimeout(() => {
      toast({
        title: moodTaskSuggestion[mood as keyof typeof moodTaskSuggestion],
        description: "Tap a task to see micro-steps and get started!",
      });
    }, 2000);
  };

  const reorderTasksByMood = (taskList: Task[], mood: number): Task[] => {
    const sortedTasks = [...taskList].sort((a, b) => {
      if (mood <= 2) {
        // Low energy: prioritize easy tasks
        return a.difficulty - b.difficulty;
      } else if (mood >= 4) {
        // High energy: tackle complex tasks first
        return b.difficulty - a.difficulty;
      } else {
        // Medium energy: balanced approach
        return a.priority - b.priority;
      }
    });
    
    return sortedTasks;
  };

  const handleTaskStart = (task: Task) => {
    setActiveTask(task);
    setAppState("task-timer");
    toast({
      title: "Task Started! 🎯",
      description: `Working on: ${task.title}`,
    });
  };

  const handleTaskComplete = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, completed: true, progress: 100 } : t
    ));
    
    setCompletedTask(task);
    setTodayProgress(prev => ({
      ...prev,
      completed: prev.completed + 1
    }));
    
    // Check if all tasks completed
    const remainingTasks = tasks.filter(t => !t.completed && t.id !== task.id);
    if (remainingTasks.length === 0) {
      setAppState("celebration");
    } else {
      // Show quick celebration
      toast({
        title: "Task Complete! ✅",
        description: `Great job finishing: ${task.title}`,
      });
    }
  };

  const handleTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setAppState("task-detail");
  };

  const handleTaskBreakdown = (task: Task) => {
    toast({
      title: "Breaking it Down! 🧩",
      description: `Let's make "${task.title}" more manageable!`,
    });
  };

  // Helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const getMoodBasedMessage = (mood: number) => {
    const messages = {
      1: "Taking it gentle today - that's perfectly okay 🌊",
      2: "Building momentum with small wins 💫",
      3: "Ready for a balanced, productive day ⚖️",
      4: "Great energy for meaningful progress! 🚀",
      5: "Amazing energy - you're unstoppable today! ⭐"
    };
    return messages[mood as keyof typeof messages] || messages[3];
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return "text-blue-500";
    if (mood <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getDifficultyLabel = (difficulty: number, mood: number) => {
    const baseDifficulty = difficulty <= 1 ? "Easy" : difficulty <= 2 ? "Medium" : "Hard";
    
    // Adjust based on mood
    if (mood >= 4 && difficulty <= 2) return "Quick win";
    if (mood <= 2 && difficulty >= 3) return "Challenge";
    
    return baseDifficulty;
  };

  // Render different app states
  const renderMainContent = () => {
    console.log('Rendering appState:', appState);
    switch (appState) {
      case "mood-check":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto pt-8">
              <MoodCheckIn onMoodSelected={handleMoodSelected} />
            </div>
          </div>
        );

      case "dashboard":
        const todaysTasks = tasks.filter(task => 
          !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString()
        ).slice(0, 3);

        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
            {/* Header */}
            <div className="px-3 pt-4 pb-3">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">Good {getTimeOfDay()}, {userName}</h1>
                  <p className="text-gray-600 text-xs">{getMoodBasedMessage(currentMood)}</p>
                </div>
                <Avatar className="h-9 w-9 flex-shrink-0 ml-3">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Top Section: Mood Check-in Widget */}
            <div className="px-3 mb-4">
              <Card className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border-0 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">How's your energy today?</h3>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setCurrentMood(mood)}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                              currentMood === mood
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-white text-purple-600 hover:bg-purple-50"
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl ml-2">
                    {currentMood >= 4 ? "🚀" : currentMood >= 3 ? "🌊" : "🌱"}
                  </div>
                </div>
                <div className="px-3 py-2 bg-white/60 rounded-lg">
                  <p className="text-xs text-purple-800">
                    {currentMood >= 4 && "Great! Your tasks are optimized for high energy today."}
                    {currentMood === 3 && "Perfect! AI has balanced your tasks for steady progress."}
                    {currentMood <= 2 && "That's okay! Your tasks are simplified for gentle momentum."}
                  </p>
                </div>
              </Card>
            </div>

            {/* Progress Section */}
            <div className="px-3 mb-4">
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <div className="text-center">
                    <div className="text-xl font-bold">{todayProgress.completed}</div>
                    <div className="text-xs opacity-90">Completed</div>
                  </div>
                </Card>
                <Card className="p-3 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                  <div className="text-center">
                    <div className="text-xl font-bold">{currentStreak}</div>
                    <div className="text-xs opacity-90">Day Streak</div>
                  </div>
                </Card>
                <Card className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <div className="text-center">
                    <div className="text-xl font-bold">{Math.round((todayProgress.completed / Math.max(1, todayProgress.total)) * 100)}%</div>
                    <div className="text-xs opacity-90">Progress</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Main Section: Today's Focus (3 prioritized tasks) */}
            <div className="px-3 mb-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Today's Focus</h2>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">AI Optimized</span>
                </div>
              </div>
              
              {todaysTasks.length === 0 ? (
                <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="text-green-600 mb-3">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">All caught up!</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">Amazing work! You've completed all your tasks for today.</p>
                  <Button 
                    onClick={() => setShowAddTaskModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Plan Tomorrow
                  </Button>
                </Card>
              ) : (
                <div className="space-y-2">
                  {todaysTasks.map((task, index) => (
                    <Card 
                      key={task.id}
                      className="p-3 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => handleTaskDetail(task)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-blue-500"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">{task.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  task.priority === 1 ? "bg-red-100 text-red-700" :
                                  task.priority === 2 ? "bg-orange-100 text-orange-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {getDifficultyLabel(task.difficulty, currentMood)}
                              </Badge>
                              <span className="text-xs text-gray-500">{task.estimatedTime}min</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {task.microTasks && task.microTasks.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  {task.microTasks.length} steps
                                </span>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskStart(task);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-7"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            <Button 
              className="fixed bottom-20 right-6 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 z-50"
              onClick={() => setShowAddTaskModal(true)}
            >
              <Plus className="h-7 w-7" />
            </Button>

            {/* Bottom Navigation */}
            <Navigation 
              currentView={appState}
              onNavigate={(view) => {
                console.log('onNavigate called with view:', view);
                console.log('Current appState:', appState);
                if (view === "all-tasks") {
                  console.log('Setting appState to all-tasks');
                  setAppState("all-tasks");
                }
                if (view === "dashboard") setAppState("dashboard");
                if (view === "add-task-modal") setShowAddTaskModal(true);
                if (view === "profile") {
                  toast({
                    title: "Profile",
                    description: "Profile section coming soon!",
                  });
                }
                if (view === "analytics") {
                  toast({
                    title: "Analytics", 
                    description: "Analytics section coming soon!",
                  });
                }
              }}
              incompleteTasks={tasks.filter(t => !t.completed).length}
              currentStreak={currentStreak}
            />
          </div>
        );

      case "task-detail":
        return selectedTask ? (
          <TaskDetailView 
            task={selectedTask}
            onStart={() => handleTaskStart(selectedTask)}
            onComplete={() => handleTaskComplete(selectedTask)}
            onBack={() => setAppState("dashboard")}
            currentMood={currentMood}
          />
        ) : null;

      case "all-tasks":
        return (
          <AllTasksView 
            tasks={tasks}
            onTaskStart={handleTaskStart}
            onTaskComplete={handleTaskComplete}
            onTaskBreakdown={handleTaskBreakdown}
            onAddTask={() => setShowAddTaskModal(true)}
            onBack={() => setAppState("dashboard")}
          />
        );

      case "task-timer":
        return activeTask ? (
          <TaskTimer 
            task={activeTask}
            onComplete={() => handleTaskComplete(activeTask)}
            onBack={() => setAppState("dashboard")}
          />
        ) : null;

      case "celebration":
        return completedTask ? (
          <ProgressCelebration 
            completedTask={completedTask}
            tasksCompletedToday={todayProgress.completed}
            totalTasksToday={todayProgress.total}
            currentStreak={currentStreak}
            onContinue={() => setAppState("dashboard")}
          />
        ) : (
          <div>No completed task to celebrate</div>
        );

      case "reflection":
        return (
          <EveningReflection 
            completedTasks={tasks.filter(t => t.completed).length}
            totalTasks={tasks.length}
            currentStreak={currentStreak}
            morningMood={currentMood}
            completedTaskTitles={tasks.filter(t => t.completed).map(t => t.title)}
            onComplete={() => setAppState("dashboard")}
          />
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <>
      {renderMainContent()}
      
      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onAddTask={(newTask) => {
          const taskWithId = { ...newTask, id: Date.now().toString(), completed: false };
          setTasks(prev => [...prev, taskWithId]);
          toast({
            title: "Task Added! ✅",
            description: `"${newTask.title}" added to your list.`,
          });
        }}
      />
    </>
  );
};

// Task Detail View Component
const TaskDetailView = ({ 
  task, 
  onStart, 
  onComplete, 
  onBack, 
  currentMood 
}: {
  task: Task;
  onStart: () => void;
  onComplete: () => void;
  onBack: () => void;
  currentMood: number;
}) => {
  const [showMicroSteps, setShowMicroSteps] = useState(false);

  const getDifficultyLabel = (difficulty: number, mood: number) => {
    const baseDifficulty = difficulty <= 1 ? "Easy" : difficulty <= 2 ? "Medium" : "Hard";
    
    // Adjust based on mood
    if (mood >= 4 && difficulty <= 2) return "Quick win";
    if (mood <= 2 && difficulty >= 3) return "Challenge";
    
    return baseDifficulty;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">Task Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="p-6">
          {/* Task Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h2>
            {task.description && (
              <p className="text-gray-600 mb-4">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {task.estimatedTime} minutes
              </div>
              <Badge variant="outline">
                {getDifficultyLabel(task.difficulty, currentMood)}
              </Badge>
              <Badge variant="secondary">{task.category}</Badge>
            </div>

            {task.dueDate && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Due: {task.dueDate}
              </div>
            )}
          </div>

          {/* Mood-based encouragement */}
          <div className={`p-4 rounded-lg mb-6 ${
            currentMood <= 2 ? "bg-blue-50 border border-blue-200" :
            currentMood >= 4 ? "bg-green-50 border border-green-200" :
            "bg-yellow-50 border border-yellow-200"
          }`}>
            <p className={`text-sm font-medium ${
              currentMood <= 2 ? "text-blue-800" :
              currentMood >= 4 ? "text-green-800" :
              "text-yellow-800"
            }`}>
              {currentMood <= 2 && "Perfect for your gentle energy today 🌊"}
              {currentMood === 3 && "Great match for your balanced energy ⚖️"}
              {currentMood >= 4 && "Excellent choice for your high energy! 🚀"}
            </p>
          </div>

          {/* Micro Tasks */}
          {task.microTasks && task.microTasks.length > 0 && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setShowMicroSteps(!showMicroSteps)}
                className="flex items-center justify-between w-full p-0 h-auto mb-3"
              >
                <span className="font-medium text-gray-800">
                  {showMicroSteps ? "Hide" : "Show"} micro-steps
                </span>
                <span className={`transform transition-transform ${showMicroSteps ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </Button>

              {showMicroSteps && (
                <div className="space-y-2">
                  {task.microTasks.map((microTask, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{microTask}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={onStart} className="w-full">
              {task.progress && task.progress > 0 ? "Continue Task" : "Start Task"}
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;