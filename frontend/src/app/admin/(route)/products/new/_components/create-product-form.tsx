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
import { Loader } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [categories, setCategories] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/products/categories");
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error(
                        "API did not return an array:",
                        response.data
                    );
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const convertBlobToBase64 = (file: File | Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const base64Images = await Promise.all(
                values.images.map(async (url: string) => {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return convertBlobToBase64(blob);
                })
            );

            const response = await axios.post("/products/create", {
                ...values,
                images: base64Images,
            });

            if (response.status !== 200) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description: response.data.message,
                });
            } else {
                toast({
                    title: "Thành công!",
                    description: response.data.message,
                });
                form.reset();
            }
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
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Danh mục</FormLabel>
                            <div className="flex gap-2">
                                <FormControl>
                                    <Input
                                        placeholder="Nhập danh mục"
                                        {...field}
                                    />
                                </FormControl>
                                {categories.length > 0 && (
                                    <select
                                        className="border rounded px-3 py-2"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                field.onChange(e.target.value);
                                            }
                                        }}
                                    >
                                        <option value="">
                                            Chọn danh mục có sẵn
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <FormDescription>
                                Nhập danh mục mới hoặc chọn từ danh sách có sẵn
                            </FormDescription>
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
                <Button type="submit">
                    {isLoading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Tạo sản phẩm"
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default CreateProductForm;
