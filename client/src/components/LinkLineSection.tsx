import { useState } from "react";

const BG = "#0a0a0b";
const BG2 = "#111113";
const BG3 = "#16161a";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#e8e6f0";
const TEXT2 = "#b8b4cc";
const TEXT3 = "#8a8699";
const ACCENT = "#7c6aff";
const ACCENT2 = "#a594ff";
const TEAL = "#2dd4bf";
const TEAL2 = "#5eead4";
const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Fraunces', serif";
const SANS = "'Space Grotesk', sans-serif";

const ANNUAL_UPT = [
  { year: 2019, link: 24_761_684, comparison: 22_106_942 },
  { year: 2025, link: 37_948_202, comparison: 11_838_901 },
] as const;

const LINK_BASELINE = ANNUAL_UPT[0].link;
const COMPARISON_BASELINE = ANNUAL_UPT[0].comparison;
const LINK_CURRENT = ANNUAL_UPT[1].link;
const COMPARISON_CURRENT = ANNUAL_UPT[1].comparison;
const LINK_INDEX = (LINK_CURRENT / LINK_BASELINE) * 100;
const COMPARISON_INDEX = (COMPARISON_CURRENT / COMPARISON_BASELINE) * 100;
const MILLION = 1_000_000;
const CHART_MAX = 40;
const CHART = { left: 76, right: 700, top: 28, bottom: 226, height: 198 };

const formatMillions = (value: number) => `${(value / MILLION).toFixed(2)}M`;
const formatIndex = (value: number) => `${value.toFixed(1)}%`;

const SQL_CODE = `-- Monthly change and rank among selected systems
-- NTD UPT; rank is limited to this selected comparison group.
WITH monthly_with_lag AS (
  SELECT
    agency,
    month,
    unlinked_trips,
    LAG(unlinked_trips) OVER (
      PARTITION BY agency
      ORDER BY month
    ) AS prior_month_trips
  FROM light_rail_ridership
  WHERE mode = 'LR'
    AND agency IN (
      'Central Puget Sound Regional Transit Authority',
      'Los Angeles County Metropolitan Transportation Authority',
      'Massachusetts Bay Transportation Authority',
      'San Diego Metropolitan Transit System'
    )
),
selected_month AS (
  SELECT *
  FROM monthly_with_lag
  WHERE month = '2026-04'
)
SELECT
  agency,
  month,
  unlinked_trips,
  RANK() OVER (ORDER BY unlinked_trips DESC) AS rank_among_selected_systems,
  ROUND(
    100.0 * (unlinked_trips - prior_month_trips) / NULLIF(prior_month_trips, 0),
    1
  ) AS mom_growth_pct
FROM selected_month
ORDER BY rank_among_selected_systems;`;

const SQL_RECOVERY = `-- Annual UPT and index against calendar year 2019
WITH annual_upt (year, service_group, upt) AS (
  VALUES
    (2019, 'Link light rail', 24761684),
    (2025, 'Link light rail', 37948202),
    (2019, 'Sounder + ST Express (rail and bus)', 22106942),
    (2025, 'Sounder + ST Express (rail and bus)', 11838901)
),
baselines AS (
  SELECT
    service_group,
    MAX(CASE WHEN year = 2019 THEN upt END) AS upt_2019,
    MAX(CASE WHEN year = 2025 THEN upt END) AS upt_2025
  FROM annual_upt
  GROUP BY service_group
)
SELECT
  service_group,
  upt_2019,
  upt_2025,
  ROUND(100.0 * upt_2025 / NULLIF(upt_2019, 0), 1) AS pct_of_2019
FROM baselines
ORDER BY service_group;`;

const R_CODE = `library(tidyverse)

annual_upt <- tribble(
  ~year, ~service_group, ~upt,
  2019, "Link light rail", 24761684,
  2025, "Link light rail", 37948202,
  2019, "Sounder + ST Express (rail and bus)", 22106942,
  2025, "Sounder + ST Express (rail and bus)", 11838901
)

annual_upt %>%
  ggplot(aes(x = factor(year), y = upt / 1e6, fill = service_group)) +
  geom_col(position = "dodge", width = 0.68) +
  scale_fill_manual(values = c("#2dd4bf", "#a594ff")) +
  labs(
    title = "Annual unlinked passenger trips",
    subtitle = "Calendar-year totals; Tacoma Link streetcar excluded",
    x = NULL,
    y = "UPT (millions)",
    fill = NULL
  ) +
  theme_minimal()`;

type CodeTab = "sql" | "sql_recovery" | "r";

