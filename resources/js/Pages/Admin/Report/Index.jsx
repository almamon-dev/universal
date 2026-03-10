import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Shield,
    Layout,
    TrendingUp,
    Zap,
    BarChart,
    ArrowLeft,
} from "lucide-react";

export default function Index({ agency }) {
    const reports = [
        {
            icon: Shield,
            label: "Weekly QC Report",
            desc: "Full diagnostic audit of conversation quality",
            href: "admin.report.weekly",
            main: true,
        },
        {
            icon: Layout,
            label: "Executive Summary",
            desc: "High-level performance overview",
            href: "admin.report.summary",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: TrendingUp,
            label: "Revenue Analysis",
            desc: "Financial and conversion metrics",
            href: "admin.report.revenue",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            icon: Zap,
            label: "System Efficiency",
            desc: "Cross-departmental protocol consistency",
            href: "#",
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            icon: BarChart,
            label: "Risk Assessment",
            desc: "Revenue leakage identification",
            href: "#",
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Reports — ${agency.name}`} />

            <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href={route("admin.agencies.edit", agency.id)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#1E293B] mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Agency
                    </Link>

                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="text-3xl font-light text-[#0F172A]">
                                Report Hub
                            </h1>
                            <span className="px-2.5 py-1 bg-[#1E293B] text-white text-[10px] font-semibold rounded-full">
                                LIVE DATA
                            </span>
                        </div>
                        <p className="text-base text-[#64748B]">
                            Operational diagnostics for {agency.name}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reports.map((report, i) => (
                            <Link
                                key={i}
                                href={
                                    report.href !== "#"
                                        ? route(report.href, agency.id)
                                        : "#"
                                }
                                className={`group rounded-sm border p-6 transition-all hover:shadow-md ${
                                    report.main
                                        ? "bg-[#0F172A] border-[#0F172A]"
                                        : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 ${report.main ? "bg-white/10" : report.bg} rounded-lg flex items-center justify-center mb-4`}
                                >
                                    <report.icon
                                        className={`w-5 h-5 ${report.main ? "text-white" : report.color}`}
                                    />
                                </div>
                                <h3
                                    className={`text-base font-medium mb-2 ${report.main ? "text-white" : "text-[#0F172A]"}`}
                                >
                                    {report.label}
                                </h3>
                                <p
                                    className={`text-sm mb-6 ${report.main ? "text-white/60" : "text-[#64748B]"}`}
                                >
                                    {report.desc}
                                </p>
                                <div
                                    className={`pt-4 border-t flex items-center justify-between ${
                                        report.main
                                            ? "border-white/10"
                                            : "border-[#F1F5F9]"
                                    }`}
                                >
                                    <span
                                        className={`text-xs font-semibold uppercase tracking-wider ${
                                            report.main
                                                ? "text-white/40"
                                                : "text-[#94A3B8]"
                                        }`}
                                    >
                                        VIEW REPORT
                                    </span>
                                    <span
                                        className={`text-sm transition-transform group-hover:translate-x-1 ${
                                            report.main
                                                ? "text-white"
                                                : "text-[#64748B]"
                                        }`}
                                    >
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
