import { create } from "zustand";
import axios from "@/lib/axios";
import router from "next/router";
interface UserStore {
    user: any | null;
    checkingAuth: boolean;
    setUser: (user: any) => void;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<any>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    checkingAuth: true,

    setUser: (user) => set({ user }),

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
            router.push("/auth");
        } catch (error: any) {
            console.log(error.message);
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error: any) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error: any) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },
}));

let refreshPromise: Promise<any> | null = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
