import axios from "./axios";

export const getProductById = async (id: string) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};

export const getProductBySlug = async (slug: string) => {
    const response = await axios.get(`/products/${slug}`);
    return response.data;
};

export const getProducts = async () => {
    const response = await axios.get("/products");
    return response.data;
};

