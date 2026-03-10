import Modal from "@/Components/Modal";
import { X } from "lucide-react";
import { useState } from "react";

export default function CreateQCModal({ show, onClose, onAdd }) {
    const [qcForm, setQCForm] = useState({
        name: "",
        username: "",
        password: "",
    });

    const handleAdd = () => {
        if (!qcForm.name || !qcForm.username || !qcForm.password) return;
        onAdd({ ...qcForm, id: Date.now() });
        setQCForm({ name: "", username: "", password: "" });
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-2xl border-2 border-[#00a651] overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            Create New QC
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                QC Name:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter QC name"
                                value={qcForm.name}
                                onChange={(e) =>
                                    setQCForm({
                                        ...qcForm,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 focus:border-[#00a651] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Username:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={qcForm.username}
                                onChange={(e) =>
                                    setQCForm({
                                        ...qcForm,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 focus:border-[#00a651] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Password:
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={qcForm.password}
                                onChange={(e) =>
                                    setQCForm({
                                        ...qcForm,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 focus:border-[#00a651] transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full bg-[#00a651] text-white py-4 rounded-xl font-bold hover:bg-[#008c44] transition-all shadow-md active:scale-[0.98] mt-2"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
