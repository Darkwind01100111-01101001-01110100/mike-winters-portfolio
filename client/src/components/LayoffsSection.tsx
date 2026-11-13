// LayoffsSection.tsx
// Project: Tech Layoffs 2022–2026 — The Wave, The Lull, and the Return
// Design: Obsidian V3 — matches portfolio theme
// Data sources: trueup.io, Crunchbase, layoffs.fyi (cited inline)
// Data as of: June 22, 2026

import { useState } from "react";

const BG   = "#0a0a0b";
const BG2  = "#111113";
const BG3  = "#16161a";
const BORDER  = "rgba(255,255,255,0.07)";
const BORDER2 = "rgba(255,255,255,0.12)";
const TEXT  = "#e8e6f0";
const TEXT2 = "#b8b4cc";
const TEXT3 = "#8a8699";
const ACCENT  = "#7c6aff";
const ACCENT2 = "#a594ff";
const MONO    = "'JetBrains Mono', monospace";
const DISPLAY = "'Fraunces', serif";
const SANS    = "'Space Grotesk', sans-serif";

// ── Data ──────────────────────────────────────────────
const ANNUAL_DATA = [
  { year: "2022", people: 165000, events: 1000, color: "#7c6aff", note: "Big Tech correction" },
  { year: "2023", people: 260000, events: 1200, color: "#a594ff", note: "Peak wave" },
  { year: "2024", people: 150000, events: 900,  color: "#7c6aff", note: "Cooling period" },
  { year: "2025", people: 246000, events: 783,  color: "#c4b8ff", note: "Second wave" },
  { year: "2026*",people: 156649, events: 411,  color: "#ff6b6b", note: "YTD — pacing above 2023" },
];

const TOP_COMPANIES = [
  { company: "Amazon",     year: 2023, count: 27000 },
  { company: "Intel",      year: 2024, count: 15000 },
  { company: "Google",     year: 2023, count: 12000 },
  { company: "Meta",       year: 2023, count: 11000 },
  { company: "Microsoft",  year: 2023, count: 10000 },
  { company: "Salesforce", year: 2023, count: 10090 },
  { company: "Cisco",      year: 2024, count: 9000  },
  { company: "Dell",       year: 2023, count: 6650  },
  { company: "Uber",       year: 2022, count: 7585  },
  { company: "Oracle",     year: 2026, count: 30000 },
];
// 2026 Big Tech breakdown — sourced from image (May 15, 2026)
// Sources: TrueUp, TechCrunch, Bloomberg, Reuters
const BIG_TECH_2026 = [
  { company: "Oracle",           category: "Enterprise", count: 30000, pct: "~18%",  driver: "AI restructuring (YTD)" },
  { company: "Amazon",           category: "Big Tech",   count: 30000, pct: "Large", driver: "Corporate restructuring since Oct 2025" },
  { company: "Meta",             category: "Big Tech",   count: 8000,  pct: "~10%",  driver: "AI infra reallocation (starts May 20)" },
  { company: "Microsoft",        category: "Big Tech",   count: 8750,  pct: "~7%",   driver: "\"Rule of 70\" voluntary separation" },
  { company: "Cloudflare",       category: "Enterprise", count: 1100,  pct: "~20%",  driver: "Internal AI usage up 600% in 3 months" },
  { company: "PayPal",           category: "FinTech",    count: 4760,  pct: "~20%",  driver: "AI automation (over 2\u20133 years)" },
  { company: "LinkedIn (MSFT)",  category: "Big Tech",   count: 875,   pct: "~5%",   driver: "Revenue slowdown + org flattening" },
  { company: "BILL",             category: "FinTech",    count: 0,     pct: "~30%",  driver: "AI adoption + profitability push" },
];

const QUARTERLY_2026 = [
  { q: "Q1 2026", people: 81706, note: "Jan 27K · Feb 25K · Mar 49K — highest Q1 since 2023" },
  { q: "Q2 2026 (partial)", people: 73289, note: "Apr–Jun partial — Q2 closes Jun 30 · pacing above Q1" },
];

const SECTOR_DATA = [
  { sector: "Consumer / Retail", pct: 28 },
  { sector: "Finance / Fintech",  pct: 14 },
  { sector: "Healthcare",         pct: 12 },
  { sector: "Transportation",     pct: 11 },
  { sector: "SaaS / Enterprise",  pct: 10 },
  { sector: "AI / ML",            pct: 9  },
  { sector: "Other",              pct: 16 },
];

