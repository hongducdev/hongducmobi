import type { Metadata } from "next";
import ForgotPasswordForm from "./_components/forgot-password-form";

export const metadata: Metadata = {
    title: "Quên mật khẩu",
    description: "Quên mật khẩu",
};

const LoginPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default LoginPage;
