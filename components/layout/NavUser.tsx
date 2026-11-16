"use client"

import {
  Apple,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Heart,
  LogIn,
  LogOut,
  Sparkles,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "../providers" 
import { Button } from "../ui/button"
import Link from "next/link" 


export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, login, logout } = useUser();

  // TODO: Refine
  if (!user) {
    return (
      <>
        <Button className="cursor-pointer w-full">
          <LogIn />
          <Link href="login">
            Login
          </Link>
        </Button>
      </>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
                <UserAvatarDisplay />
                <ChevronsUpDown className="ml-auto size-4" /> 
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <UserAvatarDisplay />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup> 
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="profile">
                  <User />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="pantry">
                  <Apple />
                  My Pantry
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="favorites">
                  <Heart />
                  My Favorites 
                </Link>
              </DropdownMenuItem> 
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild> 
              <Button className="cursor-pointer w-full" onClick={logout}>
                <LogOut />
                Log out 
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/**
 * Avatar Display for a user
 * Will only show a basic link to the login page if the user is not logged in
 */
export function UserAvatarDisplay() { 
  const { user } = useUser();

  return (
    <>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user?.avatar} alt={user?.username} />
          <AvatarFallback className="rounded-lg">AN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user?.username}</span>
          <span className="truncate text-xs">{user?.email}</span>
        </div>
    </>
  )
}