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
    Activity,
    X,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import Modal from "@/Components/Modal";
import { cn } from "@/lib/utils";
import AuditDrillDownModal from "./AuditDrillDownModal";

const FaultCard = ({ label, value, sublabel, action, theme = "blue", icon: Icon, formula, onClick }) => {
    const themes = {
        blue: { text: "text-blue-700", border: "border-blue-200", bg: "bg-gradient-to-br from-blue-50 to-blue-100/40", iconBg: "bg-blue-100" },
        purple: { text: "text-purple-700", border: "border-purple-200", bg: "bg-gradient-to-br from-purple-50 to-purple-100/40", iconBg: "bg-purple-100" },
        green: { text: "text-green-700", border: "border-green-200", bg: "bg-gradient-to-br from-green-50 to-green-100/40", iconBg: "bg-green-100" },
        lime: { text: "text-lime-700", border: "border-lime-200", bg: "bg-gradient-to-br from-lime-50 to-lime-100/40", iconBg: "bg-lime-100" },
        orange: { text: "text-orange-700", border: "border-orange-200", bg: "bg-gradient-to-br from-orange-50 to-orange-100/40", iconBg: "bg-orange-100" },
        cyan: { text: "text-cyan-700", border: "border-cyan-200", bg: "bg-gradient-to-br from-cyan-50 to-cyan-100/40", iconBg: "bg-cyan-100" },
        amber: { text: "text-amber-700", border: "border-amber-200", bg: "bg-gradient-to-br from-amber-50 to-amber-100/40", iconBg: "bg-amber-100" },
        indigo: { text: "text-indigo-700", border: "border-indigo-200", bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/40", iconBg: "bg-indigo-100" },
        rose: { text: "text-rose-700", border: "border-rose-200", bg: "bg-gradient-to-br from-rose-50 to-rose-100/40", iconBg: "bg-rose-100" },
    };

    const config = themes[theme] || themes.blue;

    return (
        <Card className={cn("group relative border shadow-none rounded-xl transition-all hover:shadow-md", config.border, config.bg)}>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className={cn("text-[11px] font-bold tracking-tight", config.text)}>{label}</span>
                    <div className="flex items-center gap-2">
                        {formula && (
                            <div className="cursor-help relative group/tooltip">
                                <Info size={16} className={cn("transition-colors", config.text)} />
                                <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-72 p-4 bg-white border shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-[100] rounded-xl border-slate-100 pointer-events-none mb-2">
                                    <div className="space-y-3 font-sans">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formula</p>
                                            <p className="text-[12px] font-bold text-slate-800 leading-tight">{formula.main}</p>
                                        </div>
                                        {formula.where && (
                                            <div className="pt-2 border-t border-slate-50 space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Where</p>
                                                <div className="space-y-1">
                                                    {formula.where.map((item, i) => (
                                                        <p key={i} className="text-[10px] font-medium text-slate-500 leading-tight">
                                                            • {item}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className={cn("text-5xl font-bold tabular-nums tracking-tighter leading-none text-slate-800")}>{value}</h2>
                    <p className={cn("text-[11px] font-semibold opacity-60 tracking-tight text-slate-500")}>{sublabel}</p>
                    {action && (
                        <p 
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick && onClick();
                            }}
                            className={cn("text-[11px] font-bold underline underline-offset-4 cursor-pointer transition-all mt-4 hover:opacity-70", config.text)}
                        >
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'pitch' or 'sexting'
    const [selectedReason, setSelectedReason] = useState("Possible but Not Executed");

    const openModal = (type, initialReason = "Possible but Not Executed") => {
        setActiveModal(type);
        if (type === 'pitch') {
            setSelectedReason(initialReason);
        }
        setIsModalOpen(true);
    };

    const {
        sellable = 0,
        total_audits = 0,
        pitched = 0,
        pitch_not_possible_audits = [],
        pitch_possible_not_executed_audits = [],
        all_not_pitched_audits = [],
        sexting_pitched = 0,
        sexting_sale_no = 0,
        sexting_sale_no_audits = [],
        total_sales = 0,
        sexting_sale_yes = 0,
        prerecorded_sale_yes = 0,
        prerecorded_pitched = 0,
        sexting_sub_continued = 0,
        upsell_attempted = 0,
        upsell_purchased = 0,
        aftercare_yes = 0,
        transition_yes = 0,
    } = stats || {};

    const calcRate = (part, total) => {
        if (!total || total === 0) return "0.0%";
        return ((part / total) * 100).toFixed(1) + "%";
    };

    const currentStats = [
        {
            label: "Conversion Rate",
            value: calcRate(sellable, total_audits),
            sublabel: "Sellable / Total Conversations",
            theme: "blue",
            icon: Target,
            formula: {
                main: `(${sellable} Sellable ÷ ${total_audits} Total) × 100`,
                where: ["Sellable = Conversations with clear sales intent", "Total = Every conversation audited"]
            }
        },
        {
            label: "Pitch Rate",
            value: calcRate(pitched, sellable),
            sublabel: "Pitched / Sellable Conversations",
            action: `Click to view ${all_not_pitched_audits.length} not pitched`,
            theme: "purple",
            icon: Zap,
            onClick: () => openModal('pitch'),
            formula: {
                main: `(${pitched} Ptd. ÷ ${sellable} Slb.) × 100`,
                where: ["Pitched = Conversations where a product was offered", "Sellable = Total conversations with sales intent"]
            }
        },
        {
            label: "Sexting Sales Rate",
            value: calcRate(sexting_sale_yes, sexting_pitched),
            sublabel: "Sexting Sales / Sexting Pitched",
            action: `Click to view failed sales`,
            theme: "green",
            icon: TrendingUp,
            onClick: () => openModal('sexting'),
            formula: {
                main: `(${sexting_sale_yes} Sales ÷ ${sexting_pitched} Pitched) × 100`,
                where: ["Sales = Content Type: Sexting AND Sale: Yes", "Pitched = Content Type Pitched: Sexting"]
            }
        },
        {
            label: "Pre-recorded Sales Rate",
            value: calcRate(prerecorded_sale_yes, prerecorded_pitched),
            sublabel: "PPV Sales / PPV Pitched",
            action: `Click to view failed sales`,
            theme: "lime",
            icon: PlayCircle,
            formula: {
                main: `(${prerecorded_sale_yes} Sales ÷ ${prerecorded_pitched} Pitched) × 100`,
                where: ["Sales = Successful PPV transaction", "Pitched = PPV was offered/pitched"]
            }
        },
        {
            label: "Sexting Continuation Rate",
            value: calcRate(sexting_sub_continued, sexting_sale_yes),
            sublabel: "Continued / Sexting Sales",
            action: `Click to view not continued`,
            theme: "orange",
            icon: Repeat,
            formula: {
                main: `(${sexting_sub_continued} Continued ÷ ${sexting_sale_yes} Sold) × 100`,
                where: ["Continued = User stayed after initial sale", "Sold = Initial sexting sale made"]
            }
        },
        {
            label: "Upsell Attempt Rate",
            value: calcRate(upsell_attempted, prerecorded_pitched),
            sublabel: "Upsell Attempts / First PPV Sales",
            action: `Click to view not attempted`,
            theme: "cyan",
            icon: ArrowUpCircle,
            formula: {
                main: `(${upsell_attempted} Attempts ÷ ${prerecorded_pitched} First PPV) × 100`,
                where: ["Attempts = Second offer made after first PPV", "First PPV = Initial PPV sales count"]
            }
        },
        {
            label: "Upsell Conversion Rate",
            value: calcRate(upsell_purchased, upsell_attempted),
            sublabel: "Upsell Purchased / Upsell Attempted",
            action: `Click to view failed attempts`,
            theme: "amber",
            icon: DollarSign,
            formula: {
                main: `(${upsell_purchased} Purchased ÷ ${upsell_attempted} Attempted) × 100`,
                where: ["Purchased = Successful upsell transaction", "Attempted = Total upsell offers made"]
            }
        },
        {
            label: "Aftercare Provided Rate",
            value: calcRate(aftercare_yes, total_sales),
            sublabel: "Aftercare / Total Sales",
            action: `Click to view without aftercare`,
            theme: "indigo",
            icon: Activity,
            formula: {
                main: `(${aftercare_yes} Yes ÷ ${total_sales} Sales) × 100`,
                where: ["Aftercare = Post-sale engagement provided", "Total Sales = Sum of all successful transactions"]
            }
        },
        {
            label: "Casual Before Sexual Rate",
            value: calcRate(transition_yes, sellable),
            sublabel: "Casual Conversation: Yes / Total Sellable",
            theme: "rose",
            icon: Heart,
            formula: {
                main: `(${transition_yes} Casual Conversation: Yes ÷ ${sellable} Total Sellable) × 100`,
                where: ["Yes = Conversations with casual transition", "Total Sellable = All conversations with intent"]
            }
        },
    ];

    const isSexting = activeModal === 'sexting';
    const auditsToShow = isSexting 
        ? (stats?.sexting_sale_no_audits || []) 
        : (selectedReason === "Possible but Not Executed" ? (stats?.pitch_possible_not_executed_audits || []) : (stats?.pitch_not_possible_audits || []));

    const modalNumerator = isSexting 
        ? (stats?.sexting_sale_no || 0) 
        : (selectedReason === "Possible but Not Executed" ? (stats?.pitch_possible_not_executed_audits?.length || 0) : (stats?.pitch_not_possible_audits?.length || 0));
    
    const modalDenominator = isSexting ? (stats?.sellable || 0) : (stats?.sellable || 0);
    const title = isSexting ? "Sexting Sale: No - Details" : "Not Pitched - Details";
    const subtitle = isSexting
        ? "Summary of audits where sexting was pitched but no sale occurred."
        : "Review of sellable conversations that lacked a product pitch.";

    return (
        <div className="space-y-12">
            <AuditDrillDownModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                subtitle={subtitle}
                audits={auditsToShow}
                numerator={modalNumerator}
                denominator={modalDenominator}
                tabs={!isSexting ? [
                    { 
                        label: "Possible but Not Executed", 
                        count: stats?.pitch_possible_not_executed_audits?.length || 0, 
                        value: "Possible but Not Executed", 
                        active: selectedReason === "Possible but Not Executed" 
                    },
                    { 
                        label: "Not Possible", 
                        count: stats?.pitch_not_possible_audits?.length || 0, 
                        value: "Not Possible", 
                        active: selectedReason === "Not Possible" 
                    }
                ] : []}
                onTabChange={(val) => setSelectedReason(val)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStats.map((stat, i) => (
                    <FaultCard key={i} {...stat} />
                ))}
            </div>
        </div>
    );
}
