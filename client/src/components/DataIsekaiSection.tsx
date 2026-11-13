// DataIsekaiSection.tsx
// Project: Tower of Query
// A 10-floor SQL learning game designed and shipped as a self-paced learning experience.
// Stack: React · TypeScript · Tailwind · sql.js (SQLite in-browser via WebAssembly)
// Live: https://data-tower.netlify.app/

import { useState } from "react";

const BG   = "#0a0a0b";
const BG2  = "#111113";
const BG3  = "#16161a";
const BORDER  = "rgba(255,255,255,0.07)";
const TEXT  = "#e8e6f0";
const TEXT2 = "#b8b4cc";
const TEXT3 = "#8a8699";
const ACCENT  = "#7c6aff";
const ACCENT2 = "#a594ff";
const TEAL    = "#2dd4bf";
const TEAL2   = "#5eead4";
const MONO    = "'JetBrains Mono', monospace";
const DISPLAY = "'Fraunces', serif";
const SANS    = "'Space Grotesk', sans-serif";

// ── Tower Floors ──────────────────────────────────────
const FLOORS = [
  { floor: 1,  name: "The Awakening Chamber",   concepts: "SELECT · WHERE · BETWEEN",     difficulty: "Intro" },
  { floor: 2,  name: "The Chaotic Archive",      concepts: "Filtering · Comparison ops",    difficulty: "Intro" },
  { floor: 3,  name: "The Fragmented Vault",     concepts: "JOINs · Multi-table queries",   difficulty: "Core" },
  { floor: 4,  name: "The Shattered Bridge",     concepts: "GROUP BY · Aggregations",       difficulty: "Core" },
  { floor: 5,  name: "The Null Lord's Domain",   concepts: "NULL handling · COALESCE",      difficulty: "Core" },
  { floor: 6,  name: "The Mirror Chamber",       concepts: "Subqueries · Nested logic",     difficulty: "Advanced" },
  { floor: 7,  name: "The Cipher Hall",          concepts: "Window functions · RANK/ROW",   difficulty: "Advanced" },
  { floor: 8,  name: "The Convergence",          concepts: "CTEs · Recursive queries",      difficulty: "Advanced" },
  { floor: 9,  name: "The Temporal Spire",       concepts: "Date/time functions",           difficulty: "Advanced" },
  { floor: 10, name: "The Architect's Summit",   concepts: "Multi-concept final challenge", difficulty: "Expert" },
];

const SAMPLE_SQL = `-- Floor 7: Window Functions — The Cipher Hall
-- Objective: Rank guild members by damage output within each class

SELECT
  name,
  class,
  damage_dealt,
  RANK() OVER (
    PARTITION BY class
    ORDER BY damage_dealt DESC
  ) AS class_rank,
  ROUND(
    100.0 * damage_dealt
      / SUM(damage_dealt) OVER (PARTITION BY class),
    1
  ) AS pct_of_class_total
FROM guild_combat_log
WHERE encounter = 'Cipher Guardian'
ORDER BY class, class_rank;`;

