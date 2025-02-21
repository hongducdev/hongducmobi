import { create } from "zustand";
import { Product } from "@/types/product";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    addItem: (product: Product) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    removeAll: () => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    total: number;
    fetchCartItems: () => Promise<void>;
    discount: number;
    applyDiscount: (amount: number) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isLoading: false,
    total: 0,
    discount: 0,

    fetchCartItems: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/cart");
            const items = response.data;

            const total = items.reduce(
                (sum: number, item: CartItem) => 
                    sum + (item.product.price * item.quantity), 
                0
            );
            
            set({ items, total });
        } catch (error: any) {
            toast({
                title: "Lỗi khi tải giỏ hàng",
                description: error.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (product: Product) => {
        try {
            const user = useUserStore.getState().user;
            if (!user) {
                window.location.href = "/auth/login";
                return;
            }

            set({ isLoading: true });
            await axios.post("/cart", { productId: product._id });

            const currentItems = get().items;
            const existingItem = currentItems.find(
                (item) => item.product._id === product._id
            );

            if (existingItem) {
                const updatedItems = currentItems.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                set({ items: updatedItems });
            } else {
                set({ items: [...currentItems, { product, quantity: 1 }] });
            }

            toast({
                title: "Đã thêm vào giỏ hàng",
            });
        } catch (error: any) {
            toast({
                title: "Lỗi khi thêm vào giỏ hàng",
                description: error.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (productId: string, quantity: number) => {
        try {
            set({ isLoading: true });
            await axios.put(`/cart/${productId}`, { quantity });

            const currentItems = get().items;
            const updatedItems = currentItems.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            );
            set({ items: updatedItems });

            toast({
                title: "Đã cập nhật số lượng",
            });
        } catch (error: any) {
            toast({
                title: "Lỗi khi cập nhật số lượng",
                description: error.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    removeItem: async (productId: string) => {
        try {
            set({ isLoading: true });
            await axios.delete(`/cart/${productId}`);

            const currentItems = get().items;
            const updatedItems = currentItems.filter(
                (item) => item.product._id !== productId
            );
            set({ items: updatedItems });

            toast({
                title: "Đã xóa sản phẩm khỏi giỏ hàng",
            });
        } catch (error: any) {
            toast({
                title: "Lỗi khi xóa sản phẩm",
                description: error.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    removeAll: async () => {
        try {
            set({ isLoading: true });
            await axios.delete("/cart");
            set({ items: [], total: 0 });
            toast({
                title: "Đã xóa giỏ hàng",
            });
        } catch (error: any) {
            toast({
                title: "Lỗi khi xóa giỏ hàng",
                description: error.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    setItems: (items: CartItem[]) => {
        const total = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        set({ items, total });
    },

    applyDiscount: (amount: number) => {
        set({ discount: amount });
    },
}));
