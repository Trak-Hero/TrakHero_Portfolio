// src/pages/MenuPage.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./MenuPage.css";

const HOLD_MS = 700;

const DOMAINS = [
  {
    key: "ds",
    title: "Data Science",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(1200px 600px at 30% 50%, rgba(255,255,255,.08), transparent 60%),
      linear-gradient(135deg, #0d1221, #14406d 45%, #1976d2)`
  },
  {
    key: "cs",
    title: "Computer Science",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(1200px 600px at 70% 40%, rgba(255,255,255,.10), transparent 60%),
      linear-gradient(135deg, #0d1221, #3c1053 45%, #ad5389)`
  },
  {
    key: "ux",
    title: "Design UI/UX",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(1200px 600px at 50% 50%, rgba(255,255,255,.12), transparent 60%),
      linear-gradient(135deg, #0d1221, #0f9b0f 45%, #f1f2b5)`
  },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const warpRef = useRef(null);
  const vignetteRef = useRef(null);
  const whiteoutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".menu-card", { y: 24, autoAlpha: 0 });
      gsap.to(".menu-card", {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });
      // Removed GSAP animation of .bg-stars (CSS handles drift/twinkle now)
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const hyperdrive = (toURL) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(overlayRef.current, { pointerEvents: "auto" });

    tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.15 })
      .to(vignetteRef.current, { autoAlpha: 1, duration: 0.15 }, "<")
      .set(warpRef.current, { autoAlpha: 1, scale: 1 })
      .fromTo(
        warpRef.current,
        { opacity: 0.0, filter: "blur(2px)" },
        { opacity: 1, duration: 0.2, filter: "blur(0.5px)" }
      )
      .to(
        {},
        {
          duration: 0.65,
          ease: "power2.in",
          onUpdate: function () {
            if (!warpRef.current) return;
            const curStr =
              getComputedStyle(warpRef.current).getPropertyValue("--offset") ||
              "0px";
            const cur = parseFloat(curStr);
            const next = cur + 140;
            warpRef.current.style.setProperty("--offset", `${next}px`);
          },
        },
        "<"
      )
      .to(whiteoutRef.current, { autoAlpha: 1, duration: 0.22 }, "-=0.05")
      .add(() => {
        window.location.href = toURL;
      });

    return tl;
  };

  return (
    <div ref={containerRef} className="menu-container">
      {/* ❌ Close button */}
        <button
          className="menu-close"
          onClick={() => navigate("/")}
          aria-label="Close menu"
        >
          ✕
        </button>
      {/* Starfield and glow */}
      <div className="bg-stars"></div>
      <div className="bottom-glow"></div>

      {/* Header */}
      <div className="menu-header">
        <div className="menu-subheader">
          <span className="line" />
          SELECT DOMAIN
          <span className="line" />
        </div>
        <h1>Hold to Engage Hyperdrive</h1>
        <p>Release to cancel</p>
      </div>

      {/* Cards */}
      <div className="menu-grid">
        {DOMAINS.map((d) => (
          <MenuCard
            key={d.key}
            title={d.title}
            art={d.art}
            onConfirm={() => hyperdrive(d.url)}
          />
        ))}
      </div>

      {/* Overlay FX */}
      <div ref={overlayRef} className="overlay">
        <div ref={warpRef} className="warp" />
        <div ref={vignetteRef} className="vignette" />
      </div>

      {/* Whiteout */}
      <div ref={whiteoutRef} className="whiteout" />
    </div>
  );
}

function MenuCard({ title, art, onConfirm }) {
  const btnRef = useRef(null);
  const ringRef = useRef(null);
  const holdTween = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (holdTween.current) holdTween.current.kill();
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const startHold = () => {
    if (holdTween.current) holdTween.current.kill();
    holdTween.current = gsap.fromTo(
      ringRef.current,
      { ["--p"]: 0 },
      {
        duration: HOLD_MS / 1000,
        ["--p"]: 1,
        ease: "linear",
        onUpdate: () => {
          const p = Number(gsap.getProperty(ringRef.current, "--p")) || 0;
          ringRef.current.style.background = `conic-gradient(#ffffff ${
            p * 360
          }deg, rgba(255,255,255,.15) 0)`;
        },
        onComplete: onConfirm,
      }
    );
    gsap.to(btnRef.current, { scale: 0.985, duration: 0.1 });
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => onConfirm(), HOLD_MS + 50);
  };

  const endHold = () => {
    clearTimeout(pressTimer.current);
    if (holdTween.current) holdTween.current.kill();
    ringRef.current.style.background =
      "conic-gradient(rgba(255,255,255,.15) 0deg, rgba(255,255,255,.15) 360deg)";
    gsap.to(btnRef.current, { scale: 1, duration: 0.12 });
  };

  return (
    <button
      ref={btnRef}
      className="menu-card"
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
    >
      <div className="menu-card-art" style={{ background: art }} />
      <div className="menu-card-overlay">
        <div className="menu-card-label">HOLD</div>
        <div className="menu-card-title">{title}</div>
      </div>
      <div className="progress-ring">
        <div ref={ringRef} className="ring"></div>
        <div className="ring-inner">⏺</div>
      </div>
    </button>
  );
}
