import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NavBar({ sectionRefs = [], isSubpage = false }) {
  const navBar = useRef(null);
  const cta = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionHref = (section) => `${isSubpage ? "/" : ""}#${section}`;
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.__lenis) {
      if (!window.__lenisRaf) {
        const raf = (time) => {
          window.__lenis.raf(time);
          window.__lenisRaf = requestAnimationFrame(raf);
        };
        window.__lenisRaf = requestAnimationFrame(raf);
      }
      return;
    }

    const lenis = new Lenis();
    window.__lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      window.__lenisRaf = requestAnimationFrame(raf);
    };
    window.__lenisRaf = requestAnimationFrame(raf);

    return () => {
      if (window.__lenisRaf) {
        cancelAnimationFrame(window.__lenisRaf);
      }
      lenis.destroy();
      delete window.__lenisRaf;
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    const animation = gsap.to(navBar.current, {
      y: 0,
      duration: 3,
      delay: 0.5,
      ease: "power4.inOut",
    });

    return () => animation.kill();
  }, []);


  useEffect(() => {
    const triggers = sectionRefs.filter(Boolean).map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 375px",
        end: "bottom 300px",
        // markers: true,
        animation: gsap
          .timeline()
          .to(navBar.current, { color: "#DDDDD5" })
          .to(cta.current, { backgroundColor: "#D1D1C7", color: "#0E0E0C" }, 0)
          .to(".bg-secondary-100", { backgroundColor: "#0E0E0C" }, 0),

        toggleActions: "restart reverse restart reverse",
      })
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [sectionRefs]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: "About", href: sectionHref("about") },
    { label: "Services", href: sectionHref("services") },
    { label: "Projects", href: sectionHref("works") },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: sectionHref("contact") },
  ];

  return (
    <>
      <header
        ref={navBar}
        className="fixed top-0 z-50 flex w-full -translate-y-full items-center justify-between bg-secondary-100 px-3 py-3 sm:px-5"
      >
        <a href={sectionHref("hero")} aria-label="Logo" className="group relative inline-flex shrink-0 items-center px-3 py-1 font-grotesk text-body-3">
          <span>Simran Nagekar</span>
          <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 whitespace-nowrap font-grotesk text-body-3 sm:flex sm:gap-0">
          <a href={sectionHref("about")} className="group relative inline-flex items-center px-3 py-1">
            <span>about</span>
            <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
          </a>
          <a href={sectionHref("services")} className="group relative inline-flex items-center px-3 py-1">
            <span>services</span>
            <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
          </a>
          <a href={sectionHref("works")} className="group relative inline-flex items-center px-3 py-1">
            <span>projects</span>
            <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
          </a>
          <a href="/blog" className="group relative inline-flex items-center px-3 py-1">
            <span>blog</span>
            <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
          </a>
          <a ref={cta} className="button group relative hover:bg-transparent" href={sectionHref("contact")}>
            <span className="relative w-fit">
              <span className="absolute bottom-2 h-[0.15em] w-0 bg-secondary-700 opacity-90 duration-300 ease-out group-hover:w-full"></span>
              <span>Let&apos;s Talk.</span>
            </span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          className="inline-flex items-center px-3 py-2 font-grotesk text-xs uppercase tracking-[0.18em] sm:hidden"
        >
          Menu <span className="ml-2 text-lg leading-none">+</span>
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex min-h-[100dvh] flex-col overflow-y-auto bg-[#050505] px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-white sm:hidden">
          <div className="flex items-center justify-between">
            <a href={sectionHref("hero")} onClick={() => setMenuOpen(false)} className="font-grotesk text-lg font-semibold tracking-[0.12em]">
              Simran Nagekar
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex items-center gap-2 py-2 font-grotesk text-xs font-medium uppercase tracking-[0.18em]"
            >
              Close <span className="text-2xl font-light leading-none">×</span>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mt-16 flex flex-col items-start gap-3">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-general text-[clamp(2.7rem,11vw,4.5rem)] font-semibold uppercase leading-[1.08] tracking-[-0.065em] text-white transition-colors duration-200 hover:text-[#b8b8b8]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
