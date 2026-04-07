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
    subtitle: "Signals, models, prediction systems",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(900px 400px at 75% 55%, rgba(125,211,252,.22), transparent 45%),
      radial-gradient(500px 240px at 30% 25%, rgba(255,255,255,.08), transparent 35%),
      linear-gradient(135deg, #09111f 0%, #10345d 45%, #2d7bd3 100%)`
  },
  {
    key: "cs",
    title: "Computer Science",
    subtitle: "Systems, full-stack, engineered worlds",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(900px 420px at 72% 55%, rgba(236,72,153,.18), transparent 45%),
      radial-gradient(500px 240px at 28% 25%, rgba(255,255,255,.08), transparent 35%),
      linear-gradient(135deg, #0b1020 0%, #311245 42%, #a24aa2 100%)`
  },
  {
    key: "ux",
    title: "Design UI/UX",
    subtitle: "Interfaces, journeys, visual systems",
    url: "https://main-portfolio-8i9z.onrender.com/",
    art: `
      radial-gradient(900px 420px at 72% 55%, rgba(190,242,100,.18), transparent 45%),
      radial-gradient(500px 240px at 28% 25%, rgba(255,255,255,.08), transparent 35%),
      linear-gradient(135deg, #0a1118 0%, #0f6a18 42%, #9bd86b 100%)`
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
      gsap.set(".menu-card", { y: 30, autoAlpha: 0, scale: 0.98 });
      gsap.to(".menu-card", {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });

      gsap.fromTo(
        ".menu-header",
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }
      );

      gsap.to(".planet-orb", {
        y: -18,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.7,
      });

      gsap.to(".hud-ring", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const hyperdrive = (toURL) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(overlayRef.current, { pointerEvents: "auto" });

    tl.to(".menu-card", {
      scale: 1.03,
      filter: "blur(1px)",
      duration: 0.18,
      stagger: 0.03,
    })
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.15 })
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
              getComputedStyle(warpRef.current).getPropertyValue("--offset") || "0px";
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
      <button
        className="menu-close"
        onClick={() => navigate("/")}
        aria-label="Close menu"
      >
        ✕
      </button>

      <div className="bg-stars" />
      <div className="bg-nebula" />
      <div className="bg-grid" />
      <div className="bottom-glow" />

      <div className="planet-orb orb-1" />
      <div className="planet-orb orb-2" />
      <div className="planet-orb orb-3" />

      <div className="hud-frame">
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />
      </div>

      <div className="menu-header">
        <div className="menu-subheader">
          <span className="line" />
          SELECT DOMAIN
          <span className="line" />
        </div>
        <h1>Hold to Engage Hyperdrive</h1>
        <p>Choose a route and commit to the jump</p>
      </div>

      <div className="menu-grid">
        {DOMAINS.map((d) => (
          <MenuCard
            key={d.key}
            title={d.title}
            subtitle={d.subtitle}
            art={d.art}
            onConfirm={() => hyperdrive(d.url)}
          />
        ))}
      </div>

      <div ref={overlayRef} className="overlay">
        <div ref={warpRef} className="warp" />
        <div ref={vignetteRef} className="vignette" />
      </div>

      <div ref={whiteoutRef} className="whiteout" />
    </div>
  );
}

function MenuCard({ title, subtitle, art, onConfirm }) {
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
          ringRef.current.style.background = `conic-gradient(#ffffff ${p * 360}deg, rgba(255,255,255,.15) 0)`;
        },
        onComplete: onConfirm,
      }
    );

    gsap.to(btnRef.current, {
      scale: 0.985,
      y: -2,
      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      duration: 0.12,
    });

    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => onConfirm(), HOLD_MS + 50);
  };

  const endHold = () => {
    clearTimeout(pressTimer.current);
    if (holdTween.current) holdTween.current.kill();
    ringRef.current.style.background =
      "conic-gradient(rgba(255,255,255,.15) 0deg, rgba(255,255,255,.15) 360deg)";
    gsap.to(btnRef.current, { scale: 1, y: 0, duration: 0.12 });
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
      <div className="menu-card-art" style={{ background: art }}>
        <div className="menu-card-scan" />
        <div className="menu-card-stars" />
      </div>

      <div className="menu-card-overlay">
        <div className="menu-card-label">HOLD</div>
        <div className="menu-card-title">{title}</div>
        <div className="menu-card-subtitle">{subtitle}</div>
      </div>

      <div className="menu-card-hud">
        <div className="hud-ring" />
      </div>

      <div className="progress-ring">
        <div ref={ringRef} className="ring" />
        <div className="ring-inner">⏺</div>
      </div>
    </button>
  );
}