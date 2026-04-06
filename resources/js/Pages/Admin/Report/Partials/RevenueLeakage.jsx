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
    // Mathematical Logic based on user's defined multipliers
    const sexting_no_sale_count = stats?.sexting_no_sale || 0;
    const sexting_abandoned_count = stats?.sexting_abandoned || 0;
    const ppv_no_sale_count = stats?.ppv_no_sale || 0;
    const upsell_lost_count = stats?.upsell_lost || 0;
    const upsell_failed_count = stats?.upsell_failed || 0;
    const aftercare_missed_count = stats?.aftercare_missed || 0;

    // Loss Calculations - Using the user's specific mathematical logic
    const loss_sexting_no_sale = sexting_no_sale_count * 12;
    const loss_sexting_abandoned = sexting_abandoned_count * 175;
    const loss_ppv_no_sale = ppv_no_sale_count * 50;
    const loss_upsell_lost = upsell_lost_count * 50;
    const loss_upsell_failed = upsell_failed_count * 50;
    const loss_aftercare = aftercare_missed_count * 40;

    const total_loss = 
        loss_sexting_no_sale + 
        loss_sexting_abandoned + 
        loss_ppv_no_sale + 
        loss_upsell_lost + 
        loss_upsell_failed + 
        loss_aftercare;

    const formatCurrency = (num) => `-$${num.toLocaleString()}`;

    return (
        <Card className="border-2 border-rose-400 bg-rose-50/70 shadow-sm overflow-hidden">
            <CardContent className="p-0 space-y-0">
                <LeakageRow 
                    label="Sexting - No sale (paywall)" 
                    detail={`${sexting_no_sale_count} missed`} 
                    amount={formatCurrency(loss_sexting_no_sale)} 
                />
                <LeakageRow 
                    label="Sexting - Subscriber didn't continue" 
                    detail={`${sexting_abandoned_count} abandoned`} 
                    amount={formatCurrency(loss_sexting_abandoned)} 
                />
                <LeakageRow 
                    label="Pre-recorded PPV - No sale" 
                    detail={`${ppv_no_sale_count} missed`} 
                    amount={formatCurrency(loss_ppv_no_sale)} 
                />
                <LeakageRow 
                    label="Upsell opportunity lost" 
                    detail={`${upsell_lost_count} not upsold`} 
                    amount={formatCurrency(loss_upsell_lost)} 
                />
                <LeakageRow 
                    label="Upsell attempted but failed" 
                    detail={`${upsell_failed_count} failed`} 
                    amount={formatCurrency(loss_upsell_failed)} 
                />
                <LeakageRow 
                    label="Aftercare not provided" 
                    detail={`${aftercare_missed_count} sales at risk`} 
                    amount={formatCurrency(loss_aftercare)} 
                />
            </CardContent>

            <CardFooter className="bg-rose-100/60 p-8 flex items-center justify-between border-t-2 border-rose-200/50">
                <span className="text-[14px] font-black text-rose-900 tracking-tight">Total revenue lost</span>
                <span className="text-5xl font-black text-rose-800 tracking-tighter tabular-nums">{formatCurrency(total_loss)}</span>
            </CardFooter>
        </Card>
    );
}
