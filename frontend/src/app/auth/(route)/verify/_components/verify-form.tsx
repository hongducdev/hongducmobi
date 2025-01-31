"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    token: z.string().min(6, {
        message: "Mã xác minh phải có ít nhất 6 ký tự",
    }),
});

const VerifyForm = ({
    email,
    className,
    ...props
}: { email: string } & React.ComponentPropsWithoutRef<"div">) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const { token } = values;
            const response = await axios.post("/auth/verify", {
                email,
                token,
            });

            if (response.status !== 200) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: response.data.message,
                });
            }

            toast({
                title: "Thành công!",
                description: response.data.message,
            });
            router.push("/auth/login");
        } catch (error: any) {
            if (error.response) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description:
                        error.response.data.message || "Đăng nhập thất bại",
                });
            } else if (error.request) {
                toast({
                    title: "Lỗi kết nối!",
                    description:
                        "Không thể kết nối tới máy chủ. Vui lòng thử lại!",
                });
            } else {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: error.message || "Đăng nhập thất bại",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };
    const resendToken = async () => {
        try {
            const response = await axios.post("/auth/resend", {
                email,
            });

            if (response.status !== 200) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: response.data.message,
                });
            }

            toast({
                title: "Thành công!",
                description: response.data.message,
            });
        } catch (error: any) {
            if (error.response) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description:
                        error.response.data.message || "Đăng nhập thất bại",
                });
            } else if (error.request) {
                toast({
                    title: "Lỗi kết nối!",
                    description:
                        "Không thể kết nối tới máy chủ. Vui lòng thử lại!",
                });
            } else {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: error.message || "Đăng nhập thất bại",
                });
            }
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Xác minh</CardTitle>
                    <CardDescription>
                        Nhập mã xác minh được gửi đến email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Mã xác minh</FormLabel>
                                            <span
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                                                onClick={() => {
                                                    resendToken();
                                                }}
                                            >
                                                Gửi lại
                                            </span>
                                        </div>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                {isLoading ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Xác minh"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Đã có tài khoản{" "}
                        <a
                            href="/auth/login"
                            className="underline underline-offset-4"
                        >
                            Đăng nhập
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyForm;
