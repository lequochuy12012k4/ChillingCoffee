"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  _id?: string;
  user: string | { _id: string; name?: string; email?: string };
  menuItem?: string | { _id: string; title?: string };
  productText?: string;
  rating: number;
  image?: string;
  comment?: string;
};

const apiBase = `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Review>({ user: "", menuItem: "", rating: 5, comment: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reviewsUrl = useMemo(() => `${apiBase}/reviews`, []);
  const uploadUrl = useMemo(() => `${apiBase}/uploads`, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(reviewsUrl, { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.result) ? (data as any).result : [];
      setReviews(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setForm({ user: "", menuItem: "", rating: 5, comment: "" });
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      if (!payload.menuItem) delete payload.menuItem;
      if (typeof payload.user !== 'string') payload.user = (payload.user as any)?._id;
      if (typeof payload.menuItem !== 'string') payload.menuItem = (payload.menuItem as any)?._id;
      if (editingId) {
        await fetch(`${reviewsUrl}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(reviewsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchReviews();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (r: Review) => {
    setForm({ user: (r.user as any)?._id || (r.user as any), menuItem: (r.menuItem as any)?._id || (r.menuItem as any), rating: r.rating, image: r.image, comment: r.comment });
    setEditingId(r._id || null);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    await fetch(`${reviewsUrl}/${id}`, { method: "DELETE" });
    await fetchReviews();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feedback</h1>
        {loading && <span className="text-sm text-gray-500">Loading...</span>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b"><span className="font-medium">{editingId ? 'Edit feedback' : 'Create feedback'}</span></div>
            <form onSubmit={submit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">User ID</label>
                <input className="border p-2 rounded w-full" placeholder="User ID" value={(form.user as any) || ""} onChange={(e) => setForm({ ...form, user: e.target.value as any })} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Menu Item ID (drink)</label>
                <input className="border p-2 rounded w-full" placeholder="Menu Item ID (drink)" value={(form.menuItem as any) || ""} onChange={(e) => setForm({ ...form, menuItem: e.target.value as any })} />
                <input className="border p-2 rounded w-full mt-2" placeholder="Or typed product name" value={(form as any).productText || ""} onChange={(e) => setForm({ ...(form as any), productText: e.target.value }) as any} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Rating</label>
                  <input className="border p-2 rounded w-full" type="number" min={1} max={5} placeholder="Rating" value={form.rating || 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
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
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Comment</label>
                <textarea className="border p-2 rounded w-full" placeholder="Comment" value={form.comment || ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
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
              <span className="font-medium">All feedback</span>
              <div className="text-sm text-gray-500">{reviews.length} total</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 font-medium text-gray-600">User</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Product</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Rating</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reviews.map((r) => {
                    const user = typeof r.user === 'string' ? undefined : r.user;
                    const item = typeof r.menuItem === 'string' ? undefined : r.menuItem;
                    return (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{user?.name || user?.email || (r.user as any)}</td>
                        <td className="px-4 py-2 text-gray-600">{item?.title || (r as any).productText || (r.menuItem as any) || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <span className="text-xs px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">{r.rating}</span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded" onClick={() => onEdit(r)}>Edit</button>
                            <button className="px-3 py-1 text-xs bg-red-600 text-white rounded" onClick={() => onDelete(r._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {reviews.length === 0 && !loading && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No feedback found.</td>
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


