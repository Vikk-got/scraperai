import { useState } from "react";
import { toast } from "sonner";

interface VideoResult {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  duration?: string;
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface ChannelResult {
  channelId: string;
  title: string;
  description: string;
  customUrl?: string;
  thumbnail: string;
  banner?: string;
  country?: string;
  publishedAt: string;
  statistics: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
}

export const useYouTubeScraper = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callApi = async (body: Record<string, unknown>) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-scraper`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data.data;
  };

  const searchVideos = async (query: string, maxResults = 10): Promise<VideoResult[]> => {
    setIsLoading(true);
    try {
      const data = await callApi({ action: "searchVideos", query, maxResults });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to search videos";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChannelStats = async (channelIdOrName: string): Promise<ChannelResult> => {
    setIsLoading(true);
    try {
      // Check if it's a channel ID (starts with UC) or a search query
      const isChannelId = channelIdOrName.startsWith("UC");
      const data = await callApi({
        action: "getChannelStats",
        ...(isChannelId ? { channelId: channelIdOrName } : { query: channelIdOrName }),
      });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get channel stats";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoDetails = async (videoId: string): Promise<VideoResult> => {
    setIsLoading(true);
    try {
      const data = await callApi({ action: "getVideoDetails", videoId });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get video details";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChannelVideos = async (channelId: string, maxResults = 10): Promise<VideoResult[]> => {
    setIsLoading(true);
    try {
      const data = await callApi({ action: "getChannelVideos", channelId, maxResults });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get channel videos";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    searchVideos,
    getChannelStats,
    getVideoDetails,
    getChannelVideos,
  };
};
