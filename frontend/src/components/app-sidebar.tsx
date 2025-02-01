"use client";
import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    LogOut,
    Package,
    User
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "./logo";
import NavMain from "./nav-main";

// Menu items.
const items = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Sản phẩm",
            url: "#",
            icon: Package,
            items: [
                {
                    title: "Danh sách sản phẩm",
                    url: "/admin/products",
                },
                {
                    title: "Thêm sản phẩm",
                    url: "/admin/products/new",
                },
            ],
        },
        {
            title: "Người dùng",
            url: "#",
            icon: User,
            items: [
                {
                    title: "Danh sách người dùng",
                    url: "/admin/users",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};


const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <LogOut />
                        <span>Đăng xuất</span>
                    </SidebarMenuItem>
                </SidebarMenuButton>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;
