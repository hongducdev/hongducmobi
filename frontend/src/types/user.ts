export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        district: string;
        ward: string;
    };
}
