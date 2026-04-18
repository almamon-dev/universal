import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const AuditorCard = ({ name, count }) => (
    <div className="flex-1 bg-white p-3 rounded-md border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
        <p className="text-[9px] font-bold text-slate-400 tracking-tight mb-1">{name}</p>
        <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{count}</span>
    </div>
);

export default function QCInterventionActivity({ stats }) {
    const total_interventions = stats?.total_interventions || 0;
    const auditor_qc_stats = stats?.auditor_stats || []; // Use auditor_stats from stats

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-md p-6 space-y-6 shadow-sm">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-slate-900 tracking-tight leading-none">{total_interventions}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">Total Interventions</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {auditor_qc_stats.map((auditor, idx) => (
                        <AuditorCard key={idx} name={auditor.name} count={auditor.interventions} />
                    ))}
                </div>
            </div>
        </div>
    );
}
