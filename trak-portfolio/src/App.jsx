// App.jsx
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Html } from '@react-three/drei'
import CameraRig from './components/canvas/CameraRig'
import PlanetScene from './components/canvas/PlanetScene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import TextScrollReveal from './components/ui/TextScrollReveal'
import ScrollSync from './components/canvas/scrollSync'
import ExploreGate from './components/ui/ExploreGate'
import MenuPage from "./pages/MenuPage"
import UnmuteNudge from "./components/ui/UnmuteNudge";
import React, { useEffect, useRef } from "react"

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
    el.src = "/bgspace.mp3";
    el.play().catch(() => {});

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      el.play().catch(() => {});
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      document.removeEventListener("touchstart", unlock, true);
    };

    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("touchstart", unlock, true);

    // "M" shortcut to unmute/start
    const onKey = (e) => {
      if (e.key.toLowerCase() === "m") {
        el.play().catch(() => {});
        // store so the nudge never shows again
        localStorage.setItem("siteAudioAcknowledged", "true");
        // hide any nudge if still visible
        const ev = new CustomEvent("hide-unmute-nudge");
        window.dispatchEvent(ev);
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
  const navigate = useNavigate()

  const handleExploreClick = () => {
    // Force play on explicit user gesture
    const a = document.getElementById('bg-music')
    a?.play?.().catch(() => {})
    navigate("/menu")
  }

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
        <TextScrollReveal />
      </div>
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ScrollControls pages={3} damping={0.1}>
          <CameraRig />
          <PlanetScene />
          <ScrollSync />
          <Html fullscreen>
            <div style={{ height: '300vh', width: '100vw' }} />
            <ExploreGate onClick={handleExploreClick} />
          </Html>
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
    </div>
  )
}

export default function App() {
  return (
    <Router>
      {/* 🎵 Global background music (mounted once for all routes) */}
      <BackgroundAudio />
      <UnmuteNudge />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}