function AnnualUptChart() {
  const ticks = [0, 10, 20, 30, 40];
  const groupX = [158, 478];
  const barWidth = 74;
  const gap = 16;

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 720 280"
        role="img"
        aria-labelledby="annual-upt-title annual-upt-description"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title id="annual-upt-title">Annual UPT, 2019 and 2025</title>
        <desc id="annual-upt-description">
          Link light rail increased from 24.76 million trips in 2019 to 37.95 million in 2025. Sounder plus ST Express decreased from 22.11 million to 11.84 million.
        </desc>
        {ticks.map((tick) => {
          const y = CHART.bottom - (tick / CHART_MAX) * CHART.height;
          return (
            <g key={tick}>
              <line x1={CHART.left} x2={CHART.right} y1={y} y2={y} stroke="rgba(255,255,255,0.11)" strokeDasharray={tick === 0 ? undefined : "3 5"} />
              <text x={CHART.left - 12} y={y + 4} textAnchor="end" fill={TEXT3} fontFamily={MONO} fontSize="11">{tick}</text>
            </g>
          );
        })}
        <text x="18" y="126" transform="rotate(-90 18 126)" fill={TEXT3} fontFamily={MONO} fontSize="11" textAnchor="middle">UPT (millions)</text>
        {ANNUAL_UPT.map((row, index) => {
          const startX = groupX[index];
          const bars = [
            { key: "link", value: row.link, color: TEAL },
            { key: "comparison", value: row.comparison, color: ACCENT },
          ];
          return (
            <g key={row.year}>
              {bars.map((bar, barIndex) => {
                const height = (bar.value / MILLION / CHART_MAX) * CHART.height;
                const x = startX + barIndex * (barWidth + gap);
                const y = CHART.bottom - height;
                return (
                  <g key={bar.key}>
                    <rect x={x} y={y} width={barWidth} height={height} rx="3" fill={bar.color} opacity={barIndex === 0 ? 0.9 : 0.8} />
                    <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill={barIndex === 0 ? TEAL2 : ACCENT2} fontFamily={MONO} fontSize="11">{(bar.value / MILLION).toFixed(1)}M</text>
                  </g>
                );
              })}
              <text x={startX + barWidth + gap / 2} y="252" textAnchor="middle" fill={TEXT2} fontFamily={MONO} fontSize="13">{row.year}</text>
            </g>
          );
        })}
      </svg>
      <figcaption style={{ color: TEXT3, fontSize: "0.68rem", lineHeight: 1.6, marginTop: "0.25rem" }}>
        Calendar-year unlinked passenger trips. Each boarding is counted; a transfer can count as another trip.
      </figcaption>
    </figure>
  );
}

