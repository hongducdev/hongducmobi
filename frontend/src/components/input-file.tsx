import { UploadIcon } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import Image from "next/image";

const InputFile = ({
    value,
    onChange,
}: {
    value: string[];
    onChange: (value: string[]) => void;
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleClickInputFiles = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileUrls = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            onChange(fileUrls);
        }
    };

    return (
        <div>
            <div
                className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 cursor-pointer"
                onClick={handleClickInputFiles}
            >
                <div className="text-center">
                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-4 font-medium text-gray-900 dark:text-gray-50">
                        Kéo thả hình ảnh muốn tải lên
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        hoặc chọn một hoặc nhiều hình ảnh
                    </p>
                    <Input
                        type="file"
                        multiple
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                {value?.map((src, index) => (
                    <Image
                        key={index}
                        src={src}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="object-cover rounded-md"
                        onClick={() => window.open(src, "_blank")}
                    />
                ))}
            </div>
        </div>
    );
};

export default InputFile;
