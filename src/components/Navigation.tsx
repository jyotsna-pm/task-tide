import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  List, 
  Plus, 
  Moon, 
  Settings, 
  User,
  Calendar,
  Target
} from "lucide-react";

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  incompleteTasks: number;
  currentStreak: number;
}

export function Navigation({ currentView, onNavigate, incompleteTasks, currentStreak }: NavigationProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Today",
      icon: Home,
      badge: incompleteTasks > 0 ? incompleteTasks : undefined
    },
    {
      id: "all-tasks",
      label: "All Tasks",
      icon: List,
      badge: undefined
    },
    {
      id: "add-task",
      label: "Add",
      icon: Plus,
      badge: undefined
    },
    {
      id: "reflection",
      label: "Reflect",
      icon: Moon,
      badge: undefined
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <div key={item.id} className="relative">
              <Button
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  console.log('Navigation clicked:', item.id);
                  if (item.id === "add-task") {
                    onNavigate("add-task-modal");
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className="flex-col h-auto py-2 px-3"
                type="button"
              >
                <item.icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center pointer-events-none"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {currentStreak > 0 && (
          <div className="text-center mt-2">
            <Badge variant="secondary" className="text-xs">
              🔥 {currentStreak} day streak
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}