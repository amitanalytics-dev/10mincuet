import { ImageResponse } from "next/og";
import { BLOGS } from "../../data/blogs";

export const runtime = "edge";
export const alt = "10minCUET blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOGS.find((b) => b.slug === slug);
  const title = post?.title ?? titleFromSlug(decodeURIComponent(slug));
  const fontSize = title.length > 80 ? 44 : title.length > 50 ? 54 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 60%, #ffedd5 100%)",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            10
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#111827" }}>
            10min<span style={{ color: "#f97316" }}>CUET</span>
            <span style={{ color: "#9ca3af", fontWeight: 600 }}> · Blog</span>
          </div>
        </div>
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: "#111827",
            lineHeight: 1.2,
            maxWidth: 1056,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#6b7280",
          }}
        >
          <div>CUET UG prep in 10 minutes a day</div>
          <div
            style={{
              background: "#f97316",
              color: "white",
              borderRadius: 999,
              padding: "10px 28px",
              fontWeight: 700,
            }}
          >
            Read on 10minCUET
          </div>
        </div>
      </div>
    ),
    size
  );
}
