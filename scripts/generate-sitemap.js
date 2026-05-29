import fs from "fs";
import path from "path";

const outPath = path.resolve("public/sitemap.xml");
const baseUrl = "https://simransn.tech";

async function loadProjects() {
  try {
    const dataModule = await import("../src/data.js");
    return dataModule.default || [];
  } catch (err) {
    console.warn("Could not import data module, falling back to text parse.", err.message);
    // Fallback: read the file and extract 'link' values via regex
    try {
      const file = fs.readFileSync(path.resolve("src/data.js"), "utf8");
      const linkRegex = /link:\s*['"]([^'"]+)['"]/g;
      const matches = [];
      let m;
      while ((m = linkRegex.exec(file)) !== null) {
        matches.push(m[1]);
      }
      return matches.map((l) => ({ link: l }));
    } catch (e) {
      console.error("Fallback parse failed:", e);
      return [];
    }
  }
}

function formatDate(d = new Date()) {
  return d.toISOString().split("T")[0];
}

async function build() {
  const projects = await loadProjects();

  const urls = [
    { loc: `${baseUrl}/`, lastmod: formatDate() },
    // include project links if they are internal
    ...projects
      .filter((p) => p.link && p.link.startsWith(baseUrl))
      .map((p) => ({ loc: p.link, lastmod: formatDate() })),
  ];

  const xml = [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`];

  for (const u of urls) {
    xml.push("  <url>");
    xml.push(`    <loc>${u.loc}</loc>`);
    if (u.lastmod) xml.push(`    <lastmod>${u.lastmod}</lastmod>`);
    xml.push("    <changefreq>monthly</changefreq>");
    xml.push("    <priority>0.8</priority>");
    xml.push("  </url>");
  }

  xml.push(`</urlset>`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml.join("\n"), "utf8");
  console.log("Sitemap written to", outPath);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
