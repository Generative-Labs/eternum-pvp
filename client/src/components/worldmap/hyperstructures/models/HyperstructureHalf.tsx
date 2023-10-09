/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 --types --keepnames --keepgroups --keepmeshes --transform public/models/models/hyperstructure-half.glb 
Files: public/models/models/hyperstructure-half.glb [570.8KB] > hyperstructure-half-transformed.glb [215.31KB] (62%)
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { HyperStructureInterface } from "../../../../hooks/helpers/useHyperstructure";

type GLTFResult = GLTF & {
  nodes: {
    ["tower_half-finished_1"]: THREE.Mesh;
    ["tower_half-finished_2"]: THREE.Mesh;
    ["tower_half-finished_scaffolds"]: THREE.Mesh;
  };
  materials: {
    Stone_Rough: THREE.MeshStandardMaterial;
    Ground: THREE.MeshStandardMaterial;
    Wood: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>>;

export default function HyperstructureHalfFinished(
  props: JSX.IntrinsicElements["group"] & { hyperstructure?: HyperStructureInterface },
) {
  const { nodes, materials } = useGLTF("/models/hyperstructure-half-transformed.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        {props.hyperstructure?.initialized && (
          <Html position={[0, -1.1, 0]} distanceFactor={10}>
            <div className="p-2 text-white -translate-x-1/2 bg-black rounded-lg whitespace-nowrap">
              Progress: {props.hyperstructure?.progress}%
            </div>
          </Html>
        )}
        <group name="tower_half-finished">
          <mesh
            name="tower_half-finished_1"
            geometry={nodes["tower_half-finished_1"].geometry}
            material={materials.Stone_Rough}
          />
          <mesh
            name="tower_half-finished_2"
            geometry={nodes["tower_half-finished_2"].geometry}
            material={materials.Ground}
          />
        </group>
        <mesh
          name="tower_half-finished_scaffolds"
          geometry={nodes["tower_half-finished_scaffolds"].geometry}
          material={materials.Wood}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/hyperstructure-half-transformed.glb");
