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

// TODO: Rename this and maybe move it to a util file?
interface SideBarWhatever {
    navMain: SideBarData[]
}

interface SideBarData {
    title: string, 
    items: SideBarItem[]
}

interface SideBarItem {
    title: string,
    url: string,
    icon: LucideIcon,
    isActive?: boolean
}

const data: SideBarWhatever = {
  navMain: [
    {
        title: "Features", 
        items: [
            {
              title: "Home",
              url: "#",
              icon: HomeIcon,
            },
            {
              title: "Your Pantry",
              url: "pantry",
              isActive: true,
              icon: Apple,
            },
        ],
    },
    {
        title: "Recipes",
        items: [
            {
                title: "All",
                url: "recipes",
                icon: NotebookPen,
            },
            {
                title: "Favorites",
                url: "favorites",
                icon: Heart,
            },
        ]
    }
  ],
}

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.isActive}>
                                <a href={item.url}>
                                  <Icon />
                                  {item.title}
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