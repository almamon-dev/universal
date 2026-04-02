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
            label: "Weekly QC report",
            desc: "Full diagnostic audit of conversation quality",
            href: "admin.report.weekly",
            main: true,
        },
        {
            icon: Layout,
            label: "Executive summary",
            desc: "High-level performance overview",
            href: "admin.report.summary",
        },
        {
            icon: TrendingUp,
            label: "Revenue analysis",
            desc: "Financial and conversion metrics",
            href: "admin.report.revenue",
        },
        {
            icon: Zap,
            label: "System efficiency",
            desc: "Cross-departmental protocol consistency",
            href: "#",
        },
        {
            icon: BarChart,
            label: "Risk assessment",
            desc: "Revenue leakage identification",
            href: "#",
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Reports — ${agency.name}`} />

            <div className="min-h-screen bg-zinc-50/50 py-12 px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href={route("admin.agencies.edit", agency.id)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-black transition-colors group mb-8"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to agency
                    </Link>

                    <div className="mb-12 space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                                Reporting suite
                            </h1>
                            <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold rounded">
                                SYSTEM LIVE
                            </span>
                        </div>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-xl">
                            Operational diagnostics and data visualization for {agency.name}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report, i) => (
                            <Link
                                key={i}
                                href={
                                    report.href !== "#"
                                        ? route(report.href, agency.id)
                                        : "#"
                                }
                                className={`group rounded-xl border p-8 transition-all hover:border-zinc-900 shadow-sm ${
                                    report.main
                                        ? "bg-zinc-900 border-zinc-900 text-white"
                                        : "bg-white border-zinc-200 text-zinc-900"
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 ${report.main ? "bg-white/10" : "bg-zinc-100"} rounded-lg flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}
                                >
                                    <report.icon
                                        className={`w-5 h-5 ${report.main ? "text-white" : "text-zinc-900"}`}
                                    />
                                </div>
                                <h3
                                    className={`text-lg font-bold mb-2 ${report.main ? "text-white" : "text-zinc-900"}`}
                                >
                                    {report.label}
                                </h3>
                                <p
                                    className={`text-[11px] font-medium leading-relaxed mb-10 ${report.main ? "text-white/60" : "text-zinc-500"}`}
                                >
                                    {report.desc}
                                </p>
                                <div
                                    className={`pt-6 border-t flex items-center justify-between ${
                                        report.main
                                            ? "border-white/10"
                                            : "border-zinc-50"
                                    }`}
                                >
                                    <span
                                        className={`text-[9px] font-bold ${
                                            report.main
                                                ? "text-white/40"
                                                : "text-zinc-400"
                                        }`}
                                    >
                                        OPEN REPORT
                                    </span>
                                    <span
                                        className={`text-lg transition-transform group-hover:translate-x-1 ${
                                            report.main
                                                ? "text-white"
                                                : "text-zinc-900"
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
