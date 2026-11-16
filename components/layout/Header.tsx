"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

// TODO: include system in theme swapping somehow
// fix the spot the separator is appearing
export function Header() {
  const { theme, setTheme } = useTheme();

  function swapTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <>
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex w-full justify-between pr-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
                />
            </div>
            <Button variant="outline" size="icon" onClick={swapTheme}>
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    </header>
    </>
  )
}
