import "server-only";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, text, stars, quizCount } = body;

    // Basic validation
    if (!name || typeof name !== "string") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (typeof stars !== "number" || stars < 1 || stars > 5) {
      return Response.json({ error: "Invalid star rating" }, { status: 400 });
    }

    // Log to console (for now, since schema isn't ready yet)
    console.log("📝 New Testimonial Received:", {
      timestamp: new Date().toISOString(),
      name: name.trim(),
      rating: stars,
      feedback: text ? text.trim() : "No feedback provided",
      quizCount,
    });

    // TODO: When schema is ready, store this in Convex via mutation
    // const convex = getConvexClient();
    // await convex.mutation(api.testimonials.addTestimonial, {
    //   name: name.trim(),
    //   text: text ? text.trim() : null,
    //   stars,
    //   quizCount,
    // });

    return Response.json({ ok: true, message: "Testimonial received" });
  } catch (error) {
    console.error("Error in testimonial API:", error);
    return Response.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
