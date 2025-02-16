"use client";

import React, { useEffect, useState } from "react";
import UserTable from "@/components/admin/user-table";
import axios from "@/lib/axios";

const UserPage = async () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/users");
                setUsers(response.data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500">Error: {error.message}</p>
                </div>
            ) : (
                <UserTable data={users} />
            )}
        </div>
    );
};

export default UserPage;
