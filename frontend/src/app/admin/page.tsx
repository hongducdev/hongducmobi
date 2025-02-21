"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Package, ShoppingCart, Users } from "lucide-react";

interface Analytics {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: {
        date: string;
        total: number;
    }[];
    topProducts: {
        name: string;
        total: number;
    }[];
}

const chartConfig = {
    revenue: {
        label: "Doanh thu",
        color: "hsl(var(--chart-1))",
    },
    products: {
        label: "Sản phẩm",
        color: "hsl(var(--chart-2))",
    },
};

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Tổng quan</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Doanh thu
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(analytics.totalRevenue)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Đơn hàng
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.totalOrders}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Người dùng
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.totalUsers}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sản phẩm
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.totalProducts}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo ngày</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="h-[350px]"
                        >
                            <BarChart data={analytics.recentOrders}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(5)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) =>
                                        `${value / 1000000}M`
                                    }
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-revenue)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <ChartTooltip />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sản phẩm bán chạy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="h-[350px]"
                        >
                            <BarChart data={analytics.topProducts}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-products)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <ChartTooltip />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
