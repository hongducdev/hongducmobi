"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./components/sidebar";
import { useUserStore } from "@/stores/useUserStore";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, checkingAuth, checkAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!checkingAuth && (!user || user.role !== "ADMIN")) {
            router.push("/auth/login");
        }
    }, [user, checkingAuth, router]);

    if (checkingAuth) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Không có quyền truy cập
                </h1>
            </div>
        )
    }

    return (
        <div className="h-full relative bg-gray-100">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r">
                <Sidebar />
            </div>
            <main className="md:pl-72 min-h-screen">{children}</main>
        </div>
    );
}
