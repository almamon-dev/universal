import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    Activity,
    Calendar,
    ChevronDown,
    Download,
    Filter,
    Shield,
    FileText,
    ArrowLeft,
    ChevronUp
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import ReportSection from "./Partials/ReportSection";
import ExecutiveSnapshot from "./Partials/ExecutiveSnapshot";
import UnitVolume from "./Partials/UnitVolume";
import RevenueLeakage from "./Partials/RevenueLeakage";
import RevenueFaultMapping from "./Partials/RevenueFaultMapping";
import DailyAuditCoverage from "./Partials/DailyAuditCoverage";
import QCInterventionActivity from "./Partials/QCInterventionActivity";
import ChatterAuditReport from "./Partials/ChatterAuditReport";
import CreatorAuditReport from "./Partials/CreatorAuditReport";

export default function WeeklyReport({ agency, stats }) {
    const [isComparisonOpen, setIsComparisonOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("weekly");
    const [startDate, setStartDate] = React.useState("2026-02-10");
    const [endDate, setEndDate] = React.useState("2026-02-17");

    return (
        <AdminLayout>
            <Head title={`${activeTab === 'weekly' ? 'Weekly Quality Control' : activeTab === 'chatter' ? 'Chatter Audit' : 'Creator Audit'} Report — ${agency.name}`} />

            <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">

                    {/* Top Row: Back link and Save button */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="flex items-center gap-3 text-slate-600 hover:text-slate-950 transition-colors font-bold text-sm"
                        >
                            <ArrowLeft size={20} /> Back to Dashboard
                        </Link>

                        <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-8 py-3 rounded-lg shadow-lg shadow-blue-100 flex items-center gap-2">
                            <Download size={14} className="stroke-[3]" /> Save as PDF
                        </button>
                    </div>

                    {/* Filter Card: Date Selectors */}
                    <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-10">
                            <div className="flex items-center gap-3 pr-2 border-r border-slate-50">
                                <Calendar size={24} className="text-slate-400 stroke-[1.5]" />
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-500 lowercase first-letter:uppercase">Start Date:</span>
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-52 bg-white border border-slate-200 rounded-md px-5 py-3 text-[11px] font-bold text-slate-700 shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-500 lowercase first-letter:uppercase">End Date:</span>
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-52 bg-white border border-slate-200 rounded-md px-5 py-3 text-[11px] font-bold text-slate-700 shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs Card */}
                    <Card className="bg-white border-slate-100 rounded-md p-1 shadow-sm overflow-hidden animate-in fade-in duration-500 w-fit">
                        <div className="flex items-center gap-3 p-1">
                            <button
                                onClick={() => setActiveTab("weekly")}
                                className={cn(
                                    "px-10 py-4 rounded-md text-sm font-bold transition-all duration-300",
                                    activeTab === "weekly"
                                        ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                )}
                            >
                                Weekly Quality Control Report
                            </button>
                            <button
                                onClick={() => setActiveTab("chatter")}
                                className={cn(
                                    "px-10 py-4 rounded-md text-sm font-bold transition-all duration-300",
                                    activeTab === "chatter"
                                        ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                )}
                            >
                                Chatter Audit Report
                            </button>
                            <button
                                onClick={() => setActiveTab("creator")}
                                className={cn(
                                    "px-10 py-4 rounded-md text-sm font-bold transition-all duration-300",
                                    activeTab === "creator"
                                        ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                )}
                            >
                                Creator Audit Report
                            </button>
                        </div>
                    </Card>

                    {activeTab === "weekly" && (
                        <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="px-12 pt-8 pb-6 space-y-8">

                                {/* Title Card Content */}
                                <div className="space-y-10">
                                    <div className="space-y-1">
                                        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Weekly Quality Control Report</h1>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wide">Prepared by Invariant Consulting</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 pt-4 border-t border-slate-50 mt-6">
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">Agency</p>
                                            <p className="text-sm text-slate-900 font-black leading-none">{agency.name}</p>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">Reporting period</p>
                                            <p className="text-sm text-slate-900 font-black leading-none">{stats?.period?.full_range || 'Feb 10 – Feb 17, 2026'}</p>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">Report status</p>
                                            <p className="text-sm text-slate-900 font-black leading-none">Finalized</p>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">Generated</p>
                                            <p className="text-sm text-slate-900 font-black leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Wrapper */}
                                <div className="pt-6 border-t border-slate-50/50 space-y-8">

                                    <ReportSection title="Executive Snapshot" label="Audit volume summary">
                                        <ExecutiveSnapshot stats={stats} />
                                    </ReportSection>

                                    <ReportSection>
                                        <div className="space-y-8">
                                            <QCInterventionActivity stats={stats} />
                                            <UnitVolume stats={stats} />
                                        </div>
                                    </ReportSection>

                                    <ReportSection title="Phase I — Signal Audit" label="Revenue leakage analysis">
                                        <RevenueLeakage stats={stats} />
                                    </ReportSection>

                                    <ReportSection title="Phase II — Revenue Fault Mapping" label="Diagnostic fault matrix">
                                        <RevenueFaultMapping isComparisonOpen={false} />
                                    </ReportSection>

                                    <ReportSection
                                        title="Phase II - Revenue Fault Mapping: Week-by-Week Comparison"
                                        label="Diagnostic fault comparison"
                                        action={
                                            <button
                                                onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                                                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
                                            >
                                                {isComparisonOpen ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                                                {isComparisonOpen ? "Hide Comparison" : "Show Comparison"}
                                            </button>
                                        }
                                    >
                                        {isComparisonOpen && <RevenueFaultMapping isComparisonOpen={true} />}
                                    </ReportSection>

                                    <ReportSection>
                                        <DailyAuditCoverage stats={stats} />
                                    </ReportSection>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "chatter" && (
                        <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ChatterAuditReport agency={agency} stats={stats} />
                        </Card>
                    )}

                    {activeTab === "creator" && (
                        <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CreatorAuditReport agency={agency} stats={stats} />
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
