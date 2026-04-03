import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const discoveryData = [
    {
        id: "section-a",
        title: "SECTION A — ROLE DEFINITION (CRITICAL)",
        subtitle: "Purpose: Identify role confusion.",
        questions: [
            {
                id: "q_a1",
                text: "How would you describe your primary responsibility?",
                type: "radio",
                options: [
                    "Helping chatters close sales",
                    "Coaching execution",
                    "Enforcing rules",
                    "Escalating violations",
                    "A mix of everything",
                ],
            },
            {
                id: "q_a2",
                text: "Were you trained primarily to:",
                type: "radio",
                options: [
                    "Increase sales",
                    "Maintain standards",
                    "Support chatters",
                    "Manage performance",
                ],
            },
            {
                id: "q_a3",
                text: "Is there a written description of your QC role?",
                type: "radio",
                options: ["Yes", "No", "Informal"],
            },
        ],
        footerNote:
            'Diagnostic signal: "Mix of everything" = no enforceable role.',
    },
    {
        id: "section-b",
        title: "SECTION B — QC INBOX INTERVENTION",
        subtitle: "Purpose: Detect rescue behavior.",
        questions: [
            {
                id: "q_b1",
                text: "How often do you jump into a chat to: Rewrite messages, Suggest exact lines, Negotiate pricing, Close stalled chats",
                type: "radio", // Note: Image shows radio-style circles for frequency
                options: ["Never", "Rarely", "Sometimes", "Often"],
            },
            {
                id: "q_b2",
                text: "When you intervene, what is usually the reason?",
                type: "radio",
                options: [
                    "To save a sale",
                    "To model behavior",
                    "To prevent mistakes",
                    "Because the chatter asked",
                ],
            },
            {
                id: "q_b3",
                text: "Is inbox intervention:",
                type: "radio",
                options: ["Expected", "Discouraged", "Undefined"],
            },
        ],
        footerNote:
            'Diagnostic signal: "Expected" or "Undefined" = structural dependency.',
    },
    {
        id: "section-c",
        title: "SECTION C — COACHING & DOCUMENTATION",
        subtitle: "Purpose: Expose invisible work.",
        questions: [
            {
                id: "q_c1",
                text: "When you coach a chatter, do you:",
                type: "checkbox", // Image shows square boxes
                options: [
                    "Log it formally",
                    "Reference a rule",
                    "Follow up later",
                    "Coach verbally only",
                ],
            },
            {
                id: "q_c2",
                text: "Is there a required format for documenting coaching?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q_c3",
                text: "If a chatter repeats the same mistake, what usually happens?",
                type: "radio",
                options: ["More coaching", "Escalation", "Nothing", "Depends"],
            },
        ],
        footerNote: 'Diagnostic signal: "Depends" = enforcement gap.',
    },
    {
        id: "section-d",
        title: "SECTION D — ESCALATION DISCIPLINE",
        subtitle: "Purpose: Detect avoidance.",
        questions: [
            {
                id: "q_d1",
                text: "Is there a clear threshold for escalation?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q_d2",
                text: "What triggers escalation in practice?",
                type: "radio",
                options: [
                    "Repeat mistakes",
                    "Revenue loss",
                    "Leadership request",
                    "Personal judgment",
                ],
            },
            {
                id: "q_d3",
                text: "Have you ever avoided escalation because:",
                type: "checkbox", // Image shows square boxes
                options: [
                    "You didn't want conflict",
                    "The chatter performs well",
                    "Leadership discourages it",
                    "You weren't sure it was allowed",
                ],
            },
        ],
        footerNote: "This question reveals everything.",
    },
    {
        id: "section-e",
        title: "SECTION E — RULE CLARITY & CONSISTENCY",
        subtitle: "Purpose: Expose Rule #5 failures.",
        questions: [
            {
                id: "q_e1",
                text: "Do you feel confident applying rules consistently across all chatters?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q_e2",
                text: "Have you seen situations where: Another QC allowed something you wouldn't, You enforced something others didn't",
                type: "checkbox", // Image shows square boxes
                options: [
                    "Another QC allowed something you wouldn't",
                    "You enforced something others didn't",
                ],
            },
            {
                id: "q_e3",
                text: "When that happens, what do you do?",
                type: "radio",
                options: [
                    "Follow your judgment",
                    "Ask leadership",
                    "Let it go",
                    "Change enforcement",
                ],
            },
        ],
        footerNote:
            "Diagnostic signal: QC-by-QC variance = undocumented rules.",
    },
    {
        id: "section-f",
        title: "SECTION F — LEADERSHIP SIGNALS (OBSERVED)",
        subtitle: "Purpose: Surface pressure from above.",
        questions: [
            {
                id: "q_f1",
                text: "Do you feel pressure to prioritize:",
                type: "radio",
                options: ["Revenue", "Standards", "Balance both", "Unclear"],
            },
            {
                id: "q_f2",
                text: "When leadership is present, enforcement becomes:",
                type: "radio",
                options: ["Stricter", "Looser", "No change"],
            },
        ],
        footerNote: "If enforcement changes → system is performative.",
    },
];

