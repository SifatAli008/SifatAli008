import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab favicon — brutalist “S” mark */
export default function Icon() {
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
          color: "#FF3B00",
          fontSize: 22,
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
