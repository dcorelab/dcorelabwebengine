"use client";
import { useEffect, useState } from "react";
import { getModels3D } from "@/lib/content";
import type { Model3D } from "@/types/content";
import { useGLTF } from "@react-three/drei";
import { Center } from "@react-three/drei";
function LoadedModel({ fileUrl }: { fileUrl: string }) { const gltf = useGLTF(fileUrl, "/draco/"); return <Center><primitive object={gltf.scene} scale={1} /></Center>; }
function ProceduralFallback() { return <mesh><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#8B5CF6" emissive="#7C3AED" emissiveIntensity={1} wireframe /></mesh>; }
export function ModelOrFallback({ modelId }: { modelId: string }) { const [model, setModel] = useState<Model3D | undefined>(); useEffect(() => { let active = true; void getModels3D().then((models) => { const match = models.find((entry) => entry.id === modelId && entry.published && entry.approved && Boolean(entry.fileUrl)); if (active) setModel(match); }); return () => { active = false; }; }, [modelId]); if (!model) return <ProceduralFallback />; return <LoadedModel fileUrl={model.fileUrl} />; }
