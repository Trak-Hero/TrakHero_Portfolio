// src/components/ui/UnmuteNudge.jsx
import React, { useState, useEffect } from "react";
import "./UnmuteNudge.css";

export default function UnmuteNudge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById("bg-music");

    // Allow pressing "M" to unmute
    const handleKey = async (e) => {
      if (e.key.toLowerCase() === "m") {
        try {
          await el?.play?.();
        } catch (err) {
          console.warn("Audio play blocked:", err);
        }
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const enableAudio = async () => {
    const el = document.getElementById("bg-music");
    try {
      await el?.play?.();
    } catch (err) {
      console.warn("Audio play blocked:", err);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="unmute-wrap" role="dialog" aria-live="polite">
      <button
        className="unmute-btn"
        onClick={enableAudio}
        aria-label="Enable sound"
      >
        <span className="unmute-icon">🔊</span>
        <span className="unmute-text">enable sound</span>
        <span className="unmute-kbd">press M</span>
      </button>
    </div>
  );
}
