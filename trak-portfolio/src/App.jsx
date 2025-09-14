// App.jsx
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Html, Scroll } from '@react-three/drei'
import CameraRig from './components/canvas/CameraRig'
import PlanetScene from './components/canvas/PlanetScene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import TextScrollReveal from './components/ui/TextScrollReveal'
import ScrollSync from './components/canvas/scrollSync'
import ExploreGate from './components/ui/ExploreGate'
import MenuPage from "./pages/MenuPage"
import UnmuteNudge from "./components/ui/UnmuteNudge"
import HyperdriveOverlay from "./components/ui/HyperdriveOverlay"
import SpaceRadio from "./components/ui/SpaceRadio";
import PageLoader from "./components/ui/PageLoader";
import React, { useEffect, useRef, useState } from "react"

// ✨ Router
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"

function BackgroundAudio() {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = 0.6;
    el.loop = true;
    el.preload = "auto";
    el.src = "/nostalgia1.mp3";          // <-- default track
    el.play().catch(() => {});           // will start after a gesture on most browsers

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      el.play().catch(() => {});
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("touchstart", unlock, true);
    };

    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("touchstart", unlock, true);

    // Optional keyboard: 1-4 = select track, Space = pause/play
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (["1","2","3","4"].includes(key)) {
        const idx = Number(key);
        el.src = `/nostalgia${idx}.mp3`;
        el.play().catch(()=>{});
      } else if (key === " ") {
        e.preventDefault();
        if (el.paused) el.play().catch(()=>{}); else el.pause();
      }
    };
    document.addEventListener("keydown", onKey, true);

    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  return <audio id="bg-music" ref={audioRef} playsInline />;
}


function Landing() {
  const navigate = useNavigate();
  const [hyper, setHyper] = useState(false);

  // Normal Explore → still goes to /menu
  const handleExploreClick = () => {
    document.getElementById('bg-music')?.play?.().catch(() => {});
    navigate("/menu");
  };

  // Skills (Hyperdrive) → NO route change
  const handleSkillsClick = () => {
    document.getElementById('bg-music')?.play?.().catch(() => {});
    setHyper(true);                 // just open the overlay
  };

  const handleHyperClose = () => setHyper(false);
  const DISCOVER_OFFSET_X = 950; // moves right; use negative to move left
  const DISCOVER_OFFSET_Y = -200; // move up (negative goes upward)

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
        <TextScrollReveal />
        <div className="scroll-hint">
          <span>↓ Scroll to explore projects ↓</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ScrollControls pages={3} damping={0.1}>
          <CameraRig />
          <PlanetScene />
          <ScrollSync />

          // tweak this to taste (in pixels)

          <Scroll html>
            <div style={{ position: "relative", height: "300vh", width: "100%" }}>
              <div
                style={{
                  position: "absolute",
                  top: "285vh",
                  left: "50%",
                  // center on 50%, then push right by DISCOVER_OFFSET_X
                  transform: `translate(calc(-50% + ${DISCOVER_OFFSET_X}px), ${DISCOVER_OFFSET_Y}px)`,
                  pointerEvents: "none",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ pointerEvents: "auto" }}>
                  <ExploreGate onClick={handleExploreClick} />
                </div>
              </div>
            </div>
          </Scroll>

        </ScrollControls>

        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            intensity={1.5}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.025}
          />
        </EffectComposer>
      </Canvas>

      {/* 🔝 Fixed top-left button, above everything and not affected by scrolling */}
      <button className="skills-hyper-btn" onClick={handleSkillsClick}>
        Map of Trak’s Skills
      </button>

      {/* Hyperdrive overlay (no auto-route) */}
      {hyper && (
        <HyperdriveOverlay open={hyper} onClose={handleHyperClose} />
      )}
    </div>
  );
}



export default function App() {
  return (
    <Router>
      <PageLoader /> 
      {/* 🎵 Global background music (mounted once for all routes) */}
      <BackgroundAudio />
      <UnmuteNudge />
      <SpaceRadio />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}
