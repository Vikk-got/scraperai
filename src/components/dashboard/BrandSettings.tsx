import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

export const BrandSettings = () => {
  const { settings, updateSettings } = useBrandSettings();

  const handleSave = () => {
    toast.success("Brand settings saved! AI will now use these preferences.");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Brand Settings</h1>
          <p className="text-muted-foreground">Train the AI to match your brand's voice and style</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              placeholder="Your brand or company name"
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandColors">Brand Colors</Label>
            <Input
              id="brandColors"
              placeholder="e.g., #F59E0B, #1F2937, #10B981"
              value={settings.colors}
              onChange={(e) => updateSettings({ colors: e.target.value })}
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              Hex codes separated by commas. These will be used in image generation.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandTone">Brand Voice & Tone</Label>
            <Textarea
              id="brandTone"
              placeholder="e.g., Professional yet approachable. We use clear, jargon-free language. We're helpful and encouraging."
              value={settings.tone}
              onChange={(e) => updateSettings({ tone: e.target.value })}
              className="bg-secondary/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandStyle">Visual Style</Label>
            <Input
              id="brandStyle"
              placeholder="e.g., Modern and minimal, bold colors, geometric shapes"
              value={settings.style}
              onChange={(e) => updateSettings({ style: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              placeholder="e.g., Tech-savvy professionals aged 25-45"
              value={settings.targetAudience}
              onChange={(e) => updateSettings({ targetAudience: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <Button onClick={handleSave} className="w-full" variant="hero" size="lg">
            <Save className="w-5 h-5" />
            Save Brand Settings
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">How AI Learns Your Style</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h4 className="text-foreground font-medium mb-2">📝 Content Writing</h4>
              <p>Your brand voice and tone settings guide how AI writes content. It will match your communication style across all content types.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h4 className="text-foreground font-medium mb-2">🎨 Image Generation</h4>
              <p>Brand colors and visual style preferences are applied to all generated images, ensuring visual consistency.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h4 className="text-foreground font-medium mb-2">👥 Audience Targeting</h4>
              <p>Understanding your audience helps AI craft messages that resonate with your target demographic.</p>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="text-foreground font-medium mb-2">🧠 Continuous Learning</h4>
              <p>The more you use ContentAI, the better it understands your preferences. Your content history helps refine future outputs.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
