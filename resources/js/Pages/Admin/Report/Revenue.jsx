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
        {
            label: "Total Gross",
            value: "$142,500",
            trend: "+12%",
            color: "text-emerald-600",
        },
        {
            label: "Net Profit",
            value: "$98,200",
            trend: "+8%",
            color: "text-blue-600",
        },
        {
            label: "Avg Ticket",
            value: "$42.50",
            trend: "-2%",
            color: "text-rose-600",
        },
        {
            label: "Retention",
            value: "68%",
            trend: "+5%",
            color: "text-purple-600",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Revenue Analysis — Report" />

            <div className="min-h-screen bg-[#FAFAFA] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/admin/report"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Reports
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-emerald-600 rounded-sm flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                    <TrendingUp size={24} />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                    Revenue Analysis
                                </h1>
                            </div>
                            <p className="text-gray-500 text-lg">
                                Financial diagnostics and profitability
                                insights.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                Export CSV
                            </button>
                            <button className="px-6 py-2.5 bg-black text-white rounded-sm text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10">
                                New Forecast
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {metrics.map((m, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1"
                            >
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    {m.label}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-gray-900">
                                        {m.value}
                                    </span>
                                    <span
                                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                                    >
                                        {m.trend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts & Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <DollarSign
                                        className="text-emerald-500"
                                        size={20}
                                    />
                                    Transaction History
                                </h3>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={14}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        className="pl-9 pr-4 py-2 bg-gray-50 border-transparent rounded-sm text-xs focus:bg-white focus:ring-0 w-48 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase">
                                                Gateway
                                            </th>
                                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase">
                                                Amount
                                            </th>
                                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase text-right">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            {
                                                name: "Sexting Paywall",
                                                val: "+$1,200",
                                                status: "Verified",
                                            },
                                            {
                                                name: "Pre-recorded PPV",
                                                val: "+$850",
                                                status: "Verified",
                                            },
                                            {
                                                name: "Renewal Subscription",
                                                val: "+$3,400",
                                                status: "Pending",
                                            },
                                            {
                                                name: "Bonus Content",
                                                val: "+$120",
                                                status: "Verified",
                                            },
                                        ].map((t, i) => (
                                            <tr
                                                key={i}
                                                className="group hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="py-5 text-sm font-medium text-gray-900">
                                                    {t.name}
                                                </td>
                                                <td className="py-5 text-sm font-bold text-emerald-600">
                                                    {t.val}
                                                </td>
                                                <td className="py-5 text-right">
                                                    <span
                                                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${t.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                                                    >
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <PieChart className="text-blue-500" size={20} />
                                Revenue Split
                            </h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        label: "New Subs",
                                        percent: 45,
                                        color: "bg-blue-500",
                                    },
                                    {
                                        label: "Renewals",
                                        percent: 35,
                                        color: "bg-purple-500",
                                    },
                                    {
                                        label: "Upsells",
                                        percent: 20,
                                        color: "bg-emerald-500",
                                    },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="text-gray-600">
                                                {s.label}
                                            </span>
                                            <span className="text-gray-900">
                                                {s.percent}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${s.color}`}
                                                style={{
                                                    width: `${s.percent}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-gray-900 rounded-3xl text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Total Yield
                                    </span>
                                    <ArrowUpRight
                                        size={16}
                                        className="text-emerald-400"
                                    />
                                </div>
                                <div className="text-3xl font-black">
                                    $24.8k
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">
                                    Projected next 30 days based on velocity
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
