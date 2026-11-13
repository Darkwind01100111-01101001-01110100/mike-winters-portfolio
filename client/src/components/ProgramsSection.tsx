import React from "react";
import portfolioContent from "@/lib/portfolioContent.json";

const cases = [
  {
    number: "01",
    title: portfolioContent.programs[0].title,
    problem: "Projects rotating every three to four days left little time for audit-and-fix loops.",
    role: "Co-developed the readiness framework.",
    approach: ["Intake", "Guidelines + calibration", "80% certification", "Golden-set validation", "Production", "20% audit"],
    result: "High-complexity, net-new tasks delivered on a three-day SLA.",
    visualLabel: "Readiness gates · three-day cycle",
    loop: "If certification or validation misses the bar, return to guideline calibration.",
  },
  {
    number: "02",
    title: portfolioContent.programs[1].title,
    problem: "New language workflows required configuration and usability checks before they could expand.",
    role: "Built, piloted, and ramped workflows with engineering and product.",
    approach: ["Pilot cohort", "Compatibility checks", "Language ramp", "Steady-state review"],
    result: "Workflows built and ramped across 9+ languages; the team serves as a go-to pilot group for new and complex workflows.",
    visualLabel: "Pilot → ramp → steady state",
    loop: "Refine configuration and usability at each checkpoint.",
  },
  {
    number: "03",
    title: portfolioContent.programs[2].title,
    problem: "Judgment-based evaluation needs consistent guidance, reliable review, and a path to resolve disagreement.",
    role: "Helped establish the quality and calibration practices used across workstreams.",
    approach: ["Multi-review", "Consensus", "Third-review SME adjudication", "Audit + outlier review", "Rater feedback", "Guideline update"],
    result: "A recurring feedback loop connecting reviewer-level metrics, audits, quality leads, and product or subject-matter experts.",
    visualLabel: "Calibration loop",
    loop: "Guideline updates feed the next multi-review cycle.",
  },
  {
    number: "04",
    title: portfolioContent.programs[3].title,
    problem: "A growing operation needed clear ownership, repeatable onboarding, and prepared workstream leads.",
    role: "Coach 12 workstream leads, cross-train 10+ coordinators, and deliver five training programs.",
    approach: ["Central resources", "Lead onboarding", "Clear role ownership", "Joint guideline review"],
    result: "Team leads own assignments and logistics; quality leads own standards and audits; product and SMEs own guideline content, with shared review before rollout.",
    visualLabel: "Ownership and review model",
    loop: "Coordinators support resourcing, escalations, and onboarding across the work.",
  },
];

const BG = "#111113";
const BG3 = "#16161a";
const BORDER = "rgba(255,255,255,0.09)";
const TEXT = "#e8e6f0";
const TEXT2 = "#b8b4cc";
const TEXT3 = "#8a8699";
const ACCENT = "#a594ff";
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";

function ProcessVisual({ steps, label, loop }: { steps: string[]; label: string; loop: string }) {
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "1rem", marginTop: "1.25rem" }}>
      <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "stretch", gap: "0.4rem", flexWrap: "wrap" }}>
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ flex: "1 1 110px", minWidth: 96, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 56, padding: "0.55rem", border: `1px solid ${BORDER}`, borderRadius: 5, color: TEXT, background: BG3, fontFamily: SANS, fontSize: "0.68rem", lineHeight: 1.35 }}>{step}</div>
            {i < steps.length - 1 && <div aria-hidden="true" style={{ color: ACCENT, alignSelf: "center", fontFamily: MONO }}>→</div>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: "0.65rem", color: TEXT3, fontSize: "0.68rem", lineHeight: 1.5 }}>↺ {loop}</div>
    </div>
  );
}

export default function ProgramsSection() {
  return (
    <section id="programs" aria-labelledby="programs-title" style={{ padding: "6rem clamp(2rem, 5vw, 6rem)", background: BG, borderBottom: `1px solid ${BORDER}` }} className="section-mobile-pad">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// programs & delivery</div>
        <h2 id="programs-title" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: TEXT, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.2 }}>Programs</h2>
        <p style={{ fontSize: "0.9rem", color: TEXT2, maxWidth: 680, lineHeight: 1.8, marginBottom: "2rem" }}>
          Selected examples of how I organize delivery, build quality into workflows, and develop the people responsible for the work.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: "1rem" }}>
          {cases.map((item) => (
            <article key={item.number} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "1.35rem", minWidth: 0 }}>
              <div style={{ fontFamily: MONO, color: ACCENT, fontSize: "0.62rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>CASE {item.number}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: TEXT, fontSize: "1.12rem", margin: "0 0 1rem", lineHeight: 1.35 }}>{item.title}</h3>
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {[["Problem", item.problem], ["My role", item.role], ["Result", item.result]].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontFamily: MONO, color: TEXT3, fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{label}</div>
                    <p style={{ color: TEXT2, fontSize: "0.76rem", lineHeight: 1.65, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <ProcessVisual steps={item.approach} label={item.visualLabel} loop={item.loop} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
