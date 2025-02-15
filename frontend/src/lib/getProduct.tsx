import axios from "./axios";

export const getProductById = async (id: string) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};
