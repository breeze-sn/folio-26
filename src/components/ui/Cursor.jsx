import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const curs = useRef(null);
  const svg = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    // TODO Learn useContext and useRef here
    const images = document.querySelectorAll(".img");

    const tl = gsap.timeline({ paused: true });

    tl.to(curs.current, { height: "112px", width:"112px", ease: "expo.inout" }).to(
      svg.current,
      { opacity: 1, width: "96px", height:"96px" },
      0
    );

    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => {
      tl.reverse();
      tl.eventCallback("onReverseComplete", () => {
        gsap.set(svg.current, { opacity: 0 });
        gsap.set(curs.current, { height: "12px", width:"12px" });
      });
    };

    images.forEach((img) => {
      img.addEventListener("mouseenter", handleMouseEnter);
      img.addEventListener("mouseleave", handleMouseLeave);
    });

    function moveCursor(e) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    }
    document.addEventListener("mousemove", moveCursor);

    const loop = () => {
      const { x, y } = posRef.current;
      if (curs.current) {
        curs.current.style.left = x + "px";
        curs.current.style.top = y + "px";
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      images.forEach((img) => {
        img.removeEventListener("mouseenter", handleMouseEnter);
        img.removeEventListener("mouseleave", handleMouseLeave);
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={curs}
      className="cursor pointer-events-none fixed left-1/2 top-1/2 z-[999] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-600 sm:flex"
      style={{ left: "50%", top: "50%" }}
    >
      <svg
        ref={svg}
        xmlns="http://www.w3.org/2000/svg"
        className="scale-50 opacity-0"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M6 19L19 6m0 0v12.48M19 6H6.52"
        />
      </svg>
    </div>
  );
}
