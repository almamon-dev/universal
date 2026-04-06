import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const ClassificationCard = ({ label, count, action, theme = "slate" }) => {
    const statusColors = {
        emerald: "bg-emerald-500",
        rose: "bg-rose-500",
        cyan: "bg-cyan-500",
        amber: "bg-amber-500",
        indigo: "bg-[#6366F1]",
        slate: "bg-slate-400",
        violet: "bg-violet-500",
    };

    return (
        <Card className="flex-1 shadow-sm border border-slate-100 bg-white relative transition-all hover:shadow-md group overflow-hidden">
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", statusColors[theme] || statusColors.slate)} />
            <CardContent className="p-5 pb-6 space-y-4 text-left">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 lowercase first-letter:uppercase">{label}</p>
                    <h4 className="text-3xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">{count}</h4>
                </div>
                {action && (
                    <p className="text-[9px] font-bold text-slate-400 underline underline-offset-4 cursor-pointer hover:text-slate-600 transition-colors lowercase first-letter:uppercase">
                        {action}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

const SectionRow = ({ title, children }) => (
    <div className="space-y-4">
        <p className="text-md font-bold text-slate-700">{title}</p>
        <div className="flex gap-6">
            {children}
        </div>
    </div>
);

export default function UnitVolume({ stats }) {
    // Dynamic mapping from stats prop
    const fresh_subs = stats?.fresh_subs || 0;
    const old_subs = stats?.old_subs || 0;
    
    const transition_yes = stats?.transition_yes || 0;
    const transition_no = stats?.transition_no || 0;
    
    const negotiation_yes = stats?.negotiation_yes || 0;
    const negotiation_no = stats?.negotiation_no || 0;
    
    const aftercare_yes = stats?.aftercare_yes || 0;
    const aftercare_no = stats?.aftercare_no || 0;
    
    const help_requested_yes = stats?.help_requested_yes || 0;
    const help_requested_no = stats?.help_requested_no || 0;
    
    const rule_violations_yes = stats?.rule_violations_yes || 0;
    const rule_violations_no = stats?.rule_violations_no || 0;

    return (
        <div className="space-y-10">
            <SectionRow title="Subscriber type">
                <ClassificationCard label="New sub (1 day)" count={fresh_subs} theme="cyan" />
                <ClassificationCard label="Old sub (2 days +)" count={old_subs} theme="indigo" />
            </SectionRow>

            <SectionRow title="Casual to sexual transition (sellable conversations)">
                <ClassificationCard label="Yes" count={transition_yes} theme="emerald" />
                <ClassificationCard label="No (click for details)" count={transition_no} theme="rose" />
            </SectionRow>

            <SectionRow title="Negotiation discipline (sellable conversations)">
                <ClassificationCard label="Yes" count={negotiation_yes} theme="emerald" />
                <ClassificationCard label="No" count={negotiation_no} theme="rose" />
            </SectionRow>

            <SectionRow title="Aftercare provided (pillow talk)">
                <ClassificationCard label="Yes" count={aftercare_yes} theme="emerald" />
                <ClassificationCard label="No" count={aftercare_no} theme="rose" />
            </SectionRow>

            <SectionRow title="Chatter requested help (sellable conversations)">
                <ClassificationCard label="Yes" count={help_requested_yes} theme="amber" />
                <ClassificationCard label="No" count={help_requested_no} theme="slate" />
            </SectionRow>

            <SectionRow title="Rule violations (sellable conversations)">
                <ClassificationCard label="Yes" count={rule_violations_yes} theme="rose" action="Click to view details" />
                <ClassificationCard label="No" count={rule_violations_no} theme="emerald" />
            </SectionRow>
        </div>
    );
}
