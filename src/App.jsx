import { useEffect } from "react";
import folio25Image from "./assets/images/cards/folio25.svg";
import gdgImage from "./assets/images/cards/gdg.svg";
import riftImage from "./assets/images/cards/rift.svg";

const pastWork = [
  {
    title: "Folio'25 | Simran Nagakar",
    style: "tile-portfolio",
    image: folio25Image,
    alt: "Folio 25 portfolio cover"
  },
  {
    title: "GDG Community Design & Identity",
    style: "tile-gdg",
    image: gdgImage,
    alt: "GDG community design showcase"
  },
  {
    title: "RIFT Design",
    style: "tile-rift",
    image: riftImage,
    alt: "RIFT design showcase"
  }
];

const socialLinks = [
  { label: "Instagram", style: "social-instagram", icon: "IG" },
  { label: "LinkedIn", style: "social-linkedin", icon: "in" },
  { label: "Medium", style: "social-medium", icon: "M" },
  { label: "Pinterest", style: "social-pinterest", icon: "P" },
  { label: "Spotify", style: "social-spotify", icon: "S" },
  { label: "X", style: "social-x", icon: "X" },
  { label: "Behance", style: "social-behance", icon: "Be" },
  { label: "Reddit", style: "social-reddit", icon: "R" }
];

export default function App() {
  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="under-construction-page">
      <header className="micro-header" data-reveal>
        <p>Simran Nagakar</p>
      </header>

      <main>
        <section className="hero-stage" data-reveal>
          <h1>WEBSITE</h1>
          <p>Under Construction</p>
          <div className="scroll-mark" aria-hidden="true" />
          <span>scroll down</span>
        </section>

        <section className="evolve" data-reveal>
          <h2>While this evolves</h2>
          <p>
            Explore what already exists, a glimpse into my earlier work and
            creative journey.
          </p>
        </section>

        <section className="work-preview" data-reveal>
          <article className={`work-tile ${pastWork[0].style}`}>
            <img src={pastWork[0].image} alt={pastWork[0].alt} className="work-image" />
          </article>
          <p>{pastWork[0].title}</p>

          <div className="work-grid-two">
            {pastWork.slice(1).map((item) => (
              <div key={item.title} className="work-grid-item">
                <article className={`work-tile ${item.style}`}>
                  <img src={item.image} alt={item.alt} className="work-image" />
                </article>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="connect" data-reveal>
          <h2>Let's connect</h2>
          <p>Follow the process, explore updates, and stay in touch</p>
        </section>

        <section className="deploy-note" data-reveal>
          <p>Render-ready build updated from src/App.jsx.</p>
        </section>

        <section className="social-grid" data-reveal>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              className={`social-card ${link.style}`}
              href="#"
              aria-label={link.label}
            >
              <span>{link.label}</span>
              <small>{link.icon}</small>
            </a>
          ))}
        </section>
      </main>

      <footer className="site-footer" data-reveal>
        <p>© folio'26</p>
      </footer>
    </div>
  );
}
