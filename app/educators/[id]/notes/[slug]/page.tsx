// @ts-nocheck
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { AppNav } from "../../../../components/AppNav";

export const dynamic = "force-dynamic";

async function getNote(educatorId: string, slug: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  const convex = new ConvexHttpClient(url);
  const note = await convex.query(api.educatorNotes.getBySlug, {
    educatorId: educatorId as any,
    slug,
  });
  if (!note || note.status !== "published") return null;
  // Increment view count fire-and-forget
  convex.mutation(api.educatorNotes.incrementView, { noteId: note._id }).catch(() => {});
  const educator = await convex.query(api.educators.getById, { educatorId: educatorId as any });
  return { note, educator };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const data = await getNote(id, slug);
  if (!data) return { title: "Note not found" };
  return {
    title: `${data.note.title} — ${data.educator?.name ?? "Educator"}`,
    description: data.note.summary ?? data.note.title,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const data = await getNote(id, slug);
  if (!data) notFound();
  const { note, educator } = data;

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <article className="max-w-2xl mx-auto px-4 pt-12 pb-20">
        <Link href={`/educators/${educator?._id ?? id}`} className="text-xs font-bold text-orange-600 hover:text-orange-700">
          ← {educator?.name ?? "Educator"}
        </Link>
        {note.subject && (
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6">{note.subject}</p>
        )}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mt-2">{note.title}</h1>
        {note.summary && <p className="text-lg text-gray-500 mt-3 leading-relaxed">{note.summary}</p>}
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-4">
          {note.publishedAt && (
            <span>
              Published{" "}
              {new Date(note.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          <span>·</span>
          <span>{note.viewCount} views</span>
        </div>

        <div
          className="prose prose-sm sm:prose-base mt-8 max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-a:text-orange-600"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </article>
    </div>
  );
}
