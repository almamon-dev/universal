import React from "react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Image,
    Table,
    Type,
    Highlighter,
    Eraser,
    ChevronDown,
    Subscript,
    Superscript,
    Undo2,
    X,
    Save,
} from "lucide-react";

const RichTextEditor = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    subtitle,
}) => {
    return (
        <div className="space-y-3">
            {label && (
                <div className="space-y-1">
                    <label className="text-[14px] font-bold text-[#2f3344] flex items-center gap-1">
                        {label}{" "}
                        {error && <span className="text-red-500">*</span>}
                    </label>
                    {subtitle && (
                        <p className="text-[12px] text-slate-400">{subtitle}</p>
                    )}
                </div>
            )}

            <div className="border border-[#eef0f2] rounded-[12px] overflow-hidden bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#673ab7]/10 focus-within:border-[#673ab7]">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#f1f2f4] bg-[#fafbfc]">
                    <div className="flex items-center gap-1 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="flex items-center gap-1 px-2 py-1 text-[13px] text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                            Normal <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Bold size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Italic size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Underline size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Strikethrough size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <ListOrdered size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <List size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Subscript size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Superscript size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <AlignCenter size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors scale-x-[-1]"
                        >
                            <Undo2 size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Type size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Highlighter size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 border-r border-[#eef0f2] pr-1 mr-1">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors rotate-90"
                        >
                            <AlignLeft size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Link size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Image size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                        >
                            <Table size={16} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 ml-1 transition-colors"
                        >
                            <Eraser size={16} />
                        </button>
                    </div>
                </div>

                {/* Editor Content */}
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[200px] p-6 text-[15px] text-slate-600 bg-white border-none focus:ring-0 resize-y placeholder:text-slate-300"
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default RichTextEditor;
