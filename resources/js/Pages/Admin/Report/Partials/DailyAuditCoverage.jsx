import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, ShieldCheck, Activity } from "lucide-react";

const ChartWrapper = ({ title, data, dataKey, color = "#3B82F6", icon: Icon }) => (
    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] transform group-hover:scale-125 transition-transform duration-1000 rotate-12">
            <Icon size={240} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-black/5`}>
                        <Icon size={22} className={`text-[${color}]`} style={{ color: color }} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-tighter leading-none mb-1">{title}</h4>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] h-3">PERFORMANCE VELOCITY METRICS</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                 <div className="px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-center">PEAK VALUE</p>
                    <p className="text-slate-900 font-extrabold text-sm text-center tracking-tighter uppercase tabular-nums">MAX : {Math.max(...data.map(d => d[dataKey]))} UNITS</p>
                 </div>
            </div>
        </div>

        <div className="h-[300px] w-full mt-8 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 900, textAnchor: 'middle' }}
                        dy={15}
                        interval={0}
                        textTransform="uppercase"
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                        dx={-5}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '24px', 
                            border: 'none', 
                            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', 
                            padding: '20px',
                            backgroundColor: 'white'
                        }}
                        cursor={{ fill: "#F1F5F9", radius: 12 }}
                        itemStyle={{ color: '#0F172A', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}
                    />
                    <Bar 
                        dataKey={dataKey} 
                        fill={color} 
                        radius={[10, 10, 2, 2]} 
                        barSize={50} 
                        animationBegin={300}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default function DailyAuditCoverage({ stats }) {
    const data = (stats?.daily_coverage || [
        { name: "MON", value: 45, passed: 32, avg: 38 },
        { name: "TUE", value: 52, passed: 41, avg: 46 },
        { name: "WED", value: 78, passed: 65, avg: 71 },
        { name: "THU", value: 58, passed: 44, avg: 51 },
        { name: "FRI", value: 82, passed: 70, avg: 76 },
        { name: "SAT", value: 36, passed: 25, avg: 30 },
        { name: "SUN", value: 72, passed: 58, avg: 65 },
    ]).map(d => ({ ...d, name: d.name.toUpperCase() }));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <ChartWrapper 
                title="DAILY AUDIT COVERAGE" 
                data={data} 
                dataKey="value" 
                color="#2563EB" 
                icon={BarChart3}
            />
            <ChartWrapper 
                title="DAILY AUDIT PASS" 
                data={data} 
                dataKey="passed" 
                color="#10B981" 
                icon={ShieldCheck}
            />
            <ChartWrapper 
                title="DAILY AUDIT AVERAGE" 
                data={data} 
                dataKey="avg" 
                color="#6366F1" 
                icon={Activity}
            />
        </div>
    );
}
