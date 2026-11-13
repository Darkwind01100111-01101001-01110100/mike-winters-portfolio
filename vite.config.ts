import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const portfolioContentPath = path.resolve(import.meta.dirname, "client/src/lib/portfolioContent.json");
const portfolioContent = JSON.parse(readFileSync(portfolioContentPath, "utf8")) as {
  name: string;
  tagline: string;
  role: string;
  heroSummary: string;
  about: string[];
  programs: { id: string; title: string; summary: string }[];
  projects: { id: string; title: string; summary: string; links: { label: string; href: string; external: boolean }[] }[];
  contact: { roles: string; location: string; emailLabel: string; emailHref: string; linkedinLabel: string; linkedinHref: string };
  resumeUrl: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

function linkList(links: { label: string; href: string; external: boolean }[]): string {
  return links.map((link) => {
    const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${escapeHtml(link.href)}"${target}>${escapeHtml(link.label)}</a>`;
  }).join(" · ");
}

function renderStaticSummary(): string {
  const programs = portfolioContent.programs.map((program) =>
    `<li><h3>${escapeHtml(program.title)}</h3><p>${escapeHtml(program.summary)}</p></li>`,
  ).join("");
  const projects = portfolioContent.projects.map((project) =>
    `<li><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p><p>${linkList(project.links)}</p></li>`,
  ).join("");

  return `<main id="portfolio-summary">
    <header>
      <h1>${escapeHtml(portfolioContent.name)}</h1>
      <p>${escapeHtml(portfolioContent.tagline)}</p>
      <p><strong>${escapeHtml(portfolioContent.role)}</strong></p>
      <p>${escapeHtml(portfolioContent.heroSummary)}</p>
    </header>
    <section aria-labelledby="summary-programs"><h2 id="summary-programs">Programs</h2><ul>${programs}</ul></section>
    <section aria-labelledby="summary-about"><h2 id="summary-about">About</h2><p>${escapeHtml(portfolioContent.about[0])}</p><p>${escapeHtml(portfolioContent.about[1])}</p></section>
    <section aria-labelledby="summary-projects"><h2 id="summary-projects">Selected projects</h2><ul>${projects}</ul></section>
    <section aria-labelledby="summary-contact"><h2 id="summary-contact">Contact and resume</h2><p>${escapeHtml(portfolioContent.contact.roles)} ${escapeHtml(portfolioContent.contact.location)}</p><address><a href="${escapeHtml(portfolioContent.contact.emailHref)}">${escapeHtml(portfolioContent.contact.emailLabel)}</a> · <a href="${escapeHtml(portfolioContent.contact.linkedinHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(portfolioContent.contact.linkedinLabel)}</a> · <a href="${escapeHtml(portfolioContent.resumeUrl)}">View resume</a></address></section>
  </main>`;
}

const staticSummaryPlugin: Plugin = {
  name: "portfolio-static-summary",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      const marker = "<!-- PORTFOLIO_STATIC_SUMMARY -->";
      if (!html.includes(marker)) {
        throw new Error("Missing portfolio static-summary marker in client/index.html");
      }
      return html.replace(marker, renderStaticSummary());
    },
  },
};

export default defineConfig({
  plugins: [staticSummaryPlugin, react(), tailwindcss(), jsxLocPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "react": path.resolve(import.meta.dirname, "node_modules", "react"),
      "react-dom": path.resolve(import.meta.dirname, "node_modules", "react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
