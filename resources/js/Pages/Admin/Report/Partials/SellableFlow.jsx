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

    const isClickable = label.includes("click for details");

    return (
        <div 
            className={cn(
                "relative group transition-all rounded-md px-2",
                isClickable ? "cursor-pointer hover:bg-slate-50" : ""
            )}
            onClick={isClickable ? onClick : undefined}
            style={{ marginLeft: `${indent * 24}px` }}
        >
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                    {indent > 0 && !subtext && <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[color] || dotColors.slate)} />}
                    {indent === 0 && <div className={cn("w-2 h-2 rounded-full shrink-0", dotColors[color])} />}
                    <span className={cn(
                        "text-[13px] tracking-tight", 
                        subtext ? 'font-bold opacity-80' : 'font-bold', 
                        colors[color] || colors.dark,
                        isClickable && "group-hover:underline"
                    )}>
                        {label}
                    </span>
                </div>
                <span className={cn("text-[17px] font-black tabular-nums tracking-tighter", colors[color] || colors.dark)}>
                    {value}
                </span>
            </div>
        </div>
    );
};

const PitchDrillDownModal = ({ type, onClose }) => {
    if (!type) return null;

    const isNotPossible = type === "notPossible";
    const title = isNotPossible ? "Pitch Not Possible" : "Pitch Possible But Not Executed";
    const titleColor = "text-rose-800";
    const subtitleColor = "text-rose-600";
    const bgColor = "bg-rose-50/20";

    const fakeAuditHistory = [
        {
            date: "Feb 17, 2026, 02:44 AM",
            chatter: "CJ",
            creator: "Robert Brown",
            subUid: "SUB_S8K4L1",
            qc: "",
            subType: "Fresh (first interaction or first interaction of the day)",
            reason: isNotPossible ? "Others" : "Negotiation failed",
            reasonDetail: isNotPossible ? "Connection dropped mid-conversation" : "Subscriber was too aggressive",
        },
        {
            date: "Feb 10, 05:06 PM",
            chatter: "Alberto",
            creator: "Mary Johnson",
            subUid: "SUB_H6J8P3",
            qc: "",
            subType: "Fresh (first interaction or first interaction of the day)",
            reason: isNotPossible ? "Sub left mid conversation" : "Chatter missed signal",
            reasonDetail: "",
        }
    ];

    const chatterData = [
        { name: "CJ", count: 3 },
        { name: "Alberto", count: 2 },
        { name: "Donn", count: 2 },
        { name: "Jamie", count: 1 },
        { name: "Eliseo", count: 1 },
    ];

    const reasonData = isNotPossible ? [
        { name: "Others", count: 4 },
        { name: "Time constraint stated", count: 4 },
        { name: "Sub left mid conversation", count: 1 },
    ] : [
        { name: "Negotiation failed", count: 4 },
        { name: "Chatter missed signal", count: 3 },
        { name: "Sub aggressive", count: 1 },
    ];

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 font-['Inter', 'system-ui', 'sans-serif']">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-5 border-b border-rose-100 bg-[#FFF5F5]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className={cn("text-2xl font-black flex items-center gap-3", titleColor)}>
                                {title} - Details <span className="text-slate-400 font-bold">9/83</span>
                            </h2>
                            <p className={cn("text-[11px] font-bold uppercase tracking-wider", subtitleColor)}>
                                Sellable conversations where the pitch was {isNotPossible ? "not possible" : "possible but not executed"} (9 audits)
                            </p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-rose-100/50 rounded-full transition-colors">
                            <X className={titleColor} size={22} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* Section: By Chatter */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                            <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                                {title} by Chatter
                            </h3>
                            <ChevronUp className="text-rose-900" size={16} />
                        </div>
                        <div className="space-y-4">
                            <button className="bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded shadow-sm">
                                All Chatters
                            </button>
                            <div className="grid grid-cols-5 gap-3">
                                {chatterData.map((c, i) => (
                                    <div key={i} className="bg-white border border-rose-100 p-3 rounded-lg flex flex-col items-center justify-center space-y-1 hover:border-rose-300 transition-colors cursor-pointer group">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.name}</span>
                                        <span className="text-xl font-black text-rose-600 group-hover:scale-110 transition-transform">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: By Reason */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                            <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                                {title} by Reason
                            </h3>
                            <ChevronUp className="text-rose-900" size={16} />
                        </div>
                        <div className="flex flex-wrap gap-3 pt-1">
                            {reasonData.map((r, i) => (
                                <div key={i} className="bg-white border border-rose-100 px-5 py-2.5 rounded-lg flex items-center gap-4 hover:border-rose-300 transition-colors cursor-pointer group">
                                    <span className="text-[11px] font-black text-slate-700">{r.name}</span>
                                    <span className="text-xl font-black text-rose-600">{r.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: History Log */}
                    <div className="space-y-5">
                        {fakeAuditHistory.map((audit, i) => (
                            <div key={i} className={cn("border border-rose-200 rounded-xl p-6.5 space-y-5 transition-all hover:shadow-md", bgColor)}>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                                    <div className="space-y-3">
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium">Date:</span>
                                            <span className="text-slate-900 font-bold">{audit.date}</span>
                                        </div>
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium">Creator:</span>
                                            <span className="text-slate-900 font-bold">{audit.creator}</span>
                                        </div>
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">QC:</span>
                                            <span className="text-slate-900 font-bold">{audit.qc}</span>
                                        </div>
                                        <div className="flex gap-2 items-center text-[11px] pt-1">
                                            <span className="text-slate-400 font-medium uppercase tracking-tighter">Reason:</span>
                                            <div className="inline-flex px-3 py-1 bg-white border border-rose-200 rounded text-slate-800 font-black text-[10px]">
                                                {audit.reason}
                                            </div>
                                            {audit.reasonDetail && (
                                                <span className="text-slate-500 font-medium italic pl-1">({audit.reasonDetail})</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium">Chatter:</span>
                                            <span className="text-slate-900 font-bold">{audit.chatter}</span>
                                        </div>
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">Subscriber UID:</span>
                                            <span className="text-slate-900 font-bold">{audit.subUid}</span>
                                        </div>
                                        <div className="flex gap-2 text-[11px]">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">Subscriber Type:</span>
                                            <span className="text-slate-900 font-bold leading-relaxed">{audit.subType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 flex justify-end px-8 border-t border-slate-100">
                    <button 
                        onClick={onClose}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-[11px] uppercase tracking-widest px-8 py-2.5 rounded transition-all"
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

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <PitchDrillDownModal 
                type={activeModal} 
                onClose={() => setActiveModal(null)} 
            />
            
            <CardHeader className="p-8 pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                <h3 className="text-lg font-black text-[#2563EB] tracking-tight leading-none">Sellable conversations</h3>
                <span className="text-[44px] font-black text-slate-900 tracking-tighter leading-none">100</span>
            </CardHeader>
            
            <CardContent className="p-8 space-y-1">
                {/* NOT PITCHED BRANCH */}
                <div className="space-y-0.5">
                    <TreeNode label="Not Pitched" value="17" color="red" indent={0} />
                    <div className="relative border-l-2 border-rose-100 ml-1 ml-[5px] pl-6 pb-4 space-y-0.5">
                        <TreeNode 
                            label="Pitch not possible (click for details)" 
                            value="9" 
                            color="red" 
                            subtext 
                            onClick={() => setActiveModal("notPossible")} 
                        />
                        <TreeNode 
                            label="Pitch possible but not executed (click for details)" 
                            value="8" 
                            color="red" 
                            subtext 
                            onClick={() => setActiveModal("possibleNotExecuted")} 
                        />
                    </div>
                </div>

                {/* PITCHED BRANCH */}
                <div className="space-y-1 pt-2">
                    <TreeNode label="Pitched" value="83" color="blue" indent={0} />
                    <div className="ml-6 space-y-0.5 pt-1">
                        <TreeNode label="Sexting pitched" value="53" color="slate" indent={0} />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode label="Sale: No (click for details)" value="21" color="red" />
                            <TreeNode label="Sale: Yes" value="32" color="green" />
                            <div className="ml-6 border-l border-slate-100 pl-4">
                                <TreeNode label="Sub continued: Yes" value="14" color="green" />
                                <TreeNode label="Sub continued: No (click for details)" value="18" color="red" />
                            </div>
                        </div>

                        <TreeNode label="Pre-recorded pitched" value="30" color="slate" indent={0} />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode label="Sale: No (click for details)" value="15" color="red" />
                            <TreeNode label="Sale: Yes" value="47" color="green" />
                            <div className="ml-8 border-l border-slate-100 pl-4">
                                <TreeNode label="Upsell attempted" value="17" color="blue" />
                                <div className="ml-6 border-l border-slate-100 pl-4">
                                    <TreeNode label="Purchased: Yes" value="6" color="green" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
