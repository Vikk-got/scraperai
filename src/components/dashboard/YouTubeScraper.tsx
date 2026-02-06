import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useYouTubeScraper } from "@/hooks/useYouTubeScraper";
import { Youtube, Search, User, Video, Loader2, Eye, ThumbsUp, MessageCircle, Users, Play } from "lucide-react";
import { toast } from "sonner";

const formatNumber = (num: string | undefined) => {
  if (!num) return "N/A";
  const n = parseInt(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const formatDuration = (duration: string) => {
  if (!duration) return "";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return duration;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const YouTubeScraper = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelQuery, setChannelQuery] = useState("");
  const [videoId, setVideoId] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [channelData, setChannelData] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [channelVideos, setChannelVideos] = useState<any[]>([]);

  const { isLoading, searchVideos, getChannelStats, getVideoDetails, getChannelVideos } = useYouTubeScraper();

  const handleSearchVideos = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    try {
      const results = await searchVideos(searchQuery);
      setSearchResults(results);
      toast.success(`Found ${results.length} videos`);
    } catch {
      // Error handled in hook
    }
  };

  const handleGetChannel = async () => {
    if (!channelQuery.trim()) {
      toast.error("Please enter a channel name or ID");
      return;
    }
    try {
      const data = await getChannelStats(channelQuery);
      setChannelData(data);
      const videos = await getChannelVideos(data.channelId);
      setChannelVideos(videos);
      toast.success("Channel data loaded");
    } catch {
      // Error handled in hook
    }
  };

  const handleGetVideo = async () => {
    if (!videoId.trim()) {
      toast.error("Please enter a video ID or URL");
      return;
    }
    // Extract video ID from URL if needed
    let id = videoId;
    const urlMatch = videoId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (urlMatch) id = urlMatch[1];

    try {
      const data = await getVideoDetails(id);
      setVideoData(data);
      toast.success("Video data loaded");
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Youtube className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">YouTube Scraper</h1>
          <p className="text-muted-foreground">Extract data from YouTube channels and videos</p>
        </div>
      </motion.div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Channel
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video
          </TabsTrigger>
        </TabsList>

        {/* Search Videos Tab */}
        <TabsContent value="search" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Videos</Label>
                <Input
                  id="search"
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchVideos()}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearchVideos} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="ml-2">Search</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {searchResults.length > 0 && (
            <div className="grid gap-4">
              {searchResults.map((video, index) => (
                <motion.div
                  key={video.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-64 aspect-video md:aspect-auto">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatDuration(video.duration)}
                          </span>
                        )}
                      </div>
                      <CardContent className="flex-1 p-4">
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{video.channelTitle}</p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatNumber(video.statistics.viewCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {formatNumber(video.statistics.likeCount)}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Channel Stats Tab */}
        <TabsContent value="channel" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="channel">Channel Name or ID</Label>
                <Input
                  id="channel"
                  placeholder="e.g., MrBeast or UC..."
                  value={channelQuery}
                  onChange={(e) => setChannelQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetChannel()}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleGetChannel} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="ml-2">Get Stats</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {channelData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={channelData.thumbnail}
                      alt={channelData.title}
                      className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                    />
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold">{channelData.title}</h2>
                      {channelData.customUrl && (
                        <p className="text-muted-foreground">@{channelData.customUrl.replace("@", "")}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{channelData.description}</p>
                      <div className="flex justify-center md:justify-start gap-6 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{formatNumber(channelData.statistics.subscriberCount)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> Subscribers
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{formatNumber(channelData.statistics.viewCount)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Views
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{formatNumber(channelData.statistics.videoCount)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Play className="w-3 h-3" /> Videos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {channelVideos.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3">Recent Videos</h3>
                  <div className="grid gap-3">
                    {channelVideos.slice(0, 5).map((video) => (
                      <Card key={video.videoId} className="overflow-hidden">
                        <div className="flex">
                          <div className="relative w-40 aspect-video">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            {video.duration && (
                              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                {formatDuration(video.duration)}
                              </span>
                            )}
                          </div>
                          <CardContent className="flex-1 p-3">
                            <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{formatNumber(video.statistics.viewCount)} views</span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </TabsContent>

        {/* Video Details Tab */}
        <TabsContent value="video" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="videoId">Video ID or URL</Label>
                <Input
                  id="videoId"
                  placeholder="e.g., dQw4w9WgXcQ or youtube.com/watch?v=..."
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetVideo()}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleGetVideo} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  <span className="ml-2">Get Details</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {videoData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <div className="aspect-video">
                  <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{videoData.title}</h2>
                  <p className="text-muted-foreground mt-1">{videoData.channelTitle}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Card className="p-4 text-center">
                      <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xl font-bold">{formatNumber(videoData.statistics.viewCount)}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <ThumbsUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xl font-bold">{formatNumber(videoData.statistics.likeCount)}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <MessageCircle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xl font-bold">{formatNumber(videoData.statistics.commentCount)}</p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </Card>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                      {videoData.description}
                    </p>
                  </div>

                  {videoData.tags && videoData.tags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {videoData.tags.slice(0, 10).map((tag: string, index: number) => (
                          <span key={index} className="bg-secondary px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
