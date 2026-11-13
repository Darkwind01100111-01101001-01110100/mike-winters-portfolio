// LinkLineSection.tsx
// Project: Seattle Link Light Rail — From Recovery to #1 in the US
// Design: Obsidian V3 — matches portfolio theme
// Data sources: Sound Transit Annual Reports, National Transit Database, Sound Transit press releases
// Data as of: July 2026

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

// ── Data ──────────────────────────────────────────────
// Sound Transit Link light rail boardings (millions) — annual
// Source: Sound Transit Annual Reports + National Transit Database
const RIDERSHIP = [
  { year: 2016, link: 13.9, commuter: 21.2 },
  { year: 2017, link: 16.5, commuter: 22.1 },
  { year: 2018, link: 20.6, commuter: 23.2 },
  { year: 2019, link: 23.1, commuter: 23.8, baseline: true },
  { year: 2020, link: 8.2,  commuter: 7.3  },
  { year: 2021, link: 9.8,  commuter: 7.6  },
  { year: 2022, link: 19.2, commuter: 12.6 },
  { year: 2023, link: 23.4, commuter: 13.9 },
  { year: 2024, link: 27.6, commuter: 13.8 },
  { year: 2025, link: 37.8, commuter: 14.1 },
];

// Recovery % vs 2019 baseline
const RECOVERY = [
  { year: 2020, link: 35,  commuter: 31 },
  { year: 2021, link: 42,  commuter: 32 },
  { year: 2022, link: 83,  commuter: 53 },
  { year: 2023, link: 101, commuter: 58 },
  { year: 2024, link: 119, commuter: 58 },
  { year: 2025, link: 164, commuter: 59 },
];

// Top ridership days in Link history
const RECORD_DAYS = [
  { rank: 1, event: "World Cup: USA vs. Belgium (Round of 16)", date: "Jul 6, 2026", boardings: "310K", color: TEAL2 },
  { rank: 2, event: "World Cup: USA vs. Australia (Group Stage)", date: "Jun 19, 2026", boardings: "280K", color: ACCENT2 },
  { rank: 3, event: "World Cup: pre-match arrivals", date: "Jun 18, 2026", boardings: "236K", color: TEAL },
  { rank: 4, event: "Seahawks Super Bowl Parade", date: "Feb 2014", boardings: "220K", color: ACCENT2 },
  { rank: 5, event: "World Cup: Egypt vs. Belgium (Group Stage)", date: "Jun 15, 2026", boardings: "210K", color: TEAL },
];

// Monthly milestones
const MONTHLY_MILESTONES = [
  { month: "Mar 2026", event: "2 Line opens — Bellevue↔Seattle", riders: "3.4M", note: "Pre-2-Line baseline" },
  { month: "Apr 2026", event: "First full month with 2 Line", riders: "4.8M", note: "+44% vs March · US #1" },
  { month: "Jun 2026", event: "World Cup month — new monthly record", riders: "5.4M", note: "+13% vs April · all 6 match days > 200K" },
];

const SQL_CODE = `-- Monthly ridership growth and US ranking context
-- Source: National Transit Database (NTD), April 2026 report
SELECT
  agency,
  month,
  unlinked_trips_millions,
  RANK() OVER (
    PARTITION BY month
    ORDER BY unlinked_trips_millions DESC
  ) AS national_rank,
  ROUND(
    100.0 * unlinked_trips_millions
      / LAG(unlinked_trips_millions)
          OVER (PARTITION BY agency ORDER BY month) - 100,
    1
  ) AS mom_growth_pct
FROM light_rail_ridership
WHERE month = '2026-04'
  AND agency IN (
    'Sound Transit',
    'LA Metro Rail',
    'Boston MBTA Green Line',
    'San Diego MTS'
  )
ORDER BY national_rank;`;

const SQL_RECOVERY = `-- Recovery index: Link vs commuter rail, 2019–2025
SELECT
  year,
  mode,
  boardings_millions,
  ROUND(
    100.0 * boardings_millions
      / FIRST_VALUE(boardings_millions)
          OVER (PARTITION BY mode ORDER BY year),
    1
  ) AS recovery_pct_vs_2019
FROM transit_ridership
WHERE year BETWEEN 2019 AND 2025
  AND mode IN ('Link light rail', 'Commuter rail + Express')
ORDER BY mode, year;`;

