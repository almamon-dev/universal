import React from "react";
import { Calendar, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function ReportHeader({ agency }) {
    if (!agency) return null;

    return (
        <div className="space-y-6 mb-8">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft
                        size={14}
                        className="group-hover:-translate-x-0.5 transition-transform"
                    />
                    Back to Dashboard
                </button>

                <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-black transition-all shadow-sm">
                    Generate Analysis
                    <ArrowUpRight size={14} />
                </button>
            </div>

            {/* Date Range Card */}
            <div className="bg-white rounded-md border border-[#E2E8F0] p-3 shadow-sm flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <Calendar size={18} className="text-[#64748B]" />
                    <div className="flex items-center gap-2.5">
                        <span className="text-[12px] font-bold text-[#64748B]">
                            Start Date:
                        </span>
                        <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-md px-2.5 py-1 bg-gray-50/50">
                            <span className="text-[12px] font-bold text-[#1E293B]">
                                02/10/2026
                            </span>
                            <Calendar size={12} className="text-[#94A3B8]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 ml-2">
                        <span className="text-[12px] font-bold text-[#64748B]">
                            End Date:
                        </span>
                        <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-md px-2.5 py-1 bg-gray-50/50">
                            <span className="text-[12px] font-bold text-[#1E293B]">
                                02/17/2026
                            </span>
                            <Calendar size={12} className="text-[#94A3B8]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Type Tabs */}
            <div className="bg-white rounded-md border border-slate-200 p-3 shadow-sm grid grid-cols-3 gap-3">
                <Link
                    href={route("admin.report.weekly", agency?.id)}
                    className="py-2.5 text-center text-xs font-bold rounded-md bg-[#2563EB] text-white shadow-sm transition-all"
                >
                    Weekly Quality Control Report
                </Link>
                <button className="py-2.5 text-center text-xs font-medium rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                    Chatter Audit Report
                </button>
                <button className="py-2.5 text-center text-xs font-medium rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                    Creator Audit Report
                </button>
            </div>
        </div>
    );
}