export default function LinkLineSection(_props: { embedded?: boolean } = {}) {
  const [codeTab, setCodeTab] = useState<CodeTab>("sql");
  const tabs: { id: CodeTab; label: string }[] = [
    { id: "sql", label: "SQL · monthly change" },
    { id: "sql_recovery", label: "SQL · annual comparison" },
    { id: "r", label: "R · grouped bars" },
  ];
  const activeCode = codeTab === "sql" ? SQL_CODE : codeTab === "sql_recovery" ? SQL_RECOVERY : R_CODE;

  return (
    <div style={{ fontFamily: SANS }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          // seattle · transit · annual ridership · sql · r
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, color: TEXT, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Two different recovery patterns
        </h3>
        <p style={{ fontSize: "0.875rem", color: TEXT2, lineHeight: 1.8, maxWidth: 760, marginBottom: "0.5rem" }}>
          I wanted to compare how Link light rail and a combined Sounder + ST Express (rail and bus) group changed from their 2019 annual levels. By 2025, Link light rail stood above its baseline while the combined group remained below it. This comparison describes the difference; it does not explain its causes.
        </p>
        <p style={{ fontSize: "0.8rem", color: TEXT2, lineHeight: 1.7, maxWidth: 760, marginBottom: "0.5rem" }}>
          What I wanted to know → How did these services compare with their 2019 annual levels? What I found → Link light rail reached {formatIndex(LINK_INDEX)} of its 2019 level; Sounder + ST Express (rail and bus) reached {formatIndex(COMPARISON_INDEX)}.
        </p>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3 }}>
          Calendar years 2019 and 2025 · FTA monthly dataset updated Nov. 3, 2026
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { title: "Link light rail", base: LINK_BASELINE, current: LINK_CURRENT, index: LINK_INDEX, color: TEAL2 },
          { title: "Sounder + ST Express (rail and bus)", base: COMPARISON_BASELINE, current: COMPARISON_CURRENT, index: COMPARISON_INDEX, color: ACCENT2 },
        ].map((item) => (
          <div key={item.title} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{item.title}</div>
            <div style={{ fontFamily: MONO, fontSize: "1.35rem", fontWeight: 700, color: item.color }}>{formatIndex(item.index)} of 2019</div>
            <div style={{ fontSize: "0.72rem", color: TEXT2, marginTop: "0.35rem" }}>{formatMillions(item.base)} in 2019 → {formatMillions(item.current)} in 2025</div>
          </div>
        ))}
      </div>

      <section aria-label="Annual ridership comparison" style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1rem clamp(0.75rem, 2vw, 1.5rem)", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Annual unlinked passenger trips · millions
        </div>
        <AnnualUptChart />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", marginTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}><span aria-hidden="true" style={{ width: 10, height: 10, background: TEAL, borderRadius: 2 }} /><span style={{ fontSize: "0.7rem", color: TEXT2 }}>Link light rail</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}><span aria-hidden="true" style={{ width: 10, height: 10, background: ACCENT, borderRadius: 2 }} /><span style={{ fontSize: "0.7rem", color: TEXT2 }}>Sounder + ST Express (rail and bus)</span></div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", fontSize: "0.72rem", color: TEXT2 }}>
          <caption style={{ textAlign: "left", color: TEXT3, fontFamily: MONO, fontSize: "0.55rem", marginBottom: "0.4rem" }}>Annual totals (UPT)</caption>
          <thead><tr><th scope="col" style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>Year</th><th scope="col" style={{ textAlign: "right", padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>Link light rail</th><th scope="col" style={{ textAlign: "right", padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>Sounder + ST Express</th></tr></thead>
          <tbody>{ANNUAL_UPT.map((row) => <tr key={row.year}><th scope="row" style={{ textAlign: "left", fontWeight: 500, padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>{row.year}</th><td style={{ textAlign: "right", padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>{row.link.toLocaleString("en-US")}</td><td style={{ textAlign: "right", padding: "0.45rem", borderBottom: `1px solid ${BORDER}` }}>{row.comparison.toLocaleString("en-US")}</td></tr>)}</tbody>
        </table>
      </section>

      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }} role="group" aria-label="Analysis examples">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCodeTab(tab.id)}
              aria-pressed={codeTab === tab.id}
              style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", color: codeTab === tab.id ? TEAL2 : TEXT3, padding: "0.6rem 1rem", borderBottom: codeTab === tab.id ? `2px solid ${TEAL}` : "2px solid transparent", marginBottom: "-1px", whiteSpace: "nowrap" }}
            >{tab.label}</button>
          ))}
        </div>
        <div className="query-card-pad">
          <pre className="sql-pre-mobile" style={{ fontFamily: MONO, fontSize: "0.72rem", color: TEXT2, margin: 0, overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre" }}><code>{activeCode}</code></pre>
        </div>
      </div>

      <aside style={{ marginTop: "1.25rem", padding: "1rem", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.5rem" }}>
        <h4 style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.45rem" }}>Method and sources</h4>
        <p style={{ fontSize: "0.75rem", color: TEXT3, lineHeight: 1.7, margin: "0 0 0.6rem" }}>
          Annual UPT is summed across January–December from the FTA Complete Monthly Ridership dataset. The Link series uses NTD mode LR only and excludes Tacoma Link streetcar (mode SR) in both years. Sounder + ST Express (rail and bus) combines commuter rail (CR) with Sound Transit’s ST Express bus total; the agency’s ST Express rows use CB in 2019 and CB plus MB in 2025. The 2019 Sound Transit Annual Report groups LR and SR together in its 25.7M “Link” total; isolating LR gives the comparable 24.76M baseline used here. The 2025 totals match Sound Transit’s published mode totals. Results are descriptive and do not attribute causes.
        </p>
        <p style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", fontSize: "0.72rem", margin: 0 }}>
          <a href="https://catalog.data.gov/dataset/complete-monthly-ridership-with-adjustments-and-estimates" target="_blank" rel="noopener noreferrer" style={{ color: TEAL2 }}>FTA monthly data</a>
          <a href="https://www.transit.dot.gov/ntd/monthly-ridership" target="_blank" rel="noopener noreferrer" style={{ color: TEAL2 }}>FTA data notes</a>
          <a href="https://www.soundtransit.org/sites/default/files/documents/2019-sound-transit-annual-report.pdf" target="_blank" rel="noopener noreferrer" style={{ color: TEAL2 }}>Sound Transit 2019 Annual Report</a>
          <a href="https://www.soundtransit.org/sites/default/files/documents/2025-fare-revenue-report.pdf" target="_blank" rel="noopener noreferrer" style={{ color: TEAL2 }}>Sound Transit 2025 Fare Revenue Report</a>
        </p>
      </aside>
    </div>
  );
}
