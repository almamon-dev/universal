import React from "react";
import { Download, Search, ChevronDown, LayoutDashboard, Database, Activity } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function ReportHeader({ agency }) {
    if (!agency) return null;

    return (
        <div className="bg-white border-b border-slate-200/60 sticky top-0 z-50 shadow-sm transition-all duration-300">
            {/* Very Top Brand Bar */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href={route('admin.dashboard')} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 group">
                        <LayoutDashboard size={22} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                </div>

                {/* Centered Logo */}
                <div className="flex flex-col items-center gap-2 leading-none">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-blue-500/20 transform hover:rotate-6 transition-transform">
                         <Activity size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 leading-none mt-2">
                        UNIVERSAL PERFORMANCE
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2.5 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                        <Download size={14} strokeWidth={3} />
                        DOWNLOAD
                    </button>
                </div>
            </div>

            {/* Filter & Sub-nav Area */}
            <div className="bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center gap-6">
                    {/* Selectors */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex-1 md:flex-initial min-w-[340px]">
                        <div className="flex items-center gap-3 px-4 border-r border-slate-100 py-1">
                             <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Database size={11} className="text-slate-400" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">AGENCY</span>
                                <div className="flex items-center gap-1.5 cursor-pointer">
                                    <span className="text-[11px] font-black text-slate-900 truncate max-w-[140px] uppercase tracking-tighter">{agency.name}</span>
                                    <ChevronDown size={14} className="text-blue-500" />
                                </div>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-1">
                             <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Search size={11} className="text-slate-400" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">PERFORMER</span>
                                <div className="flex items-center gap-1.5 cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">SELECT ALL</span>
                                    <ChevronDown size={14} className="text-slate-300" />
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-[1.4rem] ml-auto overflow-x-auto no-scrollbar">
                        <Link
                            href={route("admin.report.weekly", agency?.id)}
                            className="px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 transition-all whitespace-nowrap"
                        >
                            WEEKLY QUALITY CONTROL REPORT
                        </Link>
                        <button className="px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl text-slate-500 hover:text-slate-900 transition-all whitespace-nowrap">
                            AGENCY WISE REPORT
                        </button>
                        <button className="px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl text-slate-500 hover:text-slate-900 transition-all whitespace-nowrap">
                            COMMUNITY WISE REPORT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
