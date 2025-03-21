import { create } from "zustand";
import axios from "@/lib/axios";
import { User } from "@/types/user";

interface UserStore {
    user: User | null;
    checkingAuth: boolean;
    setUser: (user: any) => void;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<any>;
    logout: () => Promise<void>;
    setupAutoRefresh: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => {

    return {
        user: null,
        checkingAuth: true,

        setUser: (user) => set({ user }),

        logout: async () => {
            try {
                await axios.post("/auth/logout");
                set({ user: null });
                window.location.href = "/auth/login";
            } catch (error) {
                console.error("Error logging out:", error);
                throw error;
            }
        },

        checkAuth: async () => {
            set({ checkingAuth: true });
            try {
                const response = await axios.get("/auth/profile");
                set({ user: response.data, checkingAuth: false });
                get().setupAutoRefresh();
            } catch (error: any) {
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

        setupAutoRefresh: () => {
            const REFRESH_INTERVAL = 14 * 60 * 1000;

            const refresh = async () => {
                try {
                    if (get().user) {
                        await get().refreshToken();
                    }
                } catch (error) {
                    console.error("Auto refresh token failed:", error);
                }
            };

            const intervalId = setInterval(refresh, REFRESH_INTERVAL);

            return () => clearInterval(intervalId);
        },

        updateProfile: async (data) => {
            try {
                const response = await axios.put("/users/profile", data);
                set({ user: response.data.user });
            } catch (error) {
                throw error;
            }
        },
    };
});

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
