import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import TrueFocus from "../ui/TrueFocus";

export default function Hero() {
  const hero = useRef(null);
  const title = useRef(null);
  const scroll = useRef(null);
  const [focusReady, setFocusReady] = useState(false);

  useLayoutEffect(() => {
    const scope = hero.current;

    if (!scope) {
      return undefined;
    }

    const titleItems = [title.current].filter(Boolean);
    const cleanup = [];
    const startFocus = gsap.delayedCall(1.75, () => setFocusReady(true));
    cleanup.push(() => startFocus.kill());

    gsap.set(titleItems, { y: 28, opacity: 0 });
    gsap.set(scroll.current, { opacity: 0 });

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

    intro.to(titleItems, { y: 0, opacity: 1, duration: 1.45, stagger: 0.08 }, 0.15);
    intro.to(scroll.current, { opacity: 0.7, duration: 0.8, ease: "power2.out" }, 1.1);

    const scrollPulse = gsap.to(scroll.current, {
      opacity: 0.26,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.8,
    });
    cleanup.push(() => scrollPulse.kill());

    // Hide the scroll hint when the hero is scrolled away
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!scroll.current) return;
        if (entry.intersectionRatio < 0.95) {
          gsap.to(scroll.current, { opacity: 0, duration: 0.35, ease: "power2.out" });
        } else {
          gsap.to(scroll.current, { opacity: 0.7, duration: 0.35, ease: "power2.out" });
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.95, 1] }
    );

    io.observe(scope);
    cleanup.push(() => io.disconnect());

    cleanup.push(() => gsap.killTweensOf([titleItems, title.current, scroll.current]));

    return () => {
      cleanup.forEach((dispose) => dispose());
    };
  }, []);

  return (
    <section
      ref={hero}
      id="hero"
      className="hero relative min-h-screen w-full select-none overflow-hidden grid place-items-center"
      aria-label="hero"
    >
      <div
        ref={title}
        data-hero-title
        className="flex items-center justify-center leading-none text-center z-10"
      >
        {focusReady ? (
          <TrueFocus
            sentence="port folio"
            manualMode={true}
            blurAmount={5}
            borderColor="#5227FF"
            glowColor="rgba(82, 39, 255, 0.45)"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
            baseGap={10}
            focusedGap={18}
            containerClassName="inline-flex p-[10px] justify-center items-center gap-[10px]"
            wordClassName="font-grotesk text-[clamp(6.5rem,14vw,12.5rem)] font-extrabold lowercase tracking-[0.02em] text-black"
          />
        ) : (
          <span
            className="inline-flex p-[10px] justify-center items-center gap-[10px] font-grotesk text-[clamp(6.5rem,14vw,12.5rem)] font-extrabold lowercase tracking-[0.02em] text-black"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.08)" }}
          >
            portfolio
          </span>
        )}
      </div>
      <div
        ref={scroll}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-general text-[10px] font-medium uppercase tracking-[0.96px] text-[rgba(16,20,255,0.60)]"
      >
        SCROLL TO EXPLORE
      </div>
    </section>
  );
}
