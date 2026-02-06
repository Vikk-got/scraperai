import { useState } from "react";
import { toast } from "sonner";

interface GenerateImageParams {
  prompt: string;
  brandColors?: string;
  style?: string;
}

interface GeneratedImage {
  imageUrl: string;
  description?: string;
}

export const useImageGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<GeneratedImage | null>(null);

  const generateImage = async (params: GenerateImageParams) => {
    setIsLoading(true);
    setImage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
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
        throw new Error(data.error || "Failed to generate image");
      }

      setImage({ imageUrl: data.imageUrl, description: data.description });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate image";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, image, setImage };
};
