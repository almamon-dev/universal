import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    LogOut,
    BookOpen,
    FileSpreadsheet,
    Plus,
    Inbox,
    FileText,
} from "lucide-react";

export default function UserSidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const navigation = [
        {
            name: "Dashboard",
            href: route("qc.dashboard"),
            icon: LayoutDashboard,
            active: route().current("qc.dashboard"),
        },
    ];

    if (user?.agency_id && user?.role !== "admin") {
        navigation.push({
            name: "Audit Forms",
            href: route("qc.agencies.audits.create", user.agency_id),
            icon: Inbox,
            active: route().current("qc.agencies.audits.create"),
        });
        navigation.push({
            name: "Agency Protocols",
            href: route("qc.agencies.protocols", user.agency_id),
            icon: FileText,
            active: route().current("qc.agencies.protocols"),
        });
    }

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ${isSidebarOpen
                ? "translate-x-0 shadow-2xl"
                : "-translate-x-full lg:translate-x-0"
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Logo Section */}
                <div className="pt-2 pb-2 px-4 flex flex-col items-center">
                    <Link
                        href={route("qc.dashboard")}
                        className="flex flex-col items-center group transition-all duration-300"
                    >
                        <div className="mb-5 transition-transform duration-500 group-hover:scale-110">
                            <img
                                src="/img/2.png"
                                alt="Logo"
                                className="h-20 w-auto object-contain mb-2"
                            />
                        </div>

                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-3">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-200 group relative
                                ${item.active
                                    ? "bg-black text-white shadow-xl shadow-black/10 px-6"
                                    : "text-gray-500 hover:text-black hover:bg-gray-50 px-4"
                                }
                            `}
                        >
                            <div
                                className={
                                    item.active
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-black transition-colors"
                                }
                            >
                                <item.icon size={20} />
                            </div>
                            <span className="tracking-tight">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-50 mb-2">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
