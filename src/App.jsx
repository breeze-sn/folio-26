import { useEffect, useRef, useState } from "react";
import {
  SiBehance,
  SiInstagram,
  SiMedium,
  SiPinterest,
  SiReddit,
  SiSpotify,
  SiX
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import folio25Image from "./assets/images/cards/folio25.svg";
import gdgImage from "./assets/images/cards/gdg.svg";
import riftImage from "./assets/images/cards/rift.svg";

const pastWork = [
  {
    title: "Folio'25 | Simran Nagakar",
    style: "tile-portfolio",
    image: folio25Image,
    alt: "Folio 25 portfolio cover",
    href: "https://www.simrann.dev"
  },
  {
    title: "GDG Community Design & Identity",
    style: "tile-gdg",
    image: gdgImage,
    alt: "GDG community design showcase",
    href: "https://www.behance.net/gallery/238530857/GDGoC-REVA-University-Community-Design-Identity"
  },
  {
    title: "RIFT Design",
    style: "tile-rift",
    image: riftImage,
    alt: "RIFT design showcase",
    href: "https://www.revarift.tech"
  }
];

const socialLinks = [
  {
    label: "Instagram",
    style: "social-instagram",
    icon: SiInstagram,
    span: "span-2",
    href: "https://instagram.com/simran.nagekar"
  },
  {
    label: "LinkedIn",
    style: "social-linkedin",
    icon: FaLinkedinIn,
    span: "span-4",
    href: "https://linkedin.com/in/simransn"
  },
  {
    label: "Medium",
    style: "social-medium",
    icon: SiMedium,
    span: "span-2",
    href: "https://medium.com/@breezesn"
  },
  {
    label: "Pinterest",
    style: "social-pinterest",
    icon: SiPinterest,
    span: "span-4",
    href: "https://in.pinterest.com/simran_nagekar"
  },
  {
    label: "Spotify",
    style: "social-spotify",
    icon: SiSpotify,
    span: "span-4",
    href: "https://open.spotify.com/user/31trbfvupfmba4dkc4o445srjxfa"
  },
  {
    label: "X",
    style: "social-x",
    icon: SiX,
    span: "span-2",
    href: "https://twitter.com/s1mran0"
  },
  {
    label: "Behance",
    style: "social-behance",
    icon: SiBehance,
    span: "span-4",
    href: "https://behance.net/simrannagekar"
  },
  {
    label: "Reddit",
    style: "social-reddit",
    icon: SiReddit,
    span: "span-2",
    href: "https://reddit.com/user/BreezieXD"
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const sectionsCount = 3;

    const goToSection = (direction) => {
      if (isTransitioningRef.current) {
        return;
      }

      setActiveSection((current) => {
        const next = Math.max(0, Math.min(sectionsCount - 1, current + direction));
        if (next === current) {
          return current;
        }

        isTransitioningRef.current = true;
        window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, 720);

        if (direction < 0 || next === 0) {
          setShowNav(true);
        } else {
          setShowNav(false);
        }

        return next;
      });
    };

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      event.preventDefault();
      goToSection(event.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (event) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goToSection(1);
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToSection(-1);
      }
    };

    let touchStartY = 0;

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
    };

    const onTouchEnd = (event) => {
      const delta = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) {
        return;
      }

      goToSection(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;

      for (let index = 0; index < 8; index += 1) {
        const ray = document.createElement("span");
        ray.className = "click-burst-ray";
        ray.style.setProperty("--angle", `${index * 45}deg`);
        ray.style.setProperty("--ray-length", index % 2 === 0 ? "22px" : "13px");
        burst.appendChild(ray);
      }

      document.body.appendChild(burst);

      window.setTimeout(() => {
        burst.remove();
      }, 520);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div className="under-construction-page">
      <nav className={`navbar ${showNav ? "is-shown" : "is-hidden"}`} aria-label="Primary">
        <p>Simran Nagekar</p>
      </nav>

      <main className="slides-viewport">
        <div className="slides-track" style={{ transform: `translate3d(0, -${activeSection * 100}vh, 0)` }}>
          <section className={`hero-stage snap-section ${activeSection === 0 ? "is-active" : ""}`}>
          <h1>PORTFOLIO</h1>
          <p>Under Construction</p>

          <div className="scroll-cue" aria-hidden="true">
            <div className="scroll-mark" />
            <span>scroll down</span>
          </div>
          </section>

          <section className={`projects-section snap-section ${activeSection === 1 ? "is-active" : ""}`}>
            <div className="section-heading">
              <h2>While this evolves</h2>
              <p>Explore what already exists; a glimpse into my earlier work and creative journey.</p>
            </div>

            <div className="work-preview">
              <a
                className="work-link"
                href={pastWork[0].href}
                target="_blank"
                rel="noreferrer"
                aria-label={pastWork[0].title}
              >
                <article className={`work-tile ${pastWork[0].style}`}>
                  <img src={pastWork[0].image} alt={pastWork[0].alt} className="work-image" />
                </article>
                <p>{pastWork[0].title}</p>
              </a>

              <div className="work-grid-two">
                {pastWork.slice(1).map((item) => (
                  <div key={item.title} className="work-grid-item">
                    <a
                      className="work-link"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.title}
                    >
                      <article className={`work-tile ${item.style}`}>
                        <img src={item.image} alt={item.alt} className="work-image" />
                      </article>
                      <p>{item.title}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`socials-section snap-section ${activeSection === 2 ? "is-active" : ""}`}>
            <div className="section-heading">
              <h2>Let's Connect</h2>
              <p>Follow the process, explore updates, and stay in touch.</p>
            </div>

            <div className="social-grid">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className={`social-card ${link.style} ${link.span}`}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <link.icon className="social-logo" aria-hidden="true" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <footer className="site-footer">
              <p>© folio'26</p>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
