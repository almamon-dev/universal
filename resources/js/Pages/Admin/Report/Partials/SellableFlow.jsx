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

const SellableDrillDownModal = ({ type, onClose, stats }) => {
    const [selectedChatter, setSelectedChatter] = useState("All");
    const [isChatterOpen, setIsChatterOpen] = useState(true);
    const [isReasonOpen, setIsReasonOpen] = useState(true);

    if (!type) return null;

    // Config for different types of drill-downs
    const typeConfig = {
        notPossible: {
            title: "Pitch Not Possible",
            subtext: "Sellable conversations where the pitch was not possible",
            auditsKey: "pitch_not_possible_audits",
            chatterGroupLabel: "Not Possible by Chatter",
            reasonGroupLabel: "Not Possible by Reason"
        },
        possibleNotExecuted: {
            title: "Pitch Possible Not Executed",
            subtext: "Sellable conversations where the pitch was possible but not executed",
            auditsKey: "pitch_possible_not_executed_audits",
            chatterGroupLabel: "Not Executed by Chatter",
            reasonGroupLabel: "Not Executed by Reason"
        },
        sextingSaleNo: {
            title: "Sexting Sale: No",
            subtext: "Sexting pitched but no sale made",
            auditsKey: "sexting_sale_no_audits",
            chatterGroupLabel: "Failed Sales by Chatter",
            reasonGroupLabel: "Failed Sales by Reason"
        },
        sextingSubAbandoned: {
            title: "Sexting Continued: No",
            subtext: "Sexting purchased but subscriber did not continue",
            auditsKey: "sexting_sub_abandoned_audits",
            chatterGroupLabel: "Failed Continuation by Chatter",
            reasonGroupLabel: "Failed Continuation by Reason",
            customReasonQuery: "Why did the sub not continue?"
        },
        prerecordedSaleNo: {
            title: "Pre-recorded Sale: No",
            subtext: "Pre-recorded pitched but no sale made",
            auditsKey: "prerecorded_sale_no_audits",
            chatterGroupLabel: "Failed Sales by Chatter",
            reasonGroupLabel: "Failed Sales by Reason"
        },
        upsellNo: {
            title: "Upsell Not Purchased",
            subtext: "Upsell attempted but not purchased",
            auditsKey: "upsell_no_audits",
            chatterGroupLabel: "Failed Upsells by Chatter",
            reasonGroupLabel: "Reasons for Not Purchasing",
            customReasonQuery: "Why did the sub not continue?"
        },
        sextingPitched: {
            title: "Sexting Pitches",
            subtext: "Total audits identified as Sexting content",
            auditsKey: "sexting_pitched_audits",
            chatterGroupLabel: "Pitches by Chatter",
            reasonGroupLabel: "Content Breakdown"
        },
        prerecordedPitched: {
            title: "Pre-recorded Pitches",
            subtext: "Total audits identified as Pre-recorded/PPV content",
            auditsKey: "prerecorded_pitched_audits",
            chatterGroupLabel: "Pitches by Chatter",
            reasonGroupLabel: "Content Breakdown"
        }
    };

    const config = typeConfig[type] || typeConfig.notPossible;
    const baseAudits = stats?.[config.auditsKey] || [];
    const sellableCount = stats?.sellable || 0;
    const parentCount = type === 'sextingSaleNo' ? (stats?.sexting_pitched || 0) :
        type === 'sextingSubAbandoned' ? (stats?.sexting_sale_yes || 0) :
            type === 'prerecordedSaleNo' ? (stats?.prerecorded_pitched || 0) :
                type === 'upsellNo' ? (stats?.upsell_attempted || 0) :
                    type === 'sextingPitched' ? sellableCount :
                        type === 'prerecordedPitched' ? sellableCount :
                            sellableCount;

    // Filter audits based on selection
    const filteredAudits = selectedChatter === "All"
        ? baseAudits
        : baseAudits.filter(a => a.chatter === selectedChatter);

    // Dynamic Summaries
    const chatterMap = baseAudits.reduce((acc, curr) => {
        acc[curr.chatter] = (acc[curr.chatter] || 0) + 1;
        return acc;
    }, {});
    const chatterData = Object.entries(chatterMap).map(([name, count]) => ({ name, count }));

    const reasonMap = baseAudits.reduce((acc, curr) => {
        const reason = curr.reason || 'Not Specified';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
    }, {});
    const reasonData = Object.entries(reasonMap).map(([name, count]) => ({ name, count }));

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 font-['Inter', 'system-ui', 'sans-serif']">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                {/* Header */}
                <div className="px-8 py-5 border-b border-rose-50 bg-white">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className="text-[22px] font-black tracking-tight text-rose-900 flex items-center gap-2">
                                {config.title} - Details
                                <span className="text-rose-600 ml-1">{baseAudits.length}</span>
                                <span className="text-emerald-500 font-bold text-lg">/{parentCount}</span>
                            </h2>
                            <p className="text-xs font-bold text-rose-500 lowercase first-letter:uppercase">
                                {config.subtext} ({baseAudits.length} audits)
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
                            <X className="text-slate-400 group-hover:text-slate-600" size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Interventions Summary (Chatter) */}
                    <div className="space-y-3">
                        <div
                            className="bg-[#F1F7FF] border border-[#E1EFFF] rounded-xl px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-[#E8F2FF] transition-colors"
                            onClick={() => setIsChatterOpen(!isChatterOpen)}
                        >
                            <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-tight">{config.chatterGroupLabel}</h3>
                            <ChevronUp className={cn("text-[#2563EB] transition-transform duration-200", !isChatterOpen && "rotate-180")} size={18} />
                        </div>
                        {isChatterOpen && (
                            <div className="flex flex-wrap gap-2.5 px-1 animate-in slide-in-from-top-2">
                                <button
                                    onClick={() => setSelectedChatter("All")}
                                    className={cn(
                                        "px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                                        selectedChatter === "All" ? "bg-[#2563EB] text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:border-[#2563EB]/30"
                                    )}
                                >
                                    All Chatters
                                </button>
                                {chatterData.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedChatter(c.name)}
                                        className={cn(
                                            "px-5 py-2 rounded-lg flex items-center gap-4 transition-all shadow-sm",
                                            selectedChatter === c.name ? "bg-[#2563EB] text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-[#2563EB]/30"
                                        )}
                                    >
                                        <span className={cn("text-[11px] font-bold uppercase", selectedChatter === c.name ? "text-white" : "text-slate-500")}>{c.name}</span>
                                        <span className={cn("text-[15px] font-black", selectedChatter === c.name ? "text-white" : "text-rose-600")}>{c.count}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reasons Summary */}
                    <div className="space-y-3">
                        <div
                            className="bg-[#FFF8F1] border border-[#FFEDE1] rounded-xl px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-[#FFF2E8] transition-colors"
                            onClick={() => setIsReasonOpen(!isReasonOpen)}
                        >
                            <h3 className="text-sm font-black text-[#9A3412] uppercase tracking-tight">{config.reasonGroupLabel}</h3>
                            <ChevronUp className={cn("text-[#9A3412] transition-transform duration-200", !isReasonOpen && "rotate-180")} size={18} />
                        </div>
                        {isReasonOpen && (
                            <div className="flex flex-wrap gap-2.5 px-1 animate-in slide-in-from-top-2">
                                {reasonData.map((r, i) => (
                                    <div key={i} className="bg-white border border-[#FFEDE1] px-5 py-3 rounded-xl flex items-center justify-between gap-8 min-w-[200px] shadow-sm">
                                        <span className="text-[11px] font-bold text-slate-600 capitalize">{r.name}</span>
                                        <span className="text-lg font-black text-rose-600">{r.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Records List */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                            Audits for: <span className="text-[#2563EB]">{selectedChatter}</span> ({filteredAudits.length} records)
                        </p>
                        {filteredAudits.map((audit, i) => (
                            <div key={i} className="bg-[#FFF1F2]/40 border border-rose-100 px-6 py-5 rounded-2xl shadow-sm hover:border-rose-200 transition-all">
                                <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[13px]">
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[100px]">Date:</span>
                                        <span className="text-slate-700 font-bold">{audit.date}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[100px]">Chatter:</span>
                                        <span className="text-slate-700 font-bold">{audit.chatter}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[100px]">Creator:</span>
                                        <span className="text-slate-700 font-bold underline decoration-slate-200 underline-offset-4">{audit.creator}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[100px]">Subscriber UID:</span>
                                        <span className="text-slate-700 font-bold uppercase tracking-tight">{audit.subUid}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[100px]">QC:</span>
                                        <span className="text-slate-700 font-bold">{audit.qc}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-400 min-w-[120px]">Subscriber Type:</span>
                                        <span className="text-slate-600 font-medium">{audit.subType}</span>
                                    </div>
                                    <div className="col-span-2 flex items-start gap-2 pt-1 border-t border-rose-50 mt-1">
                                        <span className="font-bold text-slate-400 min-w-[100px] mt-1">{config.customReasonQuery || "Reason"}:</span>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="bg-white border border-rose-100 px-3 py-1 rounded-md text-rose-700 font-bold text-[11px] shadow-sm">
                                                {audit.reason}
                                            </span>
                                            {audit.reasonDetail && (
                                                <span className="text-slate-500 font-medium italic">({audit.reasonDetail})</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredAudits.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found for this category</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
                    <button onClick={onClose} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-widest px-10 py-3 rounded-xl transition-all shadow-sm">
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
            <SellableDrillDownModal
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
                        <TreeNode
                            label="Sexting pitched"
                            value={sexting_pitched}
                            color="slate"
                            indent={0}
                            onClick={() => setActiveModal("sextingPitched")}
                        />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode
                                label="Sale: No"
                                value={sexting_sale_no}
                                color="red"
                                onClick={() => setActiveModal("sextingSaleNo")}
                            />
                            <TreeNode label="Sale: Yes" value={sexting_sale_yes} color="green" />
                            <div className="ml-6 border-l border-slate-100 pl-4">
                                <TreeNode label="Sub continued: Yes" value={sexting_sub_continued} color="green" />
                                <TreeNode
                                    label="Sub continued: No"
                                    value={stats?.sexting_sub_abandoned || 0}
                                    color="red"
                                    onClick={() => setActiveModal("sextingSubAbandoned")}
                                />
                            </div>
                        </div>

                        <TreeNode
                            label="Pre-recorded pitched"
                            value={prerecorded_pitched}
                            color="slate"
                            indent={0}
                            onClick={() => setActiveModal("prerecordedPitched")}
                        />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode
                                label="Sale: No"
                                value={prerecorded_sale_no}
                                color="red"
                                onClick={() => setActiveModal("prerecordedSaleNo")}
                            />
                            <TreeNode label="Sale: Yes" value={prerecorded_sale_yes} color="green" />
                            <div className="ml-8 border-l border-slate-100 pl-4">
                                <TreeNode label="Upsell attempted" value={upsell_attempted} color="blue" />
                                <div className="ml-6 border-l border-slate-100 pl-4">
                                    <TreeNode label="Purchased: Yes" value={upsell_purchased} color="green" />
                                    <TreeNode
                                        label="Purchased: No"
                                        value={stats?.upsell_no || 0}
                                        color="red"
                                        onClick={() => setActiveModal("upsellNo")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
