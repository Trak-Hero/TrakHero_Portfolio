// StarlightClock.jsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const NUM_MARKS = 14
const RADIUS = 15
const GAP_START = 0.3 * Math.PI * 2
const GAP_END = 0.4 * Math.PI * 2

export default function StarlightClock() {
  const groupRef = useRef()
  const scroll = useScroll()
  const { viewport } = useThree()

  useFrame(() => {
    const angle = scroll.offset * Math.PI * 2
    const baseY = -5              // 📉 Start below
    const targetY = 5            // 🏁 End at middle height
    const y = THREE.MathUtils.lerp(baseY, targetY, scroll.offset)

    groupRef.current.rotation.y = angle
    groupRef.current.position.y = y
  })

  return (
    <group ref={groupRef} position={[0, 5, 5]}> {/* y will be overridden in useFrame */}
      {Array.from({ length: NUM_MARKS }).map((_, i) => {
        const theta = (i / NUM_MARKS) * Math.PI * 2
        if (theta > GAP_START && theta < GAP_END) return null

        const x = Math.cos(theta) * RADIUS
        const z = Math.sin(theta) * RADIUS

        return (
          <mesh key={i} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial
              emissive="#fff2b6"
              emissiveIntensity={2.5}
              color="#fff2b6"
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}
