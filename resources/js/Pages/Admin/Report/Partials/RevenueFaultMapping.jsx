import React from "react";
import { TrendingUp, TrendingDown, Minus, Layers } from "lucide-react";

const FaultCard = ({
    title,
    rate,
    subtitle,
    color = "blue",
    delta,
    isNumber = false,
}) => {
    const themes = {
        blue: "bg-blue-50 text-blue-700 border-blue-100 shadow-blue-500/10",
        purple: "bg-purple-50 text-purple-700 border-purple-100 shadow-purple-500/10",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10",
        amber: "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-500/10",
        orange: "bg-orange-50 text-orange-700 border-orange-100 shadow-orange-500/10",
        cyan: "bg-cyan-50 text-cyan-700 border-cyan-100 shadow-cyan-500/10",
        rose: "bg-rose-50 text-rose-700 border-rose-100 shadow-rose-500/10",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-500/10",
        teal: "bg-teal-50 text-teal-700 border-teal-100 shadow-teal-500/10",
        violet: "bg-violet-50 text-violet-700 border-violet-100 shadow-violet-500/10",
        fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100 shadow-fuchsia-500/10",
    };

    const theme = themes[color] || themes.blue;

    return (
        <div className={`p-8 md:p-10 rounded-[3rem] border min-h-[180px] flex flex-col justify-between transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 active:scale-95 cursor-default group shadow-sm ${theme}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 leading-none mb-4 h-4">
                        {title}
                    </h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter leading-none tabular-nums">
                            {formatNumber(rate)}
                        </span>
                        {!isNumber && <span className="text-xl font-bold opacity-60">%</span>}
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-2xl bg-white/60 shadow-lg shadow-black/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12`}>
                   <Layers size={18} strokeWidth={2.5} />
                </div>
            </div>

            <p className="text-[11px] font-black uppercase tracking-[0.05em] opacity-80 leading-snug mt-6 group-hover:opacity-100 transition-opacity">
                {subtitle}
            </p>
        </div>
    );
};

const formatNumber = (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return val;
    return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

export default function RevenueFaultMapping({ stats }) {
    const faults = [
        { title: "SELLABLE TO CASUAL", rate: stats?.ratios?.sellable_to_casual || 66.1, subtitle: "SUCCESS RATE OF TRANSITION", color: "blue" },
        { title: "SELLABLE TO SEX", rate: stats?.ratios?.sellable_to_sex || 82.3, subtitle: "DIRECT SEXUAL TRANSITION", color: "purple" },
        { title: "ASSISTED TO CARE", rate: stats?.ratios?.assisted_to_care || 56.1, subtitle: "ASSISTANCE SUCCESS RATE", color: "emerald" },
        { title: "ASSISTANCE REQUIRE", rate: stats?.ratios?.assistance_require || 66.7, subtitle: "SUPPORT INTERVENTION FREQ", color: "orange" },
        { title: "SELLING TO SPENT", rate: stats?.ratios?.selling_to_spent || 62.9, subtitle: "MONETIZATION EFFICIENCY", color: "amber" },
        { title: "SELLABLE TO YES", rate: stats?.ratios?.sellable_to_yes || 42.1, subtitle: "AFFIRMATIVE RESPONSE RATE", color: "teal" },
        { title: "NEGOTIATED TO SPENT", rate: stats?.ratios?.negotiated_to_spent || 54.2, subtitle: "CLOSING SUCCESS RATE", color: "cyan" },
        { title: "CASUAL TO UNDER", rate: stats?.ratios?.casual_to_underwear || 86.4, subtitle: "VISUAL INTENT CONVERSION", color: "violet" },
        { title: "CASUAL TO CARE", rate: stats?.ratios?.casual_to_care || 81.4, subtitle: "OVERALL JOURNEY COMPLETION", color: "rose" },
    ];

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {faults.map((fault, idx) => (
                    <FaultCard key={idx} {...fault} />
                ))}
            </div>

            {/* Weekly Comparison Trend Section */}
            <div className="bg-slate-50/50 rounded-[3.5rem] p-1.5 border border-slate-200/40 mt-12 animate-in fade-in zoom-in-95 duration-1000">
                <div className="bg-white rounded-[3.3rem] p-12 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden group/trend">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200/50">
                                    <TrendingUp size={20} className="text-blue-600" />
                                </div>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase">WEEKLY TREND COMPARISON</h4>
                            </div>
                            <p className="text-slate-500 max-w-lg text-sm font-medium uppercase tracking-[0.05em] h-5 opacity-60">VARIANCE ANALYSIS AGAINST PREVIOUS REPORTING PERIODS</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'CURRENT WEEK', val: '94.2%', delta: '+2.4%', color: 'text-blue-600' },
                            { label: 'PREVIOUS WEEK', val: '91.8%', delta: '-1.2%', color: 'text-slate-500' },
                            { label: 'MONTHLY AVG', val: '89.5%', delta: '+4.7%', color: 'text-slate-500' },
                            { label: 'TARGET KPI', val: '95.0%', delta: 'COMPLIANT', color: 'text-emerald-600' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group/subcard">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 leading-none h-4">{item.label}</p>
                                <div className="flex items-end justify-between gap-4">
                                    <span className={`text-4xl font-black ${item.color} tracking-tighter tabular-nums leading-none`}>{item.val}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${item.color === 'text-blue-600' ? 'bg-blue-50 text-blue-600' : item.color === 'text-emerald-600' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {item.delta}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
