import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch / PWA home-screen icon */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          border: "12px solid #FF3B00",
          color: "#F5F0E8",
          fontSize: 110,
          fontWeight: 800,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          letterSpacing: "-0.06em",
          lineHeight: 1,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
