export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    quantity: number;
    sold: number;
    category: string;
    isFeatured: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
