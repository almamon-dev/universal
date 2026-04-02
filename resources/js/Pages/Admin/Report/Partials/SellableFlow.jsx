import React from "react";
import { Activity } from "lucide-react";

const FlowNode = ({
    label,
    count,
    color = "zinc",
    indent = 0,
    hasDetails = false,
}) => {
    const colorClasses = {
        zinc: "bg-white border-zinc-200 text-zinc-900 shadow-sm",
        white: "bg-zinc-50 border-zinc-100 text-zinc-500",
    };

    const dotClasses = {
        zinc: "bg-zinc-900",
        white: "bg-zinc-300",
    };

    const selectedColor = colorClasses[color] || colorClasses.zinc;
    const selectedDot = dotClasses[color] || dotClasses.zinc;

    return (
        <div
            className={`relative flex items-center justify-between p-5 rounded-xl border ${selectedColor} ${indent > 0 ? "ml-8" : ""} transition-all group hover:border-zinc-900`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-1.5 h-1.5 rounded-full ${selectedDot}`} />
                <span className="text-[11px] font-bold text-zinc-900">
                    {label}
                </span>
                {hasDetails && (
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        Condition alpha
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-zinc-900">
                    {count}
                </span>
            </div>

            {/* Connector line for nested items */}
            {indent > 0 && (
                <div className="absolute left-[-24px] top-[-16px] bottom-1/2 w-[1px] bg-zinc-200" />
            )}
        </div>
    );
};

export default function SellableFlow({ stats }) {
    const flow = stats?.flow || {};

    return (
        <div className="space-y-8">
            {/* Summary Row */}
            <div className="flex items-center justify-between bg-zinc-50/50 p-6 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 mb-1">
                            Conversion funnel
                        </p>
                        <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                            Sellable pipeline flow
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-zinc-900 leading-none tracking-tighter">
                        {flow.sellable_total || 0}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 mt-1">
                        Total funnel units
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {/* NOT PITCHED SECTION */}
                <div className="space-y-4">
                    <FlowNode
                        label="Not pitched"
                        count={flow.not_pitched?.total || 0}
                        color="zinc"
                    />
                    <div className="space-y-4">
                        <FlowNode
                            label="Pitched not possible"
                            count={flow.not_pitched?.not_possible || 0}
                            color="white"
                            indent={1}
                            hasDetails={true}
                        />
                        <FlowNode
                            label="Pitch possible but not executed"
                            count={flow.not_pitched?.not_executed || 0}
                            color="white"
                            indent={1}
                            hasDetails={true}
                        />
                    </div>
                </div>

                {/* PITCHED SECTION */}
                <div className="space-y-4">
                    <FlowNode
                        label="Sexting pitched"
                        count={flow.pitched?.total || 0}
                        color="zinc"
                    />
                    <div className="space-y-4">
                        <FlowNode
                            label="Sexting interaction"
                            count={flow.pitched?.sexting || 0}
                            color="white"
                            indent={1}
                        />
                        <div className="space-y-4 ml-16 border-l border-zinc-100 pl-8">
                            <FlowNode
                                label="Sale: no"
                                count={flow.pitched?.sale_no || 0}
                                color="white"
                                hasDetails={true}
                            />
                            <FlowNode
                                label="Sale: yes"
                                count={flow.pitched?.sale_yes || 0}
                                color="white"
                            />
                             <div className="mt-4 space-y-4 border-l border-zinc-100 pl-8">
                                <FlowNode
                                    label="Sequence continued"
                                    count={flow.pitched?.sub_continued_yes || 0}
                                    color="white"
                                />
                                <FlowNode
                                    label="Sequence terminated"
                                    count={flow.pitched?.sub_continued_no || 0}
                                    color="white"
                                    hasDetails={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRE-RECORDED SECTION */}
                <div className="space-y-4">
                    <FlowNode
                        label="Pre-recorded pitched"
                        count={flow.pre_recorded?.total || 0}
                        color="zinc"
                    />
                    <div className="space-y-4">
                        <div className="space-y-4 ml-16 border-l border-zinc-100 pl-8">
                            <FlowNode
                                label="Sale: No"
                                count={flow.pre_recorded?.sale_no || 0}
                                color="white"
                                hasDetails={true}
                            />
                            <FlowNode
                                label="Sale: Yes"
                                count={flow.pre_recorded?.sale_yes || 0}
                                color="white"
                            />
                            <div className="mt-4 space-y-4 border-l border-zinc-100 pl-8">
                                <FlowNode
                                    label="Upsell Attempted"
                                    count={flow.pre_recorded?.upsell_yes || 0}
                                    color="white"
                                />
                                <div className="mt-4 space-y-4 border-l border-zinc-100 pl-8">
                                    <FlowNode
                                        label="Upsell Purchased"
                                        count={flow.pre_recorded?.purchased_yes || 0}
                                        color="white"
                                    />
                                    <FlowNode
                                        label="Upsell Declined"
                                        count={flow.pre_recorded?.purchased_no || 0}
                                        color="white"
                                        hasDetails={true}
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
