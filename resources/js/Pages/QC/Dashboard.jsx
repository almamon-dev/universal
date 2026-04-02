import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import {
    FileSpreadsheet,
    BookOpen,
    LogOut,
    Building2,
    Calendar,
    Activity,
    Plus,
    ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function QCDashboard({ agency, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [selectedDate, setSelectedDate] = useState(stats.filter_date || new Date().toISOString().split('T')[0]);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(window.location.pathname, { date: newDate }, { 
            preserveState: true,
            preserveScroll: true
        });
    };

    const graphData = stats.graph_data || [];

    return (
        <UserLayout>
            <Head title="QC Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10 px-10 pt-6 min-h-screen">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {user.name} • Quality Control
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Date Filter */}
                        <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm mr-2 group focus-within:border-indigo-200 transition-all">
                             <Calendar size={16} className="text-gray-400 group-focus-within:text-indigo-500" />
                             <input 
                                type="date" 
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="border-none p-0 text-[13px] font-bold text-gray-700 focus:ring-0 outline-none w-[115px]" 
                             />
                        </div>
                        <Link
                            href={user?.agency_id ? route("qc.agencies.protocols", user.agency_id) : "#"}
                            className="bg-white border border-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 text-[13px] font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <BookOpen size={18} />
                            <span>Agency Protocols</span>
                        </Link>
                        <Link
                            href={user?.agency_id ? route("qc.agencies.audits.create", user.agency_id) : "#"}
                            className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 text-[13px] font-bold hover:bg-zinc-800 transition-all shadow-sm"
                        >
                            <Plus size={18} />
                            <span>New Audit</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Agency Info Card */}
                    <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <Building2 size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Agency Details
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xl font-bold text-black truncate">
                                {agency?.name || "N/A"}
                            </h3>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">ID: {agency?.id}</p>
                        </div>
                    </div>

                    {/* Filtered Statistics Card */}
                    <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                <Calendar size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm text-nowrap whitespace-nowrap">
                                {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Audits" : "Filtered Audits"}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {stats?.today_audits || 0}
                        </h3>
                    </div>

                    {/* Total Audits Card */}
                    <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                <Activity size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">
                                Total Audits
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {stats?.total_audits || 0}
                        </h3>
                    </div>

                    {/* Active Fields Count Card */}
                    <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <FileSpreadsheet size={16} />
                            </div>
                            <span className="text-gray-900 font-bold text-sm text-nowrap whitespace-nowrap">
                                Audit Protocol
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-black tabular-nums">
                            {agency?.audit_fields?.length || 0}{" "}
                            <span className="text-sm font-bold text-gray-400">
                                Fields
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Graph Section */}
                <div className="bg-white p-8 rounded-md border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Audit Activity</h2>
                            <p className="text-xs text-gray-400 font-medium">Performance over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            <Activity size={12} />
                            Live Statistics
                        </div>
                    </div>
                    
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    vertical={false} 
                                    stroke="#F3F4F6"
                                />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#4F46E5" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Quick Access Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Agency Protocols Card */}
                    <Link
                        href={user?.agency_id ? route("qc.agencies.protocols", user.agency_id) : "#"}
                        className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-black/5 hover:shadow-lg transition-all text-black"
                    >
                        <div className="flex items-center gap-4 text-nowrap whitespace-nowrap">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-none mb-1">
                                    Agency Protocols
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    View guidelines and rules
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-black transition-colors shrink-0"
                        />
                    </Link>

                    {/* Audit Form Templates Card */}
                    <Link
                        href={user?.agency_id ? route("qc.agencies.audits.create", user.agency_id) : "#"}
                        className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-black/5 hover:shadow-lg transition-all text-black"
                    >
                        <div className="flex items-center gap-4 text-nowrap whitespace-nowrap">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                                <FileSpreadsheet size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-none mb-1">
                                    Audit Form Templates
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    Submit new QC reports
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-black transition-colors shrink-0"
                        />
                    </Link>

                    {/* Logout Card */}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-red-100 transition-all text-left text-black"
                    >
                        <div className="flex items-center gap-4 text-black text-nowrap whitespace-nowrap">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <LogOut size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-none mb-1">
                                    Logout Session
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    Sign out of dashboard
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={20}
                            className="text-gray-300 group-hover:text-red-500 transition-colors shrink-0"
                        />
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
