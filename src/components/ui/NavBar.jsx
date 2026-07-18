import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NavBar({ sectionRefs }) {
  const navBar = useRef(null);
  const cta = useRef(null);
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

  return (
    <header
      ref={navBar}
      className="fixed top-0 z-50 flex w-full -translate-y-full items-center justify-between bg-secondary-100 px-3 py-3 sm:px-5"
    >
      <a href="#hero" aria-label="Logo" className="group relative inline-flex shrink-0 items-center px-3 py-1 font-grotesk text-body-3">
        <span>Simran Nagekar</span>
        <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
      </a>
      <nav className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto whitespace-nowrap font-grotesk text-body-3 sm:gap-0 sm:overflow-visible">
        <a href="#about" className="group relative inline-flex items-center px-3 py-1">
          <span>about</span>
          <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
        </a>
        <a href="#services" className="group relative inline-flex items-center px-3 py-1">
          <span>services</span>
          <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
        </a>
        <a href="#works" className="group relative inline-flex items-center px-3 py-1">
          <span>projects</span>
          <span className="absolute bottom-0 left-0 h-[0.125em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
        </a>
        <a
          ref={cta}
          className="button group relative hover:bg-transparent"
          href="#contact"
        >
          <span className="relative w-fit">
            <span className="absolute bottom-2 h-[0.15em] w-0 bg-secondary-700 opacity-90 duration-300 ease-out group-hover:w-full"></span>
            <span>Let&apos;s Talk.</span>
          </span>
        </a>
      </nav>
    </header>
  );
}
