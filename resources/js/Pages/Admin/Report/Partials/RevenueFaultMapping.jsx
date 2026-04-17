import React, { useState } from "react";
import { 
    Info, 
    ChevronDown, 
    Target, 
    Zap, 
    TrendingUp, 
    PlayCircle, 
    Repeat, 
    ArrowUpCircle, 
    DollarSign, 
    Heart, 
    ShieldAlert, 
    Activity 
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const FaultCard = ({ label, value, sublabel, action, theme = "blue", icon: Icon }) => {
    const themes = {
        blue: { text: "text-blue-600", border: "border-blue-100", bg: "bg-blue-50/50" },
        purple: { text: "text-purple-600", border: "border-purple-100", bg: "bg-purple-50/50" },
        green: { text: "text-green-600", border: "border-green-100", bg: "bg-green-50/50" },
        lime: { text: "text-lime-600", border: "border-lime-100", bg: "bg-lime-50/50" },
        orange: { text: "text-orange-600", border: "border-orange-100", bg: "bg-orange-50/50" },
        cyan: { text: "text-cyan-600", border: "border-cyan-100", bg: "bg-cyan-50/50" },
        amber: { text: "text-amber-600", border: "border-amber-100", bg: "bg-amber-50/50" },
        indigo: { text: "text-indigo-600", border: "border-indigo-100", bg: "bg-indigo-50/50" },
        rose: { text: "text-rose-600", border: "border-rose-100", bg: "bg-rose-50/50" },
    };

    const config = themes[theme] || themes.blue;

    return (
        <Card className={cn("border shadow-none rounded-md transition-all hover:shadow-sm", config.border, config.bg)}>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", config.text)}>{label}</span>
                    <div className={cn("p-1.5 rounded-full bg-white border", config.border)}>
                        <Icon size={12} className={config.text} />
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className={cn("text-3xl font-black tabular-nums tracking-tighter leading-none", "text-slate-900")}>{value}</h2>
                    <p className={cn("text-[9px] font-bold opacity-70 uppercase tracking-tight", "text-slate-500")}>{sublabel}</p>
                    {action && (
                        <p className={cn("text-[9px] font-black underline underline-offset-2 cursor-pointer transition-opacity mt-1", config.text)}>
                            {action}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default function RevenueFaultMapping({ stats, isComparisonOpen = false }) {
    const [comparisonMode, setComparisonMode] = useState("sequential");
    const [baselineWeek, setBaselineWeek] = useState("week1");

    // Dynamic Calculations based on your Math Logic
    const total_audits = stats?.total_audits || 0;
    const sellable = stats?.sellable || 0;
    const pitched = stats?.pitched || 0;
    const sexting_pitched = stats?.sexting_pitched || 0;
    const sexting_sale_yes = stats?.sexting_sale_yes || 0;
    const prerecorded_pitched = stats?.prerecorded_pitched || 0;
    const prerecorded_sale_yes = stats?.prerecorded_sale_yes || 0;
    const sexting_sub_continued = stats?.sexting_sub_continued || 0;
    const upsell_attempted = stats?.upsell_attempted || 0;
    const upsell_purchased = stats?.upsell_purchased || 0;
    const transition_yes = stats?.transition_yes || 0;
    const total_interventions = stats?.total_interventions || 0;

    const calcRate = (part, total) => {
        if (!total || total === 0) return "0.0%";
        return ((part / total) * 100).toFixed(1) + "%";
    };

    const currentStats = [
        { 
            label: "CONVERSION RATE", 
            value: calcRate(sellable, total_audits), 
            sublabel: "Sellable / Total Conversations", 
            theme: "blue", 
            icon: Target,
            formula: `(${sellable} Sellable ÷ ${total_audits} Total) × 100` 
        },
        { 
            label: "PITCH RATE", 
            value: calcRate(pitched, sellable), 
            sublabel: "Pitched / Sellable Conversations", 
            theme: "purple", 
            icon: Zap,
            formula: `(${pitched} Pitched ÷ ${sellable} Sellable) × 100` 
        },
        { 
            label: "SEXTING SALES", 
            value: calcRate(sexting_sale_yes, sexting_pitched), 
            sublabel: "Sexting Sales / Sexting Pitched", 
            theme: "green", 
            icon: TrendingUp,
            formula: `(${sexting_sale_yes} Sold ÷ ${sexting_pitched} Pitched) × 100` 
        },
        { 
            label: "PRE-RECORDED SALES", 
            value: calcRate(prerecorded_sale_yes, prerecorded_pitched), 
            sublabel: "PPV Sales / PPV Pitched", 
            theme: "lime", 
            icon: PlayCircle,
            formula: `(${prerecorded_sale_yes} Sales ÷ ${prerecorded_pitched} Pitched) × 100` 
        },
        { 
            label: "SEXTING CONTINUATION", 
            value: calcRate(sexting_sub_continued, sexting_sale_yes), 
            sublabel: "Continued / Sexting Sales", 
            theme: "orange", 
            icon: Repeat,
            formula: `(${sexting_sub_continued} Continued ÷ ${sexting_sale_yes} Sold) × 100` 
        },
        { 
            label: "UPSELL ATTEMPT", 
            value: calcRate(upsell_attempted, prerecorded_pitched), 
            sublabel: "Upsell Attempts / First PPV Sales", 
            theme: "cyan", 
            icon: ArrowUpCircle,
            formula: `(${upsell_attempted} Attempts ÷ ${prerecorded_pitched} First PPV Sales) × 100` 
        },
        { 
            label: "UPSELL CONVERSION", 
            value: calcRate(upsell_purchased, upsell_attempted), 
            sublabel: "Upsell Purchased / Upsell Attempted", 
            theme: "amber", 
            icon: DollarSign,
            formula: `(${upsell_purchased} Purchased ÷ ${upsell_attempted} Attempted) × 100` 
        },
        { 
            label: "CASUAL TO SEXUAL", 
            value: calcRate(transition_yes, sellable), 
            sublabel: "Casual Conversation: Yes / Total Sellable", 
            theme: "rose", 
            icon: Heart,
            formula: `(${transition_yes} Yes ÷ ${sellable} Sellable) × 100` 
        },
        { 
            label: "QC INTERVENTIONS", 
            value: total_interventions.toString(), 
            sublabel: "Total interventions tracked", 
            theme: "indigo",
            icon: ShieldAlert
        },
    ];

    // Placeholder for comparison weeks (can be dynamic if backend provides history)
    const week2Data = currentStats.map(s => ({ ...s, value: "0.0%" }));

    const renderWeekCards = (weekLabel, dateRange, statsLabel, data, isBaseline = false) => (
        <div className="space-y-6">
            <div className="bg-white border-b border-slate-100/50 p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{weekLabel}: {dateRange}</h3>
                    <p className="text-[11px] font-medium text-slate-400">{statsLabel}</p>
                </div>
                {isBaseline && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm">
                        Baseline Week
                    </span>
                )}
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.map((item, idx) => (
                    <FaultCard
                        key={idx}
                        label={item.label}
                        value={item.value}
                        sublabel={item.sublabel}
                        action={item.action}
                        theme={item.theme}
                        icon={item.icon}
                        formula={item.formula}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            {isComparisonOpen ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Comparison Header/Controls */}
                    <Card className="shadow-none border-slate-100/80 bg-slate-50/30">
                        <CardContent className="p-5 flex flex-wrap items-center gap-x-12 gap-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-bold text-slate-500 first-letter:uppercase">Comparison Mode:</span>
                                <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                                    <button 
                                        onClick={() => setComparisonMode("sequential")}
                                        className={cn(
                                            "px-6 py-2.5 rounded-md text-[11px] font-bold transition-all",
                                            comparisonMode === "sequential" ? "bg-[#2563EB] text-white shadow-md" : "text-slate-600 hover:text-slate-950"
                                        )}
                                    >
                                        Sequential (Week vs Previous)
                                    </button>
                                    <button 
                                        onClick={() => setComparisonMode("baseline")}
                                        className={cn(
                                            "px-6 py-2.5 rounded-md text-[11px] font-bold transition-all",
                                            comparisonMode === "baseline" ? "bg-[#2563EB] text-white shadow-md" : "text-slate-600 hover:text-slate-950"
                                        )}
                                    >
                                        Baseline (All vs Selected Week)
                                    </button>
                                </div>
                            </div>

                            {comparisonMode === "baseline" && (
                                <div className="flex items-center gap-6 border-l border-slate-200 pl-12 h-10 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <span className="text-xs font-bold text-slate-500 first-letter:uppercase">Baseline Week:</span>
                                    <select 
                                        value={baselineWeek}
                                        onChange={(e) => setBaselineWeek(e.target.value)}
                                        className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    >
                                        <option value="week1">Week 1: 2/7/2026 - 2/13/2026</option>
                                        <option value="week2">Week 2: 2/14/2026 - 2/20/2026</option>
                                    </select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Comparison Lists */}
                    <div className="space-y-12">
                        <Card className="shadow-none border-slate-100 bg-white rounded-xl overflow-hidden">
                            {renderWeekCards(
                                "Week 1",
                                "2/7/2026 - 2/13/2026",
                                `${total_audits} total audits • ${sellable} sellable conversations`,
                                currentStats,
                                baselineWeek === "week1"
                            )}
                        </Card>

                        <Card className="shadow-none border-slate-100 bg-white rounded-xl overflow-hidden opacity-90">
                            {renderWeekCards(
                                "Week 2",
                                "2/14/2026 - 2/20/2026",
                                "73 total audits • 50 sellable conversations",
                                week2Data,
                                baselineWeek === "week2"
                            )}
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {currentStats.map((item, idx) => (
                        <FaultCard
                            key={idx}
                            label={item.label}
                            value={item.value}
                            sublabel={item.sublabel}
                            action={item.action}
                            theme={item.theme}
                            icon={item.icon}
                            formula={item.formula}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
