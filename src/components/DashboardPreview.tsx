import { motion } from "framer-motion";
import dashboardImage from "@/assets/dashboard-preview.jpg";

export const DashboardPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,_hsl(38_92%_50%_/_0.05)_0%,_transparent_70%)]" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Browser chrome */}
          <div className="glass-card rounded-xl overflow-hidden glow-effect">
            {/* Window controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                  app.contentai.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard image */}
            <div className="relative aspect-video">
              <img
                src={dashboardImage}
                alt="ContentAI Dashboard Preview"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
