"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getProvinces, getDistricts, getWards } from "@/lib/address";

interface AddressForm {
    street: string;
    city: string;
    district: string;
    ward: string;
}

interface Option {
    value: string;
    label: string;
}

export default function AddressesPage() {
    const { user } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState<Option[]>([]);
    const [districts, setDistricts] = useState<Option[]>([]);
    const [wards, setWards] = useState<Option[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Option | null>(
        null
    );
    const [selectedDistrict, setSelectedDistrict] = useState<Option | null>(
        null
    );
    const [selectedWard, setSelectedWard] = useState<Option | null>(null);

    const [addressForm, setAddressForm] = useState<AddressForm>({
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        district: user?.address?.district || "",
        ward: user?.address?.ward || "",
    });

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(
                    data.map((p) => ({
                        value: p.code,
                        label: p.name,
                    }))
                );
            } catch (error) {
                console.error("Error loading provinces:", error);
            }
        };
        loadProvinces();
    }, []);

    useEffect(() => {
        if (user?.address) {
            setAddressForm({
                street: user.address.street,
                city: user.address.city,
                district: user.address.district,
                ward: user.address.ward,
            });
        }
    }, [user]);

    const handleProvinceChange = async (option: Option | null) => {
        setSelectedProvince(option);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        if (option) {
            try {
                const data = await getDistricts(option.value);
                setDistricts(
                    data.map((d) => ({
                        value: d.code,
                        label: d.name,
                    }))
                );
                setAddressForm((prev) => ({
                    ...prev,
                    city: option.label,
                    district: "",
                    ward: "",
                }));
            } catch (error) {
                console.error("Error loading districts:", error);
            }
        }
    };

    const handleDistrictChange = async (option: Option | null) => {
        setSelectedDistrict(option);
        setSelectedWard(null);
        setWards([]);

        if (option) {
            try {
                const data = await getWards(option.value);
                setWards(
                    data.map((w) => ({
                        value: w.code,
                        label: w.name,
                    }))
                );
                setAddressForm((prev) => ({
                    ...prev,
                    district: option.label,
                    ward: "",
                }));
            } catch (error) {
                console.error("Error loading wards:", error);
            }
        }
    };

    const handleWardChange = (option: Option | null) => {
        setSelectedWard(option);
        if (option) {
            setAddressForm((prev) => ({
                ...prev,
                ward: option.label,
            }));
        }
    };

    const handleSubmit = async () => {
        if (
            !addressForm.street ||
            !addressForm.city ||
            !addressForm.district ||
            !addressForm.ward
        ) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin địa chỉ",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await axios.put("/users/address", addressForm);
            toast({
                title: "Thành công",
                description: "Đã cập nhật địa chỉ",
            });
            setIsEditing(false);
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description:
                    error.response?.data?.message ||
                    "Không thể cập nhật địa chỉ",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-10">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Địa chỉ của tôi</h2>
                {user?.address && (
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "default"}
                    >
                        {isEditing ? "Hủy" : "Chỉnh sửa"}
                    </Button>
                )}
            </div>

            <div className="p-6 border rounded-lg space-y-2">
                <p className="font-medium text-lg">{user?.name}</p>
                <p>Số điện thoại: {user?.phoneNumber}</p>
                {user?.address ? (
                    <p>
                        Địa chỉ: {user.address.street}, {user.address.ward},{" "}
                        {user.address.district}, {user.address.city}
                    </p>
                ) : (
                    <p className="text-gray-500">Chưa có địa chỉ</p>
                )}
            </div>

            {(isEditing || !user?.address) && (
                <div className="p-6 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Địa chỉ
                            </label>
                            <Input
                                placeholder="Nhập địa chỉ"
                                value={addressForm.street}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        street: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tỉnh/Thành phố
                            </label>
                            <Select
                                value={addressForm.city}
                                onValueChange={(value) => {
                                    const province = provinces.find(
                                        (p) => p.label === value
                                    );
                                    if (province) {
                                        handleProvinceChange({
                                            value: province.value,
                                            label: value,
                                        });
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem
                                            key={province.value}
                                            value={province.label}
                                        >
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Quận/Huyện
                            </label>
                            <Select
                                value={addressForm.district}
                                onValueChange={(value) => {
                                    const district = districts.find(
                                        (d) => d.label === value
                                    );
                                    if (district) {
                                        handleDistrictChange({
                                            value: district.value,
                                            label: value,
                                        });
                                    }
                                }}
                                disabled={!addressForm.city}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem
                                            key={district.value}
                                            value={district.label}
                                        >
                                            {district.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Phường/Xã
                            </label>
                            <Select
                                value={addressForm.ward}
                                onValueChange={(value) => {
                                    const ward = wards.find(
                                        (w) => w.label === value
                                    );
                                    if (ward) {
                                        handleWardChange({
                                            value: ward.value,
                                            label: value,
                                        });
                                    }
                                }}
                                disabled={!addressForm.district}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn phường/xã" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map((ward) => (
                                        <SelectItem
                                            key={ward.value}
                                            value={ward.label}
                                        >
                                            {ward.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-4">
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu địa chỉ"
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
