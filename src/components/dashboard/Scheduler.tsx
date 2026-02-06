import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScheduleAnalyzer } from "@/hooks/useScheduleAnalyzer";
import { Clock, Calendar, TrendingUp, Loader2, Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "facebook", label: "Facebook", icon: "👥" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "youtube", label: "YouTube", icon: "▶️" },
];

const contentTypes = [
  "General posts",
  "Product promotions",
  "Educational content",
  "Behind-the-scenes",
  "User engagement",
  "News & updates",
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export const Scheduler = () => {
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("General posts");
  const [timezone, setTimezone] = useState("UTC");
  
  const { analyzeSchedule, isLoading, schedule } = useScheduleAnalyzer();

  const handleAnalyze = async () => {
    try {
      await analyzeSchedule({ platform, contentType, timezone });
      toast.success("Schedule analysis complete!");
    } catch {
      // Error already handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Scheduler</h1>
          <p className="text-muted-foreground">Find the best times to post for maximum engagement</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label>Platform</Label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    platform === p.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg mr-2">{p.icon}</span>
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((ct) => (
                  <SelectItem key={ct} value={ct}>
                    {ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full"
            variant="hero"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Best Times
              </>
            )}
          </Button>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {isLoading ? (
            <div className="glass-card rounded-xl p-12 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Analyzing engagement patterns...</p>
              </div>
            </div>
          ) : schedule ? (
            <>
              {/* Best Times */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Best Times to Post</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {schedule.bestTimes?.map((time, i) => (
                    <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="text-lg font-bold text-primary">{time.time}</div>
                      <div className="text-sm text-foreground">{time.day}</div>
                      <div className="text-xs text-muted-foreground mt-1">{time.reason}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Peak Engagement Hours</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.peakEngagementHours?.map((hour, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                        {hour}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold">Times to Avoid</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.avoidTimes?.map((time, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Pro Tips</h3>
                </div>
                <ul className="space-y-2">
                  {schedule.tips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="glass-card rounded-xl p-12 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select your platform and analyze to see optimal posting times</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
