import { Mail, MapPinned, Phone } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
    return (
        <footer>
            <div className="max-w-7xl mx-auto py-10 grid grid-cols-3 gap-10">
                <div className="">
                    <h5 className="text-xl font-semibold mb-4">Hỗ trợ</h5>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <MapPinned />
                            <span>Xã Quyết Thắng, Thành phố Thái Nguyên</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone />
                            <span>0909090909</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail />
                            <span>hongduc@gmail.com</span>
                        </li>
                    </ul>
                </div>
                <div className="">
                    <h5 className="text-xl font-semibold mb-4">Về chúng tôi</h5>
                    <p>
                        Hồng Đức Mobi là một cửa hàng bán điện thoại di động
                        trực tuyến. Chúng tôi cung cấp các sản phẩm điện thoại
                        di động chính hãng với giá cả cạnh tranh và dịch vụ chất
                        lượng cao.
                    </p>
                </div>
                <div className="">
                    <h5 className="text-xl font-semibold mb-4">
                        Đăng ký nhận bản tin
                    </h5>
                    <p className="mb-4">
                        Đăng ký để nhận thông tin mới nhất và các ưu đãi đặc
                        biệt từ chúng tôi.
                    </p>
                    <form className="flex gap-2">
                        <Input type="email" placeholder="Nhập email của bạn" />
                        <Button type="submit">Đăng ký</Button>
                    </form>
                </div>
            </div>
            <div className="bg-gray-100 p-4">
                <div className="container mx-auto">
                    <p className="text-center text-gray-600">
                        &copy; {new Date().getFullYear()} Bản quyền thuộc về
                        Hồng Đức Mobi.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
