import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, brandColors, style } = await req.json();
    const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY");
    
    if (!NVIDIA_API_KEY) {
      throw new Error("NVIDIA_API_KEY is not configured");
    }

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const enhancedPrompt = `${prompt}. ${brandColors ? `Use these brand colors: ${brandColors}.` : ''} ${style ? `Style: ${style}.` : 'Modern and clean aesthetic.'} Professional, high-quality, detailed.`;

    console.log("Generating image with NVIDIA Stable Diffusion 3 Medium...");

    // Use NVIDIA API with Stable Diffusion 3 Medium (SD 3.5 Large not available on hosted API)
    const response = await fetch("https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
        cfg_scale: 5,
        aspect_ratio: "1:1",
        seed: 0,
        steps: 50,
        mode: "text-to-image",
        model: "sd3",
        output_format: "jpeg",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(JSON.stringify({ error: "Invalid API key or unauthorized." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Image generation failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("NVIDIA response keys:", Object.keys(data));

    // NVIDIA returns base64 image in the 'image' field
    let imageUrl = null;
    
    if (data.image) {
      // The image is returned as base64
      imageUrl = `data:image/jpeg;base64,${data.image}`;
    } else if (data.artifacts && Array.isArray(data.artifacts) && data.artifacts.length > 0) {
      // Alternative response format with artifacts array
      const artifact = data.artifacts[0];
      if (artifact.base64) {
        imageUrl = `data:image/jpeg;base64,${artifact.base64}`;
      }
    }

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl, description: `Generated image: ${prompt}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
