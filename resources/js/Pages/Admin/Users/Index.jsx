import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Home,
    Search,
    Trash2,
    Check,
    AlertCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    User as UserIcon,
    Shield,
    Mail,
    Calendar,
} from "lucide-react";

export default function Index({ users, filters = {}, auth }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route("admin.users.index"),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (e) => {
        updateFilters({ per_page: e.target.value, page: 1 });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(route("admin.users.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Users Management" />

            <div className="max-w-full mx-auto space-y-8 pb-10 px-8 pt-8 min-h-screen">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
                            User Management
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Manage and audit system users
                        </p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
                    {/* Search & Stats Header Area */}
                    <div className="p-8 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-black">
                            All Users
                        </h2>
                        <div className="relative w-80">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="w-full h-[48px] pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-[15px] focus:ring-1 focus:ring-black transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF8F4]">
                                    <th className="px-10 py-5 text-[14px] font-bold text-[#8A5E4D]">
                                        User Information
                                    </th>
                                    <th className="px-10 py-5 text-[14px] font-bold text-[#8A5E4D] text-center">
                                        Role
                                    </th>
                                    <th className="px-10 py-5 text-[14px] font-bold text-[#8A5E4D] text-center">
                                        Joined Date
                                    </th>
                                    <th className="px-10 py-5 text-[14px] font-bold text-[#8A5E4D] text-right pr-12">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden">
                                                        {user.profile_photo_url ? (
                                                            <img
                                                                src={
                                                                    user.profile_photo_url
                                                                }
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserIcon
                                                                size={20}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[16px] font-bold text-gray-900 leading-snug">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-[13px] text-gray-500 font-medium">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span
                                                    className={`inline-flex px-4 py-1.5 rounded-2xl text-[12px] font-bold border ${
                                                        user.is_admin
                                                            ? "bg-indigo-100/50 text-indigo-600 border-indigo-100"
                                                            : "bg-emerald-100/50 text-emerald-600 border-emerald-100"
                                                    }`}
                                                >
                                                    {user.is_admin
                                                        ? "Administrator"
                                                        : "General User"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-center text-[15px] text-gray-500 font-medium">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </td>
                                            <td className="px-10 py-6 text-right pr-12">
                                                <div className="flex items-center justify-end gap-3">
                                                    {user.id !==
                                                        auth.user.id && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center bg-[#FF6B6B]/10 text-[#FF6B6B] px-6 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#FF6B6B] hover:text-white transition-all shadow-sm active:scale-95"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                    <button className="inline-flex items-center justify-center bg-black text-white px-8 py-2.5 rounded-xl text-[14px] font-bold hover:bg-zinc-800 transition-all transition-all active:scale-95">
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-10 py-20 text-center text-gray-400 text-base font-medium"
                                        >
                                            No users found in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-10 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[14px] text-gray-500 font-medium">
                                Showing {users.from || 0} to {users.to || 0} of{" "}
                                {users.total || 0} users
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 mr-6">
                                <span className="text-[14px] text-gray-500 font-medium">
                                    Rows:
                                </span>
                                <select
                                    value={filters.per_page || 10}
                                    onChange={handlePerPageChange}
                                    className="bg-white border border-gray-100 rounded-xl text-[13px] text-gray-900 font-bold focus:ring-0 outline-none cursor-pointer px-3 py-1.5"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(users.prev_page_url)
                                    }
                                    disabled={!users.prev_page_url}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-600 disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(users.next_page_url)
                                    }
                                    disabled={!users.next_page_url}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-600 disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
