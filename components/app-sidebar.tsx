"use client"

import { Building2, Calendar, CreditCard, FileText, Home, Settings, Shield, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Employee Records",
    url: "/employees",
    icon: Users,
    badge: "24",
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: CreditCard,
    badge: "3",
  },
  {
    title: "Leave",
    url: "/leave",
    icon: Calendar,
    badge: "5",
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: Shield,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="gradient-border">
            <div className="gradient-border-content p-2">
              <Building2 className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-xl font-bold text-white">HARMONY</h1>
            <p className="text-xs text-gray-400">HR Analytics Network</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-2 mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full text-gray-300 hover:text-white hover:bg-gray-800/50 data-[active=true]:bg-red-500/20 data-[active=true]:text-red-400 data-[active=true]:border-l-4 data-[active=true]:border-red-500 rounded-r-lg"
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center justify-between w-full px-3 py-2">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden truncate">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="bg-red-500/20 text-red-400 border-red-500/30 group-data-[collapsible=icon]:hidden text-xs px-1.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              tooltip="Settings"
            >
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2">
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
