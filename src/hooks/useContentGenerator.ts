import { useState } from "react";
import { toast } from "sonner";

interface GenerateContentParams {
  type: "blog" | "social" | "email" | "caption";
  topic: string;
  tone?: string;
  brandStyle?: string;
  additionalContext?: string;
}

export const useContentGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const generateContent = async (params: GenerateContentParams) => {
    setIsLoading(true);
    setContent(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
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
        throw new Error(data.error || "Failed to generate content");
      }

      setContent(data.content);
      return data.content;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate content";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateContent, isLoading, content, setContent };
};
