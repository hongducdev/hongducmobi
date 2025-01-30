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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email({
        message: "Email không hợp lệ",
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
    }),
});

const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const { email, password } = values;
            const response = await axios.post("/auth/login", {
                email,
                password,
            });

            if (response.status !== 200) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: response.data.message,
                });
            }

            router.push("/");
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
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                    <CardDescription>
                        Nhập thông tin tài khoản để đăng nhập
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Quên mật khẩu?
                                            </a>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                {isLoading ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Đăng nhập"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Không có tài khoản?{" "}
                        <a
                            href="/auth/register"
                            className="underline underline-offset-4"
                        >
                            Đăng ký
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;
