import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor để log request
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add interceptor để log response
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Response error:", error);
        return Promise.reject(error);
    }
);

export default instance;
