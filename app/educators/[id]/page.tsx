"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

const SUBJECT_COLOR: Record<string, string> = {
  Physics: "#3b82f6",
  Chemistry: "#10b981",
  Math: "#f97316",
  "All Subjects": "#6b7280",
};

interface Educator {
  _id: string;
  name: string;
  subjects: string[];
  bio: string;
  specialization?: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  isVerified: boolean;
  createdAt: number;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className="w-4 h-4"
            fill={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating > 0 ? rating.toFixed(1) : "No ratings yet"}
        {count > 0 && ` · ${count} reviews`}
      </span>
    </div>
  );
}

export default function EducatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [educator, setEducator] = useState<Educator | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<{ _id: string; slug: string; title: string; summary?: string; publishedAt?: number; viewCount: number }[]>([]);
  const [sets, setSets] = useState<{ _id: string; slug: string; title: string; subject: string; questionIds: string[]; attemptCount: number; description?: string }[]>([]);

  useEffect(() => {
    fetch(`/api/educators/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEducator(d.educator);
        setFollowerCount(d.followerCount ?? 0);
        setFollowing(d.isFollowing ?? false);
      })
      .catch(() => setError("Failed to load educator"))
      .finally(() => setLoading(false));
    fetch(`/api/educators/${id}/content`)
      .then((r) => r.json())
      .then((d) => {
        setNotes(d.notes ?? []);
        setSets(d.sets ?? []);
      })
      .catch(() => {});
  }, [id]);

  async function handleFollow() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { window.location.href = "/login"; return; }
    setFollowLoading(true);
    try {
      const action = following ? "unfollow" : "follow";
      const res = await fetch(`/api/educators/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setFollowing(!following);
        setFollowerCount((c) => following ? c - 1 : c + 1);
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !educator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">{error || "Educator not found."}</p>
          <Link href="/educators" className="text-orange-500 font-semibold mt-4 inline-block">
            ← Back to Educators
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/educators" className="text-sm text-gray-500 hover:text-gray-700 font-semibold mb-6 inline-flex items-center gap-1">
          ← All Educators
        </Link>

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-2xl">
                {educator.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{educator.name}</h1>
                  {educator.isVerified && (
                    <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                {educator.specialization && (
                  <p className="text-orange-100 text-sm mt-0.5">{educator.specialization}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-orange-100 text-sm">
                  <span>{followerCount} followers</span>
                  {educator.rating > 0 && (
                    <span>★ {educator.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
                  following
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white text-orange-600 hover:bg-orange-50"
                } disabled:opacity-50`}
              >
                {followLoading ? "…" : following ? "Following ✓" : "Follow"}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Subjects */}
            <div className="flex gap-2 flex-wrap mb-5">
              {educator.subjects.map((s) => (
                <span
                  key={s}
                  className="text-sm font-semibold px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: SUBJECT_COLOR[s] ?? "#6b7280" }}
                >
                  {s}
                </span>
              ))}
            </div>

            <StarRating rating={educator.rating} count={educator.totalRatings} />

            {/* Bio */}
            <div className="mt-5">
              <h2 className="font-black text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{educator.bio}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl font-black text-orange-500">{followerCount}</div>
                <div className="text-xs text-gray-500 mt-0.5">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-blue-500">
                  {educator.rating > 0 ? educator.rating.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-green-500">
                  {new Date(educator.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Joined</div>
              </div>
            </div>
          </div>
        </div>

        {/* Published notes */}
        {notes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-black text-gray-900 mb-4">Notes ({notes.length})</h3>
            <div className="space-y-3">
              {notes.map((n) => (
                <Link
                  key={n._id}
                  href={`/educators/${id}/notes/${n.slug}`}
                  className="block border border-gray-100 rounded-xl px-4 py-3 hover:border-orange-300 hover:bg-orange-50/30 transition-all"
                >
                  <p className="font-bold text-gray-900">{n.title}</p>
                  {n.summary && <p className="text-sm text-gray-500 mt-1">{n.summary}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {n.publishedAt &&
                      new Date(n.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    {" · "}
                    {n.viewCount} views
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Published question sets */}
        {sets.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-black text-gray-900 mb-4">Question sets ({sets.length})</h3>
            <div className="space-y-3">
              {sets.map((s) => (
                <div
                  key={s._id}
                  className="border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{s.title}</p>
                      {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ background: SUBJECT_COLOR[s.subject] ?? "#6b7280" }}
                    >
                      {s.subject}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {s.questionIds.length} questions · {s.attemptCount} attempts
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 text-center">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-black text-gray-900 mb-2">Study Together</h3>
          <p className="text-sm text-gray-600 mb-4">
            Join a Group Study Room to learn with this educator and other students.
          </p>
          <Link
            href="/study-rooms"
            className="inline-block px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Browse Study Rooms →
          </Link>
        </div>
      </div>
    </div>
  );
}
