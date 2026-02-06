import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative glass-card rounded-2xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38_92%_50%_/_0.1)_0%,_transparent_70%)]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your
              <br />
              <span className="gradient-text">content creation?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
              Join thousands of creators who save hours every week with AI-powered content that actually sounds like them.
            </p>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free plan available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
