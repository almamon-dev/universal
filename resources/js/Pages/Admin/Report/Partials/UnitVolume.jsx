import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { X, Calendar, User, ShieldAlert } from "lucide-react";

// Modal Component for Drill-downs (Matches Screenshot Design)
const AuditListModal = ({ title, audits, stats, onClose }) => {
    if (!audits) return null;

    // Grouping audits by chatter
    const chatterGroups = audits.reduce((acc, obj) => {
        const key = obj.chatter;
        if (!acc[key]) acc[key] = [];
        acc[key].push(obj);
        return acc;
    }, {});

    const totalSellable = stats?.sellable || 100; // Mock denominator if missing
    const totalCount = audits.length;

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 font-['Inter', 'system-ui', 'sans-serif']">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-rose-50 flex justify-between items-start bg-rose-50/20">
                    <div className="space-y-0.5">
                        <h2 className="text-xl font-black text-rose-900 flex items-center gap-2">
                            {title} <span className="text-rose-600">{totalCount}</span><span className="text-emerald-500 font-bold text-base">/{totalSellable}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tight">
                            Sellable conversations that did not transition ({totalCount} audits)
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-full transition-colors">
                        <X className="text-rose-900" size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Summary Section */}
                    {totalCount > 0 && (
                        <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-5 space-y-4">
                            <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Total per Chatter:</p>
                            <div className="grid grid-cols-1 gap-3 px-1">
                                {Object.keys(chatterGroups).map((name) => (
                                    <div key={name} className="bg-white border border-rose-100 p-3 rounded-lg flex justify-between items-center shadow-sm">
                                        <span className="text-[10px] font-black text-rose-900 uppercase tracking-tighter truncate pr-2">{name}</span>
                                        <span className="text-sm font-black text-rose-700">{chatterGroups[name].length}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed List Grouped by Chatter */}
                    <div className="space-y-8">
                        {Object.keys(chatterGroups).map((name) => (
                            <div key={name} className="space-y-3">
                                <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider bg-rose-50/50 inline-block px-3 py-1 rounded-md">{name} ({chatterGroups[name].length})</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {chatterGroups[name].map((audit, i) => (
                                        <div key={i} className="bg-[#FFF1F2]/50 border border-rose-100 px-5 py-3 rounded-lg shadow-sm">
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px]">
                                                <div className="flex gap-1.5">
                                                    <span className="font-bold text-slate-500">Date:</span>
                                                    <span className="text-slate-700 font-bold">{audit.date}</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <span className="font-bold text-slate-500">Chatter:</span>
                                                    <span className="text-slate-700 font-bold">{audit.chatter}</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <span className="font-bold text-slate-500">Creator:</span>
                                                    <span className="text-slate-700 font-bold">{audit.creator}</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <span className="font-bold text-slate-500">Subscriber UID:</span>
                                                    <span className="text-slate-700 font-bold truncate">{audit.subUid}</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <span className="font-bold text-slate-500">QC:</span>
                                                    <span className="text-slate-700 font-bold">{audit.qc}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {totalCount === 0 && (
                            <div className="py-20 text-center space-y-3">
                                <ShieldAlert className="mx-auto text-rose-100" size={48} />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No audits available for this category</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex justify-between bg-slate-50/30">
                    <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Save as PDF
                    </button>
                    <button onClick={onClose} className="bg-[#E2E8F0] hover:bg-slate-300 text-slate-700 font-bold text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const ClassificationCard = ({ label, count, action, theme = "slate", onClick }) => {
    const statusThemes = {
        emerald: "bg-emerald-50/40 border-emerald-100 text-emerald-700",
        rose: "bg-rose-50/40 border-rose-100 text-rose-700",
        cyan: "bg-cyan-50/40 border-cyan-100 text-cyan-700",
        amber: "bg-amber-50/40 border-amber-100 text-amber-700",
        indigo: "bg-indigo-50/40 border-indigo-100 text-indigo-700",
        slate: "bg-slate-50/40 border-slate-100 text-slate-700",
    };

    const countColors = {
        emerald: "text-emerald-900",
        rose: "text-rose-900",
        cyan: "text-cyan-900",
        amber: "text-amber-900",
        indigo: "text-indigo-900",
        slate: "text-slate-900",
    };

    const borderColors = {
        emerald: "bg-emerald-500",
        rose: "bg-rose-500",
        cyan: "bg-cyan-500",
        amber: "bg-amber-500",
        indigo: "bg-[#6366F1]",
        slate: "bg-slate-400",
    };

    return (
        <Card className={cn("flex-1 shadow-sm border rounded-xl relative transition-all hover:shadow-md group overflow-hidden", statusThemes[theme])}>
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", borderColors[theme])} />
            <CardContent className="p-6 pb-8 space-y-5 text-left">
                <div className="space-y-3">
                    <p className={cn("text-[11px] font-bold uppercase tracking-tight", statusThemes[theme].split(' ')[2])}>{label}</p>
                    <h4 className={cn("text-[2.8rem] font-black tabular-nums leading-none tracking-tighter", countColors[theme])}>{count}</h4>
                </div>
                {action && (
                    <p 
                        onClick={onClick}
                        className="text-[10px] font-bold text-rose-600 underline underline-offset-4 cursor-pointer hover:text-rose-800 transition-colors uppercase tracking-tight"
                    >
                        {action}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

const SectionRow = ({ title, children }) => (
    <div className="space-y-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
        <div className="flex gap-6">
            {children}
        </div>
    </div>
);

export default function UnitVolume({ stats }) {
    const [modalData, setModalData] = useState(null);
    
    return (
        <div className="space-y-8">
            {modalData && (
                <AuditListModal 
                    title={modalData.title} 
                    audits={modalData.audits || []} 
                    stats={stats}
                    onClose={() => setModalData(null)} 
                />
            )}

            <SectionRow title="Subscriber type">
                <ClassificationCard label="New Sub (1 day)" count={stats?.fresh_subs || 0} theme="cyan" />
                <ClassificationCard label="Old Sub (2 days +)" count={stats?.old_subs || 0} theme="indigo" />
            </SectionRow>

            <SectionRow title="Casual to sexual transition (sellable conversations)">
                <ClassificationCard label="Yes" count={stats?.transition_yes || 0} theme="emerald" />
                <ClassificationCard 
                    label="No (click for details)" 
                    count={stats?.transition_no || 0} 
                    theme="rose" 
                    action="Click to view details"
                    onClick={() => setModalData({
                        title: "Failed Casual to Sexual Transitions",
                        audits: stats?.transition_no_audits
                    })}
                />
            </SectionRow>

            <SectionRow title="Negotiation discipline (sellable conversations)">
                <ClassificationCard label="Yes" count={stats?.negotiation_yes || 0} theme="emerald" />
                <ClassificationCard label="No" count={stats?.negotiation_no || 0} theme="rose" />
            </SectionRow>

            <SectionRow title="Aftercare provided (pillow talk)">
                <ClassificationCard label="Yes" count={stats?.aftercare_yes || 0} theme="emerald" />
                <ClassificationCard label="No" count={stats?.aftercare_no || 0} theme="rose" />
            </SectionRow>

            <SectionRow title="Chatter requested help (sellable conversations)">
                <ClassificationCard label="Yes" count={stats?.help_requested_yes || 0} theme="amber" />
                <ClassificationCard label="No" count={stats?.help_requested_no || 0} theme="slate" />
            </SectionRow>

            <SectionRow title="Rule violations (sellable conversations)">
                <ClassificationCard 
                    label="Yes" 
                    count={stats?.rule_violations_yes || 0} 
                    theme="rose" 
                    action="Click to view details"
                    onClick={() => setModalData({
                        title: "Audit Rule Violations",
                        audits: stats?.rule_violations_yes_audits
                    })} 
                />
                <ClassificationCard label="No" count={stats?.rule_violations_no || 0} theme="emerald" />
            </SectionRow>
        </div>
    );
}
