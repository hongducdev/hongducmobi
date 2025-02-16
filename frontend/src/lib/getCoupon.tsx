import axios from "./axios";

export const getCoupons = async () => {
    const response = await axios.get("/coupons");
    return response.data;
};

export const getCoupon = async (id: string) => {
    const response = await axios.get(`/coupons/${id}`);
    return response.data;
};
