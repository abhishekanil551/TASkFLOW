import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Shield,
  User,
  Users,
  X,
  Mail,
} from "lucide-react";

import type {
  WorkspaceMember,
  UserRole,
} from "../../types/workspace";

interface MembersTabProps {
  members: WorkspaceMember[];

  currentUserId: string;

  currentUserRole: UserRole;

  onAddMember: (
    email: string,
    role: UserRole
  ) => void;

  onRemoveMember: (
    memberId: string
  ) => void;

  onUpdateRole: (
    memberId: string,
    role: UserRole
  ) => void;
}

export function MembersTab({
  members,
  currentUserId,
  currentUserRole,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
}: MembersTabProps) {
  const [
    showAddModal,
    setShowAddModal,
  ] = useState(false);

  const [
    newMemberEmail,
    setNewMemberEmail,
  ] = useState("");

  const [
    newMemberRole,
    setNewMemberRole,
  ] = useState<UserRole>(
    "member"
  );

  const [
    emailError,
    setEmailError,
  ] = useState("");

  const isAdmin =
    currentUserRole ===
    "admin";


  const safeMembers =
    useMemo(() => {
      return (
        members || []
      ).map(
        (
          member,
          index
        ) => {
          // REAL EMAIL
          const realEmail =
            member.email?.trim() ||
            "";

          // REAL NAME
          const realName =
            member.name?.trim() ||
            "";

          // DISPLAY NAME
          let displayName =
            realName;

          if (
            !displayName &&
            realEmail
          ) {
            displayName =
              realEmail.split(
                "@"
              )[0];
          }

          if (
            !displayName
          ) {
            displayName = `Member ${index + 1}`;
          }

          // DISPLAY EMAIL
          const displayEmail =
            realEmail ||
            "No email";

          return {
            ...member,

            id:
              member.id ||
              member.userId ||
              `member-${index}`,

            userId:
              member.userId ||
              member.id,

            name:
              displayName,

            email:
              displayEmail,

            role:
              member.role ||
              "member",
          };
        }
      );
    }, [members]);

  const adminCount =
    safeMembers.filter(
      (
        member
      ) =>
        member.role ===
        "admin"
    ).length;

  const memberCount =
    safeMembers.filter(
      (
        member
      ) =>
        member.role ===
        "member"
    ).length;

  const handleAddMember =
    async () => {
      const email =
        newMemberEmail.trim();

      if (!email) {
        setEmailError(
          "Email is required"
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(email)
      ) {
        setEmailError(
          "Invalid email format"
        );
        return;
      }

      try {
        setEmailError("");

        await onAddMember(
          email,
          newMemberRole
        );

        setNewMemberEmail("");
        setNewMemberRole(
          "member"
        );
        setShowAddModal(
          false
        );
      } catch (error: any) {
        setEmailError(
          error?.response?.data
            ?.message ||
          "User not found"
        );
      }
    };

  const getRoleBadge = (
    role: UserRole
  ) => {
    if (
      role ===
      "admin"
    ) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 rounded-full text-xs">
        <User className="w-3 h-3" />
        Member
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Members
          </h2>

          <p className="text-sm text-zinc-400 mt-1">
            {adminCount} admin
            {adminCount !==
              1
              ? "s"
              : ""}
            ,{" "}
            {
              memberCount
            }{" "}
            member
            {memberCount !==
              1
              ? "s"
              : ""}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() =>
              setShowAddModal(
                true
              )
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {/* EMPTY */}
      {safeMembers.length ===
        0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-zinc-600" />
            </div>

            <p className="text-zinc-400 text-sm">
              No members found
            </p>
          </div>
        )}

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {safeMembers.map(
            (
              member
            ) => {
              const avatarLetter =
                (
                  member.name ||
                  member.email ||
                  "U"
                )
                  .charAt(
                    0
                  )
                  .toUpperCase();

              const isCurrentUser =
                member.userId ===
                currentUserId ||
                member.id ===
                currentUserId;

              return (
                <div
                  key={
                    member.id
                  }
                  className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/80 transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-semibold text-white">
                      {
                        avatarLetter
                      }
                    </div>

                    <div>
                      <p className="text-white font-medium">
                        {
                          member.name
                        }
                      </p>

                      <p className="text-zinc-400 text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {
                          member.email
                        }
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    {getRoleBadge(
                      member.role
                    )}

                    {isAdmin &&
                      !isCurrentUser && (
                        <div className="flex items-center gap-2">
                          <select
                            value={
                              member.role
                            }
                            onChange={(
                              e
                            ) =>
                              onUpdateRole(
                                member.userId,
                                e.target.value as UserRole
                              )
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white"
                          >
                            <option value="member">
                              Member
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>

                          <button
                            onClick={() =>
                              onRemoveMember(
                                member.userId
                              )
                            }
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                    {isCurrentUser && (
                      <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800 rounded">
                        You
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-zinc-700">
              <h3 className="text-lg font-semibold text-white">
                Add New Member
              </h3>

              <button
                onClick={() =>
                  setShowAddModal(
                    false
                  )
                }
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="email"
                value={
                  newMemberEmail
                }
                onChange={(e) => {
                  setNewMemberEmail(
                    e.target.value
                  );

                  if (emailError) {
                    setEmailError("");
                  }
                }}
                placeholder="member@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
              />

              {emailError && (
                <p className="text-red-500 text-sm">
                  {emailError}
                </p>
              )}

              <select
                value={
                  newMemberRole
                }
                onChange={(
                  e
                ) =>
                  setNewMemberRole(
                    e.target
                      .value as UserRole
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
              >
                <option value="member">
                  Member
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div className="flex gap-3 p-6 border-t border-zinc-700">
              <button
                onClick={() =>
                  setShowAddModal(
                    false
                  )
                }
                className="flex-1 px-4 py-2.5 bg-zinc-800 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAddMember
                }
                className="flex-1 px-4 py-2.5 bg-blue-600 rounded-lg text-white"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}