import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  mode: "submit" | "reject";
  onClose: () => void;
  onSubmit: (data: {
    submissionProofs?: {
      link: string;
      description: string;
    }[];
    rejectReason?: string;
  }) => Promise<void>;
}

export default function TaskActionModal({
  isOpen,
  mode,
  onClose,
  onSubmit,
}: Props) {
  const [link, setLink] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [rejectReason, setRejectReason] =
    useState("");

  const [proofs, setProofs] =
    useState<
      {
        link: string;
        description: string;
      }[]
    >([]);

  useEffect(() => {
    if (!isOpen) {
      setLink("");
      setDescription("");
      setRejectReason("");
      setProofs([]);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const addProof = () => {
    if (!link.trim()) {
      return;
    }

    setProofs([
      ...proofs,
      {
        link: link.trim(),
        description:
          description.trim(),
      },
    ]);

    setLink("");
    setDescription("");
  };

  const removeProof = (
    index: number
  ) => {
    setProofs(
      proofs.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleConfirm =
    async () => {
      if (mode === "submit") {
        if (
          proofs.length === 0
        ) {
          alert(
            "Add at least one work link"
          );
          return;
        }

        await onSubmit({
          submissionProofs:
            proofs,
        });

        onClose();
        return;
      }

      if (
        !rejectReason.trim()
      ) {
        alert(
          "Reason required"
        );
        return;
      }

      await onSubmit({
        rejectReason,
      });

      onClose();
    };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">

        <h2 className="text-xl font-semibold text-white mb-4">
          {mode === "submit"
            ? "Submit Work"
            : "Reject Submission"}
        </h2>

        {mode === "submit" ? (
          <>
            <div className="space-y-3">

              <input
                value={link}
                onChange={(e) =>
                  setLink(
                    e.target.value
                  )
                }
                placeholder="Work link"
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
              />

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 h-24"
              />

              <button
                type="button"
                onClick={addProof}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                <Plus size={16} />
                Add Link
              </button>

              {proofs.length > 0 && (
                <div className="space-y-3 mt-4">
                  {proofs.map(
                    (
                      proof,
                      index
                    ) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
                      >
                        <div className="flex justify-between items-start gap-3">

                          <div className="flex-1 overflow-hidden">
                            <p className="text-blue-400 break-all">
                              {
                                proof.link
                              }
                            </p>

                            <p className="text-zinc-400 text-sm mt-1">
                              {
                                proof.description
                              }
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeProof(
                                index
                              )
                            }
                            className="text-red-500"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <textarea
            value={rejectReason}
            onChange={(e) =>
              setRejectReason(
                e.target.value
              )
            }
            placeholder="Reason for rejection"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 h-32"
          />
        )}

        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 rounded-lg text-white"
          >
            Cancel
          </button>

          <button
            onClick={
              handleConfirm
            }
            className={`px-4 py-2 rounded-lg text-white ${
              mode === "submit"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          >
            {mode === "submit"
              ? "Submit Work"
              : "Reject"}
          </button>

        </div>
      </div>
    </div>
  );
}