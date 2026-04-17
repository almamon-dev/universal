import React, { useState, useEffect } from "react";
import Header from "../Components/Navigation/Admin/Header";
import Sidebar from "../Components/Navigation/Admin/Sidebar";
import { Toaster, toast } from "react-hot-toast";
import { usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { flash } = usePage().props;
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="flex h-screen bg-[#F9F9F9] overflow-hidden font-['Inter', 'system-ui', 'sans-serif']">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#333",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "500",
                    },
                }}
            />
            
            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[155] lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <aside
                className={`fixed inset-y-0 left-0 z-[160] bg-[#09090b] transition-all duration-300 ease-in-out border-r border-[#18181b] 
                    ${isCollapsed ? "w-[80px]" : "w-[260px]"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Main Content Area */}
            <div 
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out 
                    ${isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"}
                    ml-0`}
            >
                {/* Header with Mobile Menu Toggle */}
                <Header onMenuClick={() => setIsMobileOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
