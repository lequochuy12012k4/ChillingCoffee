"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Navbar from "@/app/components/client/Navbar";
import Footer from "@/app/components/client/Footer";
import { useSession } from "next-auth/react";

type Review = {
  _id: string;
  user?: { _id: string; name?: string; email?: string } | string;
  menuItem?: { _id: string; title?: string } | string;
  rating: number;
  image?: string;
  comment?: string;
};

const apiBase = `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;

export default function CustomerFeedbackPage() {
  const { user } = useAuth();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [userId, setUserId] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [productText, setProductText] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<string>("");
  const [items, setItems] = useState<Array<{ _id: string; title: string }>>([]);
  const [showGoogleAlert, setShowGoogleAlert] = useState(false);

  const reviewsUrl = useMemo(() => `${apiBase}/reviews`, []);
  const itemsUrl = useMemo(() => `${apiBase}/menu.items?category=drink`, []);
  const uploadUrl = useMemo(() => `${apiBase}/uploads`, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(reviewsUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load reviews (${res.status})`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.result) ? (data as any).result : [];
      setReviews(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Sync current user id
  useEffect(() => {
    if (user?._id) setUserId(user._id);
  }, [user]);

  // Removed backend profile fetch to avoid 401 when using Google OAuth token.

  // Fallback 2: if we at least have session.user.email, look up user by email (public endpoint)
  useEffect(() => {
    const lookupByEmail = async () => {
      if (userId) return;
      const email = session?.user?.email;
      if (!email) return;
      try {
        const res = await fetch(`${apiBase}/users?email=${encodeURIComponent(email)}&current=1&pageSize=1`, { cache: 'no-store' });
        const data = await res.json();
        const list = Array.isArray(data?.result) ? data.result : Array.isArray(data) ? data : [];
        if (list[0]?._id) setUserId(list[0]._id);
      } catch (e) {
        // ignore
      }
    };
    lookupByEmail();
  }, [session, userId, apiBase]);

  // Show notice for Google accounts (session present but no resolved backend userId)
  useEffect(() => {
    if (session?.user && !userId) setShowGoogleAlert(true);
    else setShowGoogleAlert(false);
  }, [session, userId]);

  // Load drinks to select a product to review
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(itemsUrl, { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray((data as any)?.result) ? (data as any).result : [];
        setItems(list.map((it: any) => ({ _id: it._id, title: it.title })));
      } catch {}
    })();
  }, [itemsUrl]);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = { user: userId, rating, comment };
      if (menuItemId) payload.menuItem = menuItemId;
      if (!menuItemId && productText) payload.productText = productText;
      if (image) payload.image = image;
      const res = await fetch(reviewsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      setUserId(user?._id || "");
      setMenuItemId("");
      setRating(5);
      setComment("");
      setImage("");
      setProductText("");
      await fetchReviews();
    } catch (e: any) {
      setError(e?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Customer Feedback</h1>
      <p className="text-gray-600 mb-6">Read what our customers say about our drinks.</p>

      {showGoogleAlert && (
        <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 text-yellow-800 px-3 py-2 text-sm">
          The Feedback not work with Google account
        </div>
      )}
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-6">
        {reviews.map((r, idx) => {
          const user = typeof r.user === 'string' ? undefined : r.user;
          const item = typeof r.menuItem === 'string' ? undefined : r.menuItem;
          const left = idx % 2 === 0;
          return (
            <div key={r._id} className={`flex ${left ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-2xl w-full border rounded p-4 ${left ? 'bg-white' : 'bg-gray-50'} shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {item?.title || (r as any).productText || 'General feedback'}
                  </div>
                  <div className="text-yellow-600 font-semibold">{r.rating}/5</div>
                </div>
                {r.comment && <div className="text-gray-700 mt-2">{r.comment}</div>}
                <div className="text-sm text-gray-500 mt-2">
                  by {user?.name || user?.email || 'Anonymous'}
                </div>
                {r.image && (
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt="review" className="w-full max-h-64 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!loading && reviews.length === 0 && (
          <div className="text-sm text-gray-500">No feedback yet.</div>
        )}
      </div>

      <div className="bg-white border rounded p-4 mt-10">
        <h2 className="text-lg font-medium mb-3">Leave your feedback</h2>
        <form onSubmit={submitFeedback} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Your Name</label>
            <input className="border p-2 rounded w-full bg-gray-50" placeholder="Name" value={(session?.user?.name as string) || user?.name || ""} disabled />
            {!userId && <p className="text-xs text-red-600">Please <a href="/login" className="text-blue-600">log in</a> to submit feedback.</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Product (optional)</label>
            <select className="border p-2 rounded w-full" value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)}>
              <option value="">General feedback</option>
              {items.map((it) => (
                <option key={it._id} value={it._id}>{it.title}</option>
              ))}
            </select>
            {!menuItemId && (
              <input className="border p-2 rounded w-full mt-2" placeholder="Or type product name" value={productText} onChange={(e) => setProductText(e.target.value)} />
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Rating</label>
            <input type="number" min={1} max={5} className="border p-2 rounded w-full" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-gray-600">Comment</label>
            <textarea className="border p-2 rounded w-full" placeholder="Write your thoughts..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-gray-600">Image (optional)</label>
            <div className="flex items-center gap-3">
              <input className="border p-2 rounded w-full" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
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
                    setImage(absolute);
                  }
                }} />
              </label>
            </div>
          </div>
          <div className="md:col-span-2 flex gap-2 pt-1">
            <button type="submit" disabled={submitting || !userId} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}


