import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
    BookOpen,
} from "lucide-react";
import UserSidebar from "@/Components/Navigation/User/Sidebar";

export default function UserLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <UserSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden lg:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-all"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {auth.user?.name?.charAt(0) || "U"}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-bold text-gray-900 leading-none">
                                        {auth.user?.name || "User"}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1 font-medium capitalize">
                                        {auth.user?.role || "Member"}
                                    </p>
                                </div>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-20 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Signed in as
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                                                {auth.user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 text-left font-medium transition-colors"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
