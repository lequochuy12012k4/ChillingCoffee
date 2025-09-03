"use client";

import { useEffect, useMemo, useState } from "react";

type User = {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  role?: string;
  accout_type?: string;
};

const apiBase = `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<User>({ name: "", email: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const usersUrl = useMemo(() => `${apiBase}/users`, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${usersUrl}?current=1&pageSize=100`, { cache: "no-store" });
      const data = await res.json();
      setUsers(data?.result || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", address: "" });
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(usersUrl.replace(/\/$/, ""), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, _id: editingId }),
        });
      } else {
        await fetch(usersUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, password: "123456" }),
        });
      }
      await fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, phone: u.phone, address: u.address, image: u.image });
    setEditingId(u._id || null);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    await fetch(`${usersUrl}/${id}`, { method: "DELETE" });
    await fetchUsers();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        {loading && <span className="text-sm text-gray-500">Loading...</span>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b"><span className="font-medium">{editingId ? 'Edit user' : 'Create user'}</span></div>
            <form onSubmit={submit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Name</label>
                <input className="border p-2 rounded w-full" placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Email</label>
                <input className="border p-2 rounded w-full" placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Phone</label>
                  <input className="border p-2 rounded w-full" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Address</label>
                  <input className="border p-2 rounded w-full" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 border rounded">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-medium">All users</span>
              <div className="text-sm text-gray-500">{users.length} total</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Role</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Account</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2 text-gray-600">{u.email}</td>
                      <td className="px-4 py-2 text-gray-600">{u.phone || '-'}</td>
                      <td className="px-4 py-2 text-gray-600">{u.role || 'user'}</td>
                      <td className="px-4 py-2"><span className="text-gray-700 text-xs px-2 py-0.5 rounded bg-gray-100 border">{u.accout_type || 'local'}</span></td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded" onClick={() => onEdit(u)}>Edit</button>
                          <button className="px-3 py-1 text-xs bg-red-600 text-white rounded" onClick={() => onDelete(u._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}