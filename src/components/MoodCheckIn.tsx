import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Heart } from "lucide-react";

const moodEmojis = [
  { emoji: "😫", label: "Overwhelmed", value: 1, color: "text-destructive" },
  { emoji: "😞", label: "Low", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-muted-foreground" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-primary" },
  { emoji: "😄", label: "Great!", value: 5, color: "text-success-gentle" },
];

interface MoodCheckInProps {
  onMoodSelected: (mood: number, context?: string) => void;
}

export function MoodCheckIn({ onMoodSelected }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
    if (moodValue <= 2) {
      setShowContext(true);
    } else {
      setShowContext(false);
      setContext("");
    }
  };

  const handleContinue = () => {
    if (selectedMood) {
      onMoodSelected(selectedMood, context);
    }
  };

  const selectedMoodData = moodEmojis.find(m => m.value === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-ocean animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-ocean rounded-full w-16 h-16 flex items-center justify-center">
            <Heart className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-ocean-deep">
            How are you feeling?
          </CardTitle>
          <CardDescription className="text-ocean-medium">
            Understanding your mood helps us adapt your tasks for today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant="mood"
                size="mood"
                onClick={() => handleMoodSelect(mood.value)}
                className={`
                  transition-all duration-300
                  ${selectedMood === mood.value 
                    ? 'ring-2 ring-primary scale-105 shadow-encourage' 
                    : 'hover:scale-105'
                  }
                `}
                title={mood.label}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>

          {selectedMood && (
            <div className="text-center animate-scale-in">
              <p className="text-sm text-muted-foreground mb-1">Current mood</p>
              <p className={`text-lg font-medium ${selectedMoodData?.color}`}>
                {selectedMoodData?.label}
              </p>
            </div>
          )}

          {showContext && (
            <div className="animate-slide-up">
              <label className="text-sm font-medium text-ocean-deep mb-2 block">
                What's on your mind? (optional)
              </label>
              <Textarea
                placeholder="Feeling stressed about work deadlines..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[80px] border-ocean-light focus:border-primary"
              />
            </div>
          )}

          <Button
            variant="ocean"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedMood}
            className="w-full"
          >
            Continue to Tasks
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}