"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
    code: z.string().min(3, "Mã giảm giá phải có ít nhất 3 ký tự"),
    discountPercentage: z.string().min(1, "Vui lòng nhập giá trị giảm"),
    maxUses: z.string().min(1, "Vui lòng nhập số lượt sử dụng tối đa"),
    startDate: z.date({
        required_error: "Vui lòng chọn ngày bắt đầu",
    }),
    expirationDate: z.date({
        required_error: "Vui lòng chọn ngày kết thúc",
    }),
});

const NewCouponForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            discountPercentage: "",
            maxUses: "",
            startDate: new Date(),
            expirationDate: new Date(),
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/coupons", values);
            if (response.status !== 201) {
                toast({
                    title: "Lỗi",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
            toast({
                title: "Thành công",
                description: "Mã giảm giá đã được tạo thành công",
            });
            form.reset();
        } catch (error: any) {
            if (error.response) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description:
                        error.response.data.message || "Tạo mã giảm giá thất bại",
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
                    description: error.message || "Tạo mã giảm giá thất bại",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã giảm giá</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nhập mã giảm giá"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giá trị giảm (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Nhập giá trị giảm"
                                    min="0"
                                    max="100"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="maxUses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số lượt sử dụng tối đa</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Nhập số lượt sử dụng"
                                    min="1"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ngày bắt đầu</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(
                                                    field.value,
                                                    "dd/MM/yyyy"
                                                )
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ngày kết thúc</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(
                                                    field.value,
                                                    "dd/MM/yyyy"
                                                )
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang tạo..." : "Tạo mã giảm giá"}
                </Button>
            </form>
        </Form>
    );
};

export default NewCouponForm;
