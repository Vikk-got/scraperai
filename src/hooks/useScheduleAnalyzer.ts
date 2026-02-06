import { useState } from "react";
import { toast } from "sonner";

interface ScheduleTime {
  day: string;
  time: string;
  reason: string;
}

interface ScheduleAnalysis {
  bestTimes: ScheduleTime[];
  peakEngagementHours: string[];
  avoidTimes: string[];
  tips: string[];
}

interface AnalyzeParams {
  platform: string;
  contentType: string;
  timezone?: string;
}

export const useScheduleAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleAnalysis | null>(null);

  const analyzeSchedule = async (params: AnalyzeParams) => {
    setIsLoading(true);
    setSchedule(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(params),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze schedule");
      }

      setSchedule(data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to analyze schedule";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeSchedule, isLoading, schedule };
};
