import React, { useState } from "react";
import { ChevronUp, ChevronDown, Calendar, Layers } from "lucide-react";

const FaultCard = ({
    title,
    rate,
    subtitle,
    footer,
    delta,
    theme,
    isNumber = false,
}) => {
    return (
        <div
            className={`p-4 rounded-md border border-slate-200 bg-white shadow-sm group hover:shadow-md transition-all relative flex flex-col justify-between h-full min-h-[120px]`}
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4
                        className={`text-[9px] font-bold uppercase tracking-wider text-slate-400`}
                    >
                        {title}
                    </h4>
                    <span className="text-xs font-bold text-slate-800">
                        {rate}
                        {!isNumber && "%"}
                    </span>
                </div>

                <p className="text-[9px] font-medium text-slate-500 leading-tight">
                    {subtitle}
                </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div>
                    {footer && (
                        <button className="text-[8px] font-semibold underline decoration-dotted text-slate-400 hover:text-blue-600 transition-colors">
                            {footer}
                        </button>
                    )}
                </div>

                {delta && (
                    <div
                        className={`flex items-center gap-0.5 text-[10px] font-bold ${delta.value >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                        {delta.value >= 0 ? (
                            <ChevronUp size={10} />
                        ) : (
                            <ChevronDown size={10} />
                        )}
                        {isNumber
                            ? Math.abs(delta.value)
                            : `${Math.abs(delta.value).toFixed(1)}%`}
                    </div>
                )}
            </div>

            {/* Subtle theme indicator */}
            <div
                className={`absolute bottom-0 left-0 w-full h-[2px] rounded-b-md bg-${theme}-500 opacity-20 group-hover:opacity-100 transition-opacity`}
            />
        </div>
    );
};

const WeekReport = ({ title, subtitle, cards, isBaseline = false }) => (
    <div className="bg-slate-50/50 rounded-md border border-slate-200 p-6 shadow-sm">
        <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-slate-400" />
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">
                        {title}
                    </h3>
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                    {subtitle}
                </p>
            </div>
            {isBaseline && (
                <span className="bg-blue-600/10 text-blue-600 text-[8px] font-bold px-2 py-1 rounded-md border border-blue-600/20 uppercase tracking-wider">
                    Baseline
                </span>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
                <FaultCard key={idx} {...card} />
            ))}
        </div>
    </div>
);

export default function RevenueFaultMapping({ stats }) {
    const [compMode, setCompMode] = useState("sequential");

    const week1Cards = [
        {
            title: "Conversion Rate",
            rate: "79.0",
            subtitle: "Sellable / Total Conversations",
            theme: "blue",
        },
        {
            title: "Pitch Rate",
            rate: "89.0",
            subtitle: "Pitched / Sellable Conversations",
            footer: "9 not pitched",
            theme: "purple",
        },
        {
            title: "Sexting Sales",
            rate: "73.0",
            subtitle: "Sexting Sales / Sexting Pitched",
            footer: "11 failed sales",
            theme: "emerald",
        },
        {
            title: "Pre-recorded Sales",
            rate: "83.0",
            subtitle: "PPV Sales / PPV Pitched",
            footer: "6 failed sales",
            theme: "lime",
        },
        {
            title: "Sexting Continuation",
            rate: "62.0",
            subtitle: "Continued / Sexting Sales",
            footer: "11 not continued",
            theme: "orange",
        },
        {
            title: "Upsell Attempt",
            rate: "34.0",
            subtitle: "Upsell Attempts / First PPV Sales",
            footer: "39 not attempted",
            theme: "cyan",
        },
        {
            title: "Upsell Conversion",
            rate: "70.0",
            subtitle: "Upsell Purchased / Upsell Attempted",
            footer: "6 failed attempts",
            theme: "amber",
        },
        {
            title: "Casual to Sexual",
            rate: "0.0",
            subtitle: "Casual Transition Success",
            theme: "rose",
        },
        {
            title: "QC Interventions",
            rate: "15",
            subtitle: "Total Management Actions",
            theme: "slate",
            isNumber: true,
        },
    ];

    const week2Cards = [
        {
            title: "Conversion Rate",
            rate: "62.0",
            subtitle: "Sellable / Total Conversations",
            theme: "blue",
            delta: { value: -17.0 },
        },
        {
            title: "Pitch Rate",
            rate: "86.0",
            subtitle: "Pitched / Sellable Conversations",
            footer: "8 not pitched",
            theme: "purple",
            delta: { value: -3.0 },
        },
        {
            title: "Sexting Sales",
            rate: "61.0",
            subtitle: "Sexting Sales / Sexting Pitched",
            footer: "11 failed sales",
            theme: "emerald",
            delta: { value: -12.0 },
        },
        {
            title: "Pre-recorded Sales",
            rate: "73.0",
            subtitle: "PPV Sales / PPV Pitched",
            footer: "6 failed sales",
            theme: "lime",
            delta: { value: -10.0 },
        },
        {
            title: "Sexting Continuation",
            rate: "53.0",
            subtitle: "Continued / Sexting Sales",
            footer: "8 not continued",
            theme: "orange",
            delta: { value: -9.0 },
        },
        {
            title: "Upsell Attempt",
            rate: "36.0",
            subtitle: "Upsell Attempts / First PPV Sales",
            footer: "21 not attempted",
            theme: "cyan",
            delta: { value: 2.0 },
        },
        {
            title: "Upsell Conversion",
            rate: "83.0",
            subtitle: "Upsell Purchased / Upsell Attempted",
            footer: "2 failed attempts",
            theme: "amber",
            delta: { value: 13.0 },
        },
        {
            title: "Casual to Sexual",
            rate: "0.0",
            subtitle: "Casual Transition Success",
            theme: "rose",
            delta: { value: 0 },
        },
        {
            title: "QC Interventions",
            rate: "11",
            subtitle: "Total Management Actions",
            theme: "slate",
            isNumber: true,
            delta: { value: -4 },
        },
    ];

    return (
        <div className="space-y-8 pt-4">
            {/* Comparison Controls */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-md flex flex-wrap items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                        <Layers className="text-white" size={18} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                            Week-over-Week Analysis
                        </h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                            Comparative revenue performance tracking
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCompMode("sequential")}
                        className={`px-5 py-2 text-xs font-semibold rounded-md transition-all ${compMode === "sequential" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                    >
                        Sequential (vs Previous)
                    </button>
                    <button
                        onClick={() => setCompMode("baseline")}
                        className={`px-5 py-2 text-xs font-semibold rounded-md transition-all ${compMode === "baseline" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                    >
                        Baseline (Selected)
                    </button>

                    {compMode === "baseline" && (
                        <select className="bg-white border border-slate-200 px-4 py-2 text-xs font-semibold rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm min-w-[220px]">
                            <option>Week 1: 02/07 - 02/13</option>
                            <option>Week 2: 02/14 - 02/20</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Week Report Cards */}
            <div className="space-y-8">
                <WeekReport
                    title="Week 1: Feb 7, 2026 - Feb 13, 2026"
                    subtitle="Metrics from 108 operations audits • 85 sellable units"
                    cards={week1Cards}
                    isBaseline={compMode === "baseline"}
                />

                <WeekReport
                    title="Week 2: Feb 14, 2026 - Feb 20, 2026"
                    subtitle="Metrics from 94 operations audits • 58 sellable units"
                    cards={week2Cards}
                />
            </div>
        </div>
    );
}
