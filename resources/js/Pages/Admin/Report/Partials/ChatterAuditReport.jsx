import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronDown, ChevronUp, User, Activity, AlertTriangle, ShieldCheck, Filter, ArrowRight, X, Download } from "lucide-react";
import ReportSection from "./ReportSection";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const ChatterModal = ({ chatter, onClose }) => {
    if (!chatter) return null;

    const fakeAuditHistory = [
        {
            date: "Feb 10, 05:06 PM",
            qc: "",
            state: "Non-Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_M3X1Z4",
            creator: "Robert Brown",
            flags: {}
        },
        {
            date: "Feb 10, 07:39 PM",
            qc: "",
            state: "Non-Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_J2M1N8",
            creator: "John Smith",
            flags: {}
        },
        {
            date: "Feb 11, 08:15 AM",
            qc: "",
            state: "Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_R2I7J5",
            creator: "Mary Johnson",
            flags: {
                casualSexual: "Yes",
                negotiation: "No",
                pitch: "Yes",
                firstPpv: "Yes",
                upsellAtt: "No",
                upsellPur: "No",
                aftercare: "No",
                requestHelp: "No",
                qcInter: "No",
                ruleViol: "No",
            }
        }
    ];

    const FlagLabel = ({ label, value, colorType = "default" }) => {
        const isYes = value === "Yes";
        const isNo = value === "No";
        
        let valueClass = "text-slate-400";
        if (isYes) valueClass = "text-emerald-600";
        if (colorType === "blue" && isYes) valueClass = "text-blue-600";

        return (
            <div className="flex gap-1.5 items-baseline">
                <span className="text-[11px] font-medium text-slate-400">{label}:</span>
                <span className={cn("text-[11px] font-bold", valueClass)}>{value || "No"}</span>
            </div>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-indigo-50 bg-[#FAF5FF]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-black text-[#6D28D9]">{chatter.name} - Detailed Performance</h2>
                            <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">{chatter.count || 40} audits during selected period</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-indigo-100 rounded-full transition-colors">
                            <X className="text-[#6D28D9]" size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-widest">Audit History</h3>
                    
                    <div className="space-y-5">
                        {fakeAuditHistory.map((audit, i) => (
                            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                {/* Row 1: Header Info */}
                                <div className="grid grid-cols-4 px-5 py-3 bg-slate-50/50 border-b border-slate-100 text-[10px]">
                                    <div className="flex gap-1.5 align-baseline">
                                        <span className="text-slate-400 font-medium">Date:</span>
                                        <span className="text-slate-900 font-extrabold">{audit.date}</span>
                                    </div>
                                    <div className="flex gap-1.5 align-baseline">
                                        <span className="text-slate-400 font-medium">QC:</span>
                                        <span className="text-slate-900 font-extrabold">{audit.qc}</span>
                                    </div>
                                    <div className="flex gap-1.5 align-baseline">
                                        <span className="text-slate-400 font-medium">State:</span>
                                        <span className={cn("font-black", audit.state === "Sellable" ? "text-emerald-600" : "text-rose-600")}>{audit.state}</span>
                                    </div>
                                    <div className="flex gap-1.5 align-baseline overflow-hidden">
                                        <span className="text-slate-400 font-medium">Type:</span>
                                        <span className="text-slate-900 font-extrabold truncate">{audit.type}</span>
                                    </div>
                                </div>
                                
                                {/* Row 2: Subscriber ID Box */}
                                <div className="px-5 py-2.5 border-b border-slate-50">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8FAFC] border border-slate-200 rounded text-[10px]">
                                        <span className="text-slate-500 font-medium">Subscriber ID:</span>
                                        <span className="text-slate-900 font-black tracking-tight">{audit.subUid}</span>
                                    </div>
                                </div>

                                {/* Row 3: Creator & Flags */}
                                <div className="p-5 space-y-3">
                                    <div className="flex gap-1.5 text-[10px]">
                                        <span className="text-slate-400 font-medium">Creator:</span>
                                        <span className="text-slate-900 font-extrabold">{audit.creator}</span>
                                    </div>

                                    {audit.flags && Object.keys(audit.flags).length > 0 && (
                                        <div className="grid grid-cols-4 gap-y-3 gap-x-8 pt-1">
                                            <div className="space-y-2">
                                                <FlagLabel label="Pitched" value={audit.flags.pitch} />
                                                <FlagLabel label="Aftercare" value={audit.flags.aftercare} />
                                            </div>
                                            <div className="space-y-2">
                                                <FlagLabel label="Casual" value={audit.flags.casualSexual} />
                                                <FlagLabel label="1st PPV" value={audit.flags.firstPpv} colorType="blue" />
                                                <FlagLabel label="Help" value={audit.flags.requestHelp} />
                                            </div>
                                            <div className="space-y-2">
                                                <FlagLabel label="Negotiation" value={audit.flags.negotiation} />
                                                <FlagLabel label="Upsell Att" value={audit.flags.upsellAtt} />
                                                <FlagLabel label="QC Inter" value={audit.flags.qcInter} />
                                            </div>
                                            <div className="space-y-2">
                                                <FlagLabel label="Upsell Pur" value={audit.flags.upsellPur} />
                                                <FlagLabel label="Violation" value={audit.flags.ruleViol} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50/30 p-4 flex justify-between items-center px-8 border-t border-slate-100">
                    <button className="bg-[#059669] hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all flex items-center gap-2">
                        <Download size={14} strokeWidth={3} /> Save PDF
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-[#7C3AED] hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-2.5 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default function ChatterAuditReport({ agency, stats }) {
    const [isComparisonOpen, setIsComparisonOpen] = useState(true);
    const [selectedChatter, setSelectedChatter] = useState("all");
    const [selectedChatterData, setSelectedChatterData] = useState(null);

    const chatters = stats?.chatter_stats || [];

    const chatterPerformanceList = [
        {
            name: "Alberto",
            rank: 1,
            count: 40,
            conv: "92%",
            pitch: "83%",
            sellable: { y: 23, n: 17 },
            fresh: { y: 0, n: 0 },
            pitched: { y: 19, n: 4 },
            sexting: { p: 11, b: 4, nb: 7, c: 0, r: "36%" },
            pre: { p: 8, b: 5, nb: 3, u: 1, uy: 1, r: "63%" },
            qc: 3,
            rules: 1
        },
        {
            name: "Jamie",
            rank: 2,
            count: 34,
            conv: "68%",
            pitch: "91%",
            sellable: { y: 22, n: 12 },
            fresh: { y: 0, n: 0 },
            pitched: { y: 20, n: 2 },
            sexting: { p: 11, b: 10, nb: 1, c: 0, r: "77%" },
            pre: { p: 7, b: 4, nb: 3, u: 2, uy: 0, r: "57%" },
            qc: 6,
            rules: 5
        },
        {
            name: "CJ",
            rank: 3,
            count: 34,
            conv: "76%",
            pitch: "88%",
            sellable: { y: 26, n: 8 },
            fresh: { y: 0, n: 0 },
            pitched: { y: 23, n: 3 },
            sexting: { p: 17, b: 12, nb: 5, c: 0, r: "71%" },
            pre: { p: 6, b: 2, nb: 4, u: 1, uy: 1, r: "33%" },
            qc: 8,
            rules: 5
        }
    ];

    const detailedTableData = [
        { name: "Alberto", audits: 40, sellable: 23, non_sellable: 17, ppv_sold: 9, upsell_sold: 2, rank: 1 },
        { name: "Jamie", audits: 34, sellable: 22, non_sellable: 12, ppv_sold: 14, upsell_sold: 3, rank: 2 },
        { name: "CJ", audits: 34, sellable: 26, non_sellable: 8, ppv_sold: 14, upsell_sold: 1, rank: 3 },
        { name: "Donn", audits: 34, sellable: 21, non_sellable: 13, ppv_sold: 7, upsell_sold: 1, rank: 4 },
        { name: "Eliseo", audits: 23, sellable: 8, non_sellable: 15, ppv_sold: 3, upsell_sold: 0, rank: 5 }
    ];

    return (
        <div className="px-6 pt-8 pb-6 space-y-12">
            {/* Modal */}
            <ChatterModal chatter={selectedChatterData} onClose={() => setSelectedChatterData(null)} />

            {/* Header */}
            <div className="space-y-10">
                <div className="space-y-1">
                    <h1 className="text-lg font-bold text-slate-700">Chatter Audit Report</h1>
                    <p className="text-[10px] font-bold text-slate-700">Prepared by Invariant Consulting</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-10 gap-x-20 pt-8 border-t border-slate-100 mt-6">
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-widest leading-none">Agency</p>
                            <p className="text-sm text-slate-900 leading-none">{agency.name}</p>
                        </div>
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-widest leading-none">Reporting period</p>
                            <p className="text-sm text-slate-900 leading-none">{stats?.period?.full_range || "Feb 10, 2026 – Feb 17, 2026"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-widest leading-none">Report status</p>
                            <p className="text-sm text-slate-900 leading-none">Final</p>
                        </div>
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-widest leading-none">Generated</p>
                            <p className="text-sm text-slate-900 leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-12">
                <ReportSection
                    title="Chatter Performance Analysis"
                    label="Individual efficiency metrics"
                    action={
                        <button
                            onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            {isComparisonOpen ? "Hide Weekly Comparison" : "Show Weekly Comparison"}
                        </button>
                    }
                >
                    <div className="space-y-8 animate-in fade-in duration-700">
                        {isComparisonOpen && (
                            <div className="bg-[#F5F7FF] border border-[#E0E7FF] rounded-2xl p-8 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-[#374151]">Week-by-Week Comparison</h4>
                                    <p className="text-sm font-medium text-[#6366F1]">Select a chatter from the list below to view their weekly performance trends</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 pt-2">
                                    {detailedTableData.slice(0, 5).map((chatter, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setSelectedChatterData(chatter)}
                                            className="bg-white border border-[#E0E7FF] p-6 rounded-xl hover:border-[#6366F1]/50 cursor-pointer transition-all group"
                                        >
                                            <p className="text-lg font-bold text-[#1F2937] mb-1 group-hover:text-[#6366F1] transition-colors">{chatter.name}</p>
                                            <p className="text-sm font-medium text-[#6B7280]">{chatter.audits} total audits</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {chatterPerformanceList.map((chatter, idx) => (
                                <Card 
                                    key={idx} 
                                    onClick={() => setSelectedChatterData(chatter)}
                                    className="border-[#E0E7FF] shadow-lg rounded-xl overflow-hidden bg-[#FBF9FF] p-8 space-y-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[#A78BFA]  tracking-widest leading-none">#{chatter.rank} CHATTER</p>
                                            <h3 className="text-2xl font-black text-[#1F2937] leading-none pt-2">{chatter.name}</h3>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-black text-[#A78BFA]  tracking-widest leading-none">AUDITS</p>
                                            <p className="text-[2.5rem] font-black text-[#8B5CF6] leading-none pt-1">{chatter.count}</p>
                                        </div>
                                    </div>

                                    {/* Primary Stats */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold text-[#4B5563]">Conversion Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#059669]">{chatter.conv}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold text-[#4B5563]">Pitch Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#8B5CF6]">{chatter.pitch}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#E0E7FF] w-full" />

                                    {/* Operational Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Sellable / Non-Sellable</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.sellable.y}</span>
                                                <span className="text-[#9CA3AF]">/</span>
                                                <span className="text-[#E11D48]">{chatter.sellable.n}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Fresh / Continuing</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.fresh.y}</span>
                                                <span className="text-[#9CA3AF]">/</span>
                                                <span className="text-[#E11D48]">{chatter.fresh.n}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Pitched / Not Pitched</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.pitched.y}</span>
                                                <span className="text-[#9CA3AF]">/</span>
                                                <span className="text-[#E11D48]">{chatter.pitched.n}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#E0E7FF] w-full" />

                                    {/* Sexting Performance */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[#E11D48]  tracking-widest">SEXTING PERFORMANCE</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Pitched</span>
                                                <span className="text-sm font-black text-[#E11D48]">{chatter.sexting.p}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Bought / Not Bought</span>
                                                <div className="flex items-center gap-1 font-black text-sm">
                                                    <span className="text-[#059669]">{chatter.sexting.b}</span>
                                                    <span className="text-[#9CA3AF]">/</span>
                                                    <span className="text-[#E11D48]">{chatter.sexting.nb}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Continued Sequence</span>
                                                <span className="text-sm font-black text-[#E11D48]">{chatter.sexting.c}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-[#4B5563]">Sales Rate</span>
                                                    <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                                </div>
                                                <span className="text-sm font-black text-[#E11D48]">{chatter.sexting.r}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#E0E7FF] w-full" />

                                    {/* Pre-recorded Performance */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[#2563EB]  tracking-widest">PRE-RECORDED PERFORMANCE</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Pitched</span>
                                                <span className="text-sm font-black text-[#2563EB]">{chatter.pre.p}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Bought / Not Bought</span>
                                                <div className="flex items-center gap-1 font-black text-sm">
                                                    <span className="text-[#059669]">{chatter.pre.b}</span>
                                                    <span className="text-[#9CA3AF]">/</span>
                                                    <span className="text-[#E11D48]">{chatter.pre.nb}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#4B5563]">Upsell Attempt / Yes</span>
                                                <div className="flex items-center gap-1 font-black text-sm text-[#059669]">
                                                    <span>{chatter.pre.u}</span>
                                                    <span className="text-[#9CA3AF]">/</span>
                                                    <span>{chatter.pre.uy}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-[#4B5563]">Sales Rate</span>
                                                    <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                                </div>
                                                <span className="text-sm font-black text-[#2563EB]">{chatter.pre.r}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#E0E7FF] w-full" />

                                    {/* Intervention Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">QC Interventions</span>
                                            <span className="text-sm font-black text-[#E11D48]">{chatter.qc}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Rule Violations</span>
                                            <span className="text-sm font-black text-[#E11D48]">{chatter.rules}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </ReportSection>

                {/* Filter and Table */}
                <div className="space-y-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-700">Filter by Chatter:</span>
                            <div className="relative">
                                <select
                                    value={selectedChatter}
                                    onChange={(e) => setSelectedChatter(e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-xs font-bold text-slate-700 cursor-pointer outline-none min-w-[200px]"
                                >
                                    <option value="all">All Chatters</option>
                                    <option>Alberto</option>
                                    <option>Jamie</option>
                                    <option>CJ</option>
                                    <option>Donn</option>
                                    <option>Eliseo</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-10">
                        <h3 className="text-md font-bold text-slate-700 ">Detailed Chatter Breakdown</h3>
                        <div className="bg-white border border-slate-100 rounded-md overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest">Rank</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest">Chatter Name</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest text-center">Audit Count</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest text-center">Sellable</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest text-center">Non-Sellable</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest text-center">PPV Sold</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400  tracking-widest text-center">PPV Upsell Sold</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-bold text-xs">
                                    {detailedTableData.map((chatter, idx) => (
                                        <tr 
                                            key={idx} 
                                            onClick={() => setSelectedChatterData(chatter)}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-slate-400">#{chatter.rank}</td>
                                            <td className="px-6 py-4 text-slate-900">{chatter.name}</td>
                                            <td className="px-6 py-4 text-slate-900 text-center">{chatter.audits}</td>
                                            <td className="px-6 py-4 text-slate-700 text-center">{chatter.sellable}</td>
                                            <td className="px-6 py-4 text-slate-700 text-center">{chatter.non_sellable}</td>
                                            <td className="px-6 py-4 text-slate-900 text-center font-black">{chatter.ppv_sold}</td>
                                            <td className="px-6 py-4 text-slate-900 text-center font-black">{chatter.upsell_sold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-8 text-center">
                            <p className="text-[12px] text-slate-700">All interpretation and enforcement of quality control standards are managed by Invariant Consulting. <br /> This report is confidential and intended solely for the use of {agency.name}.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
