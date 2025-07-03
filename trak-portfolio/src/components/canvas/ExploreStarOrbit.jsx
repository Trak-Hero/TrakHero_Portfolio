import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const NUM_ORBITING_STARS = 6
const RADIUS = 0.3
const STAR_SIZE = 0.01

export default function ExploreStarOrbit({ targetY = 1.5 }) {
  const groupRef = useRef()
  const stars = useRef([])
  const scroll = useScroll()

  useFrame((state) => {
    const t = scroll.offset

    // Activate only near the end
    groupRef.current.visible = t > 0.9

    // Orbit stars
    const time = state.clock.getElapsedTime()
    stars.current.forEach((star, i) => {
      const angle = (time * 0.6 + i * (Math.PI * 2 / NUM_ORBITING_STARS))
      const x = Math.cos(angle) * RADIUS
      const y = Math.sin(angle) * RADIUS

      star.position.set(x, y, 0)
    })

    // Optional: hover near bottom center of viewport
    groupRef.current.position.set(0, targetY, -1)
  })

  return (
    <group ref={groupRef} visible={false}>
      {Array.from({ length: NUM_ORBITING_STARS }).map((_, i) => (
        <group key={i} ref={el => stars.current[i] = el}>
          <mesh>
            <sphereGeometry args={[STAR_SIZE, 8, 8]} />
            <meshStandardMaterial
              emissive="#ffd966"
              emissiveIntensity={20}
              color="#ffcc33"
              toneMapped={false}
            />
          </mesh>
          <pointLight intensity={1.2} distance={1} color="#ffcc33" />
        </group>
      ))}
    </group>
  )
}
