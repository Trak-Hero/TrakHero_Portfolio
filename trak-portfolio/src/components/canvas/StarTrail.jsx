import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NUM_STARS = 4
const TRAIL_LERP_SPEED = 0.05
const STAR_SIZE = 0.003

export default function StarTrail() {
  const trail = useRef([])
  const { camera, mouse } = useThree()

  // Initialize trail with Object3D instances
  useEffect(() => {
    trail.current = Array(NUM_STARS).fill().map(() => new THREE.Object3D())
  }, [])

  useFrame(() => {
    if (!trail.current.every(obj => obj && obj.position)) return

    const target = new THREE.Vector3(mouse.x, mouse.y, -0.2).unproject(camera)

    for (let i = 0; i < NUM_STARS; i++) {
      if (i === 0) {
        trail.current[i].position.lerp(target, TRAIL_LERP_SPEED)
      } else {
        trail.current[i].position.lerp(trail.current[i - 1].position, TRAIL_LERP_SPEED)
      }
    }
  })

  return (
    <>
      {Array(NUM_STARS).fill().map((_, i) => (
        <group
          key={i}
          ref={el => {
            if (el) trail.current[i] = el
          }}
        >
          <mesh>
            <sphereGeometry args={[STAR_SIZE, 8, 8]} />
            <meshStandardMaterial
              emissive="#ffd966"
              emissiveIntensity={10}
              color="#ffcc33"
              toneMapped={false}
            />
          </mesh>
          <pointLight
            intensity={1.0}
            distance={1}
            color="#ffcc33"
          />
        </group>
      ))}
    </>
  )
}
