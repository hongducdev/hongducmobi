import type { Metadata } from "next";
import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
    title: "Đăng ký",
    description: "Đăng ký tài khoản",
};

const RegisterPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
