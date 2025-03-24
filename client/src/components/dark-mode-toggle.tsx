import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="dark-mode" className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Dark Mode
      </Label>
      <Switch
        id="dark-mode"
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
      />
    </div>
  );
}
