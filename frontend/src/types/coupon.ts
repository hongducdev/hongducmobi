export interface Coupon {
    _id: string;
    code: string;
    discountType: "percent" | "fixed";
    discount: number;
    quantity: number;
    used: number;
    expiryDate: Date | string;
    discountPercentage: number;
    maxUses: number;
    currentUses?: number;
    startDate?: Date;
    expirationDate?: Date;
    isActive?: boolean;
}
