import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function Flashlight({ handBone }) {
  const spotlightRef = useRef()
  const beamTarget = useRef(new THREE.Object3D())
  const { mouse, camera } = useThree()
  const scroll = useScroll()

  useEffect(() => {
    if (!handBone) {
      console.warn('Flashlight: handBone is missing')
    }
  }, [handBone])

  useFrame(() => {
    if (!handBone || !spotlightRef.current) return

    // Get hand world position
    const handPos = new THREE.Vector3()
    handBone.getWorldPosition(handPos)
    spotlightRef.current.position.copy(handPos)

    // Reverse-direction beam based on mouse
    const x = THREE.MathUtils.lerp(-0.4, 0.4, mouse.x + 0.5)
    const y = THREE.MathUtils.lerp(-0.25, 0.25, mouse.y + 0.5)
    const dir = new THREE.Vector3(x, y, 1).unproject(camera).sub(camera.position).normalize()
    const targetPos = handPos.clone().add(dir.multiplyScalar(3))

    beamTarget.current.position.copy(targetPos)
    spotlightRef.current.target = beamTarget.current
    spotlightRef.current.target.updateMatrixWorld()

    // 🔦 Smooth flashlight intensity based on scroll
    const t = scroll.offset
    spotlightRef.current.intensity = THREE.MathUtils.lerp(10, 2900, t > 0.9 ? (t - 0.9) * 10 : 0)
  })

  return (
    <>
      <spotLight
        ref={spotlightRef}
        angle={0.5}
        penumbra={0.9}
        distance={300}
        intensity={10} // base value
        color="#fff6cc"
        castShadow
      />
      <primitive object={beamTarget.current} />
    </>
  )
}
