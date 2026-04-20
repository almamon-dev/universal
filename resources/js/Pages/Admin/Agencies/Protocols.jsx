import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Info, Edit, CheckCircle2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-hot-toast";
import React from "react";

export default function Protocols({ agency }) {
    const { data, setData, post, processing } = useForm({
        protocols: agency.protocols || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.agencies.protocols.update", agency.id), {
            onSuccess: () => toast.success("Protocols saved successfully!"),
            onError: () => toast.error("Failed to save protocols."),
        });
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["link", "clean"],
        ],
    };

    return (
        <AdminLayout>
            <Head title={`Edit Protocols - ${agency.name}`} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Side */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="inline-flex items-center gap-2 text-xs transition-colors px-4 py-2 rounded-md border w-fit font-bold text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                        >
                            <ArrowLeft size={14} />
                            Back to Agency
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Agency Protocols
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                <Edit size={12} />
                                Editor Mode
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            {agency.name}
                        </p>
                    </div>

                    <a
                        href="https://quillbot.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-md hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-900/10 transition-all active:scale-95"
                    >
                        <CheckCircle2 size={16} />
                        Refine Protocols
                    </a>
                </div>

                {/* Main Editor Card */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm transition-all duration-300">
                    <div className="p-6 md:p-10 space-y-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Guidelines & Strategy
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Define all agency-specific rules,
                                    guidelines, and operating procedures here.
                                </p>
                            </div>
                        </div>

                        <div className="quill-premium-container overflow-hidden">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <ReactQuill
                                    theme="snow"
                                    value={data.protocols}
                                    onChange={(content) =>
                                        setData("protocols", content)
                                    }
                                    modules={modules}
                                    placeholder="Start documenting your agency protocols..."
                                    className="quill-premium"
                                />

                                {/* Form Actions */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-900/10 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        <Save size={18} />
                                        {processing
                                            ? "Publishing..."
                                            : "Publish Protocols"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        </AdminLayout>
    );
}
