import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";

const data = [
    { name: "Apr 01", audits: 85 }, { name: "Apr 02", audits: 62 }, { name: "Apr 03", audits: 94 },
    { name: "Apr 04", audits: 110 }, { name: "Apr 05", audits: 45 }, { name: "Apr 06", audits: 78 },
    { name: "Apr 07", audits: 64 }, { name: "Apr 08", audits: 92 }, { name: "Apr 09", audits: 88 },
    { name: "Apr 10", audits: 105 }, { name: "Apr 11", audits: 56 }, { name: "Apr 12", audits: 42 },
    { name: "Apr 13", audits: 88 }, { name: "Apr 14", audits: 95 }, { name: "Apr 15", audits: 112 },
    { name: "Apr 16", audits: 84 }, { name: "Apr 17", audits: 76 }, { name: "Apr 18", audits: 65 },
    { name: "Apr 19", audits: 52 }, { name: "Apr 20", audits: 91 }, { name: "Apr 21", audits: 87 },
    { name: "Apr 22", audits: 104 }, { name: "Apr 23", audits: 96 }, { name: "Apr 24", audits: 115 },
    { name: "Apr 25", audits: 62 }, { name: "Apr 26", audits: 48 }, { name: "Apr 27", audits: 89 },
    { name: "Apr 28", audits: 97 }, { name: "Apr 29", audits: 108 }, { name: "Apr 30", audits: 125 },
];

export default function DailyAuditCoverage({ stats }) {
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
