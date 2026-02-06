import { useState, useEffect } from "react";

export interface BrandSettings {
  name: string;
  colors: string;
  tone: string;
  style: string;
  targetAudience: string;
}

const DEFAULT_SETTINGS: BrandSettings = {
  name: "",
  colors: "#F59E0B, #1F2937",
  tone: "Professional yet approachable",
  style: "Modern and clean",
  targetAudience: "Business professionals",
};

export const useBrandSettings = () => {
  const [settings, setSettings] = useState<BrandSettings>(() => {
    const saved = localStorage.getItem("brandSettings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("brandSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<BrandSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};
