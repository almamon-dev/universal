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
            <div className="bg-white overflow-hidden font-sans">
                {/* Clean Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Create New QC</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-md transition-colors">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">QC Name</label>
                            <input
                                type="text"
                                placeholder="Enter QC name"
                                value={qcForm.name}
                                onChange={(e) => setQCForm({ ...qcForm, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={qcForm.username}
                                onChange={(e) => setQCForm({ ...qcForm, username: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={qcForm.password}
                                onChange={(e) => setQCForm({ ...qcForm, password: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleAdd}
                            className="bg-slate-900 text-white px-6 py-2 rounded-md text-xs font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
                        >
                            Save Details
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
