import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { X, ChevronUp } from "lucide-react";

const TreeNode = ({ label, value, color = "slate", indent = 0, subtext = false, onClick }) => {
    const colors = {
        blue: "text-[#2563EB]",
        red: "text-rose-600",
        green: "text-emerald-600",
        slate: "text-slate-500",
        dark: "text-slate-900"
    };

    const dotColors = {
        blue: "bg-[#2563EB]",
        red: "bg-rose-600",
        green: "bg-emerald-600",
        slate: "bg-slate-300"
    };

    const isClickable = !!onClick;

    return (
        <div
            className={cn(
                "relative group transition-all rounded-md px-2 -mx-2 h-9",
                isClickable ? "cursor-pointer hover:bg-[#2563EB]/5" : ""
            )}
            onClick={onClick}
            style={{ marginLeft: `${indent * 24}px` }}
        >
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-3">
                    {indent > 0 && !subtext && <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 shadow-sm", dotColors[color] || dotColors.slate)} />}
                    {indent === 0 && <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm", dotColors[color])} />}
                    <span className={cn(
                        "text-[13px] tracking-tight transition-colors",
                        subtext ? 'font-medium' : 'font-semibold',
                        colors[color] || colors.dark,
                        isClickable && "group-hover:text-[#2563EB]"
                    )}>
                        {label}
                        {isClickable && (
                            <span className="ml-2 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                                Click for details
                            </span>
                        )}
                    </span>
                </div>
                <span className={cn("text-lg font-black tabular-nums tracking-tighter", colors[color] || colors.dark)}>
                    {value}
                </span>
            </div>
        </div>
    );
};

const PitchDrillDownModal = ({ type, onClose, stats }) => {
    if (!type) return null;

    const isNotPossible = type === "notPossible";
    const audits = isNotPossible
        ? (stats?.pitch_not_possible_audits || [])
        : (stats?.pitch_possible_not_executed_audits || []);

    const title = isNotPossible ? "Pitch Not Possible" : "Pitch Possible But Not Executed";
    const titleColor = "text-slate-900";
    const subtitleColor = "text-slate-500";

    // Dynamic Summaries
    const chatterMap = audits.reduce((acc, curr) => {
        acc[curr.chatter] = (acc[curr.chatter] || 0) + 1;
        return acc;
    }, {});
    const chatterData = Object.entries(chatterMap).map(([name, count]) => ({ name, count }));

    const reasonMap = audits.reduce((acc, curr) => {
        acc[curr.reason] = (acc[curr.reason] || 0) + 1;
        return acc;
    }, {});
    const reasonData = Object.entries(reasonMap).map(([name, count]) => ({ name, count }));

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 font-['Inter', 'system-ui', 'sans-serif']">
            <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1.5">
                            <h2 className={cn("text-2xl font-black tracking-tight", titleColor)}>
                                {title} <span className="text-[#2563EB] ml-2">{audits.length}/{stats?.sellable || 0}</span>
                            </h2>
                            <p className={cn("text-xs font-semibold uppercase tracking-widest", subtitleColor)}>
                                Sellable conversations where the pitch was {isNotPossible ? "not possible" : "possible but not executed"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                        >
                            <X className="text-slate-400 group-hover:text-slate-600" size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Insights Grid */}
                    <div className="grid grid-cols-2 gap-10">
                        {/* Section: By Chatter */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Summary by Chatter
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {chatterData.map((c, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-lg flex items-center gap-3 hover:border-[#2563EB]/30 transition-all cursor-pointer group">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{c.name}</span>
                                        <span className="text-sm font-black text-slate-900 group-hover:text-[#2563EB]">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: By Reason */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Summary by Reason
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {reasonData.map((r, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-lg flex items-center gap-3 hover:border-[#2563EB]/30 transition-all cursor-pointer group">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{r.name}</span>
                                        <span className="text-sm font-black text-slate-900 group-hover:text-[#2563EB]">{r.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: History Log */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Audit detailed records
                            </h3>
                            <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline decoration-2">
                                Download Report
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {audits.map((audit, i) => (
                                <div key={i} className="group border border-slate-100 bg-[#FCFDFF] rounded-xl p-6 transition-all hover:border-[#2563EB]/20 hover:shadow-sm">
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-16">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-24 shrink-0">Date</span>
                                                <span className="text-[13px] text-slate-900 font-semibold">{audit.date}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-24 shrink-0">Creator</span>
                                                <span className="text-[13px] text-slate-900 font-semibold underline decoration-slate-200 underline-offset-4 cursor-pointer hover:decoration-[#2563EB] transition-colors">{audit.creator}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-24 shrink-0">QC Check</span>
                                                <span className="text-[13px] text-slate-900 font-medium">{audit.qc}</span>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-24 shrink-0 mt-1.5">Reason</span>
                                                <div className="flex flex-col gap-2">
                                                    <div className="inline-flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 font-bold text-[11px] shadow-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                                                        {audit.reason}
                                                    </div>
                                                    {audit.reasonDetail && (
                                                        <span className="text-[12px] text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-3 ml-2">
                                                            {audit.reasonDetail}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-28 shrink-0">Chatter</span>
                                                <span className="text-[13px] text-slate-900 font-semibold underline decoration-slate-200 underline-offset-4 cursor-pointer hover:decoration-[#2563EB] transition-colors">{audit.chatter}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-28 shrink-0">Subscriber ID</span>
                                                <span className="text-[13px] font-mono font-bold text-[#2563EB] bg-[#2563EB]/5 px-2 py-0.5 rounded transition-all group-hover:bg-[#2563EB]/10">{audit.subUid}</span>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] w-28 shrink-0 mt-1">Subscriber Type</span>
                                                <span className="text-[12.5px] text-slate-600 font-medium leading-snug max-w-[240px]">{audit.subType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-5 flex justify-end px-8 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-[11px] uppercase tracking-widest px-10 py-3 rounded-lg transition-all shadow-sm active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default function SellableFlow({ stats }) {
    const [activeModal, setActiveModal] = useState(null);

    // Dynamic data mapping from stats prop
    const sellable_count = stats?.sellable || 0;
    const pitched_count = stats?.pitched || 0;
    const not_pitched_count = Math.max(0, sellable_count - pitched_count);

    // Not Pitched breakdown
    const pitch_not_possible = stats?.pitch_not_possible || 0;
    const pitch_possible_not_executed = Math.max(0, not_pitched_count - pitch_not_possible);

    // Pitched breakdown
    const sexting_pitched = stats?.sexting_pitched || 0;
    const sexting_sale_yes = stats?.sexting_sale_yes || 0;
    const sexting_sale_no = Math.max(0, sexting_pitched - sexting_sale_yes);
    const sexting_sub_continued = stats?.sexting_sub_continued || 0;
    const sexting_sub_abandoned = Math.max(0, sexting_sale_yes - sexting_sub_continued);

    const prerecorded_pitched = stats?.prerecorded_pitched || 0;
    const prerecorded_sale_yes = stats?.prerecorded_sale_yes || 0;
    const prerecorded_sale_no = Math.max(0, prerecorded_pitched - prerecorded_sale_yes);
    const upsell_attempted = stats?.upsell_attempted || 0;
    const upsell_purchased = stats?.upsell_purchased || 0;

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <PitchDrillDownModal
                type={activeModal}
                onClose={() => setActiveModal(null)}
                stats={stats}
            />

            <CardHeader className="p-8 pb-3 flex border-b border-slate-200 pb-10 flex-row items-end justify-between space-y-0">
                <div className="space-y-1">
                    <h5 className="text-xl font-black text-slate-900 tracking-tight leading-none">Sellable conversations</h5>
                </div>
                <span className="text-[44px] font-black text-[#2563EB] tracking-tighter leading-none h-[38px] flex items-end">{sellable_count}</span>
            </CardHeader>

            <CardContent className="px-8 pb-8 pt-4 space-y-1">
                {/* NOT PITCHED BRANCH */}
                <div className="space-y-0.5">
                    <TreeNode label="Not Pitched" value={not_pitched_count} color="red" indent={0} />
                    <div className="relative border-l-2 border-slate-100 ml-[7px] pl-6 pb-4 space-y-0.5">
                        <TreeNode
                            label="Pitch not possible"
                            value={pitch_not_possible}
                            color="red"
                            subtext
                            onClick={() => setActiveModal("notPossible")}
                        />
                        <TreeNode
                            label="Pitch possible but not executed"
                            value={pitch_possible_not_executed}
                            color="red"
                            subtext
                            onClick={() => setActiveModal("possibleNotExecuted")}
                        />
                    </div>
                </div>

                {/* PITCHED BRANCH */}
                <div className="space-y-1 pt-2">
                    <TreeNode label="Pitched" value={pitched_count} color="blue" indent={0} />
                    <div className="ml-[7px] border-l-2 border-slate-100 pl-6 space-y-0.5 pt-1">
                        <TreeNode label="Sexting pitched" value={sexting_pitched} color="slate" indent={0} />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode label="Sale: No" value={sexting_sale_no} color="red" onClick={() => { }} />
                            <TreeNode label="Sale: Yes" value={sexting_sale_yes} color="green" />
                            <div className="ml-6 border-l border-slate-100 pl-4">
                                <TreeNode label="Sub continued: Yes" value={sexting_sub_continued} color="green" />
                                <TreeNode label="Sub continued: No" value={sexting_sub_abandoned} color="red" onClick={() => { }} />
                            </div>
                        </div>

                        <TreeNode label="Pre-recorded pitched" value={prerecorded_pitched} color="slate" indent={0} />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode label="Sale: No" value={prerecorded_sale_no} color="red" onClick={() => { }} />
                            <TreeNode label="Sale: Yes" value={prerecorded_sale_yes} color="green" />
                            <div className="ml-8 border-l border-slate-100 pl-4">
                                <TreeNode label="Upsell attempted" value={upsell_attempted} color="blue" />
                                <div className="ml-6 border-l border-slate-100 pl-4">
                                    <TreeNode label="Purchased: Yes" value={upsell_purchased} color="green" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
