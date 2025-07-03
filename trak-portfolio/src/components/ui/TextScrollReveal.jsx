import { motion, AnimatePresence } from 'framer-motion'
import { useScrollStore } from '../../stores/useScrollStore'

const messages = [
  { threshold: 0.0, text: "Welcome to Trak’s World" },
  { threshold: 0.3, text: "Explore Data & Web Creation" },
  { threshold: 0.7, text: "Embark on the Journey" }
]

export default function TextScrollReveal() {
  const offset = useScrollStore((s) => s.offset)

  let current = messages[messages.length - 1].text
  for (let i = 0; i < messages.length; i++) {
    if (offset < messages[i].threshold) {
      current = messages[Math.max(i - 1, 0)].text
      break
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
            key={current}
            className="text-[#faf6f0] text-white text-[5rem] md:text-[5rem] text-center text-yellow-200 drop-shadow-[0_0_20px_rgba(255,255,150,0.7)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1 }}
            >
            {current}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
