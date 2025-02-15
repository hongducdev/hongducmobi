"use client";
import ProductTable from "@/components/admin/product-table";
import React from "react";
import axios from "@/lib/axios";

const ProductsPage = () => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("/products");
            setData(res.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <ProductTable data={data} />
        </div>
    );
};

export default ProductsPage;
