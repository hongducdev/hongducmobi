"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
import { useRouter } from "next/navigation";

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
        message: "Giá sản phẩm phải có ít nhất 1000",
    }),
    quantity: z.number().gte(0, {
        message: "Số lượng sản phẩm phải có ít nhất 0",
    }),
    images: z.array(z.string()).min(1, {
        message: "Cần ít nhất một hình ảnh",
    }),
    category: z.string(),
});

interface EditProductFormProps {
    initialData: any;
    productId: string;
}

const EditProductForm = ({ initialData, productId }: EditProductFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description,
            price: initialData.price,
            quantity: initialData.quantity,
            images: initialData.images,
            category: initialData.category,
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
            const processedImages = await Promise.all(
                values.images.map(async (image: string) => {
                    if (
                        image.startsWith("data:") ||
                        image.startsWith("blob:")
                    ) {
                        const response = await fetch(image);
                        const blob = await response.blob();
                        return convertBlobToBase64(blob);
                    }
                    return image;
                })
            );

            const response = await axios.put(`/products/${productId}`, {
                ...values,
                images: processedImages,
            });

            if (response.status === 200) {
                toast({
                    title: "Thành công!",
                    description: "Cập nhật sản phẩm thành công",
                });
                router.refresh();
                router.push("/admin/products");
            }
        } catch (error: any) {
            if (error.response) {
                toast({
                    title: "Có lỗi xảy ra!",
                    description:
                        error.response.data.message ||
                        "Cập nhật sản phẩm thất bại",
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
                    description: error.message || "Cập nhật sản phẩm thất bại",
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
                                    <Input {...field} />
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
                                    <Input {...field} />
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
                                <Textarea rows={12} {...field} />
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
                            <FormLabel>Giá</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormDescription>Đơn vị: Đồng</FormDescription>
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
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
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
                <div className="flex items-center gap-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Cập nhật sản phẩm"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditProductForm;
