import type { Metadata } from "next";
import ResetPasswordForm from "./_components/reset-password-form";

export const metadata: Metadata = {
    title: "Đặt lại mật khẩu",
    description: "Đặt lại mật khẩu",
};

const VerifyPage = ({ searchParams }: { searchParams: { token: string } }) => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ResetPasswordForm token={searchParams.token} />
            </div>
        </div>
    );
};

export default VerifyPage;
