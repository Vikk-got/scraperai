import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Retry function with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 502 || response.status === 503) {
        // Server error, wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      return response; // Return non-retryable errors
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

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

    console.log("Generating image with Hugging Face Space...");

    // Use the public Hugging Face Gradio Space API for FLUX
    const spaceUrl = "https://black-forest-labs-flux-1-schnell.hf.space/call/infer";
    
    // Submit the generation request
    const submitResponse = await fetchWithRetry(spaceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          enhancedPrompt, // prompt
          0, // seed (0 = random)
          true, // randomize_seed
          512, // width
          512, // height
          4 // num_inference_steps
        ]
      }),
    }, 3);

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error("HF Space submit error:", submitResponse.status, errorText);
      throw new Error(`Image generation failed: ${submitResponse.status}`);
    }

    const submitData = await submitResponse.json();
    const eventId = submitData.event_id;

    if (!eventId) {
      throw new Error("No event ID returned from HF Space");
    }

    console.log("Got event ID:", eventId);

    // Poll for the result
    const resultUrl = `${spaceUrl}/${eventId}`;
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await fetch(resultUrl, {
        headers: { "Accept": "text/event-stream" }
      });
      
      const resultText = await resultResponse.text();
      
      // Parse SSE response
      const lines = resultText.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data && Array.isArray(data) && data[0]) {
              // The response contains the image URL or base64
              const imageData = data[0];
              if (typeof imageData === "object" && imageData.url) {
                imageUrl = imageData.url;
                break;
              } else if (typeof imageData === "string" && imageData.startsWith("http")) {
                imageUrl = imageData;
                break;
              }
            }
          } catch {
            // Continue parsing
          }
        }
      }
      
      if (imageUrl) break;
      attempts++;
    }

    if (!imageUrl) {
      throw new Error("Image generation timed out");
    }

    console.log("Image generated successfully");

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
