import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Stars, Environment, MeshDistortMaterial, Text, RoundedBox } from '@react-three/drei'

function BeaconPreview(handle: any) {
  const beaconRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  // console.log(handle)

  useFrame((state, delta) => {
    if (beaconRef.current) {
      // @ts-ignore
      const beam = beaconRef.current.children[1]
      if (beam && hovered) {
        beam.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      }

      if (clicked) {
        // @ts-ignore
        beaconRef.current.rotation.y += delta * 2
      }
    }
  })

  return (
    <>
      {/* Lights */}
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Environment and background effects */}
      <Environment preset="sunset" />
      <Stars count={3000} radius={50} depth={50} factor={4} saturation={0} fade speed={1} />

      {/* Main beacon group */}
      <group
        // @ts-ignore
        ref={beaconRef}
        position={[0, -1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        {/* Beacon base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            speed={5}
            distort={hovered ? 0.2 : 0}
            radius={1}
            emissive="#8b5cf6"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Beacon light beam */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.1, 0.5, 4, 32]} />
          <meshStandardMaterial color="#8b5cf6" transparent opacity={0.3} emissive="#8b5cf6" emissiveIntensity={3} />
        </mesh>

        {/* Beacon top */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={hovered ? 2 : 0.5} />
        </mesh>

        {/* Floating particles around the beacon */}
        {[...Array(8)].map((_, i) => (
          <Float
            key={i}
            speed={2}
            rotationIntensity={2}
            floatIntensity={2}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.8,
              0.5 + Math.sin(i * 0.5) * 0.3,
              Math.sin((i / 8) * Math.PI * 2) * 0.8
            ]}
          >
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Floating text */}
      <Float position={[0, 0, 0]} speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Text
          color="#8b5cf6"
          fontSize={0.1}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          @{handle.handle}
        </Text>
      </Float>
    </>
  )
}

export default BeaconPreview
