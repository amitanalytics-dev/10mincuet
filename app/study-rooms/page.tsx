"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

const SUBJECTS = ["All Subjects", "Languages", "Domain", "General Test"];

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
  "All Subjects": "#8b5cf6",
};

interface Room {
  _id: string;
  name: string;
  subject: string;
  hostName: string;
  description?: string;
  maxParticipants: number;
  participantCount: number;
  joinCode: string;
  scheduledAt?: number;
  createdAt: number;
  isActive: boolean;
}

function RoomCard({ room, onJoin }: { room: Room; onJoin: (room: Room) => void }) {
  const accent = SUBJECT_COLOR[room.subject] ?? "#6b7280";
  const isFull = room.participantCount >= room.maxParticipants;
  const spotsLeft = room.maxParticipants - room.participantCount;

  const scheduledText = room.scheduledAt
    ? new Date(room.scheduledAt).toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Starting now";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: accent }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-gray-900 text-base">{room.name}</h3>
              {isFull && (
                <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Full</span>
              )}
              {!isFull && room.participantCount > 0 && (
                <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">
                  Live
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Hosted by {room.hostName}</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0"
            style={{ backgroundColor: accent }}
          >
            {room.subject}
          </span>
        </div>

        {room.description && (
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{room.description}</p>
        )}

        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span>🕐 {scheduledText}</span>
          <span>
            👥 {room.participantCount}/{room.maxParticipants} joined
          </span>
        </div>

        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${(room.participantCount / room.maxParticipants) * 100}%`,
              backgroundColor: accent,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
            Code: <span className="font-bold text-gray-700">{room.joinCode}</span>
          </div>
          <button
            disabled={isFull}
            onClick={() => onJoin(room)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isFull
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-white hover:opacity-90"
            }`}
            style={!isFull ? { backgroundColor: accent } : {}}
          >
            {isFull ? "Full" : `Join · ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateRoomModal({ onClose, onCreated }: { onClose: () => void; onCreated: (room: { roomId: string; joinCode: string }) => void }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState<string>("Languages");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/study-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, subject, description, maxParticipants }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create room");
      onCreated(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="font-black text-gray-900 text-lg mb-5">Create Study Room</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Room Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electrostatics Sprint Session"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Subject</label>
            <div className="flex gap-2 flex-wrap">
              {["Languages", "Domain", "General Test", "All Subjects"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    subject === s ? "text-white" : "bg-gray-100 text-gray-600"
                  }`}
                  style={subject === s ? { backgroundColor: SUBJECT_COLOR[s] } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">What will you study?</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Working through CUET 2024 Paper 1 Mechanics questions together"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Max Participants: <span className="text-orange-500">{maxParticipants}</span>
            </label>
            <input
              type="range"
              min={2}
              max={20}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>2</span><span>20</span>
            </div>
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
              {loading ? "Creating…" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JoinByCodeModal({ onClose, onJoined }: { onClose: () => void; onJoined: (roomId: string) => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/study-rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ joinCode: code.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to join room");
      onJoined(data.roomId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error joining room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-black text-gray-900 text-lg mb-5">Join by Room Code</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">6-Character Room Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB3XYZ"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-mono font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="flex-1 px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Joining…" : "Join Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/study-rooms");
      const data = await res.json();
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  async function handleJoin(room: Room) {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/study-rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roomId: room._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setJoinedRoomId(data.roomId);
        fetchRooms();
      }
    } catch {
      // ignore
    }
  }

  const filtered =
    filterSubject === "All Subjects"
      ? rooms
      : rooms.filter((r) => r.subject === filterSubject || r.subject === "All Subjects");

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Group Study Rooms</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Study with peers in real time. Create a room or join one by code.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/study-rooms/host"
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                📊 My host stats
              </Link>
              <button
                onClick={() => setShowJoinCode(true)}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                # Join by Code
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                + Create Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Joined banner */}
        {joinedRoomId && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="font-bold text-green-800 text-sm">You joined the room!</p>
                <p className="text-xs text-green-600">Your spot is reserved. Start studying.</p>
              </div>
            </div>
            <button
              onClick={() => setJoinedRoomId(null)}
              className="text-green-400 hover:text-green-600 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Subject tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSubject(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filterSubject === s
                  ? "text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
              style={filterSubject === s ? { backgroundColor: SUBJECT_COLOR[s] } : {}}
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
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-lg font-black text-gray-900 mb-2">No Active Rooms</h2>
            <p className="text-sm text-gray-500 mb-6">
              {filterSubject !== "All Subjects"
                ? `No ${filterSubject} rooms right now.`
                : "No study rooms are open right now."}{" "}
              Be the first to create one!
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              Create the First Room
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4 font-semibold uppercase tracking-wide">
              {filtered.length} active room{filtered.length !== 1 ? "s" : ""} · refreshes every 15s
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((room) => (
                <RoomCard key={room._id} room={room} onJoin={handleJoin} />
              ))}
            </div>
          </>
        )}

        {/* How it works */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-black text-gray-900 mb-4">How Group Study Rooms Work</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "➕", title: "Create a Room", desc: "Pick a topic, set a size limit, share the 6-character code with your group." },
              { icon: "🤝", title: "Study Together", desc: "Work through problems side-by-side. Everyone studies their own 10minCUET session simultaneously." },
              { icon: "📈", title: "Track Progress", desc: "Each member's Bloom level and scores update in real time on their own profile." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="text-2xl shrink-0">{icon}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreated={(result) => {
            setShowCreate(false);
            setJoinedRoomId(result.roomId);
            fetchRooms();
          }}
        />
      )}

      {showJoinCode && (
        <JoinByCodeModal
          onClose={() => setShowJoinCode(false)}
          onJoined={(roomId) => {
            setShowJoinCode(false);
            setJoinedRoomId(roomId);
            fetchRooms();
          }}
        />
      )}
    </div>
  );
}
