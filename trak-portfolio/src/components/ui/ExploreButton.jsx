import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "./ExploreButton.css";

export default function ExploreButton({ onClick }) {
  const maskRef = useRef(null);
  const btnRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(true);

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

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);

    // 🔥 Trigger your scroll NOW so it behaves like before
    if (typeof onClick === "function") onClick();

    // Play the zoom and then remove the overlay
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
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleClick()}
        aria-label="Discover projects"
      >
        <div className="mask" ref={maskRef} />
        <div className="text">DISCOVER</div>
      </div>
    </div>,
    document.body
  );
}
