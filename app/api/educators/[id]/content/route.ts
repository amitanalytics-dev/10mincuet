// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const convex = getConvexClient();
  if (!convex) return Response.json({ notes: [], sets: [] });

  const [notes, sets] = await Promise.all([
    convex.query(api.educatorNotes.listPublishedByEducator, { educatorId: id as any }),
    convex.query(api.questionSets.listPublishedByEducator, { educatorId: id as any }),
  ]);
  return Response.json({ notes, sets });
}
