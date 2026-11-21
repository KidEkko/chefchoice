"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Apple, Heart, HomeIcon, LucideIcon, NotebookPen } from "lucide-react" 
import { NavUser } from "./NavUser" 
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface SideBarItem {
    title: string, 
    tabs: SideBarTab[]
}

interface SideBarTab {
    title: string,
    path: string,
    icon: LucideIcon,
    isActive?: boolean
}

const data: SideBarItem[] = [
    {
        title: "Features", 
        tabs: [
            {
              title: "Home",
              path: "",
              icon: HomeIcon,
            },
            {
              title: "Your Pantry",
              path: "pantry",
              icon: Apple,
            },
        ],
    },
    {
        title: "Recipes",
        tabs: [
            {
                title: "All",
                path: "recipes",
                icon: NotebookPen,
            },
            {
                title: "Favorites",
                path: "favorites",
                icon: Heart,
            },
        ]
    }
];

export function AppSidebar() {
  const [tabs, setTabs] = useState<SideBarItem[]>(data);
  const path = usePathname();

  // Whenever the path changes, update the tabs to reflect which path is currently active
  useEffect(() => {
    setTabs(currentTabs => currentTabs.map(item => updateSideBarItem(item)))
  },[path])

  // Tabs are updated to reflect which is active based on current path
  const updateSideBarItem = useCallback((item: SideBarItem) => {
    // Remove leading '/' and split the remaining path to ensure we're matching just the path name
    // Does not currently account for query strings. 
    // TODO: account for query strings
    const strippedPath = path.slice(1).split("/");
    item.tabs = item.tabs.map(tab => {
      tab.isActive = tab.path === strippedPath[0];
      return tab;
    })
    return item;
  },[path, tabs])

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {tabs.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <SidebarMenuItem key={tab.title}>
                            <SidebarMenuButton asChild isActive={tab.isActive}>
                                <a href={tab.path}>
                                  <Icon />
                                  {tab.title}
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter> 
        <SidebarMenu>
            <SidebarMenuItem>
                <NavUser />
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}