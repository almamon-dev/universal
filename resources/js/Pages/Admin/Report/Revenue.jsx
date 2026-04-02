import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    TrendingUp,
    DollarSign,
    PieChart,
    ArrowUpRight,
    Search,
} from "lucide-react";

export default function Revenue() {
    const metrics = [
        { label: "Total gross", value: "$142,500", trend: "+12%" },
        { label: "Net profit", value: "$98,200", trend: "+8%" },
        { label: "Avg ticket", value: "$42.50", trend: "-2%" },
        { label: "Retention rate", value: "68%", trend: "+5%" },
    ];

    return (
        <AdminLayout>
            <Head title="Revenue Analysis — Report" />

            <div className="min-h-screen bg-zinc-50/50 py-12 px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href={route("admin.report.index")}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-black transition-colors group mb-8"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        System dashboard
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <TrendingUp size={20} />
                                </div>
                                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight leading-none">
                                    Revenue analysis
                                </h1>
                            </div>
                            <p className="text-zinc-500 text-lg leading-relaxed max-w-xl">
                                Financial diagnostics and profitability insights across the commercial spectrum.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                            <button className="px-6 py-2 bg-white border border-zinc-200 rounded-md text-[10px] font-bold text-zinc-500 hover:text-zinc-900 transition-all shadow-sm">
                                Export dataset
                            </button>
                            <button className="px-6 py-2 bg-zinc-900 text-white rounded-md text-[10px] font-bold hover:bg-zinc-800 transition-all">
                                New forecast
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {metrics.map((m, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-xl border border-zinc-200 hover:border-zinc-900 transition-all shadow-sm group"
                            >
                                <p className="text-[10px] font-bold text-zinc-400 mb-6 group-hover:text-zinc-900 transition-colors">
                                    {m.label}
                                </p>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-3xl font-bold text-zinc-900 tracking-tighter">
                                        {m.value}
                                    </span>
                                    <span
                                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${m.trend.startsWith("+") ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-zinc-50 border-zinc-100 text-zinc-400"}`}
                                    >
                                        {m.trend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts & Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                    <DollarSign className="text-zinc-400" size={16} />
                                    Transaction history
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        className="pl-9 pr-4 py-1.5 bg-zinc-50 border-zinc-200 rounded-md text-[10px] focus:bg-white focus:ring-0 w-48 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-50">
                                            <th className="pb-4 text-[10px] font-bold text-zinc-400">
                                                Gateway
                                            </th>
                                            <th className="pb-4 text-[10px] font-bold text-zinc-400">
                                                Amount
                                            </th>
                                            <th className="pb-4 text-[10px] font-bold text-zinc-400 text-right">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {[
                                            { name: "Sexting paywall", val: "+$1,200", status: "Verified" },
                                            { name: "Pre-recorded PPV", val: "+$850", status: "Verified" },
                                            { name: "Renewal subscription", val: "+$3,400", status: "Pending" },
                                            { name: "Bonus content", val: "+$120", status: "Verified" },
                                        ].map((t, i) => (
                                            <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                                                <td className="py-4 text-[11px] font-bold text-zinc-900">
                                                    {t.name}
                                                </td>
                                                <td className="py-4 text-[11px] font-bold text-zinc-900">
                                                    {t.val}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${t.status === "Verified" ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-zinc-50 border-zinc-100 text-zinc-400"}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                                <h3 className="text-sm font-bold text-zinc-900 mb-8 flex items-center gap-2">
                                    <PieChart className="text-zinc-400" size={16} />
                                    Revenue split
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "New subs", percent: 45 },
                                        { label: "Renewals", percent: 35 },
                                        { label: "Upsells", percent: 20 },
                                    ].map((s, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-[10px] font-bold mb-2">
                                                <span className="text-zinc-400">{s.label}</span>
                                                <span className="text-zinc-900">{s.percent}%</span>
                                            </div>
                                            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-zinc-900"
                                                    style={{ width: `${s.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-zinc-400">
                                            Total yield
                                        </span>
                                        <ArrowUpRight size={14} className="text-zinc-900" />
                                    </div>
                                    <div className="text-3xl font-bold text-zinc-900 tracking-tighter">
                                        $24,800
                                    </div>
                                    <p className="text-[9px] font-bold text-zinc-400 mt-2 leading-tight">
                                        Projected velocity based on historical conversion curves.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
