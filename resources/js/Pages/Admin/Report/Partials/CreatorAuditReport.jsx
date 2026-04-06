import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronDown, ChevronUp, User, Activity, AlertTriangle, ShieldCheck, Filter, ArrowRight, X } from "lucide-react";
import ReportSection from "./ReportSection";
import { cn } from "@/lib/utils";

import { createPortal } from "react-dom";

const CreatorModal = ({ creator, onClose }) => {
    if (!creator) return null;

    const fakeAuditHistory = [
        {
            date: "Feb 10, 08:54 AM",
            chatter: "Eliseo",
            state: "Non-Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_E8W3Y1",
            flags: {
                pitch: "No",
                firstPpv: "No",
                upsellAtt: "No",
                upsellPur: "No",
                aftercare: "No",
                requestHelp: "No",
                qcInter: "No",
                ruleViol: "No",
            }
        },
        {
            date: "Feb 10, 12:40 PM",
            chatter: "Jamie",
            state: "Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_H6J8P3",
            flags: {
                casualSexual: "Yes",
                negotiation: "No",
                pitch: "No",
                firstPpv: "No",
                upsellAtt: "No",
                upsellPur: "No",
                aftercare: "No",
                requestHelp: "No",
                qcInter: "No",
                ruleViol: "No",
            }
        },
        {
            date: "Feb 10, 01:05 PM",
            chatter: "CJ",
            state: "Sellable",
            type: "Fresh (first interaction or first interaction of the day)",
            subUid: "SUB_CJ_123",
            flags: {
                casualSexual: "No",
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
        
        let valueClass = "bg-slate-50 text-slate-400 border-slate-100";
        if (isYes) {
            if (colorType === "blue") valueClass = "bg-blue-50 text-blue-700 border-blue-200";
            else valueClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (isNo) {
            valueClass = "bg-rose-50 text-rose-700 border-rose-200";
        }

        return (
            <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-50/50 last:border-0">
                <span className="text-[10px] font-bold text-slate-500/80 uppercase tracking-widest leading-none">{label}</span>
                <span className={cn(
                    "px-2 py-0.5 border text-[9px] font-black tracking-[0.1em] uppercase rounded shadow-sm transition-all",
                    valueClass
                )}>
                    {value || "No"}
                </span>
            </div>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-rose-50 bg-[#FAF5F7]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-black text-[#9D174D]">{creator.name} - Detailed Performance</h2>
                            <p className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider">{creator.count} audits with 5 chatters</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-full transition-colors">
                            <X className="text-[#9D174D]" size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-widest">Audit History</h3>
                    
                    <div className="space-y-5">
                        {fakeAuditHistory.map((audit, i) => (
                            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                {/* Entry Header Area */}
                                <div className="grid grid-cols-4 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex gap-1.5 text-[10px]">
                                        <span className="text-slate-400 font-medium tracking-tight">Date:</span>
                                        <span className="text-slate-900 font-extrabold">{audit.date}</span>
                                    </div>
                                    <div className="flex gap-1.5 text-[10px]">
                                        <span className="text-slate-400 font-medium tracking-tight">Chatter:</span>
                                        <span className="text-slate-900 font-extrabold">{audit.chatter}</span>
                                    </div>
                                    <div className="flex gap-1.5 text-[10px]">
                                        <span className="text-slate-400 font-medium tracking-tight">State:</span>
                                        <span className={cn("font-black", audit.state === "Sellable" ? "text-emerald-600" : "text-rose-600")}>{audit.state}</span>
                                    </div>
                                    <div className="flex gap-1.5 text-[10px] overflow-hidden">
                                        <span className="text-slate-400 font-medium tracking-tight">Type:</span>
                                        <span className="text-slate-900 font-extrabold truncate">{audit.type}</span>
                                    </div>
                                </div>
                                
                                {/* Flag Table Area */}
                                <div className="p-5 grid grid-cols-4 gap-x-8 gap-y-3 bg-white">
                                    <div className="space-y-2">
                                        <FlagLabel label="Chatter" value={audit.chatter} />
                                        <FlagLabel label="Pitched" value={audit.flags.pitch} />
                                        <FlagLabel label="Aftercare" value={audit.flags.aftercare} />
                                        <FlagLabel label="QC" value="" />
                                    </div>

                                    <div className="space-y-2">
                                        <FlagLabel label="Casual" value={audit.flags.casualSexual} />
                                        <FlagLabel label="1st PPV" value={audit.flags.firstPpv} colorType="blue" />
                                        <FlagLabel label="Help Requested" value={audit.flags.requestHelp} />
                                    </div>

                                    <div className="space-y-2">
                                        <FlagLabel label="Negotiation" value={audit.flags.negotiation} />
                                        <FlagLabel label="Upsell Att" value={audit.flags.upsellAtt} />
                                        <FlagLabel label="QC Inter" value={audit.flags.qcInter} />
                                        <div className="flex gap-1.5 pt-1">
                                            <span className="text-[10px] font-medium text-slate-400">Sub UID:</span>
                                            <span className="text-[10px] font-black text-slate-500 tracking-tighter">{audit.subUid}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <FlagLabel label="QC" value="" />
                                        <FlagLabel label="Upsell Purchase" value={audit.flags.upsellPur} />
                                        <FlagLabel label="Violation" value={audit.flags.ruleViol} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50/30 p-4 border-t border-slate-100 flex justify-end px-8">
                    <button 
                        onClick={onClose}
                        className="bg-[#E11D48] hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-2.5 rounded-lg transition-all shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default function CreatorAuditReport({ agency, stats }) {
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState(null);

    // Map from real DB stats
    const creators = stats?.creator_performance || [];

    return (
        <div className="px-6 pt-8 pb-6 space-y-12">
            {/* Modal */}
            <CreatorModal creator={selectedCreator} onClose={() => setSelectedCreator(null)} />

            {/* Header */}
            <div className="space-y-10">
                <div className="space-y-1">
                    <h1 className="text-lg font-bold text-slate-700">Creator Audit Report</h1>
                    <p className="text-[10px] font-bold text-slate-700">Prepared by Invariant Consulting</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-10 gap-x-20 pt-8 border-t border-slate-100 mt-6 font-bold">
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 tracking-widest leading-none">Agency</p>
                            <p className="text-sm text-slate-900 leading-none">{agency.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 tracking-widest leading-none">Reporting period</p>
                            <p className="text-sm text-slate-900 leading-none">{stats?.period?.full_range || "Feb 10, 2026 – Feb 17, 2026"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 tracking-widest leading-none">Report status</p>
                            <p className="text-sm text-slate-900 leading-none">Final</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 tracking-widest leading-none">Generated</p>
                            <p className="text-sm text-slate-900 leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-12">
                <ReportSection 
                    title="Creator Performance Analysis" 
                    label="Creator-level metrics"
                    action={
                        <button
                            onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                            className="bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            {isComparisonOpen ? "Hide Weekly Comparison" : "Show Weekly Comparison"}
                        </button>
                    }
                >
                    <div className="space-y-8 animate-in fade-in duration-700">
                        {isComparisonOpen && (
                            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-8 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-[#374151]">Week-by-Week Comparison</h4>
                                    <p className="text-sm font-medium text-[#E11D48]">Select a creator from the list below to view their weekly performance trends</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    {creators.map((creator, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setSelectedCreator(creator)}
                                            className="bg-white border border-[#FECDD3] p-6 rounded-xl hover:border-[#E11D48]/50 cursor-pointer transition-all group"
                                        >
                                            <p className="text-lg font-bold text-[#1F2937] mb-1 group-hover:text-[#E11D48] transition-colors">{creator.name}</p>
                                            <p className="text-sm font-medium text-[#6B7280]">{creator.count} total audits</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {creators.map((creator, idx) => (
                                <Card 
                                    key={idx} 
                                    onClick={() => setSelectedCreator(creator)}
                                    className="border-[#FECDD3] shadow-lg rounded-xl overflow-hidden bg-[#FFF5F7] p-8 space-y-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[#E11D48] tracking-widest leading-none uppercase">#{creator.rank} CREATOR</p>
                                            <h3 className="text-2xl font-black text-[#1F2937] leading-none pt-2">{creator.name}</h3>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-black text-[#E11D48] tracking-widest leading-none uppercase">AUDITS</p>
                                            <p className="text-[2.5rem] font-black text-[#E11D48] leading-none pt-1">{creator.count}</p>
                                        </div>
                                    </div>

                                    {/* Primary Stats */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Audit Share</span>
                                            <span className="text-sm font-black text-[#E11D48]">{creator.share}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold text-[#4B5563]">Conversion Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#059669]">{creator.conv}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold text-[#4B5563]">Sales Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#2563EB]">{creator.sales}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold text-[#4B5563]">Pitch Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex items-center justify-center text-[8px] font-bold text-[#9CA3AF]">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#8B5CF6]">{creator.pitch}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#FECDD3] w-full" />

                                    {/* Operational Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Sellable / Non-Sellable</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{creator.sellable.y}</span>
                                                <span className="text-[#9CA3AF]">/</span>
                                                <span className="text-[#E11D48]">{creator.sellable.n}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Fresh / Continuing</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{creator.fresh.y}</span>
                                                <span className="text-[#9CA3AF]">/</span>
                                                <span className="text-[#E11D48]">{creator.fresh.n}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#FECDD3] w-full" />

                                    {/* Intervention Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">QC Interventions</span>
                                            <span className="text-sm font-black text-[#E11D48]">{creator.qc}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#4B5563]">Rule Violations</span>
                                            <span className="text-sm font-black text-[#E11D48]">{creator.rules}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </ReportSection>

                <div className="pt-8 text-center">
                    <p className="text-[12px] text-slate-700">All interpretation and enforcement of quality control standards are managed by Invariant Consulting. <br /> This report is confidential and intended solely for the use of {agency.name}.</p>
                </div>
            </div>
        </div>
    );
}
