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
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const enhancedPrompt = `Create a professional image: ${prompt}. ${brandColors ? `Use these brand colors: ${brandColors}.` : ''} ${style ? `Style: ${style}.` : 'Modern and clean aesthetic.'} High-quality, professional design.`;

    console.log("Generating image with OpenRouter...");

    // Use OpenRouter's image generation with Gemini Flash Image model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Phoenix Image Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { 
            role: "user", 
            content: enhancedPrompt
          }
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenRouter response received");

    // Extract image from response - OpenRouter returns images in the message
    const message = data.choices?.[0]?.message;
    let imageUrl = null;

    // Check for images array in the message
    if (message?.images && message.images.length > 0) {
      imageUrl = message.images[0]?.image_url?.url || message.images[0]?.url;
    }
    
    // Check for inline image in content (base64)
    if (!imageUrl && message?.content) {
      // Some models return base64 directly in content
      const base64Match = message.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (base64Match) {
        imageUrl = base64Match[0];
      }
    }

    if (!imageUrl) {
      console.log("No image in response, returning text description");
      // If no image, return a placeholder message
      return new Response(JSON.stringify({ 
        error: "This model doesn't support image generation. Try upgrading to a paid image model.",
        description: message?.content 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
