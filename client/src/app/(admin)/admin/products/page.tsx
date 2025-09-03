"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  _id?: string;
  title: string;
  description?: string;
  base_price: string;
  image?: string;
  category: "drink" | "cake";
};

const apiBase = `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Item>({ title: "", base_price: "", category: "drink" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const itemsUrl = useMemo(() => `${apiBase}/menu.items`, []);
  const uploadUrl = useMemo(() => `${apiBase}/uploads`, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(itemsUrl, { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.result) ? (data as any).result : [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", base_price: "", image: "", category: "drink" });
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${itemsUrl}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(itemsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchItems();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (it: Item) => {
    setForm({ title: it.title, description: it.description, base_price: it.base_price, image: it.image, category: it.category });
    setEditingId(it._id || null);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    await fetch(`${itemsUrl}/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        {loading && <span className="text-sm text-gray-500">Loading...</span>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b"><span className="font-medium">{editingId ? 'Edit item' : 'Create item'}</span></div>
            <form onSubmit={submit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Title</label>
                <input className="border p-2 rounded w-full" placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Base price</label>
                  <input className="border p-2 rounded w-full" placeholder="Base price" value={form.base_price || ""} onChange={(e) => setForm({ ...form, base_price: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Category</label>
                  <select className="border p-2 rounded w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Item["category"] })}>
                    <option value="drink">Drink</option>
                    <option value="cake">Cake</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Image</label>
                <div className="flex items-center gap-3">
                  <input className="border p-2 rounded w-full" placeholder="Image URL" value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  <label className="px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      const res = await fetch(uploadUrl, { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data?.url) {
                        const absolute = data.url.startsWith('http') ? data.url : `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001").replace(/\/$/, "")}${data.url}`;
                        setForm({ ...form, image: absolute });
                      }
                    }} />
                  </label>
                </div>
                {form.image && (
                  <div className="pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="preview" className="h-24 w-24 object-cover rounded border" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Description</label>
                <textarea className="border p-2 rounded w-full" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
              <span className="font-medium">All items</span>
              <div className="text-sm text-gray-500">{items.length} total</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 font-medium text-gray-600">Image</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Title</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Category</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Price</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.image || '/ProductsHero/image.png'} alt="thumb" className="h-10 w-10 object-cover rounded border" />
                      </td>
                      <td className="px-4 py-2">{it.title}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${it.category === 'drink' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-pink-50 text-pink-700 border-pink-200'}`}>{it.category}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{it.base_price}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded" onClick={() => onEdit(it)}>Edit</button>
                          <button className="px-3 py-1 text-xs bg-red-600 text-white rounded" onClick={() => onDelete(it._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>No items found.</td>
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