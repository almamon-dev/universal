import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Shield, Users, TrendingUp, Zap } from "lucide-react";
import ReportHeader from "./Partials/ReportHeader";

export default function AgencyAudit({ agency }) {
    const metrics = [
        {
            label: "First Paywall",
            value: `$${agency.first_paywall_sexting || "0.00"}`,
        },
        {
            label: "Avg Sequence",
            value: `${agency.avg_completed_sexting_sequence || "0"} msgs`,
        },
        { label: "Avg PPV", value: `$${agency.avg_recorded_ppn || "0.00"}` },
        { label: "Health", value: "92%", highlight: true },
    ];

    return (
        <AdminLayout>
            <Head title={`Agency Audit — ${agency.name}`} />

            <div className="min-h-screen bg-[#F0F2F5] py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto space-y-10">
                    <ReportHeader agency={agency} stats={{ total_audits: 0 }} />

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        {/* Header Section */}
                        <div className="p-12 border-b border-slate-100 bg-white">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
                                Operational Audit
                            </h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Integrity Assessment • Invariant Consulting
                            </p>
                        </div>

                        <div className="p-12 space-y-12">
                            {/* Protocol Analysis Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Chatter Protocols",
                                        desc: "Response timing and sales closing mechanics",
                                        value: "98.2%",
                                        color: "text-blue-600",
                                        bg: "bg-blue-50",
                                    },
                                    {
                                        icon: Users,
                                        title: "QC Oversight",
                                        desc: "Management intervention and rule enforcement",
                                        value: "96.5%",
                                        color: "text-rose-600",
                                        bg: "bg-rose-50",
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: "Growth Strategy",
                                        desc: "Strategic alignment with objectives",
                                        value: "94.8%",
                                        color: "text-emerald-600",
                                        bg: "bg-emerald-50",
                                    },
                                ].map((card, i) => (
                                    <div
                                        key={i}
                                        className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-all hover:shadow-lg"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div
                                                className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center ${card.color} shadow-sm transition-transform group-hover:scale-110`}
                                            >
                                                <card.icon size={24} />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                                    {card.value}
                                                </span>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    Current Score
                                                </p>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                                            {card.desc}
                                        </p>
                                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                Audit Integrity
                                            </span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <div
                                                        key={s}
                                                        className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? card.color : "bg-slate-100"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* System Snapshot Section */}
                            <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-10 text-white">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                                <div className="relative flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">
                                            Agency System Snapshot
                                        </h2>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                            Operational Configuration Profile
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/40">
                                        <Zap size={20} />
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-12">
                                    {metrics.map((metric, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                {metric.label}
                                            </p>
                                            <p
                                                className={`text-2xl font-black tracking-tighter ${
                                                    metric.highlight
                                                        ? "text-emerald-400"
                                                        : "text-white"
                                                }`}
                                            >
                                                {metric.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Footer */}
                            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
                                <div className="text-center md:text-left">
                                    <div className="w-48 h-1 bg-slate-900 mb-4 mx-auto md:mx-0" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Authorized Auditor Signature
                                    </p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Official Verification
                                    </p>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                        Invariant Consulting
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
