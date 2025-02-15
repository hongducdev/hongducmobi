"use client";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import Loading from "../loading";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, checkAuth, checkingAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (checkingAuth) {
        return <Loading />;
    }

    if (!user) {
        notFound();
    }

    if (user.role !== "ADMIN") {
        return (
            <div className="flex justify-center items-center h-screen">
                Bạn không có quyền truy cập vào trang này
            </div>
        );
    }

    return (
        <div className="overflow-y-hidden">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full">
                    <SidebarTrigger />
                    <div className="p-5 w-full">{children}</div>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;
