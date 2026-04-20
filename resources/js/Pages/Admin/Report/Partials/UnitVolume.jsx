import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { X, Calendar, User, ShieldAlert } from "lucide-react";

// Modal Component for Drill-downs (Matches Screenshot Design)
// Simplified Modal for Unit Volume
const AuditListModal = ({ title, audits, stats, onClose }) => {
    if (!audits) return null;

    const chatterGroups = audits.reduce((acc, obj) => {
        const key = obj.chatter;
        if (!acc[key]) acc[key] = [];
        acc[key].push(obj);
        return acc;
    }, {});

    const totalSellable = stats?.sellable || 100;
    const totalCount = audits.length;

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                {/* Clean Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {title} ({totalCount})
                        </h2>
                        <p className="text-[11px] text-slate-500">
                            Drill-down audit list out of {totalSellable} sellable conversations
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-md transition-colors">
                        <X className="text-slate-400" size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Chatter Breakdowns: Simple Badges */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-slate-400">Breakdown by Chatter</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(chatterGroups).map((name) => (
                                <div key={name} className="flex items-center gap-2 px-3 py-1.5 border border-slate-100 rounded-md bg-slate-50/50">
                                    <span className="text-xs font-bold text-slate-700">{name}</span>
                                    <span className="text-xs font-bold text-rose-500">{chatterGroups[name].length}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audit List: Simple Rows */}
                    <div className="space-y-6">
                        {Object.keys(chatterGroups).map((name) => (
                            <div key={name} className="space-y-3">
                                <div className="divide-y divide-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                                    {chatterGroups[name].map((audit, i) => (
                                        <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors bg-white">
                                            <div className="grid grid-cols-3 gap-6 items-start text-xs">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400">Date/QC</p>
                                                    <p className="font-bold text-slate-900">{audit.date}</p>
                                                    <p className="text-[11px] text-slate-500">QC: {audit.qc}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400">Creator/Chatter</p>
                                                    <p className="font-bold text-slate-900">{audit.creator}</p>
                                                    <p className="text-[11px] text-slate-500">Ch: {audit.chatter}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400">Subscriber</p>
                                                    <p className="font-medium text-slate-700 truncate">{audit.subUid}</p>
                                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600 inline-block mt-1">
                                                        Authenticated
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {totalCount === 0 && (
                            <div className="py-20 text-center space-y-3">
                                <ShieldAlert className="mx-auto text-slate-200" size={48} />
                                <p className="text-slate-400 font-bold text-xs">No audits found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/30">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors">
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
        <Card className={cn("flex-1 shadow-none border rounded-lg relative transition-all hover:shadow-md group overflow-hidden bg-white", statusThemes[theme].split(' ')[1])}>
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", borderColors[theme])} />
            <CardContent className="p-5 space-y-5 text-left">
                <div className="space-y-1">
                    <p className={cn("text-[11px] font-bold tracking-tight text-slate-500")}>{label}</p>
                    <h4 className={cn("text-4xl font-bold tabular-nums leading-none tracking-tighter text-slate-800")}>{count}</h4>
                </div>
                {action && (
                    <p
                        onClick={onClick}
                        className="text-[10px] font-bold text-slate-400 underline underline-offset-4 cursor-pointer hover:text-slate-900 transition-colors tracking-tight"
                    >
                        {action}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

const SectionRow = ({ title, children }) => (
    <div className="space-y-4">
        <p className="text-[11px] font-bold text-slate-400 tracking-tight">{title}</p>
        <div className="flex gap-4">
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
