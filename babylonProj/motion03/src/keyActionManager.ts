import { ExecuteCodeAction } from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";

export let keyDownMap: Record<string, boolean> = {};
let keyDown: number = 0;

export function keyDownHeld() {
  keyDown = 2;
};

export function getKeyDown(): number {
  return keyDown;
};

export function keyActionManager(scene: Scene) {

  scene.actionManager.registerAction(
    new ExecuteCodeAction(
      { trigger: ActionManager.OnKeyDownTrigger },
      (evt) => {
        if (keyDown === 0) keyDown = 1;
        const key = evt.sourceEvent.key;
        keyDownMap[key] = true;
      }
    )
  );

  scene.actionManager.registerAction(
    new ExecuteCodeAction(
      { trigger: ActionManager.OnKeyUpTrigger },
      (evt) => {
        keyDown = 0;
        const key = evt.sourceEvent.key;
        keyDownMap[key] = false;
      }
    )
  );

  return scene.actionManager;
}


