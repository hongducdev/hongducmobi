"use client";
import { useUserStore } from "@/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
    ShoppingBag,
    UserCog,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitialsName } from "@/lib/utils";
import { useRouter } from "next/navigation";

const UserHeader = () => {
    const router = useRouter();
    const { user, logout } = useUserStore();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-5 cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {getInitialsName(user?.name || "")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {user?.name}
                            </span>
                            <span className="truncate text-xs text-gray-500">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 ">
                            <AvatarFallback>
                                {getInitialsName(user?.name || "")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {user?.name}
                            </span>
                            <span className="truncate text-xs">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/account")}>
                        <BadgeCheck />
                        Tài khoản
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                            <UserCog />
                            Quản lý trang
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/cart")}>
                        <ShoppingBag />
                        Giỏ hàng
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell />
                        Thông báo
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserHeader;
