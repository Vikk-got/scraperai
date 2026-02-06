import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ContentManager } from "@/components/dashboard/ContentManager";
import { ContentWriter } from "@/components/dashboard/ContentWriter";
import { ImageGenerator } from "@/components/dashboard/ImageGenerator";
import { Scheduler } from "@/components/dashboard/Scheduler";
import { BrandSettings } from "@/components/dashboard/BrandSettings";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ContentManager onNavigate={setActiveSection} />;
      case "writer":
        return <ContentWriter />;
      case "images":
        return <ImageGenerator />;
      case "scheduler":
        return <Scheduler />;
      case "brand":
        return <BrandSettings />;
      default:
        return <ContentManager onNavigate={setActiveSection} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onNavigate={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
