import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  workspaceName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteWorkspaceModal: React.FC<Props> = ({
  isOpen,
  workspaceName,
  onClose,
  onConfirm,
}) => {
  const [input, setInput] = useState("");

  const isValid = input === workspaceName;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4">

        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-card rounded-lg w-full max-w-md p-6 border border-border">

          {/* Header */}
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold text-red-400">
              Delete Workspace
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Warning */}
          <div className="flex gap-2 text-sm text-muted-foreground mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p>
              Type <span className="font-bold">{workspaceName}</span> to confirm deletion.
            </p>
          </div>

          {/* Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded mb-4"
            placeholder="Enter workspace name"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 border border-border rounded"
            >
              Cancel
            </button>

            <button
              disabled={!isValid}
              onClick={onConfirm}
              className={`px-3 py-2 rounded text-white ${
                isValid
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};