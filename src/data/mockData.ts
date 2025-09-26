import { Task } from "@/components/TaskCard";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly reports",
    description: "Go through Q3 financial reports and prepare summary for team meeting",
    estimatedTime: 45,
    difficulty: 2,
    category: "Work",
    priority: 1,
    completed: false,
    progress: 20,
    microTasks: [
      "Open reports folder",
      "Review revenue section (10 min)",
      "Check expense breakdown (10 min)",
      "Note key insights (15 min)",
      "Draft 3-bullet summary (10 min)"
    ],
    dueDate: "Today"
  },
  {
    id: "2", 
    title: "Call mom for birthday",
    description: "Mom's birthday is coming up - give her a call to catch up",
    estimatedTime: 20,
    difficulty: 1,
    category: "Personal",
    priority: 2,
    completed: false,
    microTasks: [
      "Find a quiet moment",
      "Think of topics to discuss",
      "Make the call",
      "Ask about birthday plans"
    ],
    dueDate: "Tomorrow"
  },
  {
    id: "3",
    title: "Organize desk workspace", 
    description: "Clean and reorganize desk for better productivity",
    estimatedTime: 30,
    difficulty: 1,
    category: "Personal",
    priority: 3,
    completed: false,
    microTasks: [
      "Clear all items from desk",
      "Wipe down surface",
      "Sort items into keep/discard piles",
      "Arrange essential items only",
      "Put supplies in designated spots"
    ]
  },
  {
    id: "4",
    title: "Plan weekend hiking trip",
    description: "Research trails, check weather, and pack gear for Saturday hike",
    estimatedTime: 60,
    difficulty: 2,
    category: "Leisure",
    priority: 2,
    completed: false,
    microTasks: [
      "Check trail conditions online",
      "Look at weather forecast",
      "Make packing checklist",
      "Charge GPS and camera",
      "Plan departure time"
    ],
    dueDate: "This week"
  },
  {
    id: "5",
    title: "Grocery shopping",
    description: "Weekly grocery run - need fresh produce and pantry staples",
    estimatedTime: 40,
    difficulty: 1,
    category: "Errands",
    priority: 2,
    completed: true,
    microTasks: [
      "Check what's needed at home",
      "Make shopping list",
      "Drive to store",
      "Shop systematically by aisle",
      "Unpack and organize at home"
    ]
  }
];

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  context?: string;
  tasksCompleted: number;
  tasksAssigned: number;
}

export const mockMoodHistory: MoodEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    mood: 4,
    tasksCompleted: 3,
    tasksAssigned: 3
  },
  {
    id: "2", 
    date: "2024-01-14",
    mood: 2,
    context: "Feeling overwhelmed with work deadlines",
    tasksCompleted: 1,
    tasksAssigned: 2
  },
  {
    id: "3",
    date: "2024-01-13", 
    mood: 5,
    tasksCompleted: 4,
    tasksAssigned: 4
  },
  {
    id: "4",
    date: "2024-01-12",
    mood: 3,
    tasksCompleted: 2,
    tasksAssigned: 3
  }
];

export interface UserProfile {
  name: string;
  currentStreak: number;
  totalTasksCompleted: number;
  averageMood: number;
  preferredTaskSize: "micro" | "small" | "medium" | "large";
  bestProductiveTime: "morning" | "afternoon" | "evening";
}

export const mockUserProfile: UserProfile = {
  name: "Alex",
  currentStreak: 7,
  totalTasksCompleted: 156,
  averageMood: 3.8,
  preferredTaskSize: "small",
  bestProductiveTime: "morning"
};