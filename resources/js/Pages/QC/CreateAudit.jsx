import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    Calendar,
    ChevronDown,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    ArrowLeft,
    User,
    Mail,
    Hash,
    FileText,
    CheckCircle,
    AlertCircle,
    ClipboardCheck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// Helper Functions outside component
const slugify = (str) =>
    (str || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "").trim();

const findTargetField = (label, allFields) => {
    const sLabel = slugify(label);
    if (!sLabel) return null;

    // Search in all provided fields
    let found = allFields.find(f => slugify(f.id) === sLabel || slugify(f.name) === sLabel || slugify(f.field_label) === sLabel);
    if (found) return found;

    const targetId = (label || "").trim().toLowerCase();
    found = allFields.find(f => f.id?.toString().toLowerCase() === targetId);
    if (found) return found;

    return allFields.find(f => slugify(f.name).includes(sLabel) || slugify(f.field_label).includes(sLabel));
};

const generateFieldKey = (field) => {
    return field?.field_key || field?.id || slugify(field?.name || field?.field_label || "");
};

const evaluateCondition = (condition, responses, allFields) => {
    // If no condition, it's visible by default
    if (!condition || typeof condition !== 'string' || !condition.trim() || condition === 'null') return true;

    const parts = condition.split(/\s+(?:AND|and)\s+/);
    return parts.every((part) => {
        const match = part.match(/(.+?)\s*(!=|==|=)\s*(.+)/);
        if (!match) return true;

        const label = match[1].trim();
        const operator = match[2].trim();
        const expectedValue = match[3].trim();

        const targetField = findTargetField(label, allFields);

        const potentialKeys = [
            targetField ? generateFieldKey(targetField) : null,
            targetField?.id,
            slugify(label),
            label
        ].filter(Boolean);

        let actualValue = null;
        for (const key of potentialKeys) {
            if (responses[key] !== undefined && responses[key] !== null) {
                actualValue = responses[key];
                break;
            }
        }

        // If no value found, condition is false
        if (actualValue === null || actualValue === undefined) return false;

        const sActual = slugify(actualValue.toString());
        const sExpected = slugify(expectedValue.toString());

        const isMatch = sActual === sExpected;
        return operator === "!=" ? !isMatch : isMatch;
    });
};

const isVisibleDeep = (field, fIdx, allFields, responses) => {
    if (fIdx === 0) return true;
    return evaluateCondition(field.required_if, responses, allFields);
};

const isVisible = (field, fIdx, allFields, responses) => {
    // 1. Primary Condition Check (required_if)
    if (!isVisibleDeep(field, fIdx, allFields, responses)) return false;

    // 2. Step-by-Step Waterfall:
    // A field only becomes visible if the immediately preceding "visible-by-condition" field has an answer.
    let lastVisibleIdx = -1;
    for (let i = fIdx - 1; i >= 0; i--) {
        if (isVisibleDeep(allFields[i], i, allFields, responses)) {
            lastVisibleIdx = i;
            break;
        }
    }

    if (lastVisibleIdx !== -1) {
        const lastField = allFields[lastVisibleIdx];
        const lastKey = generateFieldKey(lastField);
        const lastVal = responses[lastKey];
        if (lastVal === undefined || lastVal === null || lastVal.toString().trim() === "") return false;
    }

    return true;
};

export default function CreateAudit({ agency, chatters = [], creators = [], audit_templates }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const auditFields = audit_templates || [];

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const tabContainerRef = useRef(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);


    const emptyAudit = {
        chatter_id: "",
        creator_id: "",
        subscriber_uid: "",
        responses: {},
        status: "completed",
    };

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            audits: [emptyAudit],
        },
    });

    const hasErrors = Object.keys(errors).length > 0;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "audits",
    });

    const auditsData = watch("audits");

    // Auto-scroll active tab
    useEffect(() => {
        if (tabContainerRef.current) {
            const container = tabContainerRef.current;
            const activeTab = container.children[activeTabIndex];
            if (activeTab) {
                const containerRect = container.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                if (tabRect.left < containerRect.left) {
                    container.scrollTo({
                        left:
                            container.scrollLeft +
                            (tabRect.left - containerRect.left) -
                            20,
                        behavior: "smooth",
                    });
                } else if (tabRect.right > containerRect.right) {
                    container.scrollTo({
                        left:
                            container.scrollLeft +
                            (tabRect.right - containerRect.right) +
                            20,
                        behavior: "smooth",
                    });
                }
            }
        }
    }, [activeTabIndex]);

    useEffect(() => {
        const checkOverflow = () => {
            if (tabContainerRef.current) {
                const { scrollWidth, clientWidth } = tabContainerRef.current;
                setShowScrollButtons(scrollWidth > clientWidth);
            }
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [fields.length]);

    const scrollTabs = (direction) => {
        if (tabContainerRef.current) {
            const scrollAmount = 200;
            tabContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleWheel = (e) => {
        if (tabContainerRef.current)
            tabContainerRef.current.scrollLeft += e.deltaY;
    };

    const addAudit = () => {
        append({ ...emptyAudit });
        setActiveTabIndex(fields.length);
    };

    const removeAuditItem = (e, index) => {
        e.stopPropagation();
        if (fields.length > 1) {
            remove(index);
            if (activeTabIndex >= fields.length - 1)
                setActiveTabIndex(Math.max(0, fields.length - 2));
        } else {
            toast.error("At least one audit is required.");
        }
    };

    const onSubmit = (formData) => {
        setIsProcessing(true);
        router.post(route("qc.agencies.audits.store", agency.id), formData, {
            onSuccess: () => {
                toast.success("All audits submitted successfully!");
                setIsProcessing(false);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Please fill all required fields.");
                setIsProcessing(false);
            },
        });
    };

    const todayDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const getCompletionPercentage = (responses, allFields) => {
        if (!allFields.length) return 0;

        // Identify which fields SHOULD be answered (visible fields)
        const currentVisibleFields = allFields.filter((f, idx) => isVisible(f, idx, allFields, responses));
        if (currentVisibleFields.length === 0) return 0;

        const answeredCount = currentVisibleFields.filter(field => {
            const key = generateFieldKey(field);
            const val = responses[key];
            return val !== undefined && val !== null && val.toString().trim() !== "";
        }).length;

        return Math.round((answeredCount / currentVisibleFields.length) * 100);
    };

    return (
        <UserLayout>
            <Head title={`New Audit - ${agency.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 px-10 pt-2">
                <main className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-3">
                        <button
                            onClick={() => router.get(route("dashboard"))}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </button>
                    </div>

                    {/* Modern Tab Bar */}
                    <div className="mb-2 bg-white border border-gray-200 rounded-md shadow-sm p-1 flex items-center gap-1">
                        {showScrollButtons && (
                            <button
                                type="button"
                                onClick={() => scrollTabs("left")}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        <div
                            ref={tabContainerRef}
                            onWheel={handleWheel}
                            className="flex items-center flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth gap-1"
                        >
                            {fields.map((field, index) => {
                                const isActive = activeTabIndex === index;
                                const currentAuditValue = auditsData[index];
                                const selectedChatter = chatters.find(
                                    (c) =>
                                        c.id.toString() ===
                                        currentAuditValue?.chatter_id?.toString(),
                                );
                                const tabLabel = selectedChatter
                                    ? selectedChatter.name
                                    : `Audit ${index + 1}`;

                                const hasErrors = errors.audits?.[index];
                                const completion = getCompletionPercentage(
                                    currentAuditValue?.responses || {},
                                    auditFields
                                );

                                return (
                                    <button
                                        key={field.id}
                                        onClick={() => setActiveTabIndex(index)}
                                        type="button"
                                        className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-md transition-all ${isActive
                                            ? "bg-black text-white shadow-lg shadow-black/10"
                                            : "text-gray-500 hover:text-black hover:bg-gray-100"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${isActive
                                                ? "bg-white"
                                                : hasErrors
                                                    ? "bg-red-500"
                                                    : completion === 100
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-300"
                                                }`}
                                        />
                                        <span className="truncate max-w-[120px]">
                                            {tabLabel}
                                        </span>
                                        {completion > 0 &&
                                            completion < 100 &&
                                            !isActive && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                                                    {completion}%
                                                </span>
                                            )}
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    removeAuditItem(e, index)
                                                }
                                                className={`p-1 rounded-full transition-all ${isActive
                                                    ? "hover:bg-white/20 text-white/80 hover:text-white"
                                                    : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                                    }`}
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {showScrollButtons && (
                            <button
                                type="button"
                                onClick={() => scrollTabs("right")}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}

                        <div className="w-px h-8 bg-gray-100 mx-1" />

                        <button
                            type="button"
                            onClick={addAudit}
                            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all shrink-0"
                            title="Add New Audit"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        {fields.map((field, index) => {
                            if (activeTabIndex !== index) return null;

                            const activeAuditValues = auditsData[index] || {};
                            const responses = activeAuditValues.responses || {};
                            const completion =
                                getCompletionPercentage(responses, auditFields);
                            const hasErrors = errors.audits?.[index];

                            return (
                                <div key={field.id} className="space-y-3">
                                    {/* Progress Bar */}
                                    <div className="bg-white border border-gray-200 rounded-md p-2.5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Audit Progress
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600">
                                                {completion}% Complete
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                style={{
                                                    width: `${completion}%`,
                                                }}
                                                className={`h-full rounded-full transition-all duration-500 ${completion === 100
                                                    ? "bg-emerald-500"
                                                    : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* General Information Card */}
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                                        <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-white to-white border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-indigo-100 flex items-center justify-center">
                                                    <FileText
                                                        size={20}
                                                        className="text-indigo-600"
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        General Information
                                                    </h2>
                                                    <p className="text-sm text-indigo-600 mt-0.5">
                                                        Basic details about the
                                                        audit
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Date
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={todayDate}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600 cursor-not-allowed group-hover:border-gray-300 transition-colors"
                                                        />
                                                        <Calendar
                                                            size={18}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        QC Name
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={user.name}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600 cursor-not-allowed group-hover:border-gray-300 transition-colors"
                                                        />
                                                        <User
                                                            size={18}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Chatter Name
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register(
                                                            `audits.${index}.chatter_id`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm focus:outline-none transition-all ${errors.audits?.[
                                                            index
                                                        ]?.chatter_id
                                                            ? "border-red-500 ring-2 ring-red-500/20"
                                                            : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                            }`}
                                                    >
                                                        <option value="">
                                                            Select Chatter
                                                        </option>
                                                        {chatters.map((c) => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Creator Name
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register(
                                                            `audits.${index}.creator_id`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm focus:outline-none transition-all ${errors.audits?.[
                                                            index
                                                        ]?.creator_id
                                                            ? "border-red-500 ring-2 ring-red-500/20"
                                                            : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                            }`}
                                                    >
                                                        <option value="">
                                                            Select Creator
                                                        </option>
                                                        {creators.map((c) => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-6 space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Subscriber UID
                                                    <span className="text-red-500 ml-1">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        {...register(
                                                            `audits.${index}.subscriber_uid`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        placeholder="Enter Subscriber UID"
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm pl-10 focus:outline-none transition-all ${errors.audits?.[
                                                            index
                                                        ]?.subscriber_uid
                                                            ? "border-red-500 ring-2 ring-red-500/20"
                                                            : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                            }`}
                                                    />
                                                    <Hash
                                                        size={16}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Audit Fields Section - Card within a Card */}
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden mb-8">
                                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <ClipboardCheck size={18} />
                                                </div>
                                                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                                    Templated Audit Fields
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6 bg-slate-50/50">
                                            <div className="space-y-2.5">
                                                {audit_templates && audit_templates.length > 0 ? (
                                                    audit_templates.map((fieldItem, fIdx) => {
                                                        const fieldKey = generateFieldKey(fieldItem);
                                                        const isFieldVisible = isVisible(fieldItem, fIdx, audit_templates, responses);
                                                        if (!isFieldVisible) return null;

                                                        const isSelect =
                                                            fieldItem.type === "select" ||
                                                            fieldItem.options ||
                                                            (fieldItem.field_label || "")
                                                                .toLowerCase()
                                                                .includes("subscriber type");

                                                        const isRequiredField = fieldItem.is_required || fieldItem.required;
                                                        const hasError = errors.audits?.[index]?.responses?.[fieldKey];
                                                        const currentValue = responses[fieldKey];

                                                        return (
                                                            <div
                                                                key={fieldKey}
                                                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5 space-y-3 hover:border-indigo-200 transition-all duration-300"
                                                            >
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <label className="text-[15px] font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
                                                                            {fieldItem.name || fieldItem.field_label}
                                                                            {isRequiredField && <span className="text-red-500 font-bold">*</span>}
                                                                        </label>
                                                                        {currentValue && (
                                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                                                                                Answered
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {fieldItem.help_text && (
                                                                        <div className="bg-indigo-50/80 border border-indigo-100 p-3.5 rounded-lg">
                                                                            <p className="flex items-center gap-2 text-sm text-indigo-900 font-bold mb-1">
                                                                                <FileText size={14} className="text-indigo-500" />
                                                                                Description:
                                                                            </p>
                                                                            <p className="text-[13px] text-indigo-800/80 leading-relaxed font-medium pl-5">
                                                                                {fieldItem.help_text}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isSelect ? (
                                                                    (() => {
                                                                        const options =
                                                                            fieldItem.options
                                                                                ?.split(/,(?![^()]*\))/)
                                                                                .map((o) => o.trim()) || [];

                                                                        const handleUpdate = (opt) => {
                                                                            setValue(
                                                                                `audits.${index}.responses.${fieldKey}`,
                                                                                opt,
                                                                                {
                                                                                    shouldValidate: true,
                                                                                    shouldDirty: true,
                                                                                },
                                                                            );

                                                                            // Waterfall: Reset following fields to ensure fresh state
                                                                            const followingFields = audit_templates.slice(fIdx + 1);
                                                                            followingFields.forEach((nextField) => {
                                                                                const nKey = generateFieldKey(nextField);
                                                                                setValue(`audits.${index}.responses.${nKey}`, "", { shouldValidate: true });
                                                                            });
                                                                        };

                                                                        return (
                                                                            <div className="space-y-3">
                                                                                <div className="relative group">
                                                                                    <select
                                                                                        value={responses[fieldKey] || ""}
                                                                                        onChange={(e) => handleUpdate(e.target.value)}
                                                                                        className={`w-full appearance-none bg-white border rounded-md px-4 py-2 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all ${hasError
                                                                                            ? "border-red-500"
                                                                                            : responses[fieldKey]
                                                                                                ? "border-emerald-500"
                                                                                                : "border-gray-200 focus:border-indigo-600"
                                                                                            }`}
                                                                                    >
                                                                                        <option value="">
                                                                                            Select {(fieldItem.name || fieldItem.field_label).toLowerCase()}
                                                                                        </option>
                                                                                        {options.map((opt) => (
                                                                                            <option key={opt} value={opt}>
                                                                                                {opt}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>

                                                                                {/* 'Other' Specification Input */}
                                                                                {slugify(responses[fieldKey]) === "other" && (
                                                                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                                                        <input
                                                                                            type="text"
                                                                                            {...register(`audits.${index}.responses.${fieldKey}_other`, { required: true })}
                                                                                            placeholder="Please specify other..."
                                                                                            className="w-full bg-slate-50 border border-indigo-100 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })()
                                                                ) : (
                                                                    <textarea
                                                                        rows={3}
                                                                        {...register(
                                                                            `audits.${index}.responses.${fieldKey}`,
                                                                            {
                                                                                required: isRequiredField,
                                                                            },
                                                                        )}
                                                                        className={`w-full bg-white border rounded-lg px-4 py-3 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none ${hasError
                                                                            ? "border-red-500"
                                                                            : currentValue
                                                                                ? "border-emerald-500"
                                                                                : "border-gray-200 focus:border-indigo-600"
                                                                            }`}
                                                                        placeholder={`Enter analysis/details for ${fieldItem.field_label || fieldItem.name}...`}
                                                                    />
                                                                )}
                                                                {hasError && (
                                                                    <p className="text-[11px] font-black uppercase tracking-widest text-red-500 mt-2 flex items-center gap-2 px-2">
                                                                        <AlertCircle size={14} />
                                                                        Required field
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="bg-white border border-gray-200 rounded-md p-16 text-center">
                                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                            <AlertCircle size={32} className="text-gray-300" />
                                                        </div>
                                                        <p className="text-gray-600 font-semibold text-lg">No audit questions</p>
                                                        <p className="text-sm text-gray-400 mt-2">Audit template has not been configured yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions & Submit Section */}
                                    <div className="space-y-6">
                                        {/* Error/Success Feedbacks (Small/Clean) */}
                                        {hasErrors && (
                                            <div className="bg-red-50 border border-red-100 rounded-md p-4 flex items-center gap-3 text-red-700">
                                                <AlertCircle size={18} />
                                                <span className="text-sm font-medium">
                                                    Please correct the errors
                                                    before submitting.
                                                </span>
                                            </div>
                                        )}

                                        {/* Main Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-[#18181b] text-white py-4 rounded-md font-bold hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-black/5 text-lg"
                                        >
                                            {isProcessing
                                                ? "Submitting..."
                                                : "Submit Audit"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </form>
                </main>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; overflow-x: auto; }`,
                }}
            />
        </UserLayout>
    );
}
