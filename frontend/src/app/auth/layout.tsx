"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";
import Loading from "../loading";
import { Button } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, checkAuth, checkingAuth, logout } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (checkingAuth) {
        return <Loading />;
    }

    if (user) {
        return (
            <div className="flex flex-col gap-5 justify-center items-center h-screen">
                Bạn đã đăng nhập
                <Button onClick={() => logout()}>Đăng xuất</Button>
            </div>
        );
    }

    return <div>{children}</div>;
};

export default AuthLayout;
