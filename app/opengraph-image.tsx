import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "10minCUET — CUET UG prep in 10 minutes a day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 60%, #ffedd5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            10
          </div>
          <div style={{ fontSize: 84, fontWeight: 900, color: "#111827" }}>
            10min<span style={{ color: "#f97316" }}>CUET</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#4b5563",
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.4,
          }}
        >
          CUET UG prep in 10 minutes a day — Science · Commerce · Humanities ·
          from Class 6
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "#9a3412",
          }}
        >
          <div
            style={{
              background: "#ffedd5",
              borderRadius: 999,
              padding: "10px 28px",
            }}
          >
            Adaptive Bloom-level quizzes
          </div>
          <div
            style={{
              background: "#ffedd5",
              borderRadius: 999,
              padding: "10px 28px",
            }}
          >
            Daily 10-min sessions
          </div>
          <div
            style={{
              background: "#ffedd5",
              borderRadius: 999,
              padding: "10px 28px",
            }}
          >
            Free diagnostic
          </div>
        </div>
      </div>
    ),
    size
  );
}
