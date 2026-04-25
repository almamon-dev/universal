import React, { useState, useMemo } from "react";
import Modal from "@/Components/Modal";
import { cn } from "@/lib/utils";
import {
    ShieldAlert, X, ChevronDown, ChevronUp,
    Filter, User, Calendar, Hash, Activity
} from "lucide-react";

export default function AuditDrillDownModal({
    isOpen,
    onClose,
    title,
    subtitle,
    audits = [],
    numerator = 0,
    denominator = 0,
    tabs = [],
    onTabChange
}) {
    const [selectedChatter, setSelectedChatter] = useState("All");
    const [isGroupsOpen, setIsGroupsOpen] = useState(true);

    // Data processing with useMemo for efficiency
    const { chatterData, reasonData } = useMemo(() => {
        const cMap = {};
        const rMap = {};

        audits.forEach(curr => {
            cMap[curr.chatter] = (cMap[curr.chatter] || 0) + 1;
            const r = curr.reason || "Not Specified";
            rMap[r] = (rMap[r] || 0) + 1;
        });

        return {
            chatterData: Object.entries(cMap).map(([name, count]) => ({ name, count })),
            reasonData: Object.entries(rMap).map(([name, count]) => ({ name, count }))
        };
    }, [audits]);

    const filteredAudits = selectedChatter === "All"
        ? audits
        : audits.filter(a => a.chatter === selectedChatter);
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="6xl">
            <div className="bg-[#fcfcfd] flex flex-col max-h-[80vh] w-full overflow-hidden font-sans rounded-xl shadow-2xl">
                {/* 1. HEADER - Minimalist & Clean */}
                <div className="px-8 py-6 bg-white border-b border-slate-100 shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {title}
                                </h2>
                                <div className="flex items-center px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100">
                                    <span className="text-rose-600 font-bold text-xs">{numerator}</span>
                                    <span className="text-rose-300 mx-1 text-[10px]">/</span>
                                    <span className="text-rose-500 font-bold text-xs">{denominator}</span>
                                </div>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                {subtitle} • <span className="text-slate-600">{audits.length} total entries</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                        >
                            <X className="text-slate-400" size={18} />
                        </button>
                    </div>
                </div>

                {/* 2. TABS - Indicator Style */}
                {tabs.length > 0 && (
                    <div className="px-8 bg-white border-b border-slate-100 flex gap-8 shrink-0 overflow-x-auto no-scrollbar">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => onTabChange && onTabChange(tab.value)}
                                className={cn(
                                    "py-4 text-xs font-bold transition-all relative whitespace-nowrap",
                                    tab.active
                                        ? "text-slate-900"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab.label}
                                <span className="ml-1.5 text-[10px] opacity-60">({tab.count})</span>
                                {tab.active && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* 3. MAIN BODY */}
                <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8 custom-scrollbar">

                    {/* Analytics / Filters Card */}
                    <div className="mb-8 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setIsGroupsOpen(!isGroupsOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-slate-500">
                                <Filter size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Distribution Insights</span>
                            </div>
                            {isGroupsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isGroupsOpen && (
                            <div className="px-6 pb-6 space-y-6">
                                {/* Chatter Selection */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedChatter("All")}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-[11px] font-bold transition-all border",
                                            selectedChatter === "All"
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                        )}
                                    >
                                        All Chatters
                                    </button>
                                    {chatterData.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedChatter(c.name)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-2",
                                                selectedChatter === c.name
                                                    ? "bg-white border-rose-500 text-rose-600 shadow-sm ring-1 ring-rose-500/10"
                                                    : "bg-white border-slate-200 text-slate-500 hover:border-rose-200"
                                            )}
                                        >
                                            {c.name}
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[9px]",
                                                selectedChatter === c.name ? "bg-rose-50" : "bg-slate-50"
                                            )}>{c.count}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Reason Mapping Pills */}
                                <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                    {reasonData.map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500">{r.name}</span>
                                            <span className="text-[10px] font-black text-slate-900 ml-1">{r.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Audit Logs List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit Repository</h3>
                            <div className="h-px flex-1 bg-slate-200/50"></div>
                        </div>

                        {filteredAudits.map((audit, i) => (
                            <div key={i} className="group bg-white border border-slate-200/70 rounded-xl p-5 hover:border-rose-200 transition-all shadow-sm hover:shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                    {/* Column 1: Identity */}
                                    <div className="md:col-span-3 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-slate-50 rounded text-slate-400 group-hover:text-rose-500 transition-colors">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Chatter</p>
                                                <p className="text-xs font-bold text-slate-900">{audit.chatter}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-slate-50 rounded text-slate-400 group-hover:text-rose-500 transition-colors">
                                                <Calendar size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Date</p>
                                                <p className="text-xs font-medium text-slate-600">{audit.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Details */}
                                    <div className="md:col-span-3 space-y-4 border-l border-slate-50 pl-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-slate-50 rounded text-slate-400 group-hover:text-rose-500 transition-colors">
                                                <Hash size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Subscriber ID</p>
                                                <p className="text-xs font-mono font-bold text-slate-800">{audit.subUid}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-slate-50 rounded text-slate-400 group-hover:text-rose-500 transition-colors">
                                                <Activity size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">QC Status</p>
                                                <p className="text-xs font-semibold text-slate-600">{audit.qc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Diagnostic Feedback */}
                                    <div className="md:col-span-6 bg-[#fcfcfd] border border-slate-100 rounded-lg p-4 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Verdict</span>
                                            <span className="text-[11px] font-bold text-slate-800">{audit.reason}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                                            {audit.reasonDetail || "No qualitative feedback recorded."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredAudits.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 opacity-40">
                            <ShieldAlert size={40} className="text-slate-300 mb-2" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No matching logs</p>
                        </div>
                    )}
                </div>

                {/* 4. FOOTER */}
                <div className="px-8 py-5 border-t border-slate-100 flex justify-end bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        Dismiss Portal
                    </button>
                </div>
            </div>
        </Modal>
    );
}
