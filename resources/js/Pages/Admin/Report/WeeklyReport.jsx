import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import ReportHeader from "./Partials/ReportHeader";
import ExecutiveSnapshot from "./Partials/ExecutiveSnapshot";
import UnitVolume from "./Partials/UnitVolume";
import SellableFlow from "./Partials/SellableFlow";
import ConversationFlow from "./Partials/ConversationFlow";
import MetricGrids from "./Partials/MetricGrids";
import RevenueLeakage from "./Partials/RevenueLeakage";
import RevenueFaultMapping from "./Partials/RevenueFaultMapping";
import DailyAuditCoverage from "./Partials/DailyAuditCoverage";
import QCInterventionActivity from "./Partials/QCInterventionActivity";

import ReportSection from "./Partials/ReportSection";

export default function WeeklyReport({ agency, stats }) {
    return (
        <AdminLayout>
            <Head title={`Weekly Report - ${agency.name}`} />

            <div className="min-h-screen bg-[#F0F2F5] py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <ReportHeader agency={agency} />

                    {/* Main Report Container */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        {/* Report Identity Section */}
                        <div className="p-12 border-b border-slate-100 bg-white relative">
                            <div className="absolute top-12 right-12 text-right hidden md:block">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Audit Report
                                </div>
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
                                Executive Snapshot
                            </h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">
                                Analytical Performance Report • Invariant
                                Consulting
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Partner Agency
                                    </p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                                        {agency.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Reporting Cycle
                                    </p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                                        {stats?.period?.full_range || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Operational Status
                                    </p>
                                    <p className="text-lg font-bold text-blue-600 tracking-tight leading-tight">
                                        Verified & Finalized
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Publication Date
                                    </p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                                        {new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Report Sections */}
                        <ReportSection title="Audit Volume">
                            <ExecutiveSnapshot stats={stats} />
                        </ReportSection>

                        <ReportSection title="Conversation Classification">
                            <UnitVolume stats={stats} />
                        </ReportSection>

                        <ReportSection title="Sellable Conversation Flow">
                            <SellableFlow stats={stats} />
                        </ReportSection>

                        <ReportSection title="QC Intervention Activity">
                            <QCInterventionActivity stats={stats} />
                        </ReportSection>

                        <ReportSection title="Phase I - Signal Audit / Revenue Leakage">
                            <RevenueLeakage stats={stats} />
                        </ReportSection>

                        <ReportSection title="Phase II - Detailed Metric Grids">
                            <MetricGrids stats={stats} />
                        </ReportSection>

                        <ReportSection title="Phase III - Revenue Fault Mapping">
                            <RevenueFaultMapping stats={stats} />
                        </ReportSection>

                        <ReportSection title="Daily Audit Coverage">
                            <DailyAuditCoverage stats={stats} />
                        </ReportSection>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
