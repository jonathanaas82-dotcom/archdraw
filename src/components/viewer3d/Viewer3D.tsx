import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import Scene3D from './Scene3D'
import styles from './Viewer3D.module.css'

export default function Viewer3D(): React.ReactElement {
  return (
    <div className={styles.container}>
      <Canvas
        frameloop="demand"
        camera={{ position: [5000, 8000, 10000], fov: 45, near: 1, far: 200000 }}
        gl={{ antialias: true }}
        style={{ background: '#111' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10000, 20000, 10000]} intensity={0.8} />
        <directionalLight position={[-5000, 5000, -5000]} intensity={0.3} />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
        <OrbitControls makeDefault />
        <Grid
          args={[100000, 100000]}
          cellSize={1000}
          cellThickness={0.5}
          cellColor="#2a2a2a"
          sectionSize={5000}
          sectionThickness={1}
          sectionColor="#333"
          fadeDistance={80000}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      </Canvas>
      <div className={styles.hint}>F3 / Tab — bytt visning &nbsp;|&nbsp; Venstreklikk drag = roter &nbsp;|&nbsp; Scroll = zoom</div>
    </div>
  )
}
