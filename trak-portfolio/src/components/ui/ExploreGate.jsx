import { useScrollStore } from '../../stores/useScrollStore'
import ExploreButton from './ExploreButton'

export default function ExploreGate({ onClick }) {
  const offset = useScrollStore((s) => s.scrollOffset)

  if (offset < 0.95) return null

  return (
    <div className="relative z-20 flex justify-center">
      <ExploreButton onClick={onClick} />
    </div>
  )
}