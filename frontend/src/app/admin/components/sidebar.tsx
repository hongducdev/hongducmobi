import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Tags,
    Users,
    LogOut,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";

const routes = [
    {
        label: "Tổng quan",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-600",
    },
    {
        label: "Đơn hàng",
        icon: ShoppingBag,
        href: "/admin/orders",
        color: "text-violet-600",
    },
    {
        label: "Sản phẩm",
        icon: Package,
        href: "/admin/products",
        color: "text-pink-600",
    },
    {
        label: "Mã giảm giá",
        icon: Tags,
        href: "/admin/coupons",
        color: "text-orange-600",
    },
    {
        label: "Người dùng",
        icon: Users,
        href: "/admin/users",
        color: "text-green-600",
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUserStore();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="px-3 py-2 flex-1">
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                                pathname === route.href
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon
                                    className={cn("h-5 w-5 mr-3", route.color)}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Nút đăng xuất */}
            <div className="px-3 py-2 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
} 