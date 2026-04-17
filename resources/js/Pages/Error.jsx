import React from "react";
import { Link, Head } from "@inertiajs/react";
import { Home, RefreshCw, AlertTriangle, Construction } from "lucide-react";

export default function Error({ status }) {
    const title = {
        503: "Service Unavailable",
        500: "Server Error",
        404: "Page Not Found",
        403: "Forbidden",
    }[status];

    const description = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: "Whoops, something went wrong on our servers.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you are forbidden from accessing this page.",
    }[status];

    const icons = {
        503: <Construction className="w-24 h-24 text-amber-500 mb-6 animate-pulse" />,
        500: <AlertTriangle className="w-24 h-24 text-rose-500 mb-6 drop-shadow-lg" />,
        404: <RefreshCw className="w-24 h-24 text-blue-500 mb-6 animate-spin-slow" />,
        403: <AlertTriangle className="w-24 h-24 text-indigo-500 mb-6" />,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans', 'sans-serif']">
            <Head title={title} />

            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    {icons[status] || icons[404]}
                </div>

                <div className="space-y-3">
                    <h1 className="text-8xl font-black text-slate-900 leading-none tracking-tighter">
                        {status}
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="pt-6">
                    <Link
                        href="/"
                        style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                        className="inline-flex items-center gap-2 px-10 py-4 font-bold rounded-md hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-300"
                    >
                        <Home size={20} />
                        Back to Homepage
                    </Link>
                </div>

                <style>{`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 8s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
}
