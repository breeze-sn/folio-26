import { Icon } from "@iconify/react";
import Seo from "./ui/Seo";
import NavBar from "./ui/NavBar";
import Cursor from "./ui/Cursor";
import Footer from "./ui/Footer";
import "../blog.css";

const mediumProfile = "https://medium.com/@breezesn";

const articles = [
  {
    number: "01",
    category: "DESIGN · 3 MIN READ",
    date: "AUG 13, 2025",
    title: "The Art of Minimalism: Lessons from Fluent UI and Apple Design for Modern Interfaces",
    summary: "A look at how clear hierarchy, useful whitespace, and deliberate choices make digital products easier to use.",
    href: "https://medium.com/@breezesn/the-art-of-minimalism-lessons-from-fluent-ui-and-apple-design-for-modern-interfaces-05cbe09f733e",
    cover: "minimalism",
    coverLabel: ["MAKE ROOM", "FOR WHAT MATTERS"],
  },
  {
    number: "02",
    category: "PUBLICATION",
    date: "NOV 2026",
    title: "Hospital AI 2027: From Listening to Acting to Orchestrating",
    summary: "Exploring how hospital AI can move beyond answering questions to coordinating workflows and helping teams take meaningful action.",
    href: "https://surgy.health/hospital-ai-2027.pdf",
    cover: "report",
    coverLabel: ["HOSPITAL AI", "2027"],
  },
  {
    number: "03",
    category: "ARTICLE",
    date: "OCT 28, 2026",
    title: "Hospital AI Budget 2027: Where to Invest and How to Choose",
    summary: "A practical look at prioritising hospital AI investments, evaluating opportunities, and making technology budgets count.",
    href: "https://surgy.health/blog/ai-resource-allocation-hospitals-2027",
    cover: "allocation",
    coverLabel: ["BETTER", "ALLOCATION"],
  },
  {
    number: "04",
    category: "ARTICLE",
    date: "OCT 28, 2026",
    title: "What Factors Influence Hospital Procurement Decisions for Surgical Analytics Platforms?",
    summary: "Breaking down the clinical, operational, and technical considerations behind choosing the right surgical analytics platform.",
    href: "https://surgy.health/blog/hospital-procurement-surgical-analytics-platforms",
    cover: "procurement",
    coverLabel: ["THE", "RIGHT TOOLS"],
  },
  {
    number: "05",
    category: "ARTICLE",
    date: "JUN 9, 2026",
    title: "Time Management for Healthcare Professionals: Free AI-Avatar Course on SurgyLearn & YouTube",
    summary: "An introduction to practical time-management habits and a free learning resource designed around the realities of healthcare work.",
    href: "https://surgy.health/blog/surgylearn-time-management-for-healthcare-professionals-2026",
    cover: "learning",
    coverLabel: ["MAKE TIME", "WORK BETTER"],
  },
];

function ArticleCard({ article, total }) {
  return (
    <a href={article.href} target="_blank" rel="noreferrer" className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-accent-100/30 bg-secondary-100 p-2">
      <div className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-primary-100">
      {article.cover && (
        <div className="blog-card-image">
        <div className={`blog-cover blog-card-cover blog-cover-${article.cover}`}>
          <div className="relative z-10 flex items-start justify-between font-grotesk text-[10px] font-semibold tracking-[0.16em]">
            <span>SIMRAN NAGEKAR</span><span>{article.number} / {String(total).padStart(2, "0")}</span>
          </div>
          <span className="blog-cover-type">{article.coverLabel.map((line) => <span key={line}>{line}</span>)}</span>
          <span className="blog-cover-orbit" aria-hidden="true" />
          <span className="blog-cover-square" aria-hidden="true" />
          <span className="blog-cover-caption">FIELD NOTES&nbsp; — &nbsp;{article.number}</span>
        </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 font-grotesk text-[10px] font-semibold tracking-[0.13em] text-accent-100">
          <span>{article.category}</span><span>{article.date}</span>
        </div>
        <h2 className="mt-5 max-w-xl font-general text-2xl font-semibold leading-[1.12] tracking-[-0.045em] text-accent-300 sm:text-[2rem]">{article.title}</h2>
        {article.summary && <p className="mt-4 flex-1 font-grotesk text-sm leading-7 text-accent-100">{article.summary}</p>}
        <span className="mt-8 inline-flex items-center gap-2 font-grotesk text-sm font-semibold text-secondary-600">
          {article.category === "PUBLICATION" ? "Read publication" : "Read article"} <Icon icon="ph:arrow-up-right" className="text-lg" />
        </span>
      </div>
      </div>
    </a>
  );
}

export default function Blog() {
  return (
    <div className="blog-page flex min-h-screen flex-col bg-secondary-100 text-accent-300">
      <Cursor />
      <Seo title="Writing" url="https://simransn.vercel.app/blog" robots="noindex, nofollow" />
      <NavBar isSubpage />
      <main className="blog-main mx-auto flex w-full max-w-none flex-1 flex-col px-4 sm:px-5 xl:px-6">
        <section aria-labelledby="blog-title" className="blog-hero">
          <div className="blog-hero-context">
            <p className="blog-eyebrow">A COLLECTION OF NOTES</p>
            <h1 id="blog-title">Ideas, made<br className="hidden sm:block" /> a little clearer.</h1>
            <p className="blog-intro-copy">Writing on thoughtful design, useful research, and the small decisions that shape digital experiences.</p>
            <a href={mediumProfile} target="_blank" rel="noreferrer" className="blog-medium-link">
              Visit my Medium <Icon icon="ph:arrow-up-right" />
            </a>
          </div>
          <div className="blog-cover blog-cover-minimalism blog-hero-art" role="img" aria-label="Abstract illustration of ideas in progress">
            <span className="blog-cover-orbit" aria-hidden="true" />
            <span className="blog-cover-square" aria-hidden="true" />
            <span className="blog-hero-disc" aria-hidden="true" />
            <span className="blog-hero-diamond" aria-hidden="true" />
          </div>
        </section>

        <section id="blog-articles" className="flex-1 py-8 sm:py-10" aria-labelledby="selected-writing">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><h2 id="selected-writing" className="font-general text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">From the notebook</h2></div>
            <span className="pb-1 font-grotesk text-xs text-accent-100">{String(articles.length).padStart(2, "0")} ARTICLES</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard key={article.number} article={article} total={articles.length} />)}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
