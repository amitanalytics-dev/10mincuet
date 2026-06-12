"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
  Biology: "#8b5cf6",
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
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className="w-3.5 h-3.5"
            fill={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating > 0 ? rating.toFixed(1) : "New"} {count > 0 ? `(${count})` : ""}
      </span>
    </div>
  );
}

function EducatorCard({ educator }: { educator: Educator }) {
  return (
    <Link
      href={`/educators/${educator._id}`}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg shrink-0">
            {educator.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                {educator.name}
              </h3>
              {educator.isVerified && (
                <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            {educator.specialization && (
              <p className="text-xs text-gray-500 mt-0.5">{educator.specialization}</p>
            )}
            <StarRating rating={educator.rating} count={educator.totalRatings} />
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">{educator.bio}</p>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {educator.subjects.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: SUBJECT_COLOR[s] ?? "#6b7280" }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-800">{educator.totalStudents}</span> followers
          </div>
          <span className="text-xs text-orange-500 font-semibold group-hover:underline">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}

function BecomeEducatorModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SUBJECT_OPTIONS = ["Languages", "Domain", "General Test", "All Subjects"];

  function toggleSubject(s: string) {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (subjects.length === 0) { setError("Select at least one subject"); return; }
    setLoading(true);
    setError("");
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/educators", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, subjects, bio, specialization: specialization || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create profile");
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-black text-gray-900 text-lg mb-1">Become an Educator</h3>
        <p className="text-sm text-gray-500 mb-5">Share your knowledge with CUET aspirants.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name as it'll appear publicly"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Subjects You Teach</label>
            <div className="flex gap-2 flex-wrap">
              {SUBJECT_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSubject(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    subjects.includes(s) ? "text-white" : "bg-gray-100 text-gray-600"
                  }`}
                  style={subjects.includes(s) ? { backgroundColor: SUBJECT_COLOR[s] ?? "#6b7280" } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Specialization (optional)</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. IIT Delhi alumnus, 10+ years CUET coaching"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Bio</label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your teaching approach, experience, and what they'll learn..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EducatorsPage() {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [created, setCreated] = useState(false);

  const SUBJECT_FILTERS = ["All", "Languages", "Domain", "General Test"];

  useEffect(() => {
    fetch("/api/educators")
      .then((r) => r.json())
      .then((d) => setEducators(d.educators ?? []))
      .catch(() => setEducators([]))
      .finally(() => setLoading(false));
  }, [created]);

  const filtered =
    filterSubject === "All"
      ? educators
      : educators.filter((e) => e.subjects.includes(filterSubject));

  const top3 = [...educators].sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Educator Network</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Find mentors, follow educators, and join live study sessions.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              + Become an Educator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Leaderboard */}
        {top3.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-4">
              Top Mentors
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {top3.map((e, i) => (
                <Link
                  key={e._id}
                  href={`/educators/${e._id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:border-orange-200 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl font-black text-gray-300">#{i + 1}</div>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black shrink-0">
                    {e.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{e.name}</p>
                    <p className="text-xs text-gray-500">{e.totalStudents} followers</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subject filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SUBJECT_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSubject(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filterSubject === s
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h2 className="text-lg font-black text-gray-900 mb-2">No Educators Yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              Be the first educator on 10minCUET and build your student community.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              Create Educator Profile
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4 font-semibold uppercase tracking-wide">
              {filtered.length} educator{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((e) => (
                <EducatorCard key={e._id} educator={e} />
              ))}
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <BecomeEducatorModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            setCreated((c) => !c);
          }}
        />
      )}
    </div>
  );
}
