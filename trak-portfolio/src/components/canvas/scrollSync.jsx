// src/components/canvas/ScrollSync.jsx
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useScrollStore } from '../../stores/useScrollStore'

export default function ScrollSync() {
  const scroll = useScroll()
  const setOffset = useScrollStore((s) => s.setOffset)

  useFrame(() => {
    setOffset(scroll.offset)
  })

  return null
}
