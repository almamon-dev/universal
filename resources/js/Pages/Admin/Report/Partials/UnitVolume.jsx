import React from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Activity, ShieldCheck, ShieldAlert } from "lucide-react";

export default function UnitVolume({ stats }) {
    const passed = stats?.total_passed || 113;
    const failed = stats?.total_failed || 58;
    const total = passed + failed;
    
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 66;
    const failRate = total > 0 ? Math.round((failed / total) * 100) : 34;

    const items = [
        { label: "PASSED ITEMS", val: passed, rate: passRate, color: 'emerald', icon: ShieldCheck, delta: '+2.4%' },
        { label: "FAILED ITEMS", val: failed, rate: failRate, color: 'rose', icon: ShieldAlert, delta: '-1.4%' }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                {items.map((item, idx) => (
                    <div 
                        key={idx}
                        className={`bg-white rounded-[3rem] border p-10 md:p-14 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border-slate-100 relative overflow-hidden group/card`}
                    >
                        <div className={`absolute top-0 right-0 p-16 opacity-[0.02] transform transition-all group-hover/card:scale-125 duration-1000 rotate-12 pointer-events-none`}>
                            <item.icon size={220} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-12">
                                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center shadow-lg shadow-current/10 border border-${item.color}-500/20`}>
                                    <item.icon size={28} className={`text-${item.color}-500`} strokeWidth={3} />
                                </div>
                                <div className={`px-5 py-2 rounded-2xl bg-${item.color}-50 text-${item.color}-600 text-[10px] font-black uppercase tracking-[0.3em] h-5 border border-${item.color}-100`}>
                                    {item.label}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] h-3">AGGREGATE COUNT</h4>
                                <div className="flex items-end gap-5">
                                    <span className="text-7xl font-black text-slate-900 tracking-tighter leading-none tabular-nums shadow-sm drop-shadow-sm">{item.val}</span>
                                    <div className={`p-2.5 rounded-2xl bg-${item.color}-50 flex items-center gap-1.5 mb-1.5 border border-${item.color}-100 transition-transform duration-500 group-hover/card:scale-110 shadow-sm shadow-current/10`}>
                                         <span className={`text-xl font-black text-${item.color}-600 tabular-nums`}>{item.rate}%</span>
                                         {item.color === 'emerald' ? <ChevronUp size={18} className="text-emerald-500" strokeWidth={3} /> : <AnchorIcon icon={ChevronDown} color="rose" />}
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 mt-6 uppercase tracking-[0.1em] opacity-60">
                                    VARIANCE RELATIVE TO BASELINE: <span className={`text-${item.color}-600`}>{item.delta}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Audit Breakdown Area Table Placeholder */}
            <div className="bg-slate-50/50 rounded-[3.5rem] p-1.5 border border-slate-200/40 relative overflow-hidden group/breakdown">
                <div className="bg-white rounded-[3.3rem] overflow-hidden border border-slate-100 shadow-sm shadow-slate-200/50 transition-all hover:shadow-xl duration-700">
                    <div className="px-10 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                <Activity size={18} className="text-blue-500" />
                            </div>
                             <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest leading-none">AUDIT BREAKDOWN SUMMARY</h4>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm">STATUS • CATEGORY • SUB-CATEGORY • PERM</span>
                    </div>
                    
                    <div className="p-20 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
                         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0"></div>
                         <div className="relative z-10 w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-2xl shadow-blue-500/10 transform rotate-12 transition-transform group-hover/breakdown:rotate-0 duration-700">
                             <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
                                <Activity size={24} className="text-white" />
                             </div>
                         </div>
                         <p className="relative z-10 text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">DETAILED RECORDS PROCESSING INTERFACE...</p>
                         <div className="relative z-10 flex items-center justify-center gap-3">
                             {[1, 2, 3, 4, 5].map((i) => (
                                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/20 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AnchorIcon = ({ icon: Icon, color }) => (
    <Icon size={18} className={`text-${color}-500`} strokeWidth={3} />
);
