import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function DailyAuditCoverage({ stats }) {
    const data = stats?.daily_coverage || [];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 p-3 border border-slate-700 rounded-md shadow-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-xl font-bold text-white">
                        {payload[0].value}{" "}
                        <span className="text-[10px] font-medium text-slate-400">
                            Audits
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                            Operational Coverage
                        </h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                            Daily audit volume and system engagement metrics
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                        <BarChart3 className="text-white" size={18} />
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -25,
                                bottom: 0,
                            }}
                            barGap={8}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#F1F5F9"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#94A3B8",
                                    fontSize: 9,
                                    fontWeight: 600,
                                }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#94A3B8",
                                    fontSize: 9,
                                    fontWeight: 600,
                                }}
                                domain={[0, 35]}
                                ticks={[0, 7, 14, 21, 28, 35]}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "#F8FAFC" }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            index % 2 === 0
                                                ? "#2563EB"
                                                : "#3B82F6"
                                        }
                                        className="hover:fill-slate-900 transition-all cursor-pointer opacity-90 hover:opacity-100"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Peak Volume
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Baseline volume
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
