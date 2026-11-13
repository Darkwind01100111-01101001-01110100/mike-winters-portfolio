// Portfolio content — Mike Winters

export const METRICS = [
  { value: "~20", label: "Years", sublabel: "Operations & program leadership" },
  { value: "80+", label: "Team led", sublabel: "Annotation team at Meta" },
  { value: "0 → 80+", label: "Teams scaled", sublabel: "During launches" },
  { value: "9+", label: "Languages", sublabel: "Workflows built and ramped" },
  { value: "12", label: "Leads coached", sublabel: "Plus 10+ coordinators cross-trained" },
];

export const SKILLS = {
  "Program & Leadership": ["Program/project management", "Stakeholder management", "Vendor/BPO management", "Capacity planning", "Training & lead development"],
  "Quality & Evaluation": ["Guidelines & rubrics", "IRR & calibration", "Audit sampling", "Human labeling platforms"],
  "Data & Tools": ["SQL (Presto/Trino)", "Dashboards & KPI design", "Python (scripting)", "AI-assisted workflows"],
};

export const DASHBOARDS = [
  {
    id: "productivity",
    title: "Productivity Dashboard",
    subtitle: "Illustrative sample · synthetic data",
    description: "Tracks job lifecycle, completion and turnaround so leads can rebalance work before deadlines slip.",
    tags: ["Throughput", "Lifecycle", "Synthetic data"],
    metrics: ["Lifecycle view", "Turnaround", "Team rollups"],
    image: "/images/productivity-dashboard.png",
  },
  {
    id: "quality",
    title: "Quality Dashboard",
    subtitle: "Illustrative sample · synthetic data",
    description: "Shows pass-rate trends, rater-level quality and QA coverage against target to focus calibration and coaching.",
    tags: ["Quality", "Calibration", "Synthetic data"],
    metrics: ["Pass-rate trends", "Rater-level quality", "QA coverage vs target"],
    image: "/images/quality-dashboard-final.png",
  },
  {
    id: "operational",
    title: "Operational Performance Matrix",
    subtitle: "Illustrative sample · synthetic data",
    description: "Summarizes daily goal attainment by team against weekly KPI targets.",
    tags: ["KPI tracking", "Team delivery", "Synthetic data"],
    metrics: ["Daily granularity", "Team comparisons", "Target benchmarks"],
    image: "/images/operational-performance.png",
  },
];

export const SQL_QUERIES = [
  {
    id: "lifecycle-example",
    title: "Work Item Completion and Turnaround",
    panel: "Decision support example",
    description: "A small synthetic example of how completion and turnaround can be summarized by work type.",
    patterns: ["CTE", "Conditional aggregation", "Synthetic data"],
    code: `WITH work_items (work_id, work_type, created_day, completed_day) AS (
    VALUES
        (1, 'Review', 1, 2),
        (2, 'Review', 1, NULL),
        (3, 'Audit', 2, 4)
)
SELECT
    work_type,
    COUNT(*) AS items_created,
    SUM(CASE WHEN completed_day IS NOT NULL THEN 1 ELSE 0 END) AS items_completed,
    ROUND(100.0 * SUM(CASE WHEN completed_day IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS completion_pct,
    ROUND(AVG(completed_day - created_day), 1) AS avg_days_to_complete
FROM work_items
GROUP BY work_type`,
    sampleOutput: [
      { work_type: "Review", items_created: "2", items_completed: "1", completion_pct: "50.0%", avg_days_to_complete: "1.0" },
      { work_type: "Audit", items_created: "1", items_completed: "1", completion_pct: "100.0%", avg_days_to_complete: "2.0" },
    ],
    outputColumns: ["work_type", "items_created", "items_completed", "completion_pct", "avg_days_to_complete"],
  },
];
