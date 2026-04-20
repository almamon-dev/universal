import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import AuditDrillDownModal from "./AuditDrillDownModal";

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
                            <span className="ml-2 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity tracking-tighter">
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

export default function SellableFlow({ stats }) {
    const [activeModal, setActiveModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Config mapping for Unified Modal
    const typeConfig = {
        notPossible: {
            title: "Pitch Not Possible",
            subtext: "Sellable conversations where the pitch was not possible",
            audits: stats?.pitch_not_possible_audits || [],
            denominator: sellable_count
        },
        possibleNotExecuted: {
            title: "Pitch Possible Not Executed",
            subtext: "Sellable conversations where the pitch was possible but not executed",
            audits: stats?.pitch_possible_not_executed_audits || [],
            denominator: sellable_count
        },
        sextingSaleNo: {
            title: "Sexting Sale: No",
            subtext: "Sexting pitched but no sale made",
            audits: stats?.sexting_sale_no_audits || [],
            denominator: sexting_pitched
        },
        sextingSubAbandoned: {
            title: "Sexting Continued: No",
            subtext: "Sexting purchased but subscriber did not continue",
            audits: stats?.sexting_sub_abandoned_audits || [],
            denominator: sexting_sale_yes
        },
        prerecordedSaleNo: {
            title: "Pre-recorded Sale: No",
            subtext: "Pre-recorded pitched but no sale made",
            audits: stats?.prerecorded_sale_no_audits || [],
            denominator: prerecorded_pitched
        },
        upsellNo: {
            title: "Upsell Not Purchased",
            subtext: "Upsell attempted but not purchased",
            audits: stats?.upsell_no_audits || [],
            denominator: upsell_attempted
        },
        sextingPitched: {
            title: "Sexting Pitches",
            subtext: "Total audits identified as Sexting content",
            audits: stats?.sexting_pitched_audits || [],
            denominator: sellable_count
        },
        prerecordedPitched: {
            title: "Pre-recorded Pitches",
            subtext: "Total audits identified as Pre-recorded/PPV content",
            audits: stats?.prerecorded_pitched_audits || [],
            denominator: sellable_count
        }
    };

    const modalData = activeModal ? typeConfig[activeModal] : null;

    const openModal = (type) => {
        setActiveModal(type);
        setIsModalOpen(true);
    };

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <AuditDrillDownModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData?.title}
                subtitle={modalData?.subtext}
                audits={modalData?.audits || []}
                numerator={modalData?.audits?.length || 0}
                denominator={modalData?.denominator || 0}
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
                            onClick={() => openModal("notPossible")}
                        />
                        <TreeNode
                            label="Pitch possible but not executed"
                            value={pitch_possible_not_executed}
                            color="red"
                            subtext
                            onClick={() => openModal("possibleNotExecuted")}
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
                            onClick={() => openModal("sextingPitched")}
                        />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode
                                label="Sale: No"
                                value={sexting_sale_no}
                                color="red"
                                onClick={() => openModal("sextingSaleNo")}
                            />
                            <TreeNode label="Sale: Yes" value={sexting_sale_yes} color="green" />
                            <div className="ml-6 border-l border-slate-100 pl-4">
                                <TreeNode label="Sub continued: Yes" value={sexting_sub_continued} color="green" />
                                <TreeNode
                                    label="Sub continued: No"
                                    value={stats?.sexting_sub_abandoned || 0}
                                    color="red"
                                    onClick={() => openModal("sextingSubAbandoned")}
                                />
                            </div>
                        </div>

                        <TreeNode
                            label="Pre-recorded pitched"
                            value={prerecorded_pitched}
                            color="slate"
                            indent={0}
                            onClick={() => openModal("prerecordedPitched")}
                        />
                        <div className="ml-6 space-y-0.5 border-l border-slate-100 pl-4 pb-2">
                            <TreeNode
                                label="Sale: No"
                                value={prerecorded_sale_no}
                                color="red"
                                onClick={() => openModal("prerecordedSaleNo")}
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
                                        onClick={() => openModal("upsellNo")}
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
