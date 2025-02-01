"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/input-file";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Tên sản phẩm phải có ít nhất 2 ký tự",
    }),
    slug: z.string().min(2, {
        message: "Slug sản phẩm phải có ít nhất 2 ký tự",
    }),
    description: z.string().min(2, {
        message: "Mô tả sản phẩm phải có ít nhất 2 ký tự",
    }),
    price: z.number().gte(1000, {
        message: "Giá sản phẩm phải có ít nhất 1000",
    }),
    quantity: z.number().gte(0, {
        message: "Số lượng sản phẩm phải có ít nhất 0",
    }),
    images: z.array(z.string()).min(1, {
        message: "Cần ít nhất một hình ảnh",
    }),
    category: z.string(),
});

const CreateProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            price: 1000,
            quantity: 0,
            images: [],
            category: "",
        },
    });

    const { watch, setValue } = form;
    const name = watch("name");

    useEffect(() => {
        if (name) {
            const newSlug = slugify(name, {
                replacement: "_",
                lower: true,
                strict: true,
                locale: "vi",
            });
            setValue("slug", newSlug, { shouldValidate: true });
        }
    }, [name, setValue]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setIsLoading(true);
        try {
            const response = await axios.post("/products/create", values);
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
            form.reset();
        } catch (error: any) {
            if (error.response) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description:
                        error.response.data.message || "Tạo sản phẩm thất bại",
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
                    description: error.message || "Tạo sản phẩm thất bại",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên sản phẩm</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Điện thoại Samsung S25 Ultra"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug sản phẩm</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="dien_thoai_samsung_s25_ultra"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả sản phẩm</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={12}
                                    placeholder="Mô tả sản phẩm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giá</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormDescription>Đơn vị: Đồng</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số lượng</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormDescription>Đơn vị: Cái</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hình ảnh</FormLabel>
                            <FormControl>
                                <InputFile
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Tạo sản phẩm</Button>
            </form>
        </Form>
    );
};

export default CreateProductForm;
