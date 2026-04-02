import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Activity, Download } from "lucide-react";
import ReportSection from "./Partials/ReportSection";
import ExecutiveSnapshot from "./Partials/ExecutiveSnapshot";
import UnitVolume from "./Partials/UnitVolume";
import SellableFlow from "./Partials/SellableFlow";
import MetricGrids from "./Partials/MetricGrids";
import RevenueLeakage from "./Partials/RevenueLeakage";
import RevenueFaultMapping from "./Partials/RevenueFaultMapping";
import DailyAuditCoverage from "./Partials/DailyAuditCoverage";
import QCInterventionActivity from "./Partials/QCInterventionActivity";

export default function WeeklyReport({ agency, stats = {} }) {
    return (
        <AdminLayout>
            <Head title={`WEEKLY REPORT - ${agency.name}`} />

            <div className="min-h-screen bg-[#F8FAFC] pb-24">
                <main className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-10 pt-10">
                    {/* Report Hero Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_12px_40px_rgb(0,0,0,0.03)] overflow-hidden">
                        <div className="p-10 md:p-16 bg-gradient-to-br from-white via-white to-slate-50/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <Activity size={320} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ring-1 ring-blue-100/50">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                        </span>
                                        INTERNAL ANALYTICAL AUDIT 2.0
                                    </div>
                                    <div>
                                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase">
                                            WEEKLY QUALITY <br />
                                            <span className="text-blue-600">CONTROL REPORT</span>
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 mt-8">
                                            <div className="px-5 py-2 bg-slate-900 rounded-2xl shadow-lg shadow-black/10">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">PARTNER</p>
                                                <p className="text-white font-bold text-sm uppercase">{agency.name}</p>
                                            </div>
                                            <div className="px-5 py-2 bg-white rounded-2xl border border-slate-200">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">REPORTING CYCLE</p>
                                                <p className="text-slate-900 font-bold text-sm tracking-tight uppercase">{stats?.period?.full_range || "CURRENT ACTIVE CYCLE"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                                    <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center min-w-[180px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none text-center">GENERATED</p>
                                        <p className="text-slate-900 font-extrabold text-xl text-center tabular-nums">
                                            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center min-w-[180px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none text-center">STATUS</p>
                                        <p className="text-emerald-600 font-extrabold text-xl flex items-center justify-center gap-2 uppercase tracking-tighter">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            VERIFIED
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sections Content as individual cards */}
                        <div className="space-y-6 md:space-y-10">
                            <ReportSection title="EXECUTIVE SNAPSHOT" subtitle="SUMMARY OF AUDIT VOLUME AND PERFORMANCE">
                                <ExecutiveSnapshot stats={stats} />
                            </ReportSection>

                            <ReportSection title="QUALITY BREAKDOWN" subtitle="PERFORMANCE DISTRIBUTION AND MANAGEMENT ACTIONS">
                                <div className="grid grid-cols-1 gap-12">
                                    <UnitVolume stats={stats} />
                                    <QCInterventionActivity stats={stats} />
                                </div>
                            </ReportSection>

                            <ReportSection title="PHASE I • SIGNAL AUDIT" subtitle="REVENUE LEAKAGE AND IDENTIFIER ANALYSIS">
                                <RevenueLeakage stats={stats} />
                            </ReportSection>

                            <ReportSection title="PHASE II • REVENUE FAULT MAPPING" subtitle="COMPREHENSIVE FAULT MAPPING ACROSS CATEGORIES">
                                <RevenueFaultMapping stats={stats} />
                            </ReportSection>

                            <ReportSection title="PHASE III • TREND ANALYSIS" subtitle="WEEK-OVER-WEEK VARIANCE PERFORMANCE">
                                <MetricGrids stats={stats} />
                            </ReportSection>

                            <ReportSection title="OPERATIONS & COVERAGE" subtitle="DAILY AUDIT ACTIVITY AND PERFORMANCE VELOCITY">
                                <DailyAuditCoverage stats={stats} />
                            </ReportSection>
                        </div>
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif !important; }
                * { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
            `}</style>
        </AdminLayout>
    );
}

