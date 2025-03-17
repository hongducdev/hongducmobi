import {
    Facebook,
    Instagram,
    Mail,
    MapPinned,
    Phone,
    Twitter,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white">
                            Hồng Đức Mobi
                        </h3>
                        <p className="text-gray-400">
                            Chuyên cung cấp các sản phẩm điện thoại chính hãng
                            với giá tốt nhất thị trường
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="hover:text-blue-500 transition-colors"
                            >
                                <Facebook />
                            </a>
                            <a
                                href="#"
                                className="hover:text-blue-500 transition-colors"
                            >
                                <Instagram />
                            </a>
                            <a
                                href="#"
                                className="hover:text-blue-500 transition-colors"
                            >
                                <Twitter />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                            Liên kết nhanh
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-500 transition-colors"
                                >
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-500 transition-colors"
                                >
                                    Sản phẩm
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-500 transition-colors"
                                >
                                    Khuyến mãi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-500 transition-colors"
                                >
                                    Tin tức
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                            Thông tin liên hệ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <MapPinned className="text-blue-500 flex-shrink-0" />
                                <span>
                                    Xã Quyết Thắng, Thành phố Thái Nguyên
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500 flex-shrink-0" />
                                <span>0909090909</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500 flex-shrink-0" />
                                <span>hongduc@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                            Đăng ký nhận tin
                        </h4>
                        <p className="text-gray-400">
                            Nhận thông tin mới nhất về sản phẩm và khuyến mãi
                        </p>
                        <form className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Email của bạn"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Đăng ký
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto py-6 px-4 text-center text-gray-400">
                    <p>
                        © {new Date().getFullYear()} Hồng Đức Mobi. Tất cả quyền
                        được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
