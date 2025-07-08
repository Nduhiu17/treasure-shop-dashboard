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
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 bg-blue-50 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100 max-h-80 overflow-y-auto block">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-blue-50 transition group">
                  <td className="px-4 py-2 whitespace-nowrap capitalize flex items-center justify-between gap-2">
                    <span>{role.name}</span>
                    <button
                      className="ml-2 p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 focus:outline-none opacity-70 group-hover:opacity-100 transition"
                      title="Delete role"
                      onClick={e => {
                        e.preventDefault();
                        setRoleToDelete(role);
                        setConfirmOpen(true);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
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
