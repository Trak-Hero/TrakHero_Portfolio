import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ExploreButton.css";

gsap.registerPlugin(ScrollTrigger);

export default function ExploreButton({ onClick, triggerSelector = "body" }) {
  const maskRef = useRef(null);
  const btnRef  = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(true);

  // Hover glow tracking
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

  // 👇 Scroll-driven vertical offset: 6vh -> 0 as you scroll ~90% of a viewport
  useEffect(() => {
    if (!btnRef.current) return;
    const triggerEl = document.querySelector(triggerSelector) || document.body;

    // Start slightly below center
    gsap.set(btnRef.current, { y: () => window.innerHeight * 0.06 });

    const tween = gsap.to(btnRef.current, {
      y: 0,                    // at the end it's exactly centered
      ease: "none",
      scrollTrigger: {
        trigger: triggerEl,    // usually your hero section; "body" also works
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 0.9)}`, // ~90% of a viewport
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => tween.scrollTrigger && tween.scrollTrigger.kill();
  }, [triggerSelector]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);

    // Keep your original behavior: scroll immediately
    if (typeof onClick === "function") onClick();

    // Play zoom, then remove overlay
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
