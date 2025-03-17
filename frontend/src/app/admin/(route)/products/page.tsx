"use client";
import ProductTable from "@/components/admin/product-table";
import { Loader2 } from "lucide-react";
import React from "react";
import axios from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

const ProductsPage = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/products");
                setData(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({
                    title: "Có lỗi xảy ra",
                    description:
                        "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <ProductTable data={data} />
        </div>
    );
};

export default ProductsPage;
