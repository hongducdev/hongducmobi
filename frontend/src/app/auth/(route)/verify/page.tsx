import type { Metadata } from "next";
import VerifyForm from "./_components/verify-form";

export const metadata: Metadata = {
    title: "Xác minh",
    description: "Xác minh tài khoản",
};

const VerifyPage = ({ searchParams }: { searchParams: { email: string } }) => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <VerifyForm email={searchParams.email} />
            </div>
        </div>
    );
};

export default VerifyPage;
