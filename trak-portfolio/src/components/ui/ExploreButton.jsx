import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ExploreButton.css'

export default function ExploreButton({ onClick }) {
  const maskRef = useRef(null)
  const containerRef = useRef(null)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (clicked) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(maskRef.current, {
        x,
        y,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const el = containerRef.current
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [clicked])

  const handleClick = () => {
    setClicked(true)
    gsap.to(containerRef.current, {
      scale: 20,
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: onClick
    })
  }

  return (
    <div className="explore-container" ref={containerRef} onClick={handleClick}>
      <div className="mask" ref={maskRef} />
      <div className="text">DISCOVER</div>
    </div>
  )
}
