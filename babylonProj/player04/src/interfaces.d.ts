// interfaces.ts
import { Scene, Camera, HemisphericLight, Mesh } from "@babylonjs/core";
import { PhysicsAggregate } from "@babylonjs/core";

export interface PhysicsMesh extends Mesh {
  physicsAggregate?: PhysicsAggregate;
}

export interface SceneData {
  scene: Scene;
  light?: HemisphericLight;
  ground?: PhysicsMesh; // <- mesh with physicsAggregate
  camera?: Camera;
  box1?: PhysicsAggregate;
  box2?: PhysicsAggregate;
  box3?: PhysicsAggregate;
  box4?: PhysicsAggregate;
  skybox?: Mesh;
}

