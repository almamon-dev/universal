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
    return (
        <div className="space-y-10">
            <SectionRow title="Subscriber type">
                <ClassificationCard label="New sub (1 day)" count={105} theme="cyan" />
                <ClassificationCard label="Old sub (2 days +)" count={60} theme="indigo" />
            </SectionRow>

            <SectionRow title="Casual to sexual transition (sellable conversations)">
                <ClassificationCard label="Yes" count={79} theme="emerald" />
                <ClassificationCard label="No (click for details)" count={21} theme="rose" />
            </SectionRow>

            <SectionRow title="Negotiation discipline (sellable conversations)">
                <ClassificationCard label="Yes" count={47} theme="emerald" />
                <ClassificationCard label="No" count={53} theme="rose" />
            </SectionRow>

            <SectionRow title="Aftercare provided (pillow talk)">
                <ClassificationCard label="Yes" count={25} theme="emerald" />
                <ClassificationCard label="No" count={4} theme="rose" />
            </SectionRow>

            <SectionRow title="Chatter requested help (sellable conversations)">
                <ClassificationCard label="Yes" count={24} theme="amber" />
                <ClassificationCard label="No" count={76} theme="slate" />
            </SectionRow>

            <SectionRow title="Rule violations (sellable conversations)">
                <ClassificationCard label="Yes" count={17} theme="rose" action="Click to view details" />
                <ClassificationCard label="No" count={83} theme="emerald" />
            </SectionRow>
        </div>
    );
}
