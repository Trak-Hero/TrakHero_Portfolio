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
import React, { useEffect, useRef } from "react"

// ✨ Router
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"

function BackgroundAudio() {
  const audioRef = useRef(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0.6 // set desired volume
    // Try to autoplay (will fail silently until user gesture)
    el.play().catch(() => {})

    // Unlock on first user interaction (required by Chrome/Safari)
    const unlock = () => {
      el.play().catch(() => {})
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])

  return (
    <audio id="bg-music" ref={audioRef} loop preload="auto">
      <source src="/music.mp3" type="audio/mpeg" />
      {/* Optionally add an .ogg for wider support */}
    </audio>
  )
}

function Landing() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    // also nudge audio to start on this explicit user click
    const a = document.getElementById('bg-music')
    a?.play?.().catch(() => {})
    navigate("/menu");
  };

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
  );
}

export default function App() {
  return (
    <Router>
      {/* 🎵 Global background music (mounted once for all routes) */}
      <BackgroundAudio />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}