const SQL_CODE = `-- Annual layoff totals with YoY change
SELECT
  year,
  SUM(total_laid_off)                          AS people_impacted,
  COUNT(*)                                     AS layoff_events,
  ROUND(AVG(total_laid_off), 0)                AS avg_per_event,
  LAG(SUM(total_laid_off)) OVER (ORDER BY year) AS prev_year,
  ROUND(
    100.0 * (SUM(total_laid_off)
      - LAG(SUM(total_laid_off)) OVER (ORDER BY year))
    / NULLIF(LAG(SUM(total_laid_off)) OVER (ORDER BY year), 0),
    1
  )                                            AS yoy_pct_change
FROM layoffs
WHERE total_laid_off IS NOT NULL
GROUP BY year
ORDER BY year;`;

const PYTHON_CODE = `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("layoffs_2022_2026.csv", parse_dates=["date"])
df["year"] = df["date"].dt.year
df["quarter"] = df["date"].dt.to_period("Q")

# Annual aggregation
annual = (
    df.groupby("year")
      .agg(people=("total_laid_off", "sum"),
           events=("company", "count"))
      .reset_index()
)
annual["yoy_change"] = annual["people"].pct_change().mul(100).round(1)

# Q1 2026 vs Q1 2023 comparison
q1 = df[df["quarter"].astype(str).str.endswith("Q1")]
q1_compare = (
    q1.groupby("quarter")["total_laid_off"]
      .sum()
      .reset_index()
      .sort_values("quarter")
)
print(q1_compare.tail(5).to_string(index=False))`;

