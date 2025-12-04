import {} from "@babylonjs/core";

import { SceneData } from "./interfaces";
import "@babylonjs/loaders/glTF/2.0";import "@babylonjs/loaders";
export default function createRunScene(runScene: SceneData) {
  runScene.scene.onAfterRenderObservable.add(() => {});
}
