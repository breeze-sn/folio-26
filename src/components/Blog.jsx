import { Icon } from "@iconify/react";
import Seo from "./ui/Seo";
import NavBar from "./ui/NavBar";
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
];

function ArticleCard({ article, total }) {
  return (
    <a href={article.href} target="_blank" rel="noreferrer" className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-accent-100/30 bg-secondary-100 p-2">
      <div className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-primary-100">
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
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 font-grotesk text-[10px] font-semibold tracking-[0.13em] text-accent-100">
          <span>{article.category}</span><span>{article.date}</span>
        </div>
        <h2 className="mt-5 max-w-xl font-general text-2xl font-semibold leading-[1.12] tracking-[-0.045em] text-accent-300 sm:text-[2rem]">{article.title}</h2>
        <p className="mt-4 flex-1 font-grotesk text-sm leading-7 text-accent-100">{article.summary}</p>
        <span className="mt-8 inline-flex items-center gap-2 font-grotesk text-sm font-semibold text-secondary-600">
          Read on Medium <Icon icon="ph:arrow-up-right" className="text-lg" />
        </span>
      </div>
      </div>
    </a>
  );
}

export default function Blog() {
  return (
    <div className="blog-page flex min-h-screen flex-col bg-secondary-100 text-accent-300">
      <Seo title="Writing" description="Articles and notes on design, research, and making digital things with care." url="https://simransn.vercel.app/blog" />
      <NavBar isSubpage />
      <main className="blog-main mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:px-8 xl:px-10">
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

        <section id="blog-articles" className="flex-1 py-12 sm:py-16" aria-labelledby="selected-writing">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
            <div><h2 id="selected-writing" className="font-general text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">From the notebook</h2></div>
            <span className="pb-1 font-grotesk text-xs text-accent-100">{String(articles.length).padStart(2, "0")} ARTICLES</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">{articles.map((article) => <ArticleCard key={article.number} article={article} total={articles.length} />)}</div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-accent-100/25 py-6 font-grotesk text-xs text-accent-100 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span>© 2026 SIMRAN NAGEKAR</span>
          <a href={mediumProfile} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-accent-300 transition-colors hover:text-secondary-600">Follow along on Medium <Icon icon="ph:arrow-up-right" /></a>
          </div>
        </footer>
      </main>
    </div>
  );
}
