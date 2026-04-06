import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";

export default function DailyAuditCoverage({ stats }) {
    // Generate a default structure if data is empty (Apr 01 - Apr 30)
    const generateEmptyData = () => {
        const days = [];
        for (let i = 1; i <= 30; i++) {
            days.push({ name: `Apr ${i < 10 ? '0' + i : i}`, audits: 0 });
        }
        return days;
    };

    const data = stats?.daily_stats?.length > 0 ? stats.daily_stats : generateEmptyData();

    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-md font-bold text-slate-700">Daily audit coverage</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">Audit density across the current period</CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 pt-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                                dy={10}
                                interval={2}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', radius: 4 }}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#0f172a'
                                }}
                            />
                            <Bar
                                dataKey="audits"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            >
                                <LabelList 
                                    dataKey="audits" 
                                    position="top" 
                                    style={{ fill: '#64748b', fontSize: '9px', fontWeight: '600' }}
                                    offset={10}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
