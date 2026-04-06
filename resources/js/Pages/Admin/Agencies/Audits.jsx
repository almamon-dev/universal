import AdminLayout from "@/Layouts/AdminLayout";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Search,
    FileText,
    Calendar,
    ExternalLink,
    Plus,
    Trash2,
    Settings,
    Layout as LayoutIcon,
    Lock,
    Info,
    CheckCircle2,
    X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const TEMPLATES = [
    {
        id: "subscriber_type",
        name: "Subscriber Type",
        field_label: "Subscriber Type",
        type: "select",
        required: true,
        options: "New Sub (1 day), Old Sub (2 days +)",
        is_locked: true,
    },
    {
        id: "conv_type",
        name: "Conversation Type",
        field_label: "Conversation Interaction",
        type: "select",
        required: true,
        options:
            "Fresh (first interaction or first interaction of the day), Continuing (subscriber previously engaged and returned)",
        is_locked: true,
    },
    {
        id: "conv_classification",
        name: "Conversation State",
        field_label: "Conversation State",
        type: "select",
        required: true,
        options: "SELLABLE, NON-SELLABLE",
        is_locked: true,
    },
    {
        id: "non_sellable_reason",
        name: "Non-Sellable Reason",
        field_label: "already in the notes",
        type: "select",
        required: true,
        options: "already in the notes",
        is_conditional: true,
        required_if: "Conversation State = NON-SELLABLE",
        is_locked: true,
    },
    {
        id: "casual_conv",
        name: "Did the chatter have a casual conversation before transitioning into a sexual conversation?",
        field_label: "Did the chatter have a casual conversation before transitioning into a sexual conversation?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_conditional: true,
        required_if: "Conversation State = SELLABLE",
        is_locked: true,
    },
    {
        id: "template-first-offer-timing",
        name: "Did the chatter pitched a content?",
        field_label: "Did the chatter pitched a content?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_conditional: true,
        required_if: "Conversation State = SELLABLE",
        is_locked: true,
    },
    {
        id: "template-no-pitch-reason-category",
        name: "Why was there no pitch?",
        field_label: "Why was there no pitch?",
        type: "select",
        required: true,
        options: "PITCH NOT POSSIBLE, Pitch POSSIBLE but NOT EXECUTED",
        is_conditional: true,
        required_if: "template-first-offer-timing = No",
        is_locked: true,
    },
    {
        id: "template-pitch-not-possible-reason",
        name: "PITCH NOT POSSIBLE",
        field_label: "PITCH NOT POSSIBLE",
        type: "select",
        required: true,
        options: "Sub left mid conversation, Time constraint stated (sub is about to leave, go to work, etc), Other",
        is_conditional: true,
        required_if: "template-no-pitch-reason-category = PITCH NOT POSSIBLE",
        is_locked: true,
    },
    {
        id: "template-pitch-possible-no-execute-reason",
        name: "Pitch POSSIBLE but NOT EXECUTED",
        field_label: "Pitch POSSIBLE but NOT EXECUTED",
        type: "textarea",
        required: true,
        is_conditional: true,
        required_if: "template-no-pitch-reason-category = Pitch POSSIBLE but NOT EXECUTED",
        is_locked: true,
    },
    {
        id: "template-pitched-content-type",
        name: "What type of content was pitched?",
        field_label: "What type of content was pitched?",
        type: "select",
        required: true,
        options: "Sexting, Pre-recorded",
        is_conditional: true,
        required_if: "template-first-offer-timing = Yes",
        is_locked: true,
    },
    {
        id: "template-did-chatter-negotiate",
        name: "Did the chatter negotiated?",
        field_label: "Did the chatter negotiated?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_conditional: true,
        required_if: "template-first-offer-timing = Yes",
        is_locked: true,
    },
    {
        id: "template-did-chatter-make-sale",
        name: "Did the chatter make a sale?",
        field_label: "Did the chatter make a sale?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_conditional: true,
        required_if: "template-first-offer-timing = Yes",
        is_locked: true,
    },
    {
        id: "template-no-sale-reason",
        name: "Why did the sale not happen?",
        field_label: "Why did the sale not happen?",
        type: "select",
        required: true,
        options: "1 No Buying Power (Financial Constraint) - Sub wants it but has no funds, 2 Free-Only / Timewaster - Sub avoids spending beyond subscription fee, 3 Development Required - Sub needs more rapport / emotional build / trust, 4 Timing Issue - Wrong moment / work / not alone / busy / distracted, 5 Execution Breakdown - Chatter mishandled pacing / paywall transitioning, 6 Other",
        is_conditional: false,
        is_locked: true,
    },
    {
        id: "template-sexting-continue",
        name: "Did the sub continue the sexting sequence?",
        field_label: "Did the sub continue the sexting sequence?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_conditional: false,
        is_locked: true,
    },
    {
        id: "template-no-sexting-continue-reason",
        name: "Why did the sub not continue?",
        field_label: "Why did the sub not continue?",
        type: "select",
        required: true,
        options: "1. Financial Constraint - Sub wants it but has no more funds, 2. Sub climaxed, 3. Other",
        is_conditional: false,
        is_locked: true,
    },
    {
        id: "template-upsell-attempt",
        name: "Did the chatter tried upselling after the first PPV?",
        field_label: "Did the chatter tried upselling after the first PPV?",
        type: "select",
        required: false,
        options: "Yes, No",
        is_locked: true,
    },
    {
        id: "template-upsell-purchase",
        name: "Did the subscriber buy the upsell?",
        field_label: "Did the subscriber buy the upsell?",
        type: "select",
        required: false,
        options: "Yes, No",
        is_conditional: true,
        required_if: "template-upsell-attempt = Yes",
        is_locked: true,
    },
    {
        id: "template-no-upsell-reason",
        name: "Why did the sub not buy the upsell?",
        field_label: "Why did the sub not buy the upsell?",
        type: "select",
        required: true,
        options: "1. Financial Constraint - Sub wants it but has no more funds, 2. Sub climaxed, 3. Other",
        is_locked: true,
    },
    {
        id: "template-aftercare",
        name: "Did the chatter provide aftercare/pillow talk after the sub finishes?",
        field_label: "Did the chatter provide aftercare/pillow talk after the sub finishes?",
        type: "select",
        required: false,
        options: "Yes, No",
        is_conditional: true,
        required_if: "template-did-chatter-make-sale = Yes",
        is_locked: true,
    },
    {
        id: "template-qc-help-request",
        name: "Did the chatter request for a QCs help? (Script, how to handle, etc.)",
        field_label: "Did the chatter request for a QCs help? (Script, how to handle, etc.)",
        type: "select",
        required: true,
        options: "Yes, No",
        is_locked: true,
    },
    {
        id: "template-qc-intervention",
        name: "Did QC intervene during this conversation?",
        field_label: "Did QC intervene during this conversation?",
        type: "select",
        required: true,
        options: "Yes, No",
        is_locked: true,
    },
    {
        id: "template-rule-violation",
        name: "Rule Violation Observed",
        field_label: "Rule Violation Observed",
        type: "select",
        required: true,
        options: "Yes, No",
        is_locked: true,
    },
    {
        id: "template-rule-violation-detail",
        name: "Which rule did the chatter violate?",
        field_label: "Which rule did the chatter violate?",
        type: "textarea",
        required: false,
        is_conditional: true,
        required_if: "template-rule-violation = Yes",
        is_locked: true,
    },
];

