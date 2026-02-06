import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useImageGenerator } from "@/hooks/useImageGenerator";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Image, Download, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const styles = [
  "Modern and minimal",
  "Bold and vibrant",
  "Elegant and sophisticated",
  "Playful and fun",
  "Professional corporate",
  "Artistic and creative",
  "Retro vintage",
  "Futuristic tech",
];

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Modern and minimal");
  const [customColors, setCustomColors] = useState("");
  
  const { generateImage, isLoading, image } = useImageGenerator();
  const { settings } = useBrandSettings();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the image you want");
      return;
    }

    try {
      await generateImage({
        prompt,
        brandColors: customColors || settings.colors,
        style,
      });
      toast.success("Image generated successfully!");
    } catch {
      // Error already handled in hook
    }
  };

  const handleDownload = () => {
    if (image?.imageUrl) {
      const link = document.createElement("a");
      link.href = image.imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
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
          <Image className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Image Generator</h1>
          <p className="text-muted-foreground">Create brand-aligned visuals with AI</p>
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
            <Label htmlFor="prompt">Describe Your Image</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'A hero banner for a tech startup showing innovation and growth' or 'Social media post about summer sale'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Visual Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="colors">Brand Colors (optional)</Label>
            <Input
              id="colors"
              placeholder={settings.colors || "e.g., #F59E0B, #1F2937"}
              value={customColors}
              onChange={(e) => setCustomColors(e.target.value)}
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              Uses your brand colors by default. Override here if needed.
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
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
                Generate Image
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
            <Label>Generated Image</Label>
            {image?.imageUrl && (
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          
          <div className="aspect-square rounded-lg bg-secondary/30 border border-border overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Creating your image...</p>
              </div>
            ) : image?.imageUrl ? (
              <img
                src={image.imageUrl}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Your generated image will appear here</p>
              </div>
            )}
          </div>

          {image?.description && (
            <p className="mt-4 text-sm text-muted-foreground">{image.description}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
