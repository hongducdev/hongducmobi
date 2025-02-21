export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role: "USER" | "ADMIN";
    address?: {
        street: string;
        city: string;
        district: string;
        ward: string;
    };
}
