import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const enhancedPrompt = `${prompt}. ${brandColors ? `Use these brand colors: ${brandColors}.` : ''} ${style ? `Style: ${style}.` : 'Modern and clean aesthetic.'} Professional, high-quality design.`;

    // Use Pollinations.ai - free, no API key required
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 999999999);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

    console.log("Fetching image from Pollinations:", pollinationsUrl);

    // Fetch the actual image and wait for it to be generated
    const imageResponse = await fetch(pollinationsUrl);
    
    if (!imageResponse.ok) {
      console.error("Pollinations error:", imageResponse.status);
      throw new Error(`Image generation failed: ${imageResponse.status}`);
    }

    // Get the image as array buffer and convert to base64
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = base64Encode(new Uint8Array(imageBuffer));
    const imageUrl = `data:image/png;base64,${base64Image}`;

    console.log("Image generated successfully, size:", imageBuffer.byteLength);

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
