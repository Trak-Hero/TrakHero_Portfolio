// PrinceModel.jsx
import { forwardRef, useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const PrinceModel = forwardRef((props, ref) => {
  const { scene, animations } = useGLTF('/models/prince.glb')
  const modelRef = useRef()
  const { actions, mixer } = useAnimations(animations, modelRef)

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]].reset().fadeIn(0.5).play()
    }
    return () => mixer?.stopAllAction()
  }, [actions, mixer])

  useEffect(() => {
    if (ref && modelRef.current) {
      ref.current = modelRef.current
    }
  }, [ref])

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, -1, 0]}
      {...props}
    />
  )
})

export default PrinceModel
