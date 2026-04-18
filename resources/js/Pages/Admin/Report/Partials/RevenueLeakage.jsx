import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const LeakageRow = ({ label, detail, amount, formula }) => (
    <div className="group relative flex items-center justify-between py-6 border-b border-rose-200/50 last:border-0 hover:bg-rose-100/20 px-6 transition-colors cursor-help">
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <p className="text-[13px] font-bold text-rose-800 leading-none">{label}</p>
                <span className="text-[11px] text-zinc-400 font-medium lowercase">
                    (hover for formula)
                </span>
            </div>
        </div>
        <div className="text-right flex flex-col gap-1">
            <p className="text-[11px] font-bold text-slate-500 italic opacity-80">{detail}</p>
            <p className="text-2xl font-black text-rose-700 tabular-nums tracking-tighter leading-none">
                {amount}
            </p>
        </div>

        {/* Formula Tooltip - Centered in the row */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-white border border-slate-900 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] whitespace-nowrap pointer-events-none">
            <p className="text-[12px] text-zinc-950 font-black">
                Formula: {formula}
            </p>
        </div>
    </div>
);

export default function RevenueLeakage({ stats, agency }) {
    // Multipliers from Agency Configuration
    const m_paywall = Number(agency?.first_paywall_sexting) || 12;
    const m_sequence_full = Number(agency?.avg_completed_sexting_sequence) || 350;
    const m_sequence_50 = m_sequence_full * 0.5; // We use 50% of the sequence value
    const m_ppv = Number(agency?.avg_recorded_ppv) || 50;
    const m_upsell = m_ppv; // Upsell value follows the PPV price
    const m_aftercare = 40;

    // Mathematical Logic based on user's defined multipliers
    const sexting_no_sale_count = stats?.sexting_no_sale || 0;
    const sexting_abandoned_count = stats?.sexting_abandoned || 0;
    const ppv_no_sale_count = stats?.ppv_no_sale || 0;
    const upsell_lost_count = stats?.upsell_lost || 0;
    const upsell_failed_count = stats?.upsell_failed || 0;
    const aftercare_missed_count = stats?.aftercare_missed || 0;

    // Loss Calculations
    const loss_sexting_no_sale = sexting_no_sale_count * m_paywall;
    const loss_sexting_abandoned = sexting_abandoned_count * m_sequence_50;
    const loss_ppv_no_sale = ppv_no_sale_count * m_ppv;
    const loss_upsell_lost = upsell_lost_count * m_upsell;
    const loss_upsell_failed = upsell_failed_count * m_upsell;
    const loss_aftercare = aftercare_missed_count * m_aftercare;

    const total_loss = 
        loss_sexting_no_sale + 
        loss_sexting_abandoned + 
        loss_ppv_no_sale + 
        loss_upsell_lost + 
        loss_upsell_failed + 
        loss_aftercare;

    const formatCurrency = (num) => `-$${num.toLocaleString()}`;

    return (
        <Card className="border-2 border-rose-400 bg-rose-50/70 shadow-sm relative">
            <CardContent className="p-0 space-y-0 relative">
                <LeakageRow 
                    label="Sexting - No sale (paywall)" 
                    detail={`${sexting_no_sale_count} missed`} 
                    amount={formatCurrency(loss_sexting_no_sale)} 
                    formula={`${sexting_no_sale_count} (missed sales/nego) × $${m_paywall} (first sexting paywall)`}
                />
                <LeakageRow 
                    label="Sexting - Subscriber didn't continue" 
                    detail={`${sexting_abandoned_count} abandoned`} 
                    amount={formatCurrency(loss_sexting_abandoned)} 
                    formula={`${sexting_abandoned_count} (sub didn't continue) × $${m_sequence_50} (50% of avg sexting sequence)`}
                />
                <LeakageRow 
                    label="Pre-recorded PPV - No sale" 
                    detail={`${ppv_no_sale_count} missed`} 
                    amount={formatCurrency(loss_ppv_no_sale)} 
                    formula={`${ppv_no_sale_count} (no sales) × $${m_ppv} (avg pre-recorded PPV)`}
                />
                <LeakageRow 
                    label="Upsell opportunity lost" 
                    detail={`${upsell_lost_count} not upsold`} 
                    amount={formatCurrency(loss_upsell_lost)} 
                    formula={`${upsell_lost_count} (not upsold) × $${m_upsell} (avg upsell value)`}
                />
                <LeakageRow 
                    label="Upsell attempted but failed" 
                    detail={`${upsell_failed_count} failed`} 
                    amount={formatCurrency(loss_upsell_failed)} 
                    formula={`${upsell_failed_count} (failed) × $${m_upsell} (avg upsell value)`}
                />
                <LeakageRow 
                    label="Aftercare not provided" 
                    detail={`${aftercare_missed_count} sales at risk`} 
                    amount={formatCurrency(loss_aftercare)} 
                    formula={`${aftercare_missed_count} sales × 20% refund/churn risk. Aftercare helps prevent refunds, chargebacks, and lost repeat customers.`}
                />
            </CardContent>

            <CardFooter className="bg-rose-100/60 p-8 flex items-center justify-between border-t-2 border-rose-200/50">
                <span className="text-[14px] font-bold text-rose-900 tracking-tight">Total revenue lost</span>
                <span className="text-5xl font-black text-rose-800 tracking-tighter tabular-nums">{formatCurrency(total_loss)}</span>
            </CardFooter>
        </Card>
    );
}
