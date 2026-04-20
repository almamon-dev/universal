import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
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

            <div className="min-h-screen bg-[#fafafa] py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Agency Management Overview
                            </p>
                        </div>
                        <Link
                            href={route("admin.agencies.create")}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            <Plus size={18} />
                            Create Agency
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col gap-1"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-500">
                                        {stat.label}
                                    </span>
                                    <div className={stat.color}>
                                        <stat.icon size={16} />
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.bgColor} ${stat.color}`}>
                                            SYSTEM DATA
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Agency Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Agency Registry
                                </h3>
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                                    {filteredAgencies.length} record(s)
                                </span>
                            </div>

                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="Search agencies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all w-64"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-3 text-xs font-bold text-gray-400  tracking-wider">
                                            Agency Info
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-400  tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-400  tracking-wider">
                                            Statistics
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-400  tracking-wider text-right">
                                            Quick Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAgencies.map((agency) => (
                                        <tr
                                            key={agency.id}
                                            className="group hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route(
                                                                "admin.agencies.edit",
                                                                agency.id,
                                                            )}
                                                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                                                        >
                                                            {agency.name}
                                                        </Link>
                                                        <p className="text-xs text-gray-400">
                                                            ID: {agency.id.toString().padStart(4, "0")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={agency.status === "active"}
                                                        onChange={(checked) => {
                                                            router.patch(
                                                                route(
                                                                    "admin.agencies.status",
                                                                    agency.id,
                                                                ),
                                                                { status: checked ? "active" : "inactive" },
                                                                {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                    only: ['agencies', 'stats']
                                                                }
                                                            );
                                                        }}
                                                        className="data-[state=checked]:bg-indigo-600"
                                                    />
                                                    <span
                                                        className={`text-xs font-bold  tracking-wider ${agency.status === "active" ? "text-indigo-600" : "text-gray-400"}`}
                                                    >
                                                        {agency.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1 text-gray-500" title="Total Chatters">
                                                        <Users size={14} />
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {agency.chatters_count || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500" title="Total Audits">
                                                        <Activity size={14} />
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {agency.audits_count || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    <Link
                                                        href={route("admin.agencies.edit", agency.id)}
                                                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-sm text-xs font-bold transition-all shadow-md shadow-zinc-100 flex items-center gap-2"
                                                    >
                                                        Manage Agency
                                                        <ArrowUpRight size={14} className="opacity-60" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
