"use client";

import {
  BookOpenIcon,
  ComputerIcon,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";

type NavItem = {
  title: string;
  icon: LucideIcon;
  url: string;
};

const mainItems: NavItem[] = [
  {
    title: "Asset Dashboard",
    icon: ComputerIcon,
    url: "/",
  },
];

const SidebarNavItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={
          pathname === item.url ||
          (item.url !== "/" && pathname.startsWith(`${item.url}/`))
        }
        asChild
        className="gap-x-4 h-10 px-4"
      >
        <Link href={item.url} prefetch>
          <item.icon className="size-4" aria-hidden="true" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/" prefetch>
              <Image
                src="/logos/logo.svg"
                alt="Hospital Health"
                width={30}
                height={30}
              />
              <span className="font-semibold text-sm">Hospital Health</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarNavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="API Docs"
              asChild
              className="gap-x-4 h-10 px-4"
            >
              <a href="/docs" target="_blank" rel="noopener noreferrer">
                <BookOpenIcon className="size-4" aria-hidden="true" />
                <span>API Docs</span>
                <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
