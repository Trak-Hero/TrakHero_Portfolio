import { Canvas } from '@react-three/fiber'
import { ScrollControls, Html } from '@react-three/drei'
import CameraRig from './components/canvas/CameraRig'
import PlanetScene from './components/canvas/PlanetScene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import TextScrollReveal from './components/ui/TextScrollReveal'
import ScrollSync from './components/canvas/ScrollSync'

function App() {
  return (
    <div className="w-screen h-screen relative">
      {/* This is ABOVE Canvas and supports Tailwind */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
        <TextScrollReveal />
      </div>
      {/* Canvas 3D Scene */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ScrollControls pages={3} damping={0.1}>
          <CameraRig />
          <PlanetScene />
          <ScrollSync />

          {/* Invisible scroll container */}
          <Html fullscreen>
            <div style={{ height: '300vh', width: '100vw' }} />
          </Html>
        </ScrollControls>
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            intensity={1.5}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.025}
          />
        </EffectComposer>
      </Canvas>

    </div>
  )
}

export default App
