import React from "react";
import { GitFork } from "lucide-react";

const FlowItem = ({
    label,
    count,
    type = "neutral",
    indent = 0,
    showPill = false,
}) => {
    const colors = {
        neutral: {
            text: "text-slate-700",
            bg: "bg-white",
            dot: "bg-slate-400",
        },
        rose: {
            text: "text-rose-700",
            bg: "bg-rose-50/50",
            dot: "bg-rose-500",
        },
        blue: {
            text: "text-blue-700",
            bg: "bg-blue-50/50",
            dot: "bg-blue-500",
        },
        emerald: {
            text: "text-emerald-700",
            bg: "bg-emerald-50/50",
            dot: "bg-emerald-500",
        },
    };

    const color = colors[type] || colors.neutral;

    return (
        <div
            className={`flex items-center justify-between px-3 py-2 rounded-md border border-slate-200 ${color.bg} shadow-sm transition-all hover:border-slate-300`}
            style={{ marginLeft: `${indent * 16}px` }}
        >
            <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${color.dot}`} />
                <span
                    className={`text-[10px] font-semibold ${color.text} uppercase tracking-wider`}
                >
                    {label}
                </span>
                {showPill && (
                    <span className="text-[8px] font-bold text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded-md border border-rose-200/50 uppercase tracking-tighter">
                        Alert
                    </span>
                )}
            </div>
            <span className={`text-sm font-bold ${color.text}`}>{count}</span>
        </div>
    );
};

export default function ConversationFlow({ stats }) {
    const flow = stats?.flow || {};

    return (
        <div className="space-y-6 pt-2">
            <div className="bg-slate-50/50 rounded-md border border-slate-200 p-6 md:p-6 shadow-sm group">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md group-hover:bg-black transition-colors">
                            <GitFork className="text-white" size={18} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                                Sellable Pipeline
                            </h4>
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                                Primary conversion stream analysis
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-xl font-bold text-slate-900 tracking-tight">
                            {flow.sellable_total || 0}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            Units
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Not Pitched */}
                    <div className="space-y-2">
                        <FlowItem
                            label="Not Pitched"
                            count={flow.not_pitched?.total || 0}
                            type="rose"
                        />
                        <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                            <FlowItem
                                label="Pitched not possible"
                                count={flow.not_pitched?.not_possible || 0}
                                type="neutral"
                                showPill={true}
                            />
                            <FlowItem
                                label="Pitch possible / not executed"
                                count={flow.not_pitched?.not_executed || 0}
                                type="rose"
                                showPill={true}
                            />
                        </div>
                    </div>

                    {/* Pitched */}
                    <div className="space-y-2">
                        <FlowItem
                            label="Pitched"
                            count={flow.pitched?.total || 0}
                            type="blue"
                        />
                        <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                            <FlowItem
                                label="Sexting Interaction"
                                count={flow.pitched?.sexting || 0}
                                type="neutral"
                            />
                            <FlowItem
                                label="Sale: Negative"
                                count={flow.pitched?.sale_no || 0}
                                type="rose"
                                showPill={true}
                            />
                            <FlowItem
                                label="Sale: Success"
                                count={flow.pitched?.sale_yes || 0}
                                type="emerald"
                            />
                            <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                                <FlowItem
                                    label="Sub Continued: Yes"
                                    count={flow.pitched?.sub_continued_yes || 0}
                                    type="emerald"
                                />
                                <FlowItem
                                    label="Sub Continued: No"
                                    count={flow.pitched?.sub_continued_no || 0}
                                    type="rose"
                                    showPill={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pre-recorded Pitched */}
                    <div className="space-y-2">
                        <FlowItem
                            label="Pre-recorded Segment"
                            count={flow.pre_recorded?.total || 0}
                            type="blue"
                        />
                        <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                            <FlowItem
                                label="Sale: Negative"
                                count={flow.pre_recorded?.sale_no || 0}
                                type="rose"
                                showPill={true}
                            />
                            <FlowItem
                                label="Sale: Success"
                                count={flow.pre_recorded?.sale_yes || 0}
                                type="emerald"
                            />
                            <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                                <FlowItem
                                    label="Upsell Attempted"
                                    count={flow.pre_recorded?.upsell_yes || 0}
                                    type="blue"
                                />
                                <div className="space-y-2 pl-6 border-l-2 border-slate-200/50 ml-3">
                                    <FlowItem
                                        label="Purchased: Yes"
                                        count={
                                            flow.pre_recorded?.purchased_yes ||
                                            0
                                        }
                                        type="emerald"
                                    />
                                    <FlowItem
                                        label="Purchased: No"
                                        count={
                                            flow.pre_recorded?.purchased_no || 0
                                        }
                                        type="rose"
                                        showPill={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
