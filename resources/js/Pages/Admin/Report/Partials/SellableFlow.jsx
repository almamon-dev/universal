import React from "react";
import { Activity } from "lucide-react";

const FlowNode = ({
    label,
    count,
    color = "slate",
    indent = 0,
    isHeader = false,
    hasDetails = false,
}) => {
    const colorClasses = {
        slate: "bg-slate-50 border-slate-100 text-slate-700",
        blue: "bg-blue-50 border-blue-100 text-blue-700",
        red: "bg-rose-50 border-rose-100 text-rose-700",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
        white: "bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm",
    };

    const dotClasses = {
        slate: "bg-slate-400",
        blue: "bg-blue-500",
        red: "bg-rose-500",
        emerald: "bg-emerald-500",
        white: "bg-slate-300",
    };

    const selectedColor = colorClasses[color] || colorClasses.slate;
    const selectedDot = dotClasses[color] || dotClasses.slate;

    return (
        <div
            className={`relative flex items-center justify-between p-3 rounded-xl border ${selectedColor} ${indent > 0 ? "ml-6 md:ml-8" : ""} transition-all`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${selectedDot}`} />
                <span
                    className={`text-[10px] font-bold uppercase tracking-widest`}
                >
                    {label}
                </span>
                {hasDetails && (
                    <span className="text-[8px] font-black text-rose-500 bg-rose-100/30 px-2 py-0.5 rounded-full border border-rose-200/20 uppercase tracking-[0.1em]">
                        Alert
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight">
                    {count}
                </span>
            </div>

            {/* Connector line for nested items */}
            {indent > 0 && (
                <div className="absolute left-[-15px] md:left-[-20px] top-[-15px] bottom-1/2 w-[1.5px] bg-slate-200" />
            )}
        </div>
    );
};

export default function SellableFlow({ stats }) {
    const flow = stats?.flow || {};

    return (
        <div className="space-y-6">
            {/* Header with summary count */}
            <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Activity size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            Funnel Metrics
                        </p>
                        <h4 className="text-sm font-bold text-slate-800">
                            Sellable Pipeline Analysis
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
                        {flow.sellable_total || 0}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Units
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* NOT PITCHED SECTION */}
                <div className="space-y-3">
                    <FlowNode
                        label="Not Pitched"
                        count={flow.not_pitched?.total || 0}
                        color="red"
                    />
                    <div className="space-y-3">
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
                <div className="space-y-3">
                    <FlowNode
                        label="Pitched"
                        count={flow.pitched?.total || 0}
                        color="blue"
                    />
                    <div className="space-y-3">
                        <FlowNode
                            label="Sexting Pitched"
                            count={flow.pitched?.sexting || 0}
                            color="white"
                            indent={1}
                        />
                        <FlowNode
                            label="Sale: No"
                            count={flow.pitched?.sale_no || 0}
                            color="white"
                            indent={1}
                            hasDetails={true}
                        />
                        <FlowNode
                            label="Sale: Yes"
                            count={flow.pitched?.sale_yes || 0}
                            color="white"
                            indent={1}
                        />
                        <div className="space-y-3 pl-6 border-l-2 border-slate-100 ml-6">
                            <FlowNode
                                label="Sub continued: Yes"
                                count={flow.pitched?.sub_continued_yes || 0}
                                color="white"
                                indent={0}
                            />
                            <FlowNode
                                label="Sub continued: No"
                                count={flow.pitched?.sub_continued_no || 0}
                                color="white"
                                indent={0}
                                hasDetails={true}
                            />
                        </div>
                    </div>
                </div>

                {/* PRE-RECORDED SECTION */}
                <div className="space-y-3">
                    <FlowNode
                        label="Pre-recorded pitched"
                        count={flow.pre_recorded?.total || 0}
                        color="blue"
                    />
                    <div className="space-y-3">
                        <FlowNode
                            label="Sale: No"
                            count={flow.pre_recorded?.sale_no || 0}
                            color="white"
                            indent={1}
                            hasDetails={true}
                        />
                        <FlowNode
                            label="Sale: Yes"
                            count={flow.pre_recorded?.sale_yes || 0}
                            color="white"
                            indent={1}
                        />
                        <div className="space-y-3 pl-6 border-l-2 border-slate-100 ml-6">
                            <FlowNode
                                label="Upsell attempted"
                                count={flow.pre_recorded?.upsell_yes || 0}
                                color="white"
                                indent={0}
                            />
                            <div className="space-y-3 pl-6 border-l-2 border-slate-100 ml-6">
                                <FlowNode
                                    label="Purchased: Yes"
                                    count={
                                        flow.pre_recorded?.purchased_yes || 0
                                    }
                                    color="white"
                                    indent={0}
                                />
                                <FlowNode
                                    label="Purchased: No"
                                    count={flow.pre_recorded?.purchased_no || 0}
                                    color="white"
                                    indent={0}
                                    hasDetails={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
