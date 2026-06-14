import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";

export async function POST(req: Request) {
  const { email, phone } = await req.json();

  if (!email || !phone) {
    return new Response(JSON.stringify({ error: "Email and phone required" }), {
      status: 400,
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Store OTP in database (expires in 10 minutes)
    await (convex.mutation as any)(api.otps.storeOtp, {
      email,
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // TODO: Send OTP via email/SMS
    // For now, log it (remove in production)
    console.log(`OTP for ${email}: ${otp}`);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent to email" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), {
      status: 500,
    });
  }
}
