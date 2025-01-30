import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Hong Duc Mobi",
        template: "%s | Hong Duc Mobi",
    },
    description: "Website bán điện thoại online tại Quyết Thắng, Thái Nguyên",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={lexend.className}>
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
