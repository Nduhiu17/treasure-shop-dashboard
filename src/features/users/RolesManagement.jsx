import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Loader from "../../components/ui/Loader";
import { Dialog } from "../../components/ui/dialog";
import { useToast } from "../../components/ui/toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const jwt = localStorage.getItem("jwt_token");

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : ""
        }
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      setError(err.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { name: form.name, description: form.description };
      const res = await fetch(`${API_BASE_URL}/api/admin/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : ""
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create role");
      showToast({ message: "Role created successfully", type: "success" });
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      fetchRoles();
    } catch (err) {
      showToast({ message: err.message || "Failed to create role", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h2 className="text-lg font-bold text-blue-900">Roles Management</h2>
        <Button onClick={() => setCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Create Role
        </Button>
      </div>
      {loading ? <Loader /> : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full border-separate border-spacing-y-0 rounded-2xl overflow-hidden shadow-xl bg-white">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-100 to-blue-50 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Description</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {roles.map((role, idx) => (
                <tr key={role.id} className={`transition group ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`} style={{ boxShadow: '0 1px 4px 0 rgba(30, 64, 175, 0.04)' }}>
                  <td className="px-6 py-4 font-semibold text-blue-900 capitalize align-middle">{role.name}</td>
                  <td className="px-6 py-4 text-gray-700 align-middle">{role.description}</td>
                  <td className="px-6 py-4 text-right align-middle">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 focus:outline-none shadow-sm transition"
                        title="Edit role"
                        onClick={e => {
                          e.preventDefault();
                          setRoleToEdit(role);
                          setEditForm({ name: role.name, description: role.description || "" });
                          setEditOpen(true);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 17z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 focus:outline-none shadow-sm transition"
                        title="Delete role"
                        onClick={e => {
                          e.preventDefault();
                          setRoleToDelete(role);
                          setConfirmOpen(true);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
      <Dialog isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Role">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!roleToEdit) return;
            setEditing(true);
            try {
              const res = await fetch(`${API_BASE_URL}/api/admin/roles/${roleToEdit.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: jwt ? `Bearer ${jwt}` : ""
                },
                body: JSON.stringify({ name: editForm.name, description: editForm.description })
              });
              if (!res.ok) throw new Error("Failed to update role");
              showToast({ message: "Role updated successfully", type: "success" });
              setEditOpen(false);
              setRoleToEdit(null);
              fetchRoles();
            } catch (err) {
              showToast({ message: err.message || "Failed to update role", type: "error" });
            } finally {
              setEditing(false);
            }
          }}
          className="p-4 flex flex-col gap-4 min-w-[260px]"
        >
          <h3 className="text-lg font-bold text-blue-900 mb-2">Edit Role</h3>
          <input
            type="text"
            required
            placeholder="Name"
            value={editForm.name}
            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
            className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            required
            placeholder="Description"
            value={editForm.description}
            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
            className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" onClick={() => setEditOpen(false)} variant="secondary">Cancel</Button>
            <Button type="submit" disabled={editing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">
              {editing ? <Loader size={4} /> : "Update"}
            </Button>
          </div>
        </form>
      </Dialog>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Role"
        message={roleToDelete ? `Are you sure you want to delete the role '${roleToDelete.name}'? This cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => { setConfirmOpen(false); setRoleToDelete(null); }}
        onConfirm={async () => {
          if (!roleToDelete) return;
          setDeleting(true);
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/roles/${roleToDelete.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: jwt ? `Bearer ${jwt}` : ''
              }
            });
            if (!res.ok) throw new Error('Failed to delete role');
            showToast({ type: 'success', message: `Role '${roleToDelete.name}' deleted successfully` });
            setConfirmOpen(false);
            setRoleToDelete(null);
            fetchRoles();
          } catch (err) {
            showToast({ type: 'error', message: err.message || 'Failed to delete role' });
          } finally {
            setDeleting(false);
          }
        }}
      />
      <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Role">
        <form onSubmit={handleCreate} className="p-4 flex flex-col gap-4 min-w-[260px]">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Create Role</h3>
          <input
            type="text"
            required
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            required
            placeholder="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" onClick={() => setCreateOpen(false)} variant="secondary">Cancel</Button>
            <Button type="submit" disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">
              {creating ? <Loader size={4} /> : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
};

export default RolesManagement;
