import { useState, } from "react";
import { X } from "lucide-react";
import type { Task } from "../../domain/entities/Task";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialData?: Task | null;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddTaskModalProps) {
  const emptyForm: Task = {
    title: "",
    description: "",
    priority: "medium",
    type: "one-time",
    startDate: "",
    dueDate: "",
    days: [],
    status: "todo",
    timeSpent: 0,
    isTimerRunning: false,
  };

const getInitialForm = (): Task => {
  if (initialData) {
    return {
      ...emptyForm,
      ...initialData,
      days: initialData.days ?? [],
      description: initialData.description ?? "",
    };
  }
  return emptyForm;
};

const [form, setForm] = useState<Task>(getInitialForm);

  const [errors, setErrors] = useState<{ title?: string; days?: string }>({});


  // ✅ RESET
  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
  };

  // ✅ VALIDATION
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (form.type === "recurring" && (form.days ?? []).length === 0) {
      newErrors.days = "Select at least one day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...form,
      description: form.description ?? "",
      days: form.days ?? [],
    });

    resetForm();
    onClose();
  };

  // ✅ CLOSE
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1a2332] rounded-3xl w-full max-w-md p-6 border border-gray-700">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Edit Task" : "Add Task"}
          </h2>
          <button onClick={handleClose}>
            <X className="text-gray-400" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Task Title
            </label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className="w-full p-3 bg-gray-800 text-white rounded"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Description
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 bg-gray-800 text-white rounded"
            />
          </div>

          {/* PRIORITY */}
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as Task["priority"],
              })
            }
            className="w-full p-3 bg-gray-800 text-white rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* TYPE */}
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as Task["type"],
                days: [],
                startDate: "",
                dueDate: "",
              })
            }
            className="w-full p-3 bg-gray-800 text-white rounded"
          >
            <option value="one-time">One Time</option>
            <option value="recurring">Recurring</option>
          </select>

          {/* ONE-TIME */}
          {form.type === "one-time" && (
            <>
              <input
                type="date"
                value={form.startDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded"
              />

              <input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded"
              />
            </>
          )}

          {/* RECURRING */}
          {form.type === "recurring" && (
            <div>
              <div className="flex flex-wrap gap-2">
                {["mon","tue","wed","thu","fri","sat","sun"].map((day) => {
                  const selected = (form.days ?? []).includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const updated = selected
                          ? (form.days ?? []).filter((d) => d !== day)
                          : [...(form.days ?? []), day];

                        setForm({ ...form, days: updated });
                        setErrors((prev) => ({ ...prev, days: undefined }));
                      }}
                      className={`px-3 py-1 rounded ${
                        selected
                          ? "bg-cyan-500 text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {errors.days && (
                <p className="text-red-400 text-xs mt-1">{errors.days}</p>
              )}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-700 p-3 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-cyan-500 p-3 rounded text-black"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}