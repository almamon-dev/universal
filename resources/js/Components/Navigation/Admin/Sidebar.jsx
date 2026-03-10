import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { LayoutGrid, Plus, LogOut, Shield, FileText } from "lucide-react";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
    const { url } = usePage();
    const currentPath = url.split("?")[0];

    const { auth } = usePage().props;
    const user = auth.user;

    // Admin-only menu items
    const menuItems = [
        {
            label: "Dashboard",
            path: route("admin.dashboard"),
            icon: <LayoutGrid size={20} />,
            active: route().current("admin.dashboard"),
        },
        {
            label: "Create Agency",
            path: route("admin.agencies.create"),
            icon: <Plus size={20} />,
            active: route().current("admin.agencies.create"),
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white relative border-r border-gray-100 w-[260px]">
            {/* Logo Section */}
            <div className="pt-8 pb-10 px-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Shield size={28} className="text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-black text-[15px] leading-tight tracking-widest uppercase">
                            Invariant
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            Consulting
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-3">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.path}
                        className={`
                            flex items-center gap-3 py-3 px-5 rounded-xl transition-all duration-200 group
                            ${
                                item.active
                                    ? "bg-[#111] text-white shadow-xl shadow-black/10"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                            }
                        `}
                    >
                        <div
                            className={
                                item.active
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-black"
                            }
                        >
                            {item.icon}
                        </div>
                        <span className="font-bold text-[15px] tracking-tight">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Logout - Fixed at bottom */}
            <div className="mt-auto p-6 mb-2">
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-[#FF6B6B] hover:bg-red-50 transition-all duration-200 font-bold text-[15px]"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
