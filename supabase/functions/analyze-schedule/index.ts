import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ScheduleRequest {
  platform: string;
  contentType: string;
  timezone?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, contentType, timezone = "UTC" } = await req.json() as ScheduleRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are a social media analytics expert. Provide optimal posting times based on platform engagement data and best practices. Return your response as a JSON object with the following structure:
            {
              "bestTimes": [{"day": "Monday", "time": "9:00 AM", "reason": "..."}],
              "peakEngagementHours": ["9 AM", "12 PM", "6 PM"],
              "avoidTimes": ["2 AM - 5 AM"],
              "tips": ["tip1", "tip2"]
            }`
          },
          { 
            role: "user", 
            content: `What are the optimal posting times for ${contentType} content on ${platform}? Timezone: ${timezone}. Provide specific recommendations based on current engagement trends.`
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let schedule;
    try {
      schedule = JSON.parse(content);
    } catch {
      schedule = { 
        bestTimes: [
          { day: "Monday", time: "9:00 AM", reason: "Start of work week, high engagement" },
          { day: "Wednesday", time: "12:00 PM", reason: "Mid-week lunch break" },
          { day: "Friday", time: "3:00 PM", reason: "End of week wind-down" },
        ],
        peakEngagementHours: ["9 AM", "12 PM", "6 PM"],
        avoidTimes: ["2 AM - 5 AM", "Late Sunday night"],
        tips: ["Consistency is key", "Test different times for your audience"]
      };
    }

    return new Response(JSON.stringify(schedule), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-schedule:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