const SectionBox = ({ title, subtitle, footerNote, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-medium text-gray-900  tracking-wider">
                {title}
            </h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        <div className="space-y-6">{children}</div>

        {footerNote && (
            <div
                className={`pt-4 ${footerNote.includes("Diagnostic signal") ? "" : "border-t border-gray-100"}`}
            >
                {footerNote.includes("Diagnostic signal") ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <span className="text-sm text-amber-900 leading-relaxed">
                            <strong>Diagnostic signal:</strong>{" "}
                            {footerNote
                                .replace("Diagnostic signal:", "")
                                .replace("Diagnostic signal", "")}
                        </span>
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic">{footerNote}</p>
                )}
            </div>
        )}
    </div>
);

const QuestionField = React.memo(
    ({ question, options, qId, type = "radio", data, onChange }) => (
        <div className="space-y-3">
            <label className="text-sm text-gray-700 block font-medium">
                {question}
            </label>

            <div className="space-y-2">
                {options.map((option, idx) => (
                    <label
                        key={`${qId}-${idx}`}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <input
                            type={type || "radio"}
                            name={qId}
                            checked={
                                type === "checkbox"
                                    ? Array.isArray(data[qId]) &&
                                    data[qId].includes(option)
                                    : data[qId] === option
                            }
                            onChange={() =>
                                onChange(qId, option, type || "radio")
                            }
                            className={`w-4 h-4 border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0 ${type === "radio" || !type ? "rounded-full" : "rounded"}`}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    ),
);

export default function QCDiscovery({ agency, discovery }) {
    const { data, setData, post, processing } = useForm({
        data: discovery || {},
    });
    const handleSave = () => {
        post(route("admin.agencies.discovery.update", [agency.id, "qc"]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Progress saved successfully!");
            },
        });
    };

    const handleOptionChange = React.useCallback(
        (qId, value, type = "radio") => {
            setData((prevData) => {
                if (type === "checkbox") {
                    const currentValues = Array.isArray(prevData.data[qId])
                        ? prevData.data[qId]
                        : [];
                    const newValues = currentValues.includes(value)
                        ? currentValues.filter((v) => v !== value)
                        : [...currentValues, value];

                    return {
                        ...prevData,
                        data: {
                            ...prevData.data,
                            [qId]: newValues,
                        },
                    };
                } else {
                    return {
                        ...prevData,
                        data: {
                            ...prevData.data,
                            [qId]: value,
                        },
                    };
                }
            });
        },
        [setData],
    );

    return (
        <AdminLayout>
            <Head title={`QC System Discovery - ${agency.name}`} />

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route(
                                    "admin.agencies.discovery",
                                    agency.id,
                                )}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-medium text-gray-900">
                                    QC System Discovery
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {agency.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-4">
                        {discoveryData.map((section) => (
                            <SectionBox
                                key={section.id}
                                title={section.title}
                                subtitle={section.subtitle}
                                footerNote={section.footerNote}
                            >
                                {section.questions.map((q) => (
                                    <QuestionField
                                        key={q.id}
                                        qId={q.id}
                                        question={q.text}
                                        options={q.options}
                                        type={q.type}
                                        data={data.data}
                                        onChange={handleOptionChange}
                                    />
                                ))}
                            </SectionBox>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="px-8 py-3 bg-black text-white text-[13px] font-black  tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-95"
                        >
                            {processing ? "Saving..." : "Save Progress"}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
