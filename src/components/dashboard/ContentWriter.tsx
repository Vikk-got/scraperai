import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentGenerator } from "@/hooks/useContentGenerator";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { useContentHistory } from "@/hooks/useContentHistory";
import { PenLine, Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const contentTypes = [
  { value: "blog", label: "Blog Post", icon: "📝" },
  { value: "social", label: "Social Media", icon: "📱" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "caption", label: "Caption", icon: "💬" },
];

const tones = [
  "Professional",
  "Casual",
  "Friendly",
  "Humorous",
  "Inspirational",
  "Educational",
  "Persuasive",
];

export const ContentWriter = () => {
  const [type, setType] = useState<"blog" | "social" | "email" | "caption">("blog");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [copied, setCopied] = useState(false);
  
  const { generateContent, isLoading, content } = useContentGenerator();
  const { settings } = useBrandSettings();
  const { addContent } = useContentHistory();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      const result = await generateContent({
        type,
        topic,
        tone,
        brandStyle: settings.tone,
      });
      
      if (result) {
        addContent({ type, content: result, topic });
        toast.success("Content generated successfully!");
      }
    } catch {
      // Error already handled in hook
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
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
          <PenLine className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Writer</h1>
          <p className="text-muted-foreground">Generate AI-powered content for any platform</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label>Content Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {contentTypes.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setType(ct.value as typeof type)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    type === ct.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-xl mr-2">{ct.icon}</span>
                  <span className="text-sm font-medium">{ct.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Subject</Label>
            <Textarea
              id="topic"
              placeholder="e.g., '10 productivity tips for remote workers' or 'Launch announcement for our new app'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[120px] bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full"
            variant="hero"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content
              </>
            )}
          </Button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Label>Generated Content</Label>
            {content && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          
          <div className="min-h-[400px] p-4 rounded-lg bg-secondary/30 border border-border overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Creating your content...</p>
                </div>
              </div>
            ) : content ? (
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                  {content}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Your generated content will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
