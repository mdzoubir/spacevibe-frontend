import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Plane } from '@react-three/drei';
import { EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';

interface House3DModelProps {
    width: number;  // Width of the box
    height: number; // Height of the box
    length: number; // Length (depth) of the box
}

const House3DModel = ({ width, height, length }: House3DModelProps) => {
    const boxRef = useRef<any>(null);

    // Function to create the edges (black border) of the box
    const createBoxEdges = () => {
        if (boxRef.current) {
            const geometry = new EdgesGeometry(boxRef.current.geometry);
            const material = new LineBasicMaterial({ color: 0x000000, linewidth: 1 }); // Black outline
            return new LineSegments(geometry, material);
        }
        return null;
    };

    return (
        <Canvas camera={{ position: [width * 1.5, height * 1.5, length * 2], fov: 75 }}>
            {/* Lighting Setup */}
            <ambientLight intensity={0.5} />  {/* Soft light */}
            <directionalLight position={[10, 10, 5]} intensity={1} />  {/* Stronger directional light */}

            {/* Floor (use Plane or Box) */}
            <Plane
                args={[width, length]} // The floor's width and length
                rotation={[-Math.PI / 2, 0, 0]} // Rotate to make it horizontal
                position={[0, -height / 2, 0]} // Place it below the box
            >
                <meshStandardMaterial color={0x888888} />
            </Plane>

            {/* Box (representing the walls) */}
            <Box
                ref={boxRef}
                args={[width, height, length]}  // Create a box with width, height, and length
                position={[0, height / 2, 0]}    // Center the box on the floor
            >
                {/* Transparent material */}
                <meshStandardMaterial color={0xffffff} transparent={true} opacity={0} />
            </Box>

            {/* Add black border outline around the box */}
            {createBoxEdges() && (
                <primitive object={createBoxEdges()} />
            )}

            {/* OrbitControls for interaction */}
            <OrbitControls />
        </Canvas>
    );
};

export default House3DModel;
