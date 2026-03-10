import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Plus,
    Search,
    Edit2,
    Briefcase,
    Activity,
    ArrowUpRight,
    Users,
    Clock,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/Components/ui/switch";
import { router } from "@inertiajs/react";

export default function Dashboard({ auth, stats, agencies }) {
    const user = auth.user;
    const [searchTerm, setSearchTerm] = useState("");

    const agencyList = Array.isArray(agencies) ? agencies : [];
    const filteredAgencies = agencyList.filter((agency) =>
        (agency?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Minimal stat cards with subtle colors
    const statCards = [
        {
            label: "Total Agencies",
            value: stats?.total_agencies || 0,
            icon: Briefcase,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Active",
            value: stats?.active_agencies || 0,
            icon: Activity,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            label: "Inactive",
            value: stats?.inactive_agencies || 0,
            icon: Clock,
            color: "text-gray-500",
            bgColor: "bg-gray-100",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Simple Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-medium text-gray-900">
                            Welcome back, {user.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Minimal Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.color}`}
                                    >
                                        <stat.icon size={16} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Agency Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users size={18} className="text-gray-400" />
                                <h2 className="text-sm font-medium text-gray-700">
                                    Agencies
                                </h2>
                                <span className="text-xs text-gray-400">
                                    {filteredAgencies.length} total
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors w-48"
                                    />
                                </div>

                                {/* Create Button */}
                                <Link
                                    href={route("admin.agencies.create")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <Plus size={14} />
                                    New Agency
                                </Link>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Agency Name
                                        </th>
                                        <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Audits
                                        </th>
                                        <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Toggle
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAgencies.length > 0 ? (
                                        filteredAgencies.map((agency, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-7 h-7 rounded ${agency.status === "active" ? "bg-emerald-100" : "bg-gray-100"} flex items-center justify-center`}
                                                        >
                                                            <Briefcase
                                                                size={14}
                                                                className={
                                                                    agency.status ===
                                                                    "active"
                                                                        ? "text-emerald-600"
                                                                        : "text-gray-400"
                                                                }
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-900">
                                                            {agency.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className="text-sm text-gray-600">
                                                        {agency.total_audits ||
                                                            0}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                            agency.status ===
                                                            "active"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {agency.status ===
                                                        "active"
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <div className="flex justify-center">
                                                        <Switch
                                                            checked={
                                                                agency.status ===
                                                                "active"
                                                            }
                                                            onChange={(
                                                                checked,
                                                            ) => {
                                                                router.patch(
                                                                    route(
                                                                        "admin.agencies.update",
                                                                        agency.id,
                                                                    ),
                                                                    {
                                                                        ...agency,
                                                                        status: checked
                                                                            ? "active"
                                                                            : "inactive",
                                                                    },
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.agencies.edit",
                                                                agency.id,
                                                            )}
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.agencies.edit",
                                                                agency.id,
                                                            )}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors"
                                                        >
                                                            Manage
                                                            <ArrowUpRight
                                                                size={12}
                                                            />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-5 py-8 text-center"
                                            >
                                                <p className="text-sm text-gray-400">
                                                    No agencies found
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Simple Footer */}
                        {filteredAgencies.length > 0 && (
                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    Showing {filteredAgencies.length} of{" "}
                                    {agencyList.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">
                                        Previous
                                    </button>
                                    <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                                        1
                                    </button>
                                    <button className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Simple Footer Stats */}
                    <div className="mt-4 flex items-center justify-end gap-4 text-xs text-gray-400">
                        <span>Last updated: Just now</span>
                        <span>•</span>
                        <span>{agencyList.length} agencies total</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
