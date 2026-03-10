import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users, Activity } from "lucide-react";

export default function ExecutiveSnapshot({ stats }) {
    const chatters = stats?.chatter_stats || [];
    const [showAll, setShowAll] = useState(false);

    const displayedChatters = showAll ? chatters : chatters.slice(0, 4);

    return (
        <div className="space-y-6">
            {/* Header with total */}
            <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Activity size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            System Engagement
                        </p>
                        <h4 className="text-sm font-bold text-slate-800">
                            Audit Volume Overview
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
                        {stats?.total_audits || 0}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Units
                    </p>
                </div>
            </div>

            {/* Chatter grid */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Individual Performer Metrics
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayedChatters.length > 0 ? (
                        displayedChatters.map((chatter, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all group"
                            >
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors truncate">
                                    {chatter.name}
                                </p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">
                                    {chatter.count}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-8 text-[10px] font-bold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 uppercase tracking-widest">
                            No Active Records Found
                        </div>
                    )}
                </div>
            </div>

            {/* Show more/less button */}
            {chatters.length > 4 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-widest"
                >
                    {showAll ? (
                        <>
                            <ChevronUp size={14} />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} />
                            View {chatters.length - 4} Additional Performers
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
