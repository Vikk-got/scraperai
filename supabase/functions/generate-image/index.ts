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
    const BYTEZ_API_KEY = Deno.env.get("BYTEZ_API_KEY");
    
    if (!BYTEZ_API_KEY) {
      throw new Error("BYTEZ_API_KEY is not configured");
    }

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const enhancedPrompt = `${prompt}. ${brandColors ? `Use these brand colors: ${brandColors}.` : ''} ${style ? `Style: ${style}.` : 'Modern and clean aesthetic.'} Professional, high-quality, detailed.`;

    console.log("Generating image with Bytez Stable Diffusion XL...");

    // Use Bytez API with Stable Diffusion XL
    const response = await fetch("https://api.bytez.com/models/v2/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": BYTEZ_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: enhancedPrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bytez API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid API key." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bytez response:", JSON.stringify(data).slice(0, 200));

    // The response contains the image - could be base64 or URL
    let imageUrl = null;
    
    if (data.output) {
      // Check if output is a base64 string
      if (typeof data.output === "string") {
        if (data.output.startsWith("data:image")) {
          imageUrl = data.output;
        } else if (data.output.startsWith("http")) {
          imageUrl = data.output;
        } else {
          // Assume it's raw base64
          imageUrl = `data:image/png;base64,${data.output}`;
        }
      } else if (Array.isArray(data.output) && data.output.length > 0) {
        const firstOutput = data.output[0];
        if (typeof firstOutput === "string") {
          if (firstOutput.startsWith("data:image") || firstOutput.startsWith("http")) {
            imageUrl = firstOutput;
          } else {
            imageUrl = `data:image/png;base64,${firstOutput}`;
          }
        }
      }
    }

    if (!imageUrl) {
      console.error("No image URL in response:", JSON.stringify(data));
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
