import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const FaultCard = ({ label, value, sublabel, action, theme = "blue", formula }) => {
    const [isHovered, setIsHovered] = useState(false);
    const themes = {
        blue: { label: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50/30" },
        purple: { label: "text-purple-600", border: "border-purple-200", bg: "bg-purple-50/30" },
        green: { label: "text-green-600", border: "border-green-200", bg: "bg-green-50/30" },
        lime: { label: "text-lime-600", border: "border-lime-200", bg: "bg-lime-50/30" },
        orange: { label: "text-orange-600", border: "border-orange-200", bg: "bg-orange-50/30" },
        cyan: { label: "text-cyan-600", border: "border-cyan-200", bg: "bg-cyan-50/30" },
        yellow: { label: "text-yellow-600", border: "border-yellow-200", bg: "bg-yellow-50/30" },
        indigo: { label: "text-indigo-600", border: "border-indigo-200", bg: "bg-indigo-50/30" },
        rose: { label: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50/30" },
    };

    const config = themes[theme] || themes.blue;
    const isDetailed = formula?.definitions?.length > 0;

    return (
        <Card 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn("border shadow-none rounded-xl relative overflow-visible transition-all hover:shadow-md", config.border, config.bg)}
        >
            <CardContent className="p-7 space-y-5">
                <div className="flex items-center justify-between">
                    <span className={cn("text-[11px] font-bold uppercase tracking-widest", config.label)}>{label}</span>
                    <div className="relative">
                        <Info size={16} className={cn("cursor-help transition-all duration-300", config.label)} />
                        
                        {formula && isHovered && (
                            <div className={cn(
                                "pointer-events-none transition-all duration-300 absolute bottom-full right-0 mb-3 z-[100] animate-in fade-in zoom-in-95",
                                isDetailed ? "w-80" : "whitespace-nowrap"
                            )}>
                                <div className="bg-[#0F172A] text-white p-4 rounded-xl shadow-2xl border border-white/10 backdrop-blur-sm text-left">
                                    <div className="space-y-3">
                                        <p className="text-xs font-medium leading-relaxed tracking-tight">
                                            <span className="text-slate-400 mr-1">Formula:</span> {formula.math || formula}
                                        </p>
                                        
                                        {isDetailed && (
                                            <div className="space-y-1 pt-2 border-t border-white/5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Where:</p>
                                                {formula.definitions.map((def, i) => (
                                                    <p key={i} className="text-[10px] leading-relaxed text-slate-300">
                                                        <span className="text-white font-bold">{def.key}</span> = {def.value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-full right-1.5 -mt-1 border-8 border-transparent border-t-[#0F172A]" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className={cn("text-4xl font-black tabular-nums tracking-tighter leading-none", "text-slate-800")}>{value}</h2>
                    
                    <div className="space-y-2">
                        <p className={cn("text-[11px] font-bold opacity-80 leading-none", config.label)}>{sublabel}</p>
                        {action && (
                            <p className={cn("text-[11px] font-bold underline underline-offset-4 cursor-pointer hover:opacity-100 transition-opacity", config.label)}>
                                {action}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function RevenueFaultMapping({ isComparisonOpen = false }) {
    const [comparisonMode, setComparisonMode] = useState("sequential");
    const [baselineWeek, setBaselineWeek] = useState("week1");

    const snapshot = [
        { 
            label: "CONVERSION RATE", 
            value: "60.6%", 
            sublabel: "Sellable / Total Conversations", 
            theme: "blue", 
            formula: "(125 Sellable ÷ 185 Total) × 100"
        },
        { 
            label: "PITCH RATE", 
            value: "83.0%", 
            sublabel: "Pitched / Sellable Conversations", 
            action: "Click to view 17 not pitched", 
            theme: "purple", 
            formula: "(83 Pitched ÷ 100 Sellable) × 100"
        },
        { 
            label: "SEXTING SALES RATE", 
            value: "60.4%", 
            sublabel: "Sexting Sales / Sexting Pitched", 
            action: "Click to view 21 failed sales", 
            theme: "green", 
            formula: {
                math: "(32 Sexting Sales ÷ 53 Sexting Pitched) × 100",
                definitions: [
                    { key: "Sexting Sales", value: "Content Type: Sexting AND Sale: Yes" },
                    { key: "Sexting Pitched", value: "Content Type Pitched: Sexting" }
                ]
            }
        },
        { 
            label: "PRE-RECORDED SALES RATE", 
            value: "50.0%", 
            sublabel: "PPV Sales / PPV Pitched", 
            action: "Click to view 15 failed sales", 
            theme: "lime", 
            formula: {
                math: "(15 PPV Sales ÷ 30 PPV Pitched) × 100",
                definitions: [
                    { key: "PPV Sales", value: "Content Type: Pre-recorded AND Sale: Yes" },
                    { key: "PPV Pitched", value: "Content Type Pitched: Pre-recorded" }
                ]
            }
        },
        { 
            label: "SEXTING CONTINUATION RATE", 
            value: "43.8%", 
            sublabel: "Continued / Sexting Sales", 
            action: "Click to view 18 not continued", 
            theme: "orange",
            formula: {
                math: "(17 Continued ÷ 31 Sexting Sales) × 100",
                definitions: [
                    { key: "Sexting Continued", value: "Did sub continue? Yes" },
                    { key: "Sexting Sales", value: "Content Type: Sexting AND Sale: Yes" }
                ]
            }
        },
        { 
            label: "UPSELL ATTEMPT RATE", 
            value: "36.2%", 
            sublabel: "Upsell Attempts / First PPV Sales", 
            action: "Click to view 30 not attempted", 
            theme: "cyan",
            formula: {
                math: "(17 Upsell Attempted ÷ 47 First PPV Sales) × 100",
                definitions: [
                    { key: "Upsell Attempted", value: "Did chatter try upselling? = Yes" },
                    { key: "First PPV Sales", value: "First PPV Purchase: Yes" }
                ]
            }
        },
        { 
            label: "UPSELL CONVERSION RATE", 
            value: "35.3%", 
            sublabel: "Upsell Purchased / Upsell Attempted", 
            action: "Click to view 11 failed attempts", 
            theme: "yellow",
            formula: {
                math: "(6 Upsell Purchased ÷ 17 Upsell Attempted) × 100",
                definitions: [
                    { key: "Upsell Purchased", value: "Did subscriber buy upsell? = Yes" },
                    { key: "Upsell Attempted", value: "Did chatter try upselling? = Yes" }
                ]
            }
        },
        { 
            label: "AFTERCARE PROVIDED RATE", 
            value: "86.2%", 
            sublabel: "Aftercare / Total Sales", 
            action: "Click to view 4 without aftercare", 
            theme: "indigo",
            formula: {
                math: "(25 Aftercare: Yes ÷ 29 Total Sales) × 100",
                definitions: [
                    { key: "Aftercare: Yes", value: "template-aftercare = Yes" },
                    { key: "Total Sales", value: "All sales where (Sexting Sale: Yes OR PPV Sale: Yes)" }
                ]
            }
        },
        { 
            label: "CASUAL BEFORE SEXUAL RATE", 
            value: "79.0%", 
            sublabel: "Casual Conversation: Yes / Total Sellable", 
            action: "Click to view 5 non-casual", 
            theme: "rose",
            formula: {
                math: "(79 Casual Conversation: Yes ÷ 100 Total Sellable) × 100",
                definitions: [
                    { key: "Casual Conversation: Yes", value: "Did chatter have casual conversation before sexual? = Yes" },
                    { key: "Total Sellable", value: "Conversation State: SELLABLE" }
                ]
            }
        },
    ];

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {snapshot.map((item, idx) => (
                    <FaultCard
                        key={idx}
                        label={item.label}
                        value={item.value}
                        sublabel={item.sublabel}
                        action={item.action}
                        theme={item.theme}
                        formula={item.formula}
                    />
                ))}
            </div>
        </div>
    );
}
