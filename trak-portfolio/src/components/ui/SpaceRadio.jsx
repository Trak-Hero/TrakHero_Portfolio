import React, { useEffect, useRef, useState } from "react";
import "./SpaceRadio.css";

const TRACKS = [
  { id: 1, label: "My Nostalgia I", file: "/nostalgia1.mp3" },
  { id: 2, label: "Cozy Heart", file: "/nostalgia2.mp3" },
  { id: 3, label: "Adrift in Space", file: "/nostalgia3.mp3" },
  { id: 4, label: "Sunset With You", file: "/nostalgia4.mp3" },
];

export default function SpaceRadio() {
  const [current, setCurrent] = useState(1);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef(null);

  // Find the global audio element after mount (and retry if needed)
  useEffect(() => {
    const grab = () => {
      const el = document.getElementById("bg-music");
      if (el) {
        audioRef.current = el;
        const onPlay = () => setPaused(false);
        const onPause = () => setPaused(true);
        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onPause);
        return () => {
          el.removeEventListener("play", onPlay);
          el.removeEventListener("pause", onPause);
        };
      }
      // if not found yet, try on next frame
      const id = requestAnimationFrame(grab);
      return () => cancelAnimationFrame(id);
    };
    const cleanup = grab();
    return () => cleanup && cleanup();
  }, []);

  const choose = (id) => {
    const el = audioRef.current;
    if (!el) return;
    setCurrent(id);
    try {
      el.pause();
      el.src = `/nostalgia${id}.mp3`;
      el.load();              // <-- important for reliable swap
      el.play().catch(() => {});
    } catch {}
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };

  const next = () => choose((current % 4) + 1);
  const prev = () => choose(((current + 2) % 4) + 1); // wraps 1..4

  return (
    <div className="space-radio" role="region" aria-label="Space Radio">
      <div className="sr-row">
        <button className="sr-btn" onClick={prev} aria-label="Previous track">⟨</button>
        <button className="sr-btn sr-main" onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
          {paused ? "▶" : "⏸"}
        </button>
        <button className="sr-btn" onClick={next} aria-label="Next track">⟩</button>
      </div>
      <div className="sr-chips">
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => choose(t.id)}
            className={`sr-chip ${current === t.id ? "active" : ""}`}
            aria-pressed={current === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
