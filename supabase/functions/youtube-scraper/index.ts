import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, channelId, videoId, maxResults = 10 } = await req.json();
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");

    if (!YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY is not configured");
    }

    let data;

    switch (action) {
      case "searchVideos": {
        console.log("Searching videos:", query);
        const response = await fetch(
          `${YOUTUBE_API_BASE}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
        );
        if (!response.ok) {
          const error = await response.text();
          console.error("YouTube API error:", error);
          throw new Error(`YouTube API error: ${response.status}`);
        }
        const searchData = await response.json();
        
        // Get video statistics for each result
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
        const statsResponse = await fetch(
          `${YOUTUBE_API_BASE}/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const statsData = await statsResponse.json();
        
        // Merge statistics with search results
        data = searchData.items.map((item: any, index: number) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          publishedAt: item.snippet.publishedAt,
          statistics: statsData.items[index]?.statistics || {},
          duration: statsData.items[index]?.contentDetails?.duration || "",
        }));
        break;
      }

      case "getChannelStats": {
        console.log("Getting channel stats:", channelId || query);
        let actualChannelId = channelId;

        // If no channelId, search for channel by name
        if (!actualChannelId && query) {
          const searchResponse = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${YOUTUBE_API_KEY}`
          );
          const searchData = await searchResponse.json();
          if (searchData.items && searchData.items.length > 0) {
            actualChannelId = searchData.items[0].id.channelId;
          } else {
            throw new Error("Channel not found");
          }
        }

        const response = await fetch(
          `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,brandingSettings&id=${actualChannelId}&key=${YOUTUBE_API_KEY}`
        );
        if (!response.ok) {
          const error = await response.text();
          console.error("YouTube API error:", error);
          throw new Error(`YouTube API error: ${response.status}`);
        }
        const channelData = await response.json();
        
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error("Channel not found");
        }

        const channel = channelData.items[0];
        data = {
          channelId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          customUrl: channel.snippet.customUrl,
          thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
          banner: channel.brandingSettings?.image?.bannerExternalUrl,
          country: channel.snippet.country,
          publishedAt: channel.snippet.publishedAt,
          statistics: {
            subscriberCount: channel.statistics.subscriberCount,
            viewCount: channel.statistics.viewCount,
            videoCount: channel.statistics.videoCount,
          },
        };
        break;
      }

      case "getVideoDetails": {
        console.log("Getting video details:", videoId);
        if (!videoId) {
          throw new Error("Video ID is required");
        }

        const response = await fetch(
          `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        if (!response.ok) {
          const error = await response.text();
          console.error("YouTube API error:", error);
          throw new Error(`YouTube API error: ${response.status}`);
        }
        const videoData = await response.json();

        if (!videoData.items || videoData.items.length === 0) {
          throw new Error("Video not found");
        }

        const video = videoData.items[0];
        data = {
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
          channelTitle: video.snippet.channelTitle,
          channelId: video.snippet.channelId,
          publishedAt: video.snippet.publishedAt,
          tags: video.snippet.tags || [],
          categoryId: video.snippet.categoryId,
          duration: video.contentDetails.duration,
          definition: video.contentDetails.definition,
          statistics: {
            viewCount: video.statistics.viewCount,
            likeCount: video.statistics.likeCount,
            commentCount: video.statistics.commentCount,
          },
        };
        break;
      }

      case "getChannelVideos": {
        console.log("Getting channel videos:", channelId);
        if (!channelId) {
          throw new Error("Channel ID is required");
        }

        const response = await fetch(
          `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
        );
        if (!response.ok) {
          const error = await response.text();
          console.error("YouTube API error:", error);
          throw new Error(`YouTube API error: ${response.status}`);
        }
        const videosData = await response.json();

        // Get statistics for all videos
        const videoIds = videosData.items.map((item: any) => item.id.videoId).join(",");
        const statsResponse = await fetch(
          `${YOUTUBE_API_BASE}/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const statsData = await statsResponse.json();

        data = videosData.items.map((item: any, index: number) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
          statistics: statsData.items[index]?.statistics || {},
          duration: statsData.items[index]?.contentDetails?.duration || "",
        }));
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in youtube-scraper:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
