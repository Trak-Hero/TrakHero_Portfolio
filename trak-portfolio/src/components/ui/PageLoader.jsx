import React, { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import "./PageLoader.css";

export default function PageLoader({ minDuration = 1200 }) {
  const { progress, active } = useProgress(); // % for three.js assets
  const [visible, setVisible] = useState(true);
  const [minDone, setMinDone] = useState(false);
  const rootRef = useRef(null);

  // Minimum on-screen time so it doesn’t flash
  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  // Prevent scrolling while loader is up
  useEffect(() => {
    document.documentElement.classList.add("no-scroll");
    return () => document.documentElement.classList.remove("no-scroll");
  }, []);

  // When 3D loading is done AND min time elapsed → fade out
  useEffect(() => {
    if (!visible) return;
    const done = (!active && progress >= 100) && minDone;
    if (done) {
      rootRef.current?.classList.add("leaving");
      const t = setTimeout(() => setVisible(false), 650);
      return () => clearTimeout(t);
    }
  }, [active, progress, minDone, visible]);

  if (!visible) return null;

  return (
    <div className="loading-root" ref={rootRef} role="status" aria-live="polite">
      {/* moving stars background */}
      <div className="loading-stars" />
      {/* warp streaks */}
      <div className="loading-warp" />

      {/* HUD */}
      <div className="loading-hud">
        <div className="hud-ring">
          <div className="hud-dot" />
        </div>

        <div className="hud-title">Preparing Hyperdrive</div>
        <div className="hud-sub">Preflight checks • Navigation lock • Star map sync</div>

        <div className="hud-progress">
          <div
            className="hud-bar"
            style={{ width: `${Math.min(100, Math.floor(progress))}%` }}
          />
        </div>

        <div className="hud-percent">{Math.min(100, Math.floor(progress))}%</div>
        <div className="hud-hint">Tip: press <kbd>M</kbd> to enable sound</div>
      </div>
    </div>
  );
}
