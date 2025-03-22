import { Product } from "@/types/product";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json());

    const product = products.map((product: Product) => ({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        ...product,
    ];
}
