// --- keep your imports ---
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import gsap from "gsap";
import "./HyperdriveOverlay.css";

const SKILLS = [
  "Python","JavaScript","TypeScript","Java","C","R","SQL","Shell/Bash","HTML/CSS",
  "Pandas","NumPy","Matplotlib","scikit-learn","OpenCV","Power BI","Tableau",
  "React","Next.js","Node.js","Three.js","GSAP","Tailwind CSS","Socket.io","Vite","Vercel","Render.com",
  "Google Apps Script","HubSpot",
  "AWS","Google Cloud","Docker",
  "Swift","SwiftUI","CoreML","Firebase",
  "Figma","Illustrator","Canva","Blender","Unity"
];

// ---------- Endless tunnel word field ----------
function WordField({ speedRef, count = 120, tunnelRadius = 18, depth = 260 }) {
  // pre-gen instances
  const words = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const text = SKILLS[i % SKILLS.length];
      // ring-ish distribution (tunnel) plus slight jitter
      const a = Math.random() * Math.PI * 2;
      const r = tunnelRadius * (0.6 + Math.random() * 0.6);
      arr.push({
        id: i,
        text,
        x: Math.cos(a) * r + (Math.random() - 0.5) * 2.0,
        y: Math.sin(a) * (r * 0.45) + (Math.random() - 0.5) * 1.2,
        z: -Math.random() * depth - 20,
        rot: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 0.55 + 0.55
      });
    }
    return arr;
  }, [count, tunnelRadius, depth]);

  const refs = useRef([]);

  // gentle lateral drift to avoid “rail” feeling
  const drift = useRef({ x: 0, y: 0 });
  useEffect(() => {
    gsap.to(drift.current, {
      x: 2,
      y: -1.5,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, []);

  useFrame((_, dt) => {
    const s = speedRef.current; // units/sec
    const arr = refs.current;
    for (let i = 0; i < arr.length; i++) {
      const m = arr[i];
      if (!m) continue;

      // move toward camera
      m.position.z += s * dt;

      // tiny spin & drift
      m.rotation.z += dt * 0.25;
      m.position.x += drift.current.x * 0.02 * dt;
      m.position.y += drift.current.y * 0.02 * dt;

      // recycle past camera
      if (m.position.z > 1.2) {
        m.position.z = -depth - Math.random() * 80;
        const a = Math.random() * Math.PI * 2;
        const r = tunnelRadius * (0.6 + Math.random() * 0.6);
        m.position.x = Math.cos(a) * r + (Math.random() - 0.5) * 2.0;
        m.position.y = Math.sin(a) * (r * 0.45) + (Math.random() - 0.5) * 1.2;
        m.rotation.z = (Math.random() - 0.5) * 0.7;
        m.scale.setScalar(Math.random() * 0.55 + 0.55);
      }
    }
  });

  return (
    <>
      {words.map((w, i) => (
        <Text
          key={w.id}
          ref={(el) => (refs.current[i] = el)}
          position={[w.x, w.y, w.z]}
          rotation={[0, 0, w.rot]}
          fontSize={w.size}
          color="#eaf2ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {w.text}
        </Text>
      ))}
    </>
  );
}

export default function HyperdriveOverlay({ open, onClose }) {
  const speedRef = useRef(0);
  const [visible, setVisible] = useState(open);
  const overlayRef = useRef(null);
  const warpRef = useRef(null);

  // --- NEW: All Skills drawer state + search ---
  const [showList, setShowList] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SKILLS.filter(s => s.toLowerCase().includes(q)) : SKILLS;
  }, [query]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      gsap.set(overlayRef.current, { autoAlpha: 1 });

      // fade in quickly
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });

      // base speed + subtle breathing (yoyo forever)
      const speedObj = { v: 22 };
      speedRef.current = speedObj.v;
      const speedTween = gsap.to(speedObj, {
        v: 30,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: () => (speedRef.current = speedObj.v)
      });

      // endless warp streaks
      const ticker = () => {
        const cs = getComputedStyle(warpRef.current);
        const cur = parseFloat(cs.getPropertyValue("--offset") || "0") || 0;
        warpRef.current.style.setProperty("--offset", `${cur + 220}`);
      };
      gsap.ticker.add(ticker);

      return () => {
        speedTween.kill();
        gsap.ticker.remove(ticker);
      };
    } else if (visible) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setVisible(false)
      });
    }
  }, [open, visible]);

  // ESC to exit, L to toggle list
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key.toLowerCase() === "l") setShowList(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="hyperdrive-root" ref={overlayRef}>
      <Canvas camera={{ position: [0, 0, 0.6], fov: 72 }}>
        <color attach="background" args={["#090e19"]} />
        <ambientLight intensity={0.9} />
        <WordField speedRef={speedRef} />
      </Canvas>

      <div className="warp-overlay">
        <div className="warp-streaks" ref={warpRef} />
        <div className="warp-vignette" />
      </div>

      {/* UI */}
      <button className="hyperdrive-exit" onClick={onClose}>Exit ✕</button>
      <div className="hyperdrive-hint">Press ESC to exit • Press L to view all skills</div>

      {/* Toggle list (top-right) */}
      <button className="skills-toggle" onClick={() => setShowList(true)}>All Skills</button>

      {/* Drawer panel */}
      {showList && (
        <div className="skills-panel">
          <div className="skills-panel-header">
            <div className="skills-title">All Skills</div>
            <input
              className="skills-search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button className="skills-close" onClick={() => setShowList(false)}>✕</button>
          </div>

          <div className="skills-grid">
            {filtered.map((s) => (
              <span className="skill-chip" key={s}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
