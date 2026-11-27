"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "../ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const { theme, setTheme } = useTheme();

  function cycleTheme() {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  }

  const themeLabels = {
    system: "System",
    light: "Light",
    dark: "Dark"
  };

  const currentThemeLabel = themeLabels[theme as keyof typeof themeLabels] || "System";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full justify-between items-center px-4">
        <SidebarTrigger className="-ml-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={cycleTheme} className="cursor-pointer">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0 dark:-rotate-90 [.theme-system_&]:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0 [.theme-system_&]:scale-0" />
              <Monitor className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all [.theme-system_&]:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Theme: {currentThemeLabel}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
