import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Shield, Users, TrendingUp, Zap } from "lucide-react";
import ReportHeader from "./Partials/ReportHeader";

export default function AgencyAudit({ agency }) {
    const metrics = [
        {
            label: "First paywall",
            value: `$${agency.first_paywall_sexting || "0.00"}`,
        },
        {
            label: "Avg sequence",
            value: `${agency.avg_completed_sexting_sequence || "0"} msgs`,
        },
        { label: "Avg PPV", value: `$${agency.avg_recorded_ppn || "0.00"}` },
        { label: "Health indicator", value: "92%", highlight: true },
    ];

    return (
        <AdminLayout>
            <Head title={`Agency Audit — ${agency.name}`} />

            <div className="min-h-screen bg-zinc-50/50 py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto space-y-10">
                    <ReportHeader agency={agency} stats={{ total_audits: 0 }} />

                    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                        {/* Header Section */}
                        <div className="p-10 border-b border-zinc-100 bg-white">
                            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">
                                Operational audit
                            </h1>
                            <p className="text-[11px] font-bold text-zinc-400">
                                Integrity assessment • Invariant Consulting
                            </p>
                        </div>

                        <div className="p-10 space-y-12">
                            {/* Protocol Analysis Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Chatter protocols",
                                        desc: "Response timing and sales closing mechanics",
                                        value: "98.2%",
                                    },
                                    {
                                        icon: Users,
                                        title: "QC oversight",
                                        desc: "Management intervention and rule enforcement",
                                        value: "96.5%",
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: "Growth strategy",
                                        desc: "Strategic alignment with objectives",
                                        value: "94.8%",
                                    },
                                ].map((card, i) => (
                                    <div
                                        key={i}
                                        className="group relative bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-900 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-900 border border-zinc-200">
                                                <card.icon size={20} />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-zinc-900 tracking-tighter">
                                                    {card.value}
                                                </span>
                                                <p className="text-[9px] font-bold text-zinc-400 mt-0.5">
                                                    Current score
                                                </p>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-bold text-zinc-900 mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-[11px] leading-relaxed text-zinc-500 font-medium">
                                            {card.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* System Snapshot Section */}
                            <div className="relative overflow-hidden bg-zinc-50 rounded-xl p-8 border border-zinc-200">
                                <div className="relative flex items-center justify-between mb-8 pb-6 border-b border-zinc-200">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                                            Agency system snapshot
                                        </h2>
                                        <p className="text-[10px] text-zinc-400 font-bold mt-1">
                                            Operational configuration profile
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-zinc-200 rounded-lg flex items-center justify-center text-zinc-500">
                                        <Zap size={20} />
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {metrics.map((metric, i) => (
                                        <div key={i} className="space-y-1">
                                            <p className="text-[9px] font-bold text-zinc-400">
                                                {metric.label}
                                            </p>
                                            <p className="text-2xl font-bold tracking-tighter text-zinc-900">
                                                {metric.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Footer */}
                            <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
                                <div className="text-center md:text-left">
                                    <div className="w-32 h-1 bg-zinc-200 mb-4 mx-auto md:mx-0" />
                                    <p className="text-[10px] font-bold text-zinc-400">
                                        Authorized auditor signature
                                    </p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 mb-1">
                                        Official verification
                                    </p>
                                    <p className="text-sm font-bold text-zinc-900">
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
