import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    Download,
    ArrowLeft,
    ChevronUp,
    Loader2
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import ReportSection from "./Partials/ReportSection";
import ExecutiveSnapshot from "./Partials/ExecutiveSnapshot";
import UnitVolume from "./Partials/UnitVolume";
import RevenueLeakage from "./Partials/RevenueLeakage";
import RevenueFaultMapping from "./Partials/RevenueFaultMapping";
import DailyAuditCoverage from "./Partials/DailyAuditCoverage";
import QCInterventionActivity from "./Partials/QCInterventionActivity";
import ChatterAuditReport from "./Partials/ChatterAuditReport";
import CreatorAuditReport from "./Partials/CreatorAuditReport";

export default function WeeklyReport({ agency, stats, filters = {} }) {
    const [isComparisonOpen, setIsComparisonOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("weekly");
    const [startDate, setStartDate] = React.useState(filters.start_date || "");
    const [endDate, setEndDate] = React.useState(filters.end_date || "");
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const start = () => setIsLoading(true);
        const finish = () => setIsLoading(false);

        router.on("start", start);
        router.on("finish", finish);

        return () => {
            // Cleanup listeners
        };
    }, []);

    React.useEffect(() => {
        if (startDate !== (filters.start_date || "") || endDate !== (filters.end_date || "")) {
            handleFilter();
        }
    }, [startDate, endDate]);

    const handleFilter = () => {
        router.get(
            route("admin.report.weekly", agency.id),
            {
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    };

    return (
        <AdminLayout>
            <Head title={`${activeTab === 'weekly' ? 'Weekly Quality Control' : activeTab === 'chatter' ? 'Chatter Audit' : 'Creator Audit'} Report — ${agency.name}`} />

            <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

                    {/* Top Row: Back link and Save button */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>

                        <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[10px] px-6 py-2.5 rounded-md shadow-lg shadow-blue-100 flex items-center gap-2 tracking-tight">
                            <Download size={14} className="stroke-[3]" /> Download PDF
                        </button>
                    </div>

                    {/* Filter Card: Date Selectors */}
                    <Card className="shadow-none border-slate-100 bg-white rounded-md">
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">Start Date:</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full sm:w-44 bg-white border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">End Date:</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full sm:w-44 bg-white border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs Card */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1">
                        {[
                            { id: "weekly", label: "Executive Snapshot" },
                            { id: "chatter", label: "Chatter Performance" },
                            { id: "creator", label: "Creator Performance" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-3 rounded text-[10px] font-bold tracking-tight transition-all",
                                    activeTab === tab.id
                                        ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                        : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-[100] flex items-center justify-center rounded-md animate-in fade-in duration-200">
                                <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center gap-3">
                                    <Loader2 size={24} className="text-blue-600 animate-spin" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Generating Intelligence...</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "weekly" && (
                            <Card className={cn(
                                "shadow-none border-slate-100 bg-white rounded-md overflow-hidden animate-in fade-in duration-700",
                                isLoading && "opacity-50 grayscale-[0.5]"
                            )}>
                            <div className="p-6 md:p-10 space-y-6">

                                {/* Header Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Executive Quality Control</h1>
                                        <p className="text-[10px] font-medium text-slate-400 tracking-tight mt-2">Invariant Diagnostic Protocol</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] text-slate-400 font-bold tracking-tight">Agency Path</p>
                                            <p className="text-xs text-slate-900 font-bold">{agency.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] text-slate-400 font-bold tracking-tight">Time Horizon</p>
                                            <p className="text-xs text-slate-900 font-bold">
                                                {startDate && endDate 
                                                    ? `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                                    : stats?.period?.full_range || 'Feb 10 – Feb 17, 2026'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Sections */}
                                <div className="space-y-12">
                                    <ReportSection title="Executive Snapshot" label="AUDIT VOLUME SUMMARY">
                                        <ExecutiveSnapshot stats={stats} />
                                    </ReportSection>

                                    <div className="space-y-12">
                                        <ReportSection title="Intervention Depth" label="QC ACTIVITY TRACKING">
                                            <QCInterventionActivity stats={stats} />
                                        </ReportSection>
                                        <ReportSection title="Inventory Velocity" label="UNIT VOLUME ANALYSIS">
                                            <UnitVolume stats={stats} />
                                        </ReportSection>
                                    </div>

                                    <ReportSection title="Phase I — Signal Audit" label="REVENUE LEAKAGE ANALYSIS">
                                        <RevenueLeakage stats={stats} agency={agency} />
                                    </ReportSection>

                                    <ReportSection title="Phase II — Revenue Fault Mapping" label="DIAGNOSTIC FAULT MATRIX">
                                        <RevenueFaultMapping stats={stats} isComparisonOpen={false} />
                                    </ReportSection>

                                    <ReportSection
                                        title="Phase II — Comparative Mapping"
                                        label="WEEK-BY-WEEK PERFORMANCE"
                                        action={
                                            <button
                                                onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                                                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[9px] px-4 py-2 rounded flex items-center gap-2 transition-all tracking-tight"
                                            >
                                                {isComparisonOpen ? "Hide Metrics" : "Show Comparison"}
                                                {isComparisonOpen ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                                            </button>
                                        }
                                    >
                                        {isComparisonOpen && <RevenueFaultMapping stats={stats} isComparisonOpen={true} />}
                                    </ReportSection>

                                    <ReportSection title="Audit Continuity" label="DAILY DENSITY MAPPING">
                                        <DailyAuditCoverage stats={stats} />
                                    </ReportSection>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "chatter" && (
                        <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden">
                            <ChatterAuditReport agency={agency} stats={stats} />
                        </Card>
                    )}

                        {activeTab === "creator" && (
                            <Card className="shadow-none border-slate-100 bg-white rounded-md overflow-hidden">
                                <CreatorAuditReport agency={agency} stats={stats} />
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
