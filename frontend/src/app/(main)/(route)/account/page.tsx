"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, Lock, CreditCard, MapPin, Heart } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

const sidebarItems = [
    {
        title: "Thông tin tài khoản",
        href: "/account/profile",
        icon: User,
    },
    {
        title: "Đơn hàng của tôi",
        href: "/account/orders",
        icon: Package,
    },
    {
        title: "Đổi mật khẩu",
        href: "/account/change-password",
        icon: Lock,
    },
    {
        title: "Phương thức thanh toán",
        href: "/account/payment-methods",
        icon: CreditCard,
    },
    {
        title: "Sổ địa chỉ",
        href: "/account/addresses",
        icon: MapPin,
    },
    {
        title: "Sản phẩm yêu thích",
        href: "/account/wishlist",
        icon: Heart,
    },
];

const AccountPage = () => {
    const { user } = useUserStore();
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <div className="p-4 border rounded-lg mb-4">
                        <h2 className="font-semibold text-lg">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors",
                                    pathname === item.href &&
                                        "bg-gray-100 font-medium"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-[500px] border rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="p-4 border rounded-lg hover:border-blue-500 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                        <h3 className="font-medium">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Quản lý {item.title.toLowerCase()}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
