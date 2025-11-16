import { AbstractMesh, ActionManager, CubeTexture } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";

export default function createRunScene(runScene: SceneData) {
  runScene.scene.actionManager = new ActionManager(runScene.scene);
  keyActionManager(runScene.scene);

  // Load skybox environment
  const environmentTexture = new CubeTexture(
    "assets/textures/industrialSky.env",
    runScene.scene
  );

  runScene.scene.createDefaultSkybox(
    environmentTexture,
    true,
    10000,
    0.1
  );

  // Wait for player mesh to load once
  runScene.player.then((result) => {
    if (!result || !result.meshes || !result.meshes[0]) {
      console.error("Player mesh failed to load");
      return;
    }

    const character: AbstractMesh = result.meshes[0];

    // Run movement every frame
    runScene.scene.onBeforeRenderObservable.add(() => {

      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
        character.position.x -= 0.1;
        character.rotation.y = (3 * Math.PI) / 2;
      }

      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
        character.position.z -= 0.1;
        character.rotation.y = Math.PI;
      }

      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
        character.position.x += 0.1;
        character.rotation.y = Math.PI / 2;
      }

      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
        character.position.z += 0.1;
        character.rotation.y = 0;
      }

      // AUDIO BLOCK (optional)
      /*
      if (getKeyDown() === 1 && (keyDownMap["m"] || keyDownMap["M"])) {
        keyDownHeld();
        if (runScene.audio?.isPlaying) {
          runScene.audio.stop();
        } else {
          runScene.audio?.play();
        }
      }
      */

    }); // <-- closes onBeforeRenderObservable

  }); // <-- closes runScene.player.then()

  runScene.scene.onAfterRenderObservable.add(() => {});
}
