export interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    maxUses: number;
    currentUses: number;
    startDate: Date;
    expirationDate: Date;
    isActive: boolean;
}