export default function LayoffsSection({ embedded }: { embedded?: boolean }) {
  const [codeTab, setCodeTab] = useState<"sql" | "python">("sql");

  const maxPeople = Math.max(...ANNUAL_DATA.map(d => d.people));
  const maxCompany = Math.max(...TOP_COMPANIES.map(d => d.count));

  return (
    <div style={{ fontFamily: SANS }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          // data analysis · python · sql · trueup.io · crunchbase
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, color: TEXT, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Tech Layoffs: The Wave, The Lull, and the Return
        </h3>
        <p style={{ fontSize: "0.875rem", color: TEXT2, lineHeight: 1.8, maxWidth: 680, marginBottom: "0.5rem" }}>
          A snapshot analysis of tech industry layoffs from 2022 through mid-2026. Three distinct phases emerge from the data: the 2022–2023 Big Tech correction, a 2024 cooling period, and a resurgent second wave in 2025–2026 that is pacing above the 2023 peak on a per-day basis.
        </p>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3 }}>
          Data as of June 22, 2026 · Sources: trueup.io, Crunchbase, layoffs.fyi
        </div>
      </div>

      {/* ── Key stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "Peak Year", value: "2023", sub: "260,000 impacted" },
          { label: "2026 Daily Rate", value: "895", sub: "people/day YTD (Jun 24)" },
          { label: "Q1 2026", value: "81,700", sub: "highest Q1 since 2023" },
          { label: "2024 Low", value: "150K", sub: "cooling period" },
        ].map(s => (
          <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: "1.4rem", fontWeight: 700, color: ACCENT2, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: TEXT3, marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Annual bar chart ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
          People Impacted by Year
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: 160 }}>
          {ANNUAL_DATA.map(d => {
            const h = Math.round((d.people / maxPeople) * 140);
            const is2026 = d.year === "2026*";
            return (
              <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: is2026 ? "#ff6b6b" : ACCENT2, textAlign: "center" }}>
                  {(d.people / 1000).toFixed(0)}K
                </div>
                <div style={{
                  width: "100%", height: h,
                  background: is2026
                    ? "linear-gradient(to top, #ff6b6b, #ff9b9b)"
                    : `linear-gradient(to top, ${ACCENT}, ${ACCENT2})`,
                  borderRadius: "3px 3px 0 0",
                  position: "relative",
                  opacity: is2026 ? 0.85 : 1,
                  border: is2026 ? "1px dashed rgba(255,107,107,0.4)" : "none",
                }} />
                <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: is2026 ? "#ff6b6b" : TEXT2, textAlign: "center" }}>{d.year}</div>
                <div style={{ fontFamily: MONO, fontSize: "0.5rem", color: TEXT3, textAlign: "center", lineHeight: 1.3 }}>{d.note}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${BORDER}`, display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, background: ACCENT, borderRadius: 2 }} />
            <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>Historical</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, background: "#ff6b6b", borderRadius: 2, border: "1px dashed rgba(255,107,107,0.6)" }} />
            <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>2026 YTD (partial year)</span>
          </div>
        </div>
      </div>

      {/* ── Two-column: top companies + sector breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }} className="grid-mobile-stack">

        {/* Top companies */}
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.25rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Largest Single Layoff Events
          </div>
          {TOP_COMPANIES.slice(0, 7).map(c => (
            <div key={c.company} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              <div style={{ fontFamily: MONO, fontSize: "0.7rem", color: TEXT, width: 90, flexShrink: 0 }}>{c.company}</div>
              <div style={{ flex: 1, height: 6, background: BG2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.count / maxCompany) * 100}%`, background: `linear-gradient(to right, ${ACCENT}, ${ACCENT2})`, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT2, width: 50, textAlign: "right" }}>
                {(c.count / 1000).toFixed(1)}K
              </div>
              <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, width: 32, textAlign: "right" }}>'{String(c.year).slice(2)}</div>
            </div>
          ))}
        </div>

        {/* Sector breakdown */}
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.25rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Impacted by Sector (2022–2025)
          </div>
          {SECTOR_DATA.map((s, i) => (
            <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: TEXT2, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sector}</div>
              <div style={{ width: 80, height: 6, background: BG2, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: `linear-gradient(to right, ${ACCENT}, ${ACCENT2})`, borderRadius: 3, opacity: 0.7 + i * 0.04 }} />
              </div>
              <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT2, width: 28, textAlign: "right", flexShrink: 0 }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2026 callout ── */}
      <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "0.625rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#ff9b9b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          // 2026 snapshot · verified figures · source: trueup.io · as of June 22, 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="grid-mobile-stack">
          {QUARTERLY_2026.map(q => (
            <div key={q.q}>
              <div style={{ fontFamily: MONO, fontSize: "1.1rem", fontWeight: 700, color: "#ff6b6b" }}>{(q.people / 1000).toFixed(1)}K</div>
              <div style={{ fontFamily: MONO, fontSize: "0.7rem", color: TEXT2, marginTop: "0.15rem" }}>{q.q}</div>
              <div style={{ fontSize: "0.75rem", color: TEXT3, marginTop: "0.25rem", lineHeight: 1.5 }}>{q.note}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.8rem", color: TEXT2, lineHeight: 1.7, marginTop: "0.75rem", marginBottom: "1rem" }}>
          At 895 people per day YTD (as of June 24), 2026 is tracking well above the 2023 peak rate of ~712/day — driven by AI-driven restructuring, post-ZIRP cost normalization continuing into its fourth year, and a second wave of consumer tech contraction. Q2 figures are partial through June 24; full quarterly data available after June 30.
        </p>
        {/* Big Tech 2026 breakdown table */}
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#ff9b9b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          // notable 2026 events · sources: trueup, techcrunch, bloomberg, reuters · as of june 24, 2026
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: "0.72rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid rgba(255,107,107,0.25)` }}>
                {["Company", "Category", "% WF", "Driver"].map(h => (
                  <th key={h} style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.4rem 0.5rem", textAlign: "left", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BIG_TECH_2026.map((r, i) => (
                <tr key={r.company} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ fontFamily: MONO, fontSize: "0.7rem", color: TEXT, padding: "0.4rem 0.5rem", whiteSpace: "nowrap" }}>{r.company}</td>
                  <td style={{ fontFamily: MONO, fontSize: "0.65rem", color: r.category === "Big Tech" ? ACCENT2 : r.category === "Enterprise" ? "#60a5fa" : "#34d399", padding: "0.4rem 0.5rem", whiteSpace: "nowrap" }}>{r.category}</td>
                  <td style={{ fontFamily: MONO, fontSize: "0.7rem", color: "#ff9b9b", padding: "0.4rem 0.5rem" }}>{r.pct}</td>
                  <td style={{ fontSize: "0.7rem", color: TEXT2, padding: "0.4rem 0.5rem", lineHeight: 1.4 }}>{r.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Code section ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
          {(["sql", "python"] as const).map(t => (
            <button key={t} onClick={() => setCodeTab(t)}
              style={{
                fontFamily: MONO, fontSize: "0.65rem", fontWeight: 500,
                background: "transparent", border: "none", cursor: "pointer",
                color: codeTab === t ? ACCENT2 : TEXT3,
                padding: "0.6rem 1.25rem",
                borderBottom: codeTab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.15s",
              }}>
              {t === "sql" ? "SQL — aggregation" : "Python — pandas"}
            </button>
          ))}
        </div>
        <div className="query-card-pad">
          <pre className="sql-pre-mobile" style={{
            fontFamily: MONO, fontSize: "0.72rem", color: TEXT2,
            margin: 0, overflowX: "auto", lineHeight: 1.7,
            whiteSpace: "pre",
          }}>
            <code>{codeTab === "sql" ? SQL_CODE : PYTHON_CODE}</code>
          </pre>
        </div>
      </div>

      {/* ── Methodology note ── */}
      <div style={{ marginTop: "1.25rem", padding: "1rem", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Methodology</div>
        <p style={{ fontSize: "0.75rem", color: TEXT3, lineHeight: 1.7, margin: 0 }}>
          Annual figures compiled from trueup.io, Crunchbase News, and layoffs.fyi. Company-level figures represent single announced events; some companies appear across multiple years. Sector classification follows Crunchbase primary category. 2026 figures are partial-year through June 24, 2026. Per-day rate calculated against calendar days YTD.
        </p>
      </div>
    </div>
  );
}
