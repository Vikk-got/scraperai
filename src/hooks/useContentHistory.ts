import { useState, useEffect } from "react";

export interface ContentItem {
  id: string;
  type: "blog" | "social" | "email" | "caption";
  content: string;
  createdAt: Date;
  topic: string;
}

export const useContentHistory = () => {
  const [history, setHistory] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem("contentHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((item: ContentItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("contentHistory", JSON.stringify(history));
  }, [history]);

  const addContent = (item: Omit<ContentItem, "id" | "createdAt">) => {
    const newItem: ContentItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50 items
    return newItem;
  };

  const deleteContent = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addContent, deleteContent, clearHistory };
};