const R_CODE = `library(tidyverse)

# Load Sound Transit annual ridership data
ridership <- read_csv("sound_transit_ridership.csv")

# Compute recovery index vs 2019 baseline
baseline_2019 <- ridership %>%
  filter(year == 2019) %>%
  select(mode, boardings) %>%
  rename(baseline = boardings)

recovery <- ridership %>%
  left_join(baseline_2019, by = "mode") %>%
  mutate(recovery_pct = round(boardings / baseline * 100, 1))

# Divergence plot: Link vs commuter rail
recovery %>%
  filter(mode %in% c("Link light rail", "Commuter rail + Express")) %>%
  ggplot(aes(x = year, y = recovery_pct, color = mode)) +
  geom_hline(yintercept = 100, linetype = "dashed",
             color = "grey60", linewidth = 0.5) +
  geom_line(linewidth = 1.2) +
  geom_point(size = 3) +
  annotate("text", x = 2023.1, y = 103,
           label = "Link crosses 100%", size = 3,
           hjust = 0, color = "#2dd4bf") +
  scale_color_manual(values = c("#2dd4bf", "#7c6aff")) +
  labs(title = "Two Recoveries: Link vs Commuter Rail",
       subtitle = "% of 2019 ridership baseline",
       x = NULL, y = "Recovery Index (2019 = 100%)") +
  theme_minimal()`;