export default function Audits({ auth, agency, audits, audit_fields }) {
    const user = auth?.user;
    const isQC = user?.role === "qc";
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(isQC ? "audits" : "fields");
    const [isAddingTemplate, setIsAddingTemplate] = useState(false);
    const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
    const [editingFieldIndex, setEditingFieldIndex] = useState(null);
    const [selectedFieldIndices, setSelectedFieldIndices] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        fields: Array.isArray(audit_fields)
            ? audit_fields
            : Object.values(audit_fields || {}),
    });

    useEffect(() => {
        if (audit_fields) {
            setData(
                "fields",
                Array.isArray(audit_fields)
                    ? audit_fields
                    : Object.values(audit_fields),
            );
        }
    }, [audit_fields]);

    const persistFields = (newFields) => {
        setData("fields", newFields);
        router.post(
            route("admin.agencies.audit-fields.update", agency.id),
            { fields: newFields },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                },
            },
        );
    };

    const removeField = (index) => {
        if (!confirm("Remove this field permanently from the database?"))
            return;

        const newFields = data.fields.filter((_, i) => i !== index);
        persistFields(newFields);

        // Adjust selected indices to account for the shift
        setSelectedFieldIndices((prev) =>
            prev
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i)),
        );

        // If we were editing this field, close the editor
        if (editingFieldIndex === index) {
            setEditingFieldIndex(null);
        } else if (editingFieldIndex > index) {
            setEditingFieldIndex(editingFieldIndex - 1);
        }
    };

    const removeSelectedFields = () => {
        if (
            !confirm(
                `Are you sure you want to delete ${selectedFieldIndices.length} selected fields permanently?`,
            )
        )
            return;

        const newFields = data.fields.filter(
            (_, i) => !selectedFieldIndices.includes(i),
        );
        persistFields(newFields);
        setSelectedFieldIndices([]);
        setEditingFieldIndex(null);
    };

    const toggleFieldSelection = (index) => {
        if (selectedFieldIndices.includes(index)) {
            setSelectedFieldIndices(
                selectedFieldIndices.filter((i) => i !== index),
            );
        } else {
            setSelectedFieldIndices([...selectedFieldIndices, index]);
        }
    };

    const toggleSelectAllFields = () => {
        if (selectedFieldIndices.length === data.fields.length) {
            setSelectedFieldIndices([]);
        } else {
            setSelectedFieldIndices(data.fields.map((_, i) => i));
        }
    };

    const updateField = (index, key, value) => {
        const newFields = [...data.fields];
        newFields[index][key] = value;
        setData("fields", newFields);
    };

    const handleSaveFields = (e) => {
        e.preventDefault();
        setShowSuccess(false);
        post(route("admin.agencies.audit-fields.update", agency.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    const handleAddSelectedTemplates = () => {
        const currentFieldIds = data.fields.map((f) => f.id).filter(Boolean);
        const selectedFields = TEMPLATES.filter((t) =>
            selectedTemplateIds.includes(t.id),
        ).filter((t) => !currentFieldIds.includes(t.id));

        setData("fields", [...data.fields, ...selectedFields]);
        setIsAddingTemplate(false);
        setSelectedTemplateIds([]);
    };

    const toggleTemplateSelect = (id) => {
        if (selectedTemplateIds.includes(id)) {
            setSelectedTemplateIds(selectedTemplateIds.filter((i) => i !== id));
        } else {
            setSelectedTemplateIds([...selectedTemplateIds, id]);
        }
    };

    const handleSelectAllTemplates = () => {
        const currentFieldIds = data.fields.map((f) => f.id).filter(Boolean);
        const addableTemplates = TEMPLATES.filter(
            (t) => !currentFieldIds.includes(t.id),
        );

        if (selectedTemplateIds.length === addableTemplates.length) {
            setSelectedTemplateIds([]);
        } else {
            setSelectedTemplateIds(addableTemplates.map((t) => t.id));
        }
    };

    const filteredAudits = audits.filter(
        (audit) =>
            (audit.url || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (audit.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );
    const Layout = isQC ? UserLayout : AdminLayout;

    return (
        <Layout>
            <Head title={`Agency Audits - ${agency.name}`} />
            <div className={`max-w-7xl mx-auto px-4 py-8 ${isQC ? "pb-20" : ""}`}>
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href={
                            isQC
                                ? route("dashboard")
                                : route("admin.agencies.edit", agency.id)
                        }
                        className={`inline-flex items-center gap-2 text-sm font-medium transition-all px-4 py-2 rounded-md mb-6 border ${isQC
                                ? "bg-[#18181B] border-[#27272A] text-gray-400 hover:text-white"
                                : "text-gray-500 hover:text-gray-900 border-gray-200 bg-white"
                            }`}
                    >
                        <ArrowLeft size={16} />
                        Back to {isQC ? "Dashboard" : "Agency"}
                    </Link>
                    <div className="flex flex-col gap-2">
                        <h1
                            className={`text-3xl font-bold tracking-tight ${isQC ? "text-white" : "text-gray-900"}`}
                        >
                            {agency.name}
                        </h1>
                        <p
                            className={`text-sm ${isQC ? "text-gray-500 font-medium" : "text-gray-500"}`}
                        >
                            {isQC
                                ? "Performance history and metrics"
                                : "Manage audit configuration and reviews"}
                        </p>
                    </div>
                </div>

                {/* Configuration Section (No Tabs) */}
                {isAddingTemplate ? (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsAddingTemplate(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <p className="text-sm text-gray-600 font-medium">
                                    Select fields to add to your audit structure
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSelectAllTemplates}
                                    className="text-xs font-bold text-indigo-600  tracking-widest hover:text-indigo-700 transition-colors"
                                >
                                    {selectedTemplateIds.length > 0
                                        ? "Deselect All"
                                        : "Select All"}
                                </button>
                                <button
                                    onClick={handleAddSelectedTemplates}
                                    disabled={selectedTemplateIds.length === 0}
                                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10"
                                >
                                    Add Selected ({selectedTemplateIds.length})
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {TEMPLATES.map((field, idx) => {
                                const isAlreadyAdded = data.fields.some(
                                    (f) => f.id === field.id,
                                );
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() =>
                                            !isAlreadyAdded &&
                                            toggleTemplateSelect(field.id)
                                        }
                                        className={`p-6 border rounded-xl transition-all ${isAlreadyAdded
                                                ? "opacity-60 bg-gray-50/50 cursor-not-allowed border-gray-100"
                                                : selectedTemplateIds.includes(
                                                    field.id,
                                                )
                                                    ? "border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600 shadow-lg"
                                                    : "border-gray-200 hover:border-indigo-300 bg-white cursor-pointer shadow-sm hover:shadow-md"
                                            }`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="pt-1">
                                                <div
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isAlreadyAdded
                                                            ? "bg-emerald-500 border-emerald-500 shadow-sm"
                                                            : selectedTemplateIds.includes(
                                                                field.id,
                                                            )
                                                                ? "bg-indigo-600 border-indigo-600 shadow-md"
                                                                : "border-gray-300 bg-white hover:border-gray-400"
                                                        }`}
                                                >
                                                    {isAlreadyAdded ? (
                                                        <CheckCircle2
                                                            size={14}
                                                            className="text-white"
                                                        />
                                                    ) : (
                                                        selectedTemplateIds.includes(
                                                            field.id,
                                                        ) && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                        {idx + 1}. {field.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {field.required && (
                                                            <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 text-[10px] font-black tracking-widest rounded shadow-sm">
                                                                Required
                                                            </span>
                                                        )}
                                                        {field.is_locked && (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-black tracking-widest rounded shadow-sm">
                                                                <Lock size={12} />
                                                                Locked Template
                                                            </span>
                                                        )}
                                                        {field.is_conditional && (
                                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-black tracking-widest rounded shadow-sm">
                                                                Conditional
                                                            </span>
                                                        )}
                                                        {isAlreadyAdded && (
                                                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-black tracking-widest rounded shadow-sm">
                                                                ALREADY ADDED
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        Field: <span className="font-bold text-gray-900">{field.field_label || field.name}</span>
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Type: <span className="text-gray-900 capitalize">{field.type}</span>
                                                    </p>
                                                </div>

                                                {field.required_if && (
                                                    <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md">
                                                        <p className="text-xs font-medium text-[#1E40AF]">
                                                            Required ONLY if:
                                                        </p>
                                                        <p className="text-sm text-[#2563EB] font-bold mt-1">
                                                            {field.required_if}
                                                        </p>
                                                    </div>
                                                )}

                                                {field.help_text && (
                                                    <div className="p-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-md">
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Description:
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {field.help_text}
                                                        </p>
                                                    </div>
                                                )}

                                                {field.options && !isAlreadyAdded && (
                                                    <div className="pt-2">
                                                        <p className="text-[10px] font-black text-gray-400  tracking-widest mb-2">Available Options:</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {field.options.split(/,(?![^()]*\))/).map((opt, i) => {
                                                                const trimmed = opt.trim();
                                                                const match = trimmed.match(/^(\d+)[\.\s]+(.*)/);
                                                                return (
                                                                    <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded shadow-sm flex items-center gap-1.5 transition-all hover:border-indigo-300">
                                                                        {match ? (
                                                                            <>
                                                                                <span className="w-4 h-4 flex items-center justify-center bg-indigo-600 text-white text-[9px] rounded-sm shadow-sm shrink-0 font-black">
                                                                                    {match[1]}
                                                                                </span>
                                                                                <span>{match[2]}</span>
                                                                            </>
                                                                        ) : trimmed}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Audit Fields
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Define the fields used in your audit
                                        forms
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {data.fields.length > 0 && (
                                        <button
                                            onClick={handleSaveFields}
                                            disabled={processing}
                                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-600/10"
                                        >
                                            {processing ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingTemplate(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add Template Fields
                                    </button>
                                </div>
                            </div>

                            {showSuccess && (
                                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-600"
                                        />
                                        <p className="text-sm text-emerald-700">
                                            Audit structure updated successfully
                                        </p>
                                    </div>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <X size={16} className="text-red-600" />
                                        <p className="text-sm text-red-700">
                                            Please fix the errors below
                                        </p>
                                    </div>
                                </div>
                            )}

                            {data.fields.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-200 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data.fields.length > 0 &&
                                                    selectedFieldIndices.length ===
                                                    data.fields.length
                                                }
                                                onChange={toggleSelectAllFields}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs font-medium text-gray-500">
                                                {selectedFieldIndices.length}{" "}
                                                selected
                                            </span>
                                        </div>
                                        {selectedFieldIndices.length > 0 && (
                                            <button
                                                onClick={removeSelectedFields}
                                                className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-medium rounded border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-2"
                                            >
                                                <Trash2 size={12} />
                                                Delete Selected
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {data.fields.map((field, index) => (
                                            <div
                                                key={index}
                                                className={`border rounded-md p-4 transition-all ${selectedFieldIndices.includes(
                                                    index,
                                                )
                                                        ? "border-indigo-600 bg-indigo-50/10 shadow-sm"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                    }`}
                                            >
                                                {editingFieldIndex === index ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold text-gray-900">
                                                                    Edit Field Details
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateField(
                                                                            index,
                                                                            "is_locked",
                                                                            !field.is_locked,
                                                                        )
                                                                    }
                                                                    className={`px-2 py-0.5 rounded text-[10px] font-black  tracking-widest transition-all border ${field.is_locked
                                                                            ? "bg-amber-50 text-amber-600 border-amber-200"
                                                                            : "bg-indigo-50 text-indigo-600 border-indigo-200"
                                                                        }`}
                                                                >
                                                                    {field.is_locked
                                                                        ? "Unlock for Editing"
                                                                        : "Lock Field"}
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setEditingFieldIndex(
                                                                        null,
                                                                    )
                                                                }
                                                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs text-gray-500 mb-1">
                                                                    Field Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        field.name
                                                                    }
                                                                    disabled={
                                                                        field.is_locked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateField(
                                                                            index,
                                                                            "name",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-500 mb-1">
                                                                    Field Type
                                                                </label>
                                                                <select
                                                                    value={
                                                                        field.type
                                                                    }
                                                                    disabled={
                                                                        field.is_locked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateField(
                                                                            index,
                                                                            "type",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                                >
                                                                    <option value="text">
                                                                        Text Input
                                                                    </option>
                                                                    <option value="textarea">
                                                                        Textarea
                                                                    </option>
                                                                    <option value="number">
                                                                        Number
                                                                    </option>
                                                                    <option value="select">
                                                                        Dropdown
                                                                    </option>
                                                                    <option value="checkbox">
                                                                        Checkbox
                                                                    </option>
                                                                </select>
                                                            </div>
                                                            {field.type ===
                                                                "select" && (
                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-xs text-gray-500 mb-1">
                                                                            Options
                                                                            (comma-separated)
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                field.options ||
                                                                                ""
                                                                            }
                                                                            disabled={
                                                                                field.is_locked
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                updateField(
                                                                                    index,
                                                                                    "options",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                                            placeholder="Option 1, Option 2, Option 3"
                                                                        />
                                                                    </div>
                                                                )}
                                                            <div className="flex items-center">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            field.required
                                                                        }
                                                                        disabled={
                                                                            field.is_locked
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateField(
                                                                                index,
                                                                                "required",
                                                                                e
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200"
                                                                    />
                                                                    <span className="text-sm text-gray-700">
                                                                        Required
                                                                        field
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-4">
                                                        <div className="pt-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFieldIndices.includes(
                                                                    index,
                                                                )}
                                                                onChange={() =>
                                                                    toggleFieldSelection(
                                                                        index,
                                                                    )
                                                                }
                                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                                                                            {index + 1}. {field.name}
                                                                        </h3>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {field.required && (
                                                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[9px] font-black tracking-tighter rounded">
                                                                                    Required
                                                                                </span>
                                                                            )}
                                                                            {field.is_locked && (
                                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 text-[9px] font-black tracking-tighter rounded">
                                                                                    <Lock size={10} />
                                                                                    Locked Template
                                                                                </span>
                                                                            )}
                                                                            {(field.is_conditional || field.required_if) && (
                                                                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 text-[9px] font-black tracking-tighter rounded">
                                                                                    Conditional
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-zinc-400 font-medium">
                                                                        {field.field_label || field.name} • {field.type}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setEditingFieldIndex(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-md transition-all active:scale-95"
                                                                        title="Configure Logic"
                                                                    >
                                                                        <Settings size={16} />
                                                                    </button>
                                                                    {!field.is_locked && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeField(
                                                                                    index,
                                                                                )
                                                                            }
                                                                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all active:scale-95"
                                                                            title="Delete Field"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <p className="text-sm text-gray-600">
                                                                        Field: <span className="font-bold text-gray-900">{field.field_label || field.name}</span>
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        Type: <span className="text-gray-900 capitalize">{field.type}</span>
                                                                    </p>
                                                                </div>
                                                                {field.options && (
                                                                    <div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {field.options.split(',').slice(0, 5).map((opt, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-medium rounded  tracking-tighter">
                                                                                    {opt.trim()}
                                                                                </span>
                                                                            ))}
                                                                            {field.options.split(',').length > 5 && (
                                                                                <span className="text-[10px] font-bold text-zinc-300 pl-1 self-center">
                                                                                    +{field.options.split(',').length - 5}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {field.required_if && (
                                                                <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                                                                    <p className="text-[10px] font-black text-[#1E40AF]  tracking-widest">
                                                                        Required ONLY if:
                                                                    </p>
                                                                    <p className="text-sm text-[#2563EB] font-bold mt-1">
                                                                        {field.required_if}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {field.help_text && (
                                                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                                                    <p className="text-[10px] font-black text-gray-400  tracking-widest">
                                                                        Description:
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        "{field.help_text}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
                                    <Settings
                                        size={32}
                                        className="mx-auto mb-3 text-gray-300"
                                    />
                                    <p className="text-gray-600 font-medium mb-1">
                                        No audit fields yet
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Add template fields to get started
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <Link
                                    href={route(
                                        "admin.agencies.edit",
                                        agency.id,
                                    )}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleSaveFields}
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
