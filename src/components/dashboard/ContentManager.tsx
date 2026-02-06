import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useContentHistory } from "@/hooks/useContentHistory";
import { LayoutDashboard, PenLine, Image, Clock, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const typeIcons: Record<string, string> = {
  blog: "📝",
  social: "📱",
  email: "📧",
  caption: "💬",
};

const typeLabels: Record<string, string> = {
  blog: "Blog Post",
  social: "Social Media",
  email: "Email",
  caption: "Caption",
};

interface ContentManagerProps {
  onNavigate: (section: string) => void;
}

export const ContentManager = ({ onNavigate }: ContentManagerProps) => {
  const { history, deleteContent, clearHistory } = useContentHistory();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all content history?")) {
      clearHistory();
      toast.success("Content history cleared");
    }
  };

  const stats = {
    total: history.length,
    blog: history.filter((h) => h.type === "blog").length,
    social: history.filter((h) => h.type === "social").length,
    email: history.filter((h) => h.type === "email").length,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground">All your generated content in one place</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Created", value: stats.total, icon: FileText, color: "text-primary" },
          { label: "Blog Posts", value: stats.blog, icon: PenLine, color: "text-blue-400" },
          { label: "Social Posts", value: stats.social, icon: Image, color: "text-pink-400" },
          { label: "Emails", value: stats.email, icon: Clock, color: "text-green-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate("writer")}>
            <PenLine className="w-5 h-5" />
            <span>Write Content</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate("images")}>
            <Image className="w-5 h-5" />
            <span>Generate Image</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate("scheduler")}>
            <Clock className="w-5 h-5" />
            <span>Schedule Post</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate("brand")}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Brand Settings</span>
          </Button>
        </div>
      </motion.div>

      {/* Content History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Content</h3>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No content generated yet</p>
            <Button variant="hero" className="mt-4" onClick={() => onNavigate("writer")}>
              Create Your First Content
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{typeIcons[item.type]}</span>
                      <span className="text-sm font-medium">{typeLabels[item.type]}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(item.createdAt, "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.topic}</p>
                    <p className="text-sm text-foreground/80 line-clamp-2 mt-1">{item.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      deleteContent(item.id);
                      toast.success("Content deleted");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
