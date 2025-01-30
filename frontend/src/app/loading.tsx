import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đang xử lý...",
    description: "Đang xử lý...",
};

const Loading = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">Đang xử lý...</p>
            </div>
        </div>
    );
};

export default Loading;
