"use client";

import { ArrowUp, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function handleScrollTop() {
  if (typeof window === "undefined") return;
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div
      className="flex items-center justify-center"
      data-testid="footer-theme-toggle"
    >
      <div className="flex items-center gap-1 rounded-full border border-dotted px-2 py-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-label="Switch to light theme"
          aria-pressed={isLight}
          data-testid="footer-theme-light"
          className={cn(
            "rounded-full p-2 transition-colors",
            isLight
              ? "bg-black text-white"
              : "text-primary hover:bg-component-secondary-hover"
          )}
        >
          <Sun className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Light theme</span>
        </button>

        <button
          type="button"
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          data-testid="footer-scroll-top"
          className="rounded-full p-2 text-primary transition-colors hover:bg-component-secondary-hover"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Scroll to top</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label="Switch to dark theme"
          aria-pressed={isDark}
          data-testid="footer-theme-dark"
          className={cn(
            "rounded-full p-2 transition-colors",
            isDark
              ? "bg-black text-white"
              : "text-primary hover:bg-component-secondary-hover"
          )}
        >
          <Moon className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Dark theme</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
