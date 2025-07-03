// PlanetScene.jsx
import { useRef, useState, useEffect } from 'react'
import { Sphere, Stars } from '@react-three/drei'
import PrinceModel from './PrinceModel'
import Flashlight from './Flashlight'
import StarTrail from './StarTrail'
import StarlightClock from './StarlightClock'

export default function PlanetScene() {
  const princeRef = useRef()
  const [handBone, setHandBone] = useState(null)

  useEffect(() => {
    if (princeRef.current) {
      const bone = princeRef.current.getObjectByName('LeftHandBone_42')
      if (bone) {
        setHandBone(bone)
      } else {
        console.warn('⚠️ RightHandBone_61 not found in model.')
      }
    }
  }, [])

  return (
    <>
      <ambientLight intensity={1} />
      <Stars radius={10} depth={50} count={3000} factor={4} fade />

      {/* 🔥 Warm Fire Glow */}
      <pointLight
        position={[0, -1, 3]}
        intensity={10}
        distance={30}
        color="#ffaa55"
      />

      {/* 🌌 Ambient Sky Tint */}
      <hemisphereLight
        skyColor="#1e3a8a"
        groundColor="#0f172a"
        intensity={3}
      />

      {/* 🧍 Prince + Flashlight Beam */}
      <PrinceModel ref={princeRef} />
      {handBone && <Flashlight handBone={handBone} />}

      {/* ✨ Cursor Stars */}
      <StarTrail />
      <StarlightClock />
    </>
  )
}
