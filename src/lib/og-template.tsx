import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export type OgImageInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
};

export function createBrutalistOgImage(input: OgImageInput) {
  const { eyebrow, title, subtitle, badge } = input;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F0E8",
          border: "12px solid #0A0A0A",
          padding: "56px 64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "#FF3B00",
              border: "4px solid #0A0A0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5F0E8",
              fontSize: 26,
              fontWeight: 900,
            }}
          >
            SA
          </div>
          {badge ? (
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#F5F0E8",
                background: "#FF3B00",
                border: "3px solid #0A0A0A",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#FF3B00",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              margin: "20px 0 0",
              fontSize: title.length > 48 ? 52 : 64,
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#0A0A0A",
              maxWidth: 980,
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                margin: "24px 0 0",
                fontSize: 26,
                color: "#0A0A0A",
                opacity: 0.72,
                maxWidth: 900,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 20,
            letterSpacing: "0.15em",
            color: "#0A0A0A",
            opacity: 0.45,
            textTransform: "uppercase",
          }}
        >
          sifatali.dev
        </p>
      </div>
    ),
    { ...OG_SIZE }
  );
}
