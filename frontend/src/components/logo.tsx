import Link from "next/link";
import { Smartphone } from "lucide-react";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Smartphone className="size-4" />
            </div>
            <span className="font-semibold">Hong Duc Mobi</span>
        </Link>
    );
};

export default Logo;
