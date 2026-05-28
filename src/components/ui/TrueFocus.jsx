import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./TrueFocus.css";

export default function TrueFocus({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#5227FF",
  glowColor = "rgba(82, 39, 255, 0.45)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  baseGap = 10,
  focusedGap = 18,
  containerClassName = "",
  wordClassName = "",
}) {
  const words = sentence.split(separator).filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(manualMode ? -1 : 0);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    setCurrentIndex(manualMode ? -1 : 0);
  }, [manualMode]);

  useEffect(() => {
    if (manualMode || words.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex == null || currentIndex < 0) {
      return;
    }

    const activeWord = wordRefs.current[currentIndex];

    if (!activeWord || !containerRef.current) {
      return;
    }

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = activeWord.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index) => {
    if (manualMode) {
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(-1);
    }
  };

  const hasFocus = currentIndex >= 0;

  return (
    <div
      className={`focus-container ${hasFocus ? "is-focused" : ""} ${containerClassName}`.trim()}
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      style={{
        gap: `${manualMode && hasFocus ? focusedGap : baseGap}px`,
        transition: `gap ${animationDuration}s ease`,
      }}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        const wordBlur = manualMode && !hasFocus ? 0 : isActive ? 0 : blurAmount;

        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive ? "active is-active" : ""} ${wordClassName}`.trim()}
            style={{
              filter: `blur(${wordBlur}px)`,
              "--border-color": borderColor,
              "--glow-color": glowColor,
              transition: `filter ${animationDuration}s ease, transform ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: hasFocus ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor,
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
}
