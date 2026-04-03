import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const LeakageRow = ({ label, detail, amount }) => (
    <div className="flex items-center justify-between py-6 border-b border-rose-200/50 last:border-0 hover:bg-rose-100/20 px-6 transition-colors">
        <div className="flex-1">
            <p className="text-[13px] font-bold text-rose-800 leading-none">{label}</p>
        </div>
        <div className="text-right flex flex-col gap-1">
            <p className="text-[11px] font-bold text-slate-500 italic opacity-80">{detail}</p>
            <p className="text-2xl font-black text-rose-700 tabular-nums tracking-tighter leading-none">
                {amount}
            </p>
        </div>
    </div>
);

export default function RevenueLeakage({ stats }) {
    return (
        <Card className="border-2 border-rose-400 bg-rose-50/70 shadow-sm overflow-hidden">
            <CardContent className="p-0 space-y-0">
                <LeakageRow label="Sexting - No sale (paywall)" detail="21 missed" amount="-$252" />
                <LeakageRow label="Sexting - Subscriber didn't continue" detail="18 abandoned" amount="-$3,150" />
                <LeakageRow label="Pre-recorded PPV - No sale" detail="15 missed" amount="-$750" />
                <LeakageRow label="Upsell opportunity lost" detail="30 not upsold" amount="-$1,500" />
                <LeakageRow label="Upsell attempted but failed" detail="11 failed" amount="-$550" />
                <LeakageRow label="Aftercare not provided" detail="4 sales at risk" amount="-$160" />
            </CardContent>

            <CardFooter className="bg-rose-100/60 p-8 flex items-center justify-between border-t-2 border-rose-200/50">
                <span className="text-[14px] font-black text-rose-900 tracking-tight">Total revenue lost</span>
                <span className="text-5xl font-black text-rose-800 tracking-tighter tabular-nums">-$6,362</span>
            </CardFooter>
        </Card>
    );
}
