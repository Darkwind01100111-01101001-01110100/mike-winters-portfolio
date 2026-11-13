import { useLocation } from "wouter";

const BG    = "#0a0a0b";
const BG3   = "#16161a";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT   = "#e8e6f0";
const TEXT2  = "#9b97b0";
const ACCENT = "#7c6aff";
const ACCENT2 = "#a594ff";
const MONO   = "'JetBrains Mono', monospace";
const SANS   = "'Space Grotesk', sans-serif";
const DISPLAY = "'Fraunces', serif";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          background: BG3,
          border: `1px solid ${BORDER}`,
          borderRadius: "0.75rem",
          padding: "3rem 2.5rem",
          textAlign: "center",
        }}
      >
        {/* Terminal-style error code */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.75rem",
            color: ACCENT,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1rem",
            opacity: 0.8,
          }}
        >
          error_code: 404
        </div>

        {/* Large 404 */}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: "6rem",
            fontWeight: 700,
            lineHeight: 1,
            color: ACCENT2,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: "1.5rem",
            fontWeight: 600,
            color: TEXT,
            marginBottom: "0.75rem",
          }}
        >
          Page not found
        </h1>

        {/* Subtext */}
        <p
          style={{
            color: TEXT2,
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: BORDER,
            marginBottom: "2rem",
          }}
        />

        {/* Back home button */}
        <button
          onClick={() => setLocation("/")}
          style={{
            background: "transparent",
            border: `1px solid ${ACCENT}`,
            color: ACCENT2,
            fontFamily: MONO,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            padding: "0.65rem 1.75rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,106,255,0.12)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT2;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT;
          }}
        >
          ← back to portfolio
        </button>
      </div>
    </div>
  );
}
