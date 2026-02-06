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
    const { type, topic, tone, brandStyle, additionalContext } = await req.json();
    const NVIDIA_DEEPSEEK_API_KEY = Deno.env.get("NVIDIA_DEEPSEEK_API_KEY");
    
    if (!NVIDIA_DEEPSEEK_API_KEY) {
      throw new Error("NVIDIA_DEEPSEEK_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      blog: `You are an expert content writer specializing in blog posts. Write engaging, SEO-friendly blog posts that are informative and well-structured with headings, subheadings, and bullet points where appropriate. ${brandStyle ? `Brand voice: ${brandStyle}` : 'Use a professional yet approachable tone.'}`,
      social: `You are a social media expert. Create engaging, shareable social media content that drives engagement. Keep it concise, use emojis appropriately, and include relevant hashtags. ${brandStyle ? `Brand voice: ${brandStyle}` : 'Be conversational and engaging.'}`,
      email: `You are an email marketing specialist. Write compelling email content that drives action. Include a strong subject line, engaging body, and clear call-to-action. ${brandStyle ? `Brand voice: ${brandStyle}` : 'Be professional and persuasive.'}`,
      caption: `You are a social media caption expert. Write engaging captions for images/posts. Keep them punchy, use emojis, and include relevant hashtags. ${brandStyle ? `Brand voice: ${brandStyle}` : 'Be fun and relatable.'}`,
    };

    const userPrompts: Record<string, string> = {
      blog: `Write a comprehensive blog post about: ${topic}. ${tone ? `Tone: ${tone}.` : ''} ${additionalContext || ''}`,
      social: `Create a social media post about: ${topic}. ${tone ? `Tone: ${tone}.` : ''} ${additionalContext || ''}`,
      email: `Write an email about: ${topic}. ${tone ? `Tone: ${tone}.` : ''} ${additionalContext || ''}`,
      caption: `Write a caption for: ${topic}. ${tone ? `Tone: ${tone}.` : ''} ${additionalContext || ''}`,
    };

    console.log("Generating content with NVIDIA DeepSeek v3.2...");

    // Use NVIDIA API with DeepSeek v3.2 model (OpenAI-compatible)
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v3.2",
        messages: [
          { role: "system", content: systemPrompts[type] || systemPrompts.blog },
          { role: "user", content: userPrompts[type] || userPrompts.blog },
        ],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
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
      throw new Error(`NVIDIA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-content:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
