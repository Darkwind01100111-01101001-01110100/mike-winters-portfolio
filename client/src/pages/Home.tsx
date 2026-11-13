// ═══════════════════════════════════════════════════════
// HOME PAGE — Mike Winters Portfolio
// Design: V3 Obsidian — deep black, violet/lavender accents
// Fonts: Fraunces (display) · Space Grotesk (body) · JetBrains Mono (code)
// Sections: Hero → Metrics → Programs → About → Data & Tooling → Projects → Contact
// ═══════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";
import { METRICS, SKILLS, DASHBOARDS, SQL_QUERIES } from "@/lib/portfolioData";
import DataIsekaiSection from "@/components/DataIsekaiSection";
import ProgramsSection from "@/components/ProgramsSection";
import LinkLineSection from "@/components/LinkLineSection";
import portfolioContent from "@/lib/portfolioContent.json";

// ── Design tokens ──────────────────────────────────────
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
const GLOW    = "rgba(124,106,255,0.18)";
const GLOW2   = "rgba(124,106,255,0.08)";
const DISPLAY = "'Fraunces', serif";
const SANS    = "'Space Grotesk', sans-serif";
const MONO    = "'JetBrains Mono', monospace";

// ── Intersection observer hook ─────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Metric card ────────────────────────────────────────
function MetricCard({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div
      style={{
        background: BG3,
        border: `1px solid ${BORDER}`,
        borderRadius: "0.625rem",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}>
      <div style={{ fontFamily: MONO, fontSize: "2rem", fontWeight: 700, color: ACCENT2, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: TEXT }}>{label}</div>
      <div style={{ fontSize: "0.7rem", color: TEXT3, fontFamily: MONO }}>{sublabel}</div>
    </div>
  );
}

// ── SQL code block ─────────────────────────────────────
function SqlBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // Apply highlights in order: numbers first (before any HTML is injected),
  // then template vars, then comments, then keywords — so injected attribute
  // values like font-weight:600 are never re-matched by the number regex.
  const highlighted = code
    .replace(/\b(\d+)\b/g, m => `<span style="color:#f97316">${m}</span>`)
    .replace(/\{\{[^}]+\}\}/g, m => `<span style="color:#f59e0b">${m}</span>`)
    .replace(/--[^\n]*/g, m => `<span style="color:${TEXT3}">${m}</span>`)
    .replace(/\b(WITH|SELECT|FROM|WHERE|JOIN|LEFT JOIN|GROUP BY|ORDER BY|HAVING|AND|OR|NOT|IN|AS|ON|CASE|WHEN|THEN|ELSE|END|DISTINCT|COUNT|SUM|AVG|ROUND|CAST|NULLIF|COALESCE|VALUES|NULL|TRUE|FALSE)\b/g,
      m => `<span style="color:${ACCENT2};font-weight:600">${m}</span>`);
  return (
    <div style={{ background: "#0d0d10", border: `1px solid rgba(124,106,255,0.2)`, borderRadius: "0.5rem", fontFamily: MONO }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1rem", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, letterSpacing: "0.1em", textTransform: "uppercase" }}>SQL · Presto/Trino</span>
        <button onClick={handleCopy}
          style={{ fontFamily: MONO, fontSize: "0.65rem", padding: "0.2rem 0.6rem", borderRadius: 4, border: `1px solid ${BORDER2}`, background: "transparent", color: copied ? ACCENT2 : TEXT3, cursor: "pointer" }}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre style={{ padding: "1rem", overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.7, color: TEXT, maxHeight: 420, margin: 0 }} className="sql-pre-mobile"
        dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
}

// ── Sample output table ────────────────────────────────
function SampleTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "0.5rem", border: `1px solid ${BORDER}` }}>
      <table style={{ width: "100%", fontSize: "0.75rem", fontFamily: MONO, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: BG3 }}>
            {columns.map(c => (
              <th key={c} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 600, color: ACCENT2, borderBottom: `1px solid ${BORDER}`, fontSize: "0.65rem" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              {columns.map(c => (
                <td key={c} style={{ padding: "0.5rem 0.75rem", color: TEXT, borderBottom: `1px solid ${BORDER}` }}>
                  {Object.values(row)[columns.indexOf(c)]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────
function Nav() {
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    const sections = ["hero","about","programs","data-tooling","projects","contact"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // no dropdown in this nav version
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { id: "about",      label: "About" },
    { id: "programs",   label: "Programs" },
    { id: "data-tooling", label: "Data & Tooling" },
    { id: "projects",   label: "Projects" },
    { id: "contact",    label: "Contact" },
  ];

  const navLinkStyle = (id: string) => ({
    fontFamily: MONO,
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: active === id ? ACCENT2 : TEXT3,
    textDecoration: "none",
    padding: "0.35rem 0.75rem",
    borderRadius: 4,
    border: active === id ? `1px solid rgba(124,106,255,0.25)` : "1px solid transparent",
    background: active === id ? GLOW2 : "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,11,0.88)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${BORDER}`,
      padding: "0 2rem", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontFamily: DISPLAY, fontSize: "1.05rem", color: TEXT, letterSpacing: "-0.02em" }}>
          M<span style={{ color: ACCENT }}>W</span>
        </span>
        <span style={{ fontFamily: SANS, fontSize: "0.85rem", fontWeight: 500, color: TEXT2 }} className="hidden sm:block">Mike Winters</span>
      </button>

      {/* Desktop nav */}
      <div className="hidden md:flex" style={{ gap: "0.25rem", alignItems: "center" }}>
        {navItems.map(({ id, label }) => (
          <button key={id} onClick={() => scrollTo(id)} style={navLinkStyle(id)}>{label}</button>
        ))}
        <button onClick={() => { /* open modal via global */ (window as any).__openCvPreview?.(); }}
          style={{ ...navLinkStyle("cv") as React.CSSProperties, color: ACCENT2, background: "none", border: "none", cursor: "pointer" }}>
          CV ↗
        </button>
      </div>

      {/* Right: Get in touch + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="hidden md:block"
          style={{ fontFamily: MONO, fontSize: "0.72rem", fontWeight: 600, color: BG, background: ACCENT, padding: "0.5rem 1.1rem", borderRadius: 4, border: "none", cursor: "pointer", transition: "background 0.2s" }}>
          Get in touch
        </button>
        <button className="md:hidden" onClick={() => setMobileOpen(o => !o)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation"
          style={{ background: "none", border: "none", color: TEXT, cursor: "pointer", fontSize: "1.2rem" }}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-navigation" style={{
          position: "absolute", top: 56, left: 0, right: 0,
          background: "rgba(10,10,11,0.97)", padding: "1rem",
          borderBottom: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          {navItems.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ ...navLinkStyle(id), textAlign: "left", width: "100%" }}>
              {label}
            </button>
          ))}
          <button onClick={() => { (window as any).__openCvPreview?.(); }}
            style={{ fontFamily: MONO, fontSize: "0.72rem", color: ACCENT2, padding: "0.35rem 0.75rem", background: "none", border: "none", cursor: "pointer" }}>
            CV ↗
          </button>
          <button onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ fontFamily: MONO, fontSize: "0.72rem", fontWeight: 600, color: BG, background: ACCENT, padding: "0.5rem 1rem", borderRadius: 4, border: "none", cursor: "pointer", textAlign: "center" }}>
            Get in touch
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Dashboard lightbox ─────────────────────────────────
function DashboardLightbox({ dash, onClose, triggerRef }: { dash: typeof DASHBOARDS[0]; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); triggerRef.current?.focus(); };
  }, [onClose, triggerRef]);
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${dash.title} preview`} onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "pointer",
    }}>
      <button ref={closeButtonRef} type="button" aria-label={`Close ${dash.title} preview`} onClick={onClose} style={{
        position: "absolute", top: "1.5rem", right: "1.5rem",
        fontFamily: MONO, fontSize: "0.7rem", color: TEXT3, background: BG3,
        border: `1px solid ${BORDER}`, padding: "0.4rem 0.8rem", borderRadius: 4, cursor: "pointer",
      }}>✕ close</button>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "90vw" }}>
        <img src={dash.image} alt=""
          style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 8, border: `1px solid ${BORDER2}`, boxShadow: "0 24px 80px rgba(0,0,0,0.8)", objectFit: "contain" }} />
        <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: TEXT3, textAlign: "center" }}>{dash.title} — {dash.subtitle}</p>
      </div>
    </div>
  );
}

// ── Dashboard card ─────────────────────────────────────
function DashboardCard({ dash, index }: { dash: typeof DASHBOARDS[0]; index: number }) {
  const { ref, inView } = useInView();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      {lightboxOpen && <DashboardLightbox dash={dash} onClose={() => setLightboxOpen(false)} triggerRef={triggerRef} />}
      <div ref={ref} className="transition-all duration-500"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transitionDelay: `${index * 120}ms`,
          background: BG3,
          border: `1px solid ${BORDER}`,
          borderRadius: "0.625rem",
          overflow: "hidden",
        }}>
        {/* Screenshot */}
        <button ref={triggerRef} type="button" className="group" aria-label={`Open enlarged preview for ${dash.title}`} onClick={() => setLightboxOpen(true)}
          style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#0d0d10", cursor: "zoom-in", padding: 0, border: 0, textAlign: "left" }}>
          <img src={dash.image} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s ease", display: "block" }}
            className="group-hover:scale-[1.03]" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,10,11,0.85) 100%)", pointerEvents: "none" }} />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ position: "absolute", top: "0.6rem", right: "0.6rem", background: "rgba(10,10,11,0.75)", border: `1px solid ${BORDER2}`, borderRadius: 4, padding: "0.3rem 0.5rem", fontFamily: MONO, fontSize: "0.58rem", color: TEXT3 }}>
            ⤢ expand
          </div>
        </button>
        {/* Info */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{dash.subtitle}</div>
          <h3 style={{ fontFamily: DISPLAY, fontSize: "1.05rem", fontWeight: 400, color: TEXT, marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{dash.title}</h3>
          <p style={{ fontSize: "0.8rem", color: TEXT2, lineHeight: 1.7, marginBottom: "0.9rem" }}>{dash.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
            {dash.metrics.map(m => (
              <span key={m} style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT2, background: GLOW2, border: `1px solid rgba(124,106,255,0.15)`, padding: "0.2rem 0.5rem", borderRadius: 3 }}>{m}</span>
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: TEXT3, marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${BORDER}` }}>
            {dash.tags.join(" · ")}
          </div>
        </div>
      </div>
    </>
  );
}

// ── SQL query section ──────────────────────────────────
function QuerySection({ query, index }: { query: (typeof SQL_QUERIES)[number]; index: number }) {
  const q = query as any;
  const { ref, inView } = useInView();
  const [tab, setTab] = useState<"sql" | "output">("sql");
  return (
    <div ref={ref} className="transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 100}ms`,
        background: BG3,
        border: `1px solid ${BORDER}`,
        borderRadius: "0.625rem",
        overflow: "hidden",
      }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${BORDER}` }} className="query-card-pad">
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
          Query {index + 1} · {query.panel}
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 400, color: TEXT, marginBottom: "0.5rem" }}>{query.title}</h3>
        <p style={{ fontSize: "0.8rem", color: TEXT2, lineHeight: 1.65, marginBottom: "0.75rem" }}>{query.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {query.patterns.map(p => (
            <span key={p} style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT2, background: GLOW2, border: `1px solid rgba(124,106,255,0.2)`, padding: "0.2rem 0.5rem", borderRadius: 3 }}>{p}</span>
          ))}
        </div>
      </div>
      {/* Tab switcher */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
        {(["sql", "output"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "0.6rem 1.25rem",
              fontFamily: MONO, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
              background: "transparent", border: "none", cursor: "pointer",
              color: tab === t ? ACCENT2 : TEXT3,
              borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
              transition: "all 0.2s",
            }}>
            {t === "sql" ? "</> SQL" : "▶ Sample Output"}
          </button>
        ))}
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }} className="query-card-pad">
        {tab === "sql" ? (
          <SqlBlock code={query.code} />
        ) : (
          <SampleTable rows={(q.sampleOutput ?? []) as Record<string, string>[]} columns={(q.outputColumns ?? []) as string[]} />
        )}
      </div>
    </div>
  );
}

// ── Unified Projects section (tabbed) ──────────────────
function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<"isekai" | "link">("link");
  const projectTabs = portfolioContent.projects.map(project => ({
    id: project.id as "link" | "isekai",
    label: project.title,
    sub: project.tabSummary,
  }));

  return (
    <section id="projects" style={{ padding: "6rem clamp(2rem, 5vw, 6rem)", background: BG }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Eyebrow + title */}
        <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          // selected projects
        </div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: TEXT, letterSpacing: "-0.02em", marginBottom: "0.75rem", lineHeight: 1.2 }}>
          Selected Projects
        </h2>
        <p style={{ fontSize: "0.9rem", color: TEXT2, maxWidth: 600, lineHeight: 1.8, marginBottom: "2.5rem" }}>
          A SQL learning product I designed and shipped, alongside an independent analysis of Seattle Link ridership.
        </p>

        {/* Tab bar — prominent toggle */}
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Select a project to explore ↓
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }} className="project-tabs-mobile">
          {projectTabs.map(t => (
            <button key={t.id} type="button" aria-pressed={activeProject === t.id} onClick={() => setActiveProject(t.id)}
              style={{
                fontFamily: MONO, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em",
                background: activeProject === t.id ? "rgba(124,106,255,0.12)" : BG3,
                border: activeProject === t.id ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                borderRadius: "0.5rem",
                cursor: "pointer",
                color: activeProject === t.id ? ACCENT2 : TEXT3,
                padding: "0.85rem 1.25rem",
                transition: "all 0.2s",
                textAlign: "left",
              }}>
              {t.label}
              <span style={{ display: "block", fontSize: "0.58rem", color: activeProject === t.id ? TEXT3 : "rgba(138,134,153,0.6)", marginTop: "0.3rem", letterSpacing: "0.04em", fontWeight: 400 }}>
                {t.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div key={activeProject} style={{ animation: "obsReveal 0.35s ease forwards" }}>
          {activeProject === "isekai" && <DataIsekaiSection embedded />}
          {activeProject === "link" && <LinkLineSection embedded />}

        </div>
      </div>
    </section>
  );
}

// ── Contact Form ─────────────────────────────────────
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          ...values,
        }).toString(),
      });
      if (res.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: BG, border: `1px solid ${BORDER2}`,
    borderRadius: 4, padding: "0.65rem 0.85rem",
    fontFamily: SANS, fontSize: "0.85rem", color: TEXT,
    outline: "none", transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em",
    textTransform: "uppercase", color: TEXT3, display: "block", marginBottom: "0.4rem",
  };

  return (
    <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
        <span style={{ fontFamily: MONO, fontSize: "0.65rem", color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase" }}>Available for new roles</span>
      </div>
      {status === "success" ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: "1.2rem", color: TEXT, marginBottom: "0.5rem" }}>Message sent.</div>
          <div style={{ fontFamily: MONO, fontSize: "0.72rem", color: TEXT3 }}>I'll be in touch shortly.</div>
        </div>
      ) : (
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p style={{ display: "none" }}><input name="bot-field" /></p>
          <div>
            <label htmlFor="contact-name" style={labelStyle}>Name</label>
            <input
              id="contact-name" type="text" name="name" required
              value={values.name}
              onChange={e => setValues(v => ({ ...v, name: e.target.value }))}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="contact-email" style={labelStyle}>Email</label>
            <input
              id="contact-email" type="email" name="email" required
              value={values.email}
              onChange={e => setValues(v => ({ ...v, email: e.target.value }))}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="contact-message" style={labelStyle}>Message</label>
            <textarea
              id="contact-message" name="message" required rows={4}
              value={values.message}
              onChange={e => setValues(v => ({ ...v, message: e.target.value }))}
              placeholder="What's on your mind?"
              style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
            />
          </div>
          {status === "error" && (
            <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: "#f87171" }}>Something went wrong — try emailing directly.</div>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              fontFamily: MONO, fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: BG, background: status === "sending" ? TEXT3 : ACCENT,
              border: "none", borderRadius: 4, padding: "0.7rem 1.25rem",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              transition: "background 0.2s", alignSelf: "flex-start",
            }}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────
const CV_PDF_URL = portfolioContent.resumeUrl;

export default function Home() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const cvReturnFocusRef = useRef<HTMLElement | null>(null);
  const cvDialogRef = useRef<HTMLDivElement>(null);
  const cvCloseButtonRef = useRef<HTMLButtonElement>(null);
  const openCvPreview = () => {
    cvReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCvPreviewOpen(true);
  };
  // Wire up global opener for nav buttons (which live outside Home's scope)
  useEffect(() => {
    (window as any).__openCvPreview = openCvPreview;
    return () => { delete (window as any).__openCvPreview; };
  }, []);

  // Keep keyboard focus inside the resume modal and return it to its opener.
  useEffect(() => {
    if (!cvPreviewOpen) return;
    cvCloseButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCvPreviewOpen(false);
      if (e.key === "Tab") {
        const items = cvDialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); cvReturnFocusRef.current?.focus(); };
  }, [cvPreviewOpen]);

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: SANS, minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "6rem clamp(2rem, 5vw, 6rem) 4rem", position: "relative", overflow: "hidden",
      }} className="hero-mobile-pad">
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,106,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none", animation: "obsPulse 4s ease-in-out infinite",
        }} />
        <div ref={heroRef} style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
          className="grid-mobile-stack">
          {/* Left column */}
          <div style={{ opacity: 1, transform: "translateY(0)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
              {portfolioContent.tagline}
            </div>
            <h1 aria-label={portfolioContent.name} style={{ fontFamily: DISPLAY, fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
              <span style={{ color: TEXT }}>{portfolioContent.name.split(" ")[0]}</span><br />
              <em style={{ color: ACCENT2, fontStyle: "italic" }}>{portfolioContent.name.split(" ").slice(1).join(" ")}</em>
            </h1>
            <p style={{ fontFamily: SANS, fontSize: "1.1rem", fontWeight: 300, color: TEXT2, marginBottom: "1rem" }}>
              {portfolioContent.role}
            </p>
            <p style={{ fontSize: "0.9rem", color: TEXT2, lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: 480 }}>
              {portfolioContent.heroSummary}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.75rem" }}>
              {["Program & Project Management", "Human Evaluation & Annotation Ops", "Vendor Management", "SQL (Presto/Trino)", "Meta · Kikoff · Figure"].map(t => (
                <span key={t} style={{ fontFamily: MONO, fontSize: "0.68rem", color: TEXT2, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, padding: "0.25rem 0.6rem", borderRadius: 3 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontFamily: MONO, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", background: ACCENT, border: "none", padding: "0.75rem 1.5rem", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}>
                View Work
              </button>
              <button onClick={openCvPreview}
                style={{ fontFamily: MONO, fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: TEXT2, background: "transparent", border: `1px solid ${BORDER2}`, padding: "0.75rem 1.5rem", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}>
                View CV ↗
              </button>
            </div>
          </div>

          {/* Right column — competency blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", opacity: 1, transform: "translateY(0)", transition: "all 0.7s ease 0.2s" }}
            className="hidden md:flex">
            {[
              {
                label: "What I Do",
                title: "Programs & Delivery",
                desc: "Run work from intake and scoping through delivery, including pre-launch readiness gates for short-cycle tasks on a 3-day SLA.",
                tags: ["Intake", "Readiness gates", "SLAs"],
              },
              {
                label: "What I Do",
                title: "Quality & Calibration",
                desc: "Write and maintain guidelines and rubrics; measure inter-rater reliability through multi-review and consensus with SME adjudication, backed by audits.",
                tags: ["Guidelines", "IRR", "Audits"],
              },
              {
                label: "What I Do",
                title: "Teams & Vendors",
                desc: "Scaled teams from 0 to 80+, coach 12 workstream leads, and have supported multi-country vendor teams.",
                tags: ["Lead development", "Onboarding", "Vendor management"],
              },
            ].map(block => (
              <div key={block.title} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.25rem", transition: "all 0.3s" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{block.label}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: "0.95rem", fontWeight: 400, color: TEXT, marginBottom: "0.4rem" }}>{block.title}</div>
                <div style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.65, marginBottom: "0.75rem" }}>{block.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {block.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, padding: "0.15rem 0.5rem", borderRadius: 3 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <div style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "3rem clamp(2rem, 5vw, 6rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", textAlign: "center" }}>
            // by the numbers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            {METRICS.map(m => <MetricCard key={m.label} {...m} />)}
          </div>
        </div>
      </div>

      <ProgramsSection />
      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "6rem clamp(2rem, 5vw, 6rem)" }} className="section-mobile-pad">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// about</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: TEXT, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.2 }}>
            Background &amp; Approach
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", alignItems: "start" }} className="grid-mobile-stack">
            <div>
              <p style={{ fontSize: "0.9rem", color: TEXT2, lineHeight: 1.85, marginBottom: "1.25rem" }}>
                {portfolioContent.about[0]}
              </p>
              <p style={{ fontSize: "0.9rem", color: TEXT2, lineHeight: 1.85 }}>
                {portfolioContent.about[1]}
              </p>
            </div>
            <div>
              {Object.entries(SKILLS).map(([cat, skills]) => (
                <div key={cat} style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{cat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {skills.map(s => (
                      <span key={s} style={{ fontSize: "0.72rem", color: TEXT2, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, padding: "0.25rem 0.6rem", borderRadius: 3 }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARDS ── */}
      <section id="data-tooling" style={{ padding: "6rem clamp(2rem, 5vw, 6rem)", background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// decision support</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: TEXT, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.2 }}>
            Data &amp; Tooling
          </h2>
          <p style={{ fontSize: "0.9rem", color: TEXT2, maxWidth: 760, lineHeight: 1.8, marginBottom: "2rem" }}>
            Dashboards and queries support decisions around throughput and quality gaps. All examples use synthetic data. The SQL example illustrates common table expressions and conditional aggregation; it is not production code.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem" }} className="grid-dashboard-cards">
            {DASHBOARDS.map((d, i) => <DashboardCard key={d.id} dash={d} index={i} />)}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>// illustrative sql</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {SQL_QUERIES.map((q, i) => <QuerySection key={q.id} query={q} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS (unified tabbed) ── */}
      <ProjectsSection />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "6rem clamp(2rem, 5vw, 6rem)", background: BG2, borderTop: `1px solid ${BORDER}` }} className="section-mobile-pad">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>// contact</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: TEXT, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.2 }}>
            Get in Touch
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="grid-mobile-stack">
            {/* Links */}
            <div>
              <p style={{ fontSize: "0.9rem", color: TEXT2, lineHeight: 1.8, marginBottom: "2rem" }}>
                {portfolioContent.contact.roles} {portfolioContent.contact.location}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { icon: "✉", label: portfolioContent.contact.emailLabel, href: portfolioContent.contact.emailHref, external: false },
                  { icon: "in", label: portfolioContent.contact.linkedinLabel, href: portfolioContent.contact.linkedinHref, external: true },

                ].map(link => (
                  <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", textDecoration: "none", transition: "all 0.2s", color: TEXT2, fontSize: "0.85rem" }}>
                    <span style={{ fontFamily: MONO, fontSize: "0.7rem", color: ACCENT, width: 20, textAlign: "center" }}>{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── CV PREVIEW MODAL ── */}
      {cvPreviewOpen && (
        <div
          ref={cvDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
          onClick={() => setCvPreviewOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: BG2, border: `1px solid ${BORDER2}`,
              borderRadius: 8, overflow: "hidden",
              width: "min(860px, 95vw)", height: "min(90vh, 1100px)",
              display: "flex", flexDirection: "column",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Modal header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.85rem 1.25rem",
              borderBottom: `1px solid ${BORDER}`,
              background: BG3,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Resume Preview</span>
                <span style={{ fontFamily: MONO, fontSize: "0.65rem", color: TEXT3 }}>Mike Winters · Program & Project Management</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <a
                  href={CV_PDF_URL}
                  download="MikeWinters_Program_Project_Management_Resume.pdf"
                  style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT2, border: `1px solid rgba(124,106,255,0.3)`, padding: "0.3rem 0.75rem", borderRadius: 3, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Download PDF ↓
                </a>
                <button
                  ref={cvCloseButtonRef}
                  type="button"
                  aria-label="Close resume preview"
                  onClick={() => setCvPreviewOpen(false)}
                  style={{ fontFamily: MONO, fontSize: "0.75rem", color: TEXT2, background: "none", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "0.3rem 0.6rem", cursor: "pointer", lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            </div>
            {/* iframe */}
            <iframe
              src={CV_PDF_URL}
              title="Mike Winters resume"
              style={{ flex: 1, border: "none", width: "100%" }}
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ padding: "1.5rem 2rem", borderTop: `1px solid ${BORDER}`, textAlign: "center" }}>
        <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: TEXT3 }}>
          Mike Winters · Program & Project Management · <a href="https://mikewinters.netlify.app" style={{ color: ACCENT, textDecoration: "none" }}>mikewinters.netlify.app</a>
        </p>
      </footer>
    </div>
  );
}
