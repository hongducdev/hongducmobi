"use client";

import { useUserStore } from "@/stores/useUserStore";
import { Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import UserHeader from "./user-header";
import { useEffect } from "react";

const Header = () => {
    const { user, checkAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <nav className="flex justify-between items-center p-4 shadow-md">
            <Link
                href="/"
                className="text-2xl font-bold flex items-center gap-2"
            >
                <Smartphone />
                <span>Hồng Đức Mobi</span>
            </Link>

            <div>
                {user ? (
                    <UserHeader />
                ) : (
                    <div className="flex items-center gap-4">
                        <Button variant="link">
                            <Link href="/auth/login">Đăng nhập</Link>
                        </Button>
                        <Button>
                            <Link href="/auth/register">Đăng ký</Link>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
