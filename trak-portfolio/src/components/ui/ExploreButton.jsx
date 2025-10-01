import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "./ExploreButton.css";

export default function ExploreButton({ onClick }) {
  const maskRef = useRef(null);
  const btnRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = e => {
      if (clicked) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(maskRef.current, { x, y, duration: 0.4, ease: "power2.out" });
    };

    const el = btnRef.current;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [clicked]);

  const handleClick = () => {
    setClicked(true);
    gsap.to(btnRef.current, {
      scale: 20,
      duration: 1.2,
      ease: "power4.inOut",
      transformOrigin: "center center",
      onComplete: onClick,
    });
  };

  // Render into body so no transformed ancestor can offset it
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
