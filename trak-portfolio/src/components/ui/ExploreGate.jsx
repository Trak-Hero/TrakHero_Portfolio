import { useScrollStore } from '../../stores/useScrollStore'
import ExploreButton from './ExploreButton'

export default function ExploreGate({ onClick }) {
  const offset = useScrollStore((s) => s.scrollOffset)

  if (offset < 0.95) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20">
      <ExploreButton onClick={onClick} />
    </div>
  )
}