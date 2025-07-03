import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollStore } from '../../stores/useScrollStore'

export default function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()
  const setOffset = useScrollStore((state) => state.setOffset)

  const lerpedPos = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())

  // Define scroll start/end camera positions
  const startPos = new THREE.Vector3(2, 5, 15)
  const endPos = new THREE.Vector3(1, 0, -2)

  const startLook = new THREE.Vector3(0, 0, 0)
  const endLook = new THREE.Vector3(-3, 1.5, 5)

  useFrame(() => {
    const t = scroll.offset // smooth value from 0 to 1
    setOffset(t)

    // Interpolate position and lookAt
    const currentPos = startPos.clone().lerp(endPos, t)
    const currentLook = startLook.clone().lerp(endLook, t)

    // Smooth it visually (optional smoothing)
    lerpedPos.current.lerp(currentPos, 0.1)
    lookTarget.current.lerp(currentLook, 0.1)

    camera.position.copy(lerpedPos.current)
    camera.lookAt(lookTarget.current)
  })

  return null
}
