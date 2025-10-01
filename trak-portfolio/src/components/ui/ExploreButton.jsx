import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ExploreButton.css";

gsap.registerPlugin(ScrollTrigger);

export default function ExploreButton({ onClick, fadePercent = 0.2 }) {
  const maskRef = useRef(null);
  const btnRef  = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(true);

  // hover glow tracking (unchanged)
  useEffect(() => {
    if (!btnRef.current) return;
    const handleMouseMove = e => {
      if (clicked) return;
      const rect = btnRef.current.getBoundingClientRect();
      gsap.to(maskRef.current, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const el = btnRef.current;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [clicked]);

  // 👇 Fade in during the last `fadePercent` of page scroll
  useEffect(() => {
    if (!btnRef.current) return;

    const endPx = () => ScrollTrigger.maxScroll(window);           // total scrollable px
    const startPx = () => endPx() - window.innerHeight * fadePercent;

    // set initial state
    gsap.set(btnRef.current, { autoAlpha: 0, y: 0 });

    const tween = gsap.fromTo(
      btnRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          start: () => startPx(),
          end: () => endPx(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => tween.scrollTrigger && tween.scrollTrigger.kill();
  }, [fadePercent]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);

    // keep your onClick behavior (e.g., open section / route / etc.)
    if (typeof onClick === "function") onClick();

    gsap.to(btnRef.current, {
      scale: 20,
      duration: 1.0,
      ease: "power4.inOut",
      transformOrigin: "center center",
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return createPortal(
    <div className="explore-layer" aria-hidden={false}>
      <div
        className="explore-container"
        ref={btnRef}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        aria-label="Discover projects"
      >
        <div className="mask" ref={maskRef} />
        <div className="text">DISCOVER</div>
      </div>
    </div>,
    document.body
  );
}
