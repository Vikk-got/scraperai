import { motion } from "framer-motion";
import { FeatureCard } from "./FeatureCard";
import { PenLine, Image, Clock, Brain, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "AI Content Writer",
    description: "Generate blog posts, social media updates, and emails that sound authentically you.",
  },
  {
    icon: Image,
    title: "Brand-Aligned Design",
    description: "Create stunning visuals that perfectly match your brand identity and style guide.",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "AI analyzes your audience to find the perfect posting times for maximum engagement.",
  },
  {
    icon: Brain,
    title: "Learns Your Style",
    description: "The more you use it, the better it understands your voice, tone, and preferences.",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description: "Manage all your content channels in one beautiful, intuitive workspace.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to
            <span className="gradient-text"> create effortlessly</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            One AI assistant that handles writing, design, scheduling, and optimization—so you can focus on what matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
