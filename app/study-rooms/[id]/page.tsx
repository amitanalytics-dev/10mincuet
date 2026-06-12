"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

interface Message {
  _id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: number;
}

interface Note {
  _id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  createdAt: number;
}

interface ScoreboardEntry {
  userId: string;
  userName: string;
  messageCount: number;
}

interface Room {
  _id: string;
  name: string;
  subject: string;
  hostName: string;
  description?: string;
  maxParticipants: number;
  joinCode: string;
  isActive: boolean;
}

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
  "All Subjects": "#8b5cf6",
};

type Tab = "chat" | "notes" | "scoreboard";

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [tab, setTab] = useState<Tab>("chat");
  const [loading, setLoading] = useState(true);
  const [msgInput, setMsgInput] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteAdding, setNoteAdding] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${id}/messages`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      // ignore
    }
  }, [id]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${id}/notes`);
      const data = await res.json();
      setNotes(data.notes ?? []);
    } catch {
      // ignore
    }
  }, [id]);

  const fetchScoreboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${id}/scoreboard`);
      const data = await res.json();
      setScoreboard(data.scoreboard ?? []);
    } catch {
      // ignore
    }
  }, [id]);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/study-rooms/${id}`);
      const data = await res.json();
      setRoom(data.room ?? null);
      setParticipantCount(data.participantCount ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
    fetchMessages();
    fetchNotes();
    fetchScoreboard();

    pollRef.current = setInterval(() => {
      fetchMessages();
      if (tab === "scoreboard") fetchScoreboard();
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchRoom, fetchMessages, fetchNotes, fetchScoreboard, tab]);

  useEffect(() => {
    if (tab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tab]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgInput.trim() || msgSending) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { window.location.href = "/login"; return; }
    setMsgSending(true);
    const text = msgInput.trim();
    setMsgInput("");
    try {
      await fetch(`/api/rooms/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text }),
      });
      await fetchMessages();
      await fetchScoreboard();
    } catch {
      setMsgInput(text);
    } finally {
      setMsgSending(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim() || noteAdding) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { window.location.href = "/login"; return; }
    setNoteAdding(true);
    try {
      await fetch(`/api/rooms/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: noteTitle.trim(), content: noteContent.trim() }),
      });
      setNoteTitle("");
      setNoteContent("");
      setShowNoteForm(false);
      await fetchNotes();
    } catch {
      // ignore
    } finally {
      setNoteAdding(false);
    }
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🚪</div>
          <h2 className="text-lg font-black text-gray-900 mb-2">Room Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">This room may have been closed or doesn't exist.</p>
          <Link href="/study-rooms" className="text-orange-500 font-semibold">
            ← Back to Study Rooms
          </Link>
        </div>
      </div>
    );
  }

  const accent = SUBJECT_COLOR[room.subject] ?? "#6b7280";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNav />

      {/* Room header */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/study-rooms"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ←
            </Link>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
              style={{ backgroundColor: accent }}
            >
              {room.subject.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-gray-900 text-sm">{room.name}</h1>
                {!room.isActive && (
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                    Closed
                  </span>
                )}
                {room.isActive && (
                  <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">
                    Live
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                by {room.hostName} · {participantCount}/{room.maxParticipants} members · Code: {room.joinCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 w-full flex-1 flex flex-col">
        {room.description && (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4 text-sm text-gray-600">
            {room.description}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {(["chat", "notes", "scoreboard"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "chat" ? `💬 Chat (${messages.length})` : t === "notes" ? `📝 Notes (${notes.length})` : `🏆 Scoreboard`}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {tab === "chat" && (
          <div className="flex flex-col flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ minHeight: "400px" }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "500px" }}>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                  No messages yet. Start the conversation!
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg._id} className="flex gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5"
                    style={{ backgroundColor: accent }}
                  >
                    {msg.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-gray-800">{msg.userName}</span>
                      <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5 break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-100 p-3">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value.slice(0, 500))}
                  placeholder={room.isActive ? "Type a message…" : "Room is closed"}
                  disabled={!room.isActive}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!msgInput.trim() || msgSending || !room.isActive}
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50"
                  style={{ backgroundColor: accent }}
                >
                  {msgSending ? "…" : "Send"}
                </button>
              </form>
              {msgInput.length > 450 && (
                <p className="text-xs text-gray-400 mt-1">{500 - msgInput.length} chars left</p>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {tab === "notes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{notes.length} shared note{notes.length !== 1 ? "s" : ""}</p>
              {room.isActive && (
                <button
                  onClick={() => setShowNoteForm((s) => !s)}
                  className="px-3 py-1.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-all"
                  style={{ backgroundColor: accent }}
                >
                  {showNoteForm ? "Cancel" : "+ Add Note"}
                </button>
              )}
            </div>

            {showNoteForm && (
              <form
                onSubmit={addNote}
                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm"
              >
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title (e.g. Kinematics Key Formulas)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Note content… share formulas, tips, solved examples"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
                <button
                  type="submit"
                  disabled={noteAdding}
                  className="px-5 py-2.5 rounded-full text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
                  style={{ backgroundColor: accent }}
                >
                  {noteAdding ? "Adding…" : "Share Note"}
                </button>
              </form>
            )}

            {notes.length === 0 && !showNoteForm && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-500 text-sm">No shared notes yet.</p>
                {room.isActive && (
                  <button
                    onClick={() => setShowNoteForm(true)}
                    className="mt-4 text-sm font-semibold text-orange-500 hover:underline"
                  >
                    Add the first note →
                  </button>
                )}
              </div>
            )}

            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-black text-gray-900">{note.title}</h3>
                  <div className="text-xs text-gray-400 shrink-0">
                    {formatTime(note.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: accent }}
                  >
                    {note.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-500">by {note.userName}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scoreboard Tab */}
        {tab === "scoreboard" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Room Contributions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ranked by messages sent</p>
            </div>

            {scoreboard.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No activity yet. Start chatting to appear on the scoreboard!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {scoreboard.map((entry, i) => (
                  <div key={entry.userId} className="flex items-center gap-4 px-5 py-3.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        i === 0
                          ? "bg-yellow-400 text-white"
                          : i === 1
                          ? "bg-gray-300 text-white"
                          : i === 2
                          ? "bg-orange-300 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
                      style={{ backgroundColor: accent }}
                    >
                      {entry.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{entry.userName}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-gray-900">{entry.messageCount}</div>
                      <div className="text-xs text-gray-400">messages</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