export default function DataIsekaiSection({ embedded }: { embedded?: boolean }) {
  const [showFloors, setShowFloors] = useState(false);

  return (
    <div style={{ fontFamily: SANS }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          // sql · react · typescript · sql.js · self-directed learning
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, color: TEXT, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Tower of Query
        </h3>
        <p style={{ fontSize: "0.875rem", color: TEXT2, lineHeight: 1.8, maxWidth: 720, marginBottom: "0.5rem" }}>
          I designed and shipped this 10-floor SQL learning game as a self-paced sequence of increasingly challenging queries. Each challenge runs against SQLite in the browser through sql.js (WebAssembly), with practice in joins, window functions, CTEs, and aggregations.
        </p>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3 }}>
          Personal project · React + TypeScript + sql.js (WebAssembly) · Deployed on Netlify
        </div>
      </div>

      {/* ── Key stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "Floors", value: "10", sub: "progressive SQL challenges", color: TEAL2 },
          { label: "Concepts", value: "12+", sub: "SELECT → CTEs → window functions", color: TEAL },
          { label: "Engine", value: "SQLite", sub: "real execution via WebAssembly", color: TEAL2 },
          { label: "Format", value: "Interactive", sub: "SQL runs in the browser", color: ACCENT2 },
        ].map(s => (
          <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: TEXT3, marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Floor progression ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Tower Progression — SQL Concept Ladder
          </div>
          <button onClick={() => setShowFloors(!showFloors)} style={{
            fontFamily: MONO, fontSize: "0.6rem", color: TEAL, background: "transparent",
            border: `1px solid rgba(45,212,191,0.3)`, borderRadius: "0.25rem",
            padding: "0.3rem 0.6rem", cursor: "pointer",
          }}>
            {showFloors ? "Collapse" : "Expand all floors"}
          </button>
        </div>

        {/* Compact tower spine */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {(showFloors ? FLOORS : FLOORS.slice(0, 4)).map(f => (
            <div key={f.floor} style={{
              display: "grid", gridTemplateColumns: "2.5rem 1fr auto",
              gap: "0.75rem", padding: "0.6rem 0.75rem",
              background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.35rem",
              alignItems: "center",
            }}>
              <div style={{ fontFamily: MONO, fontSize: "0.75rem", fontWeight: 700, color: f.difficulty === "Expert" ? TEAL2 : f.difficulty === "Advanced" ? ACCENT2 : TEXT3, textAlign: "center" }}>
                F{f.floor}
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", color: TEXT, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, marginTop: "0.1rem" }}>{f.concepts}</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: "0.5rem", color: f.difficulty === "Expert" ? TEAL2 : f.difficulty === "Advanced" ? ACCENT2 : TEXT3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {f.difficulty}
              </div>
            </div>
          ))}
          {!showFloors && (
            <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textAlign: "center", padding: "0.5rem" }}>
              + 6 more floors (subqueries → window functions → CTEs → expert)
            </div>
          )}
        </div>
      </div>

      {/* ── Sample code ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0.6rem 1.25rem" }}>
          <span style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 500, color: TEAL2 }}>
            SQL — sample floor challenge (window functions)
          </span>
        </div>
        <div className="query-card-pad">
          <pre className="sql-pre-mobile" style={{
            fontFamily: MONO, fontSize: "0.72rem", color: TEXT2,
            margin: 0, overflowX: "auto", lineHeight: 1.7,
            whiteSpace: "pre",
          }}>
            <code>{SAMPLE_SQL}</code>
          </pre>
        </div>
      </div>

      {/* ── Try it live ── */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <a href="https://data-tower.netlify.app/" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: MONO, fontSize: "0.7rem", fontWeight: 600,
          background: TEAL, color: "#0a0a0b",
          padding: "0.65rem 1.5rem", borderRadius: "0.375rem",
          textDecoration: "none", display: "inline-block",
          transition: "opacity 0.15s",
        }}>
          Play the Tower →
        </a>
        <a href="https://github.com/Darkwind01100111-01101001-01110100/data-learning-isekai" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: MONO, fontSize: "0.7rem", fontWeight: 600,
          background: "transparent", color: TEXT2,
          border: `1px solid ${BORDER}`,
          padding: "0.65rem 1.5rem", borderRadius: "0.375rem",
          textDecoration: "none", display: "inline-block",
          transition: "opacity 0.15s",
        }}>
          View Source (GitHub)
        </a>
      </div>

      {/* ── Stack & approach ── */}
      <div style={{ padding: "1rem", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Stack & Approach</div>
        <p style={{ fontSize: "0.75rem", color: TEXT3, lineHeight: 1.7, margin: 0 }}>
          Built with React, TypeScript, and Tailwind CSS. SQL execution powered by sql.js — a WebAssembly compilation of SQLite that runs entirely in the browser with no backend. Each floor seeds its own in-memory database, validates query results against expected output, and tracks progress via localStorage. The game includes a Concept Codex (reference panel unlocked per floor), hint system, and solution reveal after repeated attempts — designed to encourage learning through iteration rather than frustration.
        </p>
      </div>
    </div>
  );
}