export default function LinkLineSection({ embedded }: { embedded?: boolean }) {
  const [codeTab, setCodeTab] = useState<"sql" | "sql_recovery" | "r">("sql");
  const [view, setView] = useState<"growth" | "recovery" | "records">("growth");

  return (
    <div style={{ fontFamily: SANS }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          // sql · data analysis · r · seattle · sound transit · national transit database
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, color: TEXT, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Seattle Link Light Rail: From Recovery to #1 in the US
        </h3>
        <p style={{ fontSize: "0.875rem", color: TEXT2, lineHeight: 1.8, maxWidth: 720, marginBottom: "0.5rem" }}>
          In March 2026, Sound Transit opened the 2 Line across Lake Washington — connecting Seattle and Bellevue for the first time. April ridership hit 4.8 million, a 44% single-month jump, making Seattle the most-ridden light rail system in the United States. This is a city of 4 million people outrunning Los Angeles, Boston, and San Diego on transit. The data tells a story about infrastructure investment, urban density, and what happens when you build the system people actually want to use.
        </p>
        <p style={{ fontSize: "0.8rem", color: TEXT2, lineHeight: 1.7, maxWidth: 720, marginBottom: "0.5rem" }}>
          What I wanted to know → How did ridership change around the 2 Line opening? What I found → April 2026 reached 4.8M boardings, up 44% from March.
        </p>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3 }}>
          Data as of July 2026 · Sources: Sound Transit, National Transit Database, APTA
        </div>
      </div>

      {/* ── Key stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "US Ranking", value: "#1",      sub: "light rail ridership (Apr 2026)", color: TEAL2 },
          { label: "Jun 2026",   value: "5.4M",    sub: "monthly record · World Cup month",  color: TEAL },
          { label: "Match Day",  value: "310K",   sub: "Jul 6 (R16) · all-time record",   color: TEAL2 },
          { label: "6 Match Days",  value: ">200K",   sub: "each · 3M+ citywide visitors", color: ACCENT2 },
        ].map(s => (
          <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: TEXT3, marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── View toggle ── */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {([
          { id: "growth",   label: "2 Line Growth Story" },
          { id: "recovery", label: "Recovery Divergence" },
          { id: "records",  label: "Record Days" },
        ] as const).map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            style={{
              fontFamily: MONO, fontSize: "0.68rem", fontWeight: 600,
              background: view === v.id ? TEAL : "rgba(255,255,255,0.06)",
              border: `1px solid ${view === v.id ? TEAL : "rgba(255,255,255,0.15)"}`,
              borderRadius: "0.375rem",
              cursor: "pointer",
              color: view === v.id ? "#0a0a0b" : TEXT,
              padding: "0.5rem 1.1rem",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── 2 Line Growth Story ── */}
      {view === "growth" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
            Annual Link Boardings (millions) — 2016 to 2025
          </div>
          {/* Bar chart */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: 180, marginBottom: "0.75rem", minWidth: 480, paddingTop: "1.5rem" }}>
            {RIDERSHIP.map(d => {
              const maxVal = 40;
              const pct = (d.link / maxVal) * 150;
              return (
                <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{ fontFamily: MONO, fontSize: "0.48rem", color: d.year >= 2026 ? TEAL2 : d.year === 2025 ? TEAL2 : TEXT3, marginBottom: 2 }}>
                    {d.link}M
                  </div>
                  <div style={{
                    width: "100%",
                    height: `${pct}px`,
                    background: d.baseline
                      ? "rgba(255,255,255,0.12)"
                      : d.year === 2025
                      ? `linear-gradient(to top, ${TEAL}, ${TEAL2})`
                      : d.year >= 2023
                      ? `linear-gradient(to top, rgba(45,212,191,0.6), rgba(94,234,212,0.6))`
                      : `linear-gradient(to top, rgba(45,212,191,0.25), rgba(94,234,212,0.25))`,
                    borderRadius: "2px 2px 0 0",
                    transition: "height 0.3s ease",
                  }} />
                  <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: TEXT3 }}>{d.year}</div>
                </div>
              );
            })}
          </div>
          </div>
          {/* Monthly milestone callout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
            {MONTHLY_MILESTONES.map(m => (
              <div key={m.month} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.4rem", padding: "0.75rem" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, marginBottom: "0.2rem" }}>{m.month}</div>
                <div style={{ fontFamily: MONO, fontSize: "1.1rem", fontWeight: 700, color: TEAL2, lineHeight: 1 }}>{m.riders}</div>
                <div style={{ fontSize: "0.7rem", color: TEXT2, marginTop: "0.2rem" }}>{m.event}</div>
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEAL, marginTop: "0.15rem" }}>{m.note}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            The 2 Line's crosslake connection — opening March 28, 2026 — was the single largest ridership catalyst in Link history. Notably, Link was already up ~20% in early 2026 before the 2 Line opened, meaning the April 44% surge was additive to an already-accelerating baseline. April 2026's 4.8M monthly figure surpassed Los Angeles, Boston, and San Diego to make Seattle the most-ridden light rail system in the US — the strongest ridership growth of any major metro area. Seattle is the 15th largest metro by population, but now ranks 8th nationally across all rail modes.
          </p>
        </div>
      )}

      {/* ── Recovery divergence chart ── */}
      {view === "recovery" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
            Recovery Index vs 2019 Baseline (100% = pre-pandemic)
          </div>
          <div style={{ position: "relative", height: 220 }}>
            {/* 100% line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: "38%", borderTop: "1px dashed rgba(255,255,255,0.15)" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.5rem", color: TEXT3, position: "absolute", left: 0, top: "-1rem", paddingLeft: "0.25rem" }}>100%</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "100%", paddingBottom: "1.5rem", paddingTop: "1.25rem" }}>
              {RECOVERY.map(r => (
                <div key={r.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: 170 }}>
                    {/* Link bar */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ fontFamily: MONO, fontSize: "0.45rem", color: TEAL2, marginBottom: 2 }}>{r.link}%</div>
                      <div style={{
                        width: "100%",
                        height: `${Math.min(r.link * 0.85, 165)}px`,
                        background: r.link >= 100
                          ? `linear-gradient(to top, ${TEAL}, ${TEAL2})`
                          : `linear-gradient(to top, rgba(45,212,191,0.4), rgba(94,234,212,0.4))`,
                        borderRadius: "2px 2px 0 0",
                        maxHeight: 165,
                      }} />
                    </div>
                    {/* Commuter bar */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ fontFamily: MONO, fontSize: "0.45rem", color: ACCENT2, marginBottom: 2 }}>{r.commuter}%</div>
                      <div style={{
                        width: "100%",
                        height: `${Math.min(r.commuter * 0.85, 165)}px`,
                        background: `linear-gradient(to top, rgba(124,106,255,0.4), rgba(165,148,255,0.4))`,
                        borderRadius: "2px 2px 0 0",
                        maxHeight: 165,
                      }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: TEXT3 }}>{r.year}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 10, height: 10, background: TEAL, borderRadius: 2 }} />
              <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>Link light rail</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 10, height: 10, background: ACCENT, borderRadius: 2, opacity: 0.5 }} />
              <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>Commuter rail + ST Express</span>
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            Link crossed 100% recovery in 2023 and reached 164% of its 2019 baseline by 2025 — driven by the Northgate, Lynnwood, and Federal Way extensions, plus the 2 Line. Commuter modes remain at ~59%, reflecting the permanent reduction in downtown office density post-pandemic. Two systems, two very different futures.
          </p>
        </div>
      )}

      {/* ── Record Days ── */}
      {view === "records" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Top Ridership Days in Link History
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
            {RECORD_DAYS.map(d => (
              <div key={d.rank} style={{
                display: "grid", gridTemplateColumns: "2rem 1fr auto",
                gap: "1rem", padding: "0.875rem 1rem",
                background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.4rem",
                alignItems: "center",
              }}>
                <div style={{ fontFamily: MONO, fontSize: "1rem", fontWeight: 700, color: d.color, textAlign: "center" }}>#{d.rank}</div>
                <div>
                  <div style={{ fontSize: "0.82rem", color: TEXT, fontWeight: 500 }}>{d.event}</div>
                  <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT3, marginTop: "0.15rem" }}>{d.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: MONO, fontSize: "1rem", fontWeight: 700, color: d.color }}>{d.boardings}</div>

                </div>
              </div>
            ))}
          </div>
          {/* World Cup callout */}
          <div style={{ background: "rgba(94,234,212,0.06)", border: `1px solid rgba(94,234,212,0.18)`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEAL2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>2026 FIFA World Cup — Seattle Match Days</div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Jul 6 (R16)", value: "310K" },
                { label: "Jun 19", value: "280K" },
                { label: "Jun 18", value: "236K" },
                { label: "Jun 15", value: "210K" },
                { label: "Trains deployed", value: "46" },
                { label: "Railcars", value: "174" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: MONO, fontSize: "0.9rem", fontWeight: 700, color: TEAL2 }}>{item.value}</div>
                  <div style={{ fontSize: "0.68rem", color: TEXT3 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            The USA vs. Belgium Round of 16 match on July 6 drew approximately 310,000 boardings — a new all-time single-day record for Link. The previous record (280K, USA vs. Australia group stage on June 19) had stood for just 17 days. All six of Seattle's World Cup match days exceeded 200,000 boardings, and four of Link's top five ridership days ever now belong to the 2026 tournament. June set a new monthly record at 5.4 million boardings. Sound Transit deployed 46 trains with 174 railcars — the most vehicles ever run simultaneously — and ran all-day peak service on match days for the first time in agency history. Over 3 million people visited downtown Seattle across the six match days.
          </p>
        </div>
      )}

      {/* ── Code section ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          {([
            { id: "sql",          label: "SQL — national ranking query" },
            { id: "sql_recovery", label: "SQL — recovery index" },
            { id: "r",            label: "R — ggplot2 divergence chart" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setCodeTab(t.id)}
              style={{
                fontFamily: MONO, fontSize: "0.65rem", fontWeight: 500,
                background: "transparent", border: "none", cursor: "pointer",
                color: codeTab === t.id ? TEAL2 : TEXT3,
                padding: "0.6rem 1.25rem",
                borderBottom: codeTab === t.id ? `2px solid ${TEAL}` : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="query-card-pad">
          <pre className="sql-pre-mobile" style={{
            fontFamily: MONO, fontSize: "0.72rem", color: TEXT2,
            margin: 0, overflowX: "auto", lineHeight: 1.7,
            whiteSpace: "pre",
          }}>
            <code>
              {codeTab === "sql" ? SQL_CODE : codeTab === "sql_recovery" ? SQL_RECOVERY : R_CODE}
            </code>
          </pre>
        </div>
      </div>

      {/* ── Methodology ── */}
      <div style={{ marginTop: "1.25rem", padding: "1rem", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Methodology & Sources</div>
        <p style={{ fontSize: "0.75rem", color: TEXT3, lineHeight: 1.7, margin: 0 }}>
          Annual ridership figures from Sound Transit Annual Reports (2016–2025) and the National Transit Database (NTD). Pre-2-Line +20% early 2026 growth figure and "strongest ridership growth of any major metro" characterization from FTA rapid release data via transit economist Joey Politano (@josephpolitano.bsky.social, April 2026). April 2026 monthly figure (4.8M) from Urban Institute researcher Yonah Freemark via NTD rapid release data. World Cup ridership figures from APTA (American Public Transportation Association, July 16 2026) and Sound Transit press releases. June 2026 monthly record (5.4M) and July 6 single-day record (~309K) from APTA. Downtown Seattle attendance (3M+ across 6 match days) from Downtown Seattle Association. Recovery index compares Link light rail to Sounder commuter rail + ST Express bus boardings. 2025 annual figures are from Sound Transit's published annual report.
        </p>
      </div>
    </div>
  );
}
