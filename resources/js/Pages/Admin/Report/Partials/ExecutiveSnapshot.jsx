import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import SellableFlow from "./SellableFlow";

const AuditorCard = ({ name, count }) => (
    <div className="flex-1 bg-white p-3 rounded-md border border-slate-100 shadow-sm transition-all hover:bg-slate-50 group">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
        <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{count}</span>
    </div>
);

const MetricCard = ({ label, count, theme = "emerald" }) => {
    const statusColors = {
        emerald: { bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-600" },
        rose: { bg: "bg-rose-50/50", border: "border-rose-100", text: "text-rose-600" },
        blue: { bg: "bg-blue-50/50", border: "border-blue-100", text: "text-blue-600" },
    };
    const config = statusColors[theme] || statusColors.blue;
    
    return (
        <Card className={cn("flex-1 shadow-none border rounded-md overflow-hidden transition-all", config.border, config.bg)}>
            <CardContent className="p-4 space-y-1">
                <p className={cn("text-[10px] font-black uppercase tracking-wider", config.text)}>{label}</p>
                <h4 className={cn("text-3xl font-black tabular-nums leading-none", config.text)}>{count}</h4>
            </CardContent>
        </Card>
    );
};

export default function ExecutiveSnapshot({ stats }) {
    const total_audits = stats?.total_audits || 0;
    const sellable = stats?.sellable || 0;
    const non_sellable = stats?.non_sellable || 0;
    const auditor_stats = stats?.auditor_stats || [];

    return (
        <div className="space-y-6">
            {/* AUDIT VOLUME */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit volume</p>
                <div className="bg-white border border-slate-100 rounded-md p-6 space-y-6">
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight leading-none">{total_audits}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Audits</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {auditor_stats.map((auditor, idx) => (
                            <AuditorCard key={idx} name={auditor.name} count={auditor.count} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CONVERSATION CLASSIFICATION */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversation classification</p>
                <div className="flex gap-4">
                    <MetricCard label="Sellable" count={sellable} theme="emerald" />
                    <MetricCard label="Non-sellable" count={non_sellable} theme="rose" />
                </div>
            </div>

            {/* SELLABLE CONVERSATION FLOW */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sellable conversation flow</p>
                <SellableFlow stats={stats} />
            </div>
        </div>
    );
}
