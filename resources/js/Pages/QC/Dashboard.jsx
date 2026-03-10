import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    FileSpreadsheet,
    BookOpen,
    LogOut,
    Building2,
    Calendar,
    BarChart3,
    Activity,
    Plus,
    ArrowUpRight,
} from "lucide-react";

export default function QCDashboard({ agency, stats, recent_audits = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <UserLayout>
            <Head title="QC Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10 px-6 pt-6 min-h-screen">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                            Welcome back
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {user.name} • Quality Control
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={
                                user?.agency_id
                                    ? route(
                                          "admin.agencies.protocols",
                                          user.agency_id,
                                      )
                                    : "#"
                            }
                            className="bg-white border border-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 text-[13px] font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <BookOpen size={18} />
                            <span>Agency Protocols</span>
                        </Link>
                        <Link
                            href={
                                user?.agency_id
                                    ? route(
                                          "admin.agencies.audits.create",
                                          user.agency_id,
                                      )
                                    : "#"
                            }
                            className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 text-[13px] font-bold hover:bg-zinc-800 transition-all shadow-sm"
                        >
                            <Plus size={18} />
                            <span>New Audit</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Agency Info Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <Building2 size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Agency Details
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xl font-bold text-black truncate">
                                {agency?.name || "Ultra LLC"}
                            </h3>
                        </div>
                    </div>

                    {/* Total Audits Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                <Activity size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Total Audits
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {stats?.total_audits || 0}
                        </h3>
                    </div>

                    {/* Today's Audits Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                <Calendar size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Today's Audits
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {stats?.today_audits || 0}
                        </h3>
                    </div>

                    {/* Active Fields Count Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <FileSpreadsheet size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Audit Protocol
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {agency?.audit_fields?.length || 0}{" "}
                            <span className="text-sm font-bold text-gray-400">
                                Fields
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Audit Fields Summary Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-[#F1F5F9]/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet
                                size={18}
                                className="text-purple-600"
                            />
                            <h2 className="text-[15px] font-bold text-gray-900">
                                Active Audit Protocol
                            </h2>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Requirement Checklist
                        </span>
                    </div>
                    <div className="p-6">
                        {agency?.audit_fields &&
                        agency.audit_fields.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {agency.audit_fields.map((field, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${field.required ? "bg-red-400" : "bg-gray-300"}`}
                                        />
                                        <span className="text-[13px] font-bold text-gray-700 truncate">
                                            {field.field_label || field.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-400 font-medium">
                                    No custom audit fields configured for this
                                    agency.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Audits Table Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
                    <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
                        <h2 className="text-lg font-bold text-black">
                            Recent Audits
                        </h2>
                        <button className="text-[13px] font-bold text-blue-600 hover:underline">
                            View All History
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#f8fafc]">
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b]">
                                        Subscriber UID
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b]">
                                        Chatter Name
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b] text-center">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b] text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b] text-center">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-bold text-[#64748b] text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recent_audits && recent_audits.length > 0 ? (
                                    recent_audits.map((audit, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-[14px] font-semibold text-gray-900">
                                                {audit.subscriber_uid ||
                                                    `AUD-${audit.id}`}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] font-medium text-gray-700">
                                                {audit.chatter?.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[12px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                                    {audit.response_data
                                                        ?.subscriber_type ||
                                                        "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-[12px] font-bold ${
                                                        audit.status ===
                                                        "completed"
                                                            ? "bg-emerald-100/50 text-emerald-600"
                                                            : "bg-amber-100/50 text-amber-600"
                                                    }`}
                                                >
                                                    {audit.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[14px] text-gray-500 font-medium">
                                                {new Date(
                                                    audit.created_at,
                                                ).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-black transition-colors">
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-10 py-20 text-center text-gray-400 text-sm font-medium"
                                        >
                                            No audits found for your agency yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Quick Access Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Agency Protocols Card */}
                    <Link
                        href={
                            user?.agency_id
                                ? route(
                                      "admin.agencies.protocols",
                                      user.agency_id,
                                  )
                                : "#"
                        }
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-black/5 hover:shadow-lg transition-all text-black"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Agency Protocols
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    View guidelines and rules
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-black transition-colors"
                        />
                    </Link>

                    {/* Audit Form Templates Card */}
                    <Link
                        href={
                            user?.agency_id
                                ? route(
                                      "admin.agencies.audits.create",
                                      user.agency_id,
                                  )
                                : "#"
                        }
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-black/5 hover:shadow-lg transition-all text-black"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                                <FileSpreadsheet size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Audit Form Templates
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    Submit new QC reports
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-black transition-colors"
                        />
                    </Link>

                    {/* Logout Card */}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-red-100 transition-all text-left text-black"
                    >
                        <div className="flex items-center gap-4 text-black">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <LogOut size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Logout Session
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    Sign out of dashboard
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-red-500 transition-colors"
                        />
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
