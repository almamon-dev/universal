import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import SellableFlow from "./SellableFlow";

const AuditorCard = ({ name, count }) => (
    <div className="flex-1 bg-white p-5 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md group">
        <p className="text-[10px] font-bold text-slate-400 capitalize mb-1 group-hover:text-slate-600 transition-colors">{name}</p>
        <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{count}</span>
    </div>
);

const MetricCard = ({ label, count, formula, theme = "emerald" }) => {
    const statusColors = {
        emerald: "bg-emerald-500",
        rose: "bg-rose-500",
        blue: "bg-blue-500",
    };
    return (
        <Card className="flex-1 shadow-sm border border-slate-100 bg-white overflow-hidden group hover:shadow-md transition-all relative">
            <div className={cn("h-1 w-full", statusColors[theme])} />
            <CardContent className="p-6 pt-5 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 lowercase first-letter:uppercase">{label}</p>
                <h4 className="text-4xl font-black tracking-tighter tabular-nums leading-none text-slate-900">{count}</h4>

                {formula && (
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 absolute bottom-3 right-4 bg-slate-900/90 text-[9px] text-white px-3 py-1.5 rounded shadow-xl border border-white/10 backdrop-blur-sm whitespace-nowrap">
                        <span className="text-slate-400 font-medium mr-1">Formula:</span> {formula}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function ExecutiveSnapshot({ stats }) {
    const total_audits = stats?.total_audits || 165;
    const sellable = stats?.sellable || 100;
    const non_sellable = stats?.non_sellable || 65;

    return (
        <div className="space-y-10">
            {/* AUDIT VOLUME */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700">Audit volume</p>
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-8 space-y-8">
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{total_audits}</span>
                        <span className="text-xs font-bold text-slate-400 lowercase first-letter:uppercase">Total audits</span>
                    </div>

                    <div className="flex gap-4">
                        <AuditorCard name="rosemarie" count={12} />
                        <AuditorCard name="oscar" count={42} />
                        <AuditorCard name="ojay" count={111} />
                    </div>
                </div>
            </div>

            {/* CONVERSATION CLASSIFICATION */}
            <div className="space-y-4">
                <p className="text-md font-bold text-slate-700">Conversation classification</p>
                <div className="flex gap-6">
                    <MetricCard label="Sellable" count={sellable} theme="emerald" />
                    <MetricCard label="Non-sellable" count={non_sellable} theme="rose" />
                </div>
            </div>

            {/* SELLABLE CONVERSATION FLOW (Under Classification per request) */}
            <div className="space-y-4">
                <p className="text-md font-bold text-slate-700">Sellable conversation flow</p>
                <SellableFlow stats={stats} />
            </div>
        </div>
    );
}
