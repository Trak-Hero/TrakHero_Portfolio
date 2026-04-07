// src/pages/SunsetInterlude.jsx
import React, { Suspense, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center, OrbitControls } from "@react-three/drei";
import "./sunset-interlude.css";

const MODEL_URL = "/models/boy_with_sky.glb";
// Put these near the top of the component file
const BASE_POS = new THREE.Vector3(-0.587, 18.209, 7.759);
const BASE_TAR = new THREE.Vector3(-0.895, 18.375, 3.967);
const BASE_FOV = 45;


function BoyModel(props) {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} {...props} />;
}
useGLTF.preload(MODEL_URL);

import * as THREE from "three";

/** Subtle mouse parallax for camera + target */
function ParallaxRig({
  basePos = [0, 0, 5],
  baseTarget = [0, 0, 0],
  intensity = 0.35,        // how much the camera moves (units)
  targetIntensity = 0.20,  // how much the target moves (units)
  ease = 0.08,             // smoothing (0..1) higher = snappier
  controlsRef
}) {
  const { camera } = useThree();
  const basePosV = useRef(new THREE.Vector3(...basePos));
  const baseTarV = useRef(new THREE.Vector3(...baseTarget));
  const tmpPos   = useRef(new THREE.Vector3());
  const tmpTar   = useRef(new THREE.Vector3());

  useFrame((state) => {
    const { x, y } = state.pointer;      // normalized -1..1
    // small offsets (invert Y so moving mouse up raises the view slightly)
    const ox = x * intensity;
    const oy = -y * intensity;

    const tox = x * targetIntensity;
    const toy = -y * targetIntensity;

    // desired camera/target
    tmpPos.current.set(
      basePosV.current.x + ox,
      basePosV.current.y + oy,
      basePosV.current.z
    );
    tmpTar.current.set(
      baseTarV.current.x + tox,
      baseTarV.current.y + toy,
      baseTarV.current.z
    );

    // smooth toward desired
    camera.position.lerp(tmpPos.current, ease);

    if (controlsRef?.current) {
      // OrbitControls present: lerp its target
      controlsRef.current.target.lerp(tmpTar.current, ease);
      controlsRef.current.update();
    } else {
      // no controls: just lookAt
      const look = camera.position.clone().lerp(tmpTar.current, ease);
      camera.lookAt(look);
    }
  });

  return null;
}


export default function SunsetInterlude() {
  const nav = useNavigate();
  const controlsRef = useRef(null);

  useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.target.set(-0.895, 18.375, 3.967);
        controlsRef.current.update();
      }
    }, []);

  

  return (
    <div className="interlude-scene">
      <div className="interlude-3d">
        <Canvas
            camera={{
              position: [-0.587, 18.209, 7.759],
              fov: 45,
              near: 0.1,
              far: 1000,
            }}
            dpr={[1, 2]}
            onCreated={({ camera }) => {
              camera.position.set(-0.587, 18.209, 7.759);
              camera.lookAt(-0.895, 18.375, 3.967);
              camera.updateProjectionMatrix();
            }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 5, 2]} intensity={1.2} />

            <Suspense fallback={null}>
                <Center top>
                <group position={[0, -0.6, 0]} rotation={[0, 0, 0]} scale={1}>
                    <BoyModel />
                </group>
                </Center>
                <Environment preset="sunset" />
            </Suspense>

            {/* Lock rotation so parallax doesn’t fight user input */}
            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enableRotate={false}
                enablePan={false}
                target={[-0.895, 18.375, 3.967]}
            />

            {/* Subtle parallax */}
            <ParallaxRig
              basePos={[-0.587, 18.209, 7.759]}
              baseTarget={[-0.895, 18.375, 3.967]}
              intensity={0.12}
              targetIntensity={0.08}
              ease={0.06}
              controlsRef={controlsRef}
            />

            </Canvas>


      </div>
      <button className="back-button" onClick={() => nav("/")}>
        ← Back
        </button>

      <div className="interlude-vignette" />

      <div className="dialogue">
        <div className="name-tag">Trak</div>
        <p className="line">“What knowledge do you seek?”</p>
        <div className="options">
          <button className="opt" onClick={() => nav("/about")}><span className="primary">Who is Trak?</span><span className="hint"> (About me)</span></button>
          <button className="opt" onClick={() => nav("/menu")}><span className="primary">What has Trak done?</span><span className="hint"> (My Portfolio)</span></button>
        </div>
      </div>
    </div>
  );
}
