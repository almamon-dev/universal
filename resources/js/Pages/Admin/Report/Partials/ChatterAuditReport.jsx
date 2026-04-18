import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronDown, ChevronUp, User, Activity, AlertTriangle, ShieldCheck, Filter, ArrowRight, X, Download } from "lucide-react";
import ReportSection from "./ReportSection";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const ChatterModal = ({ chatter, onClose }) => {
    if (!chatter) return null;

    const auditHistory = chatter.history || [];

    const FlagLabel = ({ label, value }) => {
        const isYes = value && value.toUpperCase().includes("YES");
        const isNo = value && value.toUpperCase().includes("NO");
        
        return (
            <div className="flex items-center justify-between py-0.5">
                <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{label}:</span>
                <span className={cn(
                    "text-[10px] font-bold px-2",
                    isYes ? "text-emerald-600" : "text-slate-400"
                )}>
                    {value || "No"}
                </span>
            </div>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 font-sans">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-indigo-50 bg-[#FAF5FF]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold text-[#6D28D9]">{chatter.name} - Detailed Performance</h2>
                            <p className="text-[10px] font-bold text-[#6D28D9] tracking-tight">{chatter.count || chatter.audits || 0} audits during selected period</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-indigo-100 rounded-full transition-colors">
                            <X className="text-[#6D28D9]" size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 tracking-tight">Audit History</h3>
                    
                    <div className="space-y-5">
                        {auditHistory.length > 0 ? (
                            auditHistory.map((audit, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
                                    {/* Entry Header Area */}
                                    <div className="grid grid-cols-4 px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                                        <div className="flex gap-2 text-[10px]">
                                            <span className="text-slate-400 font-medium">Date:</span>
                                            <span className="text-slate-900 font-bold">{audit.date}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px]">
                                            <span className="text-slate-400 font-medium tracking-tight">QC:</span>
                                            <span className="text-slate-900 font-bold">{audit.qc}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px]">
                                            <span className="text-slate-400 font-medium tracking-tight">State:</span>
                                            <span className={cn("font-bold", audit.state === "Sellable" ? "text-emerald-600" : "text-rose-600")}>{audit.state}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px] overflow-hidden">
                                            <span className="text-slate-400 font-medium tracking-tight">Type:</span>
                                            <span className="text-slate-900 font-bold truncate leading-tight">{audit.type}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Flag Grid Area */}
                                    <div className="p-6 grid grid-cols-4 gap-x-12 gap-y-1">
                                        {/* Col 1 */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between py-0.5 border-b border-slate-50">
                                                <span className="text-[10px] font-medium text-slate-500">QC Name:</span>
                                                <span className="text-[10px] font-bold text-slate-900">{audit.qc}</span>
                                            </div>
                                            <FlagLabel label="Pitched" value={audit.flags.pitch} />
                                            <FlagLabel label="Aftercare" value={audit.flags.aftercare} />
                                            <div className="flex justify-between py-0.5 leading-none">
                                                <span className="text-[10px] font-medium text-slate-500">QC:</span>
                                                <span className="text-[10px] font-bold text-slate-900">-</span>
                                            </div>
                                        </div>
    
                                        {/* Col 2 */}
                                        <div className="space-y-1">
                                            <FlagLabel label="Casual-Sexual" value={audit.flags.casualSexual} />
                                            <FlagLabel label="First PPV" value={audit.flags.firstPpv} />
                                            <FlagLabel label="Requested Help" value={audit.flags.requestHelp} />
                                        </div>
    
                                        {/* Col 3 */}
                                        <div className="space-y-1">
                                            <FlagLabel label="Negotiation" value={audit.flags.negotiation} />
                                            <FlagLabel label="Upsell Attempt" value={audit.flags.upsellAtt} />
                                            <FlagLabel label="QC Intervention" value={audit.flags.qcInter} />
                                            <div className="flex justify-between py-0.5 mt-1 border-t border-slate-50 pt-1">
                                                <span className="text-[10px] font-medium text-slate-500">Subscriber UID:</span>
                                                <span className="text-[10px] font-bold text-slate-500 tracking-tight">{audit.subUid}</span>
                                            </div>
                                        </div>
    
                                        {/* Col 4 */}
                                        <div className="space-y-1">
                                            <FlagLabel label="Upsell Purchase" value={audit.flags.upsellPur} />
                                            <FlagLabel label="Rule Violation" value={audit.flags.ruleViol} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="text-sm font-bold text-slate-400">No audit history recorded for this chatter during this period.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50/30 p-4 flex justify-between items-center px-8 border-t border-slate-100">
                    <button className="bg-[#059669] hover:bg-emerald-700 text-white font-black text-[10px] px-5 py-2.5 rounded-lg transition-all flex items-center gap-2">
                        <Download size={14} strokeWidth={3} /> Save PDF
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-[#7C3AED] hover:bg-violet-700 text-white font-black text-[10px] px-8 py-2.5 rounded-lg transition-all shadow-md"
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

    // Map from real DB stats
    const chatterPerformanceList = stats?.chatter_performance || [];
    const detailedTableData = stats?.chatter_stats || [];
    const chatters = stats?.chatter_list || [];

    return (
        <div className="px-6 pt-8 pb-6 space-y-12">
            {/* Modal */}
            <ChatterModal chatter={selectedChatterData} onClose={() => setSelectedChatterData(null)} />

            {/* Header */}
            <div className="space-y-10">
                <div className="space-y-1">
                    <h1 className="text-lg font-bold text-slate-700">Chatter Audit Report</h1>
                    <p className="text-[10px] font-bold text-slate-700 tracking-tight">Prepared by Invariant Consulting</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-10 gap-x-20 pt-8 border-t border-slate-100 mt-6">
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-tight leading-none">Agency</p>
                            <p className="text-sm text-slate-900 leading-none">{agency.name}</p>
                        </div>
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-tight leading-none">Reporting period</p>
                            <p className="text-sm text-slate-900 leading-none">{stats?.period?.full_range || "Feb 10, 2026 – Feb 17, 2026"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-tight leading-none">Report status</p>
                            <p className="text-sm text-slate-900 leading-none">Final</p>
                        </div>
                        <div className="space-y-1 font-bold">
                            <p className="text-[9px] text-slate-400  tracking-tight leading-none">Generated</p>
                            <p className="text-sm text-slate-900 leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-12">
                <ReportSection
                    title="Chatter Performance Analysis"
                    label=""
                    action={
                        <button
                            onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-[11px] px-5 py-2 rounded flex items-center gap-2 transition-all tracking-tight"
                        >
                            {isComparisonOpen ? "Hide Weekly Comparison" : "Show Weekly Comparison"}
                        </button>
                    }
                >
                    <div className="space-y-12 animate-in fade-in duration-700">
                        {isComparisonOpen && (
                            <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl p-8 space-y-8">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-slate-800">Week-by-Week Comparison</h4>
                                    <p className="text-sm font-medium text-slate-500">Select a chatter from the list below to view their weekly performance trends</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                                    {detailedTableData.slice(0, 6).map((chatter, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setSelectedChatterData(chatter)}
                                            className="bg-white border border-[#E0E7FF] p-6 rounded-lg hover:border-[#6366F1]/50 cursor-pointer transition-all shadow-sm group"
                                        >
                                            <p className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#6366F1] transition-colors">{chatter.name}</p>
                                            <p className="text-sm font-medium text-slate-400">{chatter.audits} total audits</p>
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
                                    className="border-[#E9E9FF] shadow-none rounded-xl overflow-hidden bg-[#FBF9FF] p-8 space-y-8 cursor-pointer hover:border-[#6366F1]/30 transition-all border-2"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-[#BFA9F6] leading-none">#{chatter.rank} Chatter</p>
                                            <h3 className="text-3xl font-extrabold text-[#1F2937] leading-none pt-2">{chatter.name}</h3>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-bold text-[#BFA9F6] leading-none">Audits</p>
                                            <p className="text-[2.8rem] font-black text-[#8B5CF6] leading-none pt-1">{chatter.count}</p>
                                        </div>
                                    </div>

                                    {/* Primary Stats */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-slate-600">Conversion Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[7px] font-bold text-slate-400">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#059669]">{chatter.conv}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-slate-600">Pitch Rate</span>
                                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[7px] font-bold text-slate-400">i</div>
                                            </div>
                                            <span className="text-sm font-black text-[#8B5CF6]">{chatter.pitch}</span>
                                        </div>
                                    </div>

                                    {/* Operational Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-600">Sellable / Non Sellable</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.sellable.y}</span>
                                                <span className="text-slate-300">/</span>
                                                <span className="text-[#E11D48]">{chatter.sellable.n}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-600">Fresh / Continuing</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.fresh.y}</span>
                                                <span className="text-slate-300">/</span>
                                                <span className="text-[#E11D48]">{chatter.fresh.n}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-600">Pitched / Not Pitched</span>
                                            <div className="flex items-center gap-1 font-black text-sm">
                                                <span className="text-[#059669]">{chatter.pitched.y}</span>
                                                <span className="text-slate-300">/</span>
                                                <span className="text-[#E11D48]">{chatter.pitched.n}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sexting Performance */}
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-bold text-[#BE12E5] border-b border-[#F0E6FF] pb-2 tracking-tight">Sexting Performance</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Pitched</span>
                                                <span className="text-sm font-black text-[#BE12E5]">{chatter.sexting.p}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Bought / Not Bought</span>
                                                <div className="flex items-center gap-1 font-black text-sm">
                                                    <span className="text-[#059669]">{chatter.sexting.b}</span>
                                                    <span className="text-slate-300">/</span>
                                                    <span className="text-[#E11D48]">{chatter.sexting.nb}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Continued Sequence</span>
                                                <span className="text-sm font-black text-[#BE12E5]">{chatter.sexting.c}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-slate-600">Sales Rate</span>
                                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[7px] font-bold text-slate-400">i</div>
                                                </div>
                                                <span className="text-sm font-black text-[#BE12E5]">{chatter.sexting.r}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pre-recorded Performance */}
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-bold text-[#2563EB] border-b border-[#E9EFFF] pb-2 tracking-tight">Pre Recorded Performance</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Pitched</span>
                                                <span className="text-sm font-black text-[#2563EB]">{chatter.pre.p}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Bought / Not Bought</span>
                                                <div className="flex items-center gap-1 font-black text-sm">
                                                    <span className="text-[#059669]">{chatter.pre.b}</span>
                                                    <span className="text-slate-300">/</span>
                                                    <span className="text-[#E11D48]">{chatter.pre.nb}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-600">Upsell Attempt / Yes</span>
                                                <div className="flex items-center gap-1 font-black text-sm text-[#059669]">
                                                    <span>{chatter.pre.u}</span>
                                                    <span className="text-slate-300">/</span>
                                                    <span>{chatter.pre.uy}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-slate-600">Sales Rate</span>
                                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[7px] font-bold text-slate-400">i</div>
                                                </div>
                                                <span className="text-sm font-black text-[#2563EB]">{chatter.pre.r}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Intervention Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-600">QC Interventions</span>
                                            <span className="text-sm font-black text-[#E11D48]">{chatter.qc}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-600">Rule Violations</span>
                                            <span className="text-sm font-black text-[#E11D48]">{chatter.rules}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </ReportSection>

                {/* Filter and Table */}
                <div className="space-y-10 pt-12 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-500 tracking-tight">Filter by Chatter:</span>
                        <div className="relative group">
                            <select
                                value={selectedChatter}
                                onChange={(e) => setSelectedChatter(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 rounded-md pl-4 pr-12 py-2 text-xs font-bold text-slate-700 cursor-pointer outline-none min-w-[300px] shadow-sm group-hover:border-slate-300 transition-all"
                            >
                                <option value="all">All Chatters</option>
                                {detailedTableData.map((c, i) => (
                                    <option key={i} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 stroke-[3]" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-lg font-bold text-slate-800">Detailed Chatter Breakdown</h3>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap">Rank</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap">Chatter Name</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap text-center">Audit Count</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap text-center">Sellable</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap text-center">Non Sellable</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap text-center">PPV Sold</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap text-center">PPV Upsell Sold</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-bold text-[13px]">
                                    {detailedTableData
                                        .filter(c => selectedChatter === 'all' || c.name === selectedChatter)
                                        .map((chatter, idx) => (
                                        <tr 
                                            key={idx} 
                                            onClick={() => setSelectedChatterData(chatter)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-8 py-5 text-slate-400 font-medium group-hover:text-slate-600">#{chatter.rank}</td>
                                            <td className="px-8 py-5 text-slate-800 font-bold">{chatter.name}</td>
                                            <td className="px-8 py-5 text-slate-800 text-center">{chatter.audits}</td>
                                            <td className="px-8 py-5 text-slate-500 text-center">{chatter.sellable}</td>
                                            <td className="px-8 py-5 text-slate-500 text-center">{chatter.non_sellable}</td>
                                            <td className="px-8 py-5 text-slate-900 text-center font-black">{chatter.ppv_sold}</td>
                                            <td className="px-8 py-5 text-slate-900 text-center font-black">{chatter.upsell_sold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-10 text-center border-t border-slate-50">
                            <p className="text-[13px] text-slate-400 font-medium italic">All interpretation and enforcement of quality control standards are managed by Invariant Consulting. <br /> This report is confidential and intended solely for the use of {agency.name}.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
