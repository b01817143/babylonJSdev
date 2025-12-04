//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
  Vector2,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Camera,
  Engine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
  Color3,
  StandardMaterial,
  Texture,
  CubeTexture
} from "@babylonjs/core";

import { WaterMaterial } from "@babylonjs/materials";

// ----------------------------------------------------
// TYPES
// ----------------------------------------------------

// Mesh with an optional physics aggregate attached
export type PhysicsMesh = Mesh & { physicsAggregate?: PhysicsAggregate };

// ----------------------------------------------------
// LIGHT
// ----------------------------------------------------

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

// ----------------------------------------------------
// GROUND (mesh + physics)
// ----------------------------------------------------

function createGround(scene: Scene): PhysicsMesh {
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new Texture("./assets/textures/sand.jpg", scene);
  groundMaterial.diffuseTexture.hasAlpha = true;
  groundMaterial.backFaceCulling = false;

  const ground = MeshBuilder.CreateGround("ground", { width: 16, height: 16 }, scene);
  ground.material = groundMaterial;
  ground.position.y = 0.01;

  // Physics
  const agg = new PhysicsAggregate(
    ground,
    PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  (ground as PhysicsMesh).physicsAggregate = agg;

  return ground as PhysicsMesh;
}

// ----------------------------------------------------
// WATER
// ----------------------------------------------------

function createWater(scene: Scene) {
const waterMesh = MeshBuilder.CreateGround("waterMesh", { width: 150, height: 150, subdivisions: 32 }, scene);

  const waterMaterial = new WaterMaterial("waterMaterial", scene, new Vector2(512, 512));
  waterMaterial.bumpTexture = new Texture("./assets/environments/waterbump.png", scene);
  waterMaterial.windForce = 5;
  waterMaterial.waveHeight = 0.5;
  waterMaterial.windDirection = new Vector2(1, 1); // X and Z direction
  waterMaterial.waterColor = new Color3(0, 0.3, 0.5);
  waterMaterial.colorBlendFactor = 0.3;
  waterMaterial.backFaceCulling = true;

  waterMesh.material = waterMaterial;
  waterMesh.position.y = 0.1; // Adjust this value to taste

  return waterMesh;
}


// ----------------------------------------------------
// SKY
// ----------------------------------------------------

export function createSky(scene: Scene): Mesh {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);

  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;

  skyboxMaterial.reflectionTexture = new CubeTexture(
    "./assets/textures/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);

  skybox.material = skyboxMaterial;

  return skybox;
}

// ----------------------------------------------------
// CAMERA
// ----------------------------------------------------

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 25,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

  camera.attachControl(true);
  return camera;
}

// ----------------------------------------------------
// BOXES WITH PHYSICS
// ----------------------------------------------------

function createBox(scene: Scene, name: string, pos: Vector3) {
  let box = MeshBuilder.CreateBox(name, { width: 1, height: 1 }, scene);
  box.position.copyFrom(pos);

  const texture = new StandardMaterial(name + "_mat", scene);
  texture.ambientTexture = new Texture("./assets/textures/wood.jpg", scene);
  box.material = texture;

  let boxAgg = new PhysicsAggregate(
    box, PhysicsShapeType.BOX,
    { mass: 0.2, restitution: 0.1, friction: 0.4 },
    scene
  );

  boxAgg.body.setCollisionCallbackEnabled(true);
  return boxAgg;
}

// ----------------------------------------------------
// ASSETS (trees)
// ----------------------------------------------------

function addAssets(scene: Scene) {
  const assetsManager = new AssetsManager(scene);

  const treeFiles = [
    { name: "tree1", file: "CommonTree_1.gltf", pos: new Vector3(3, 0, 2), clonePos: new Vector3(0, 0, 5) },
    { name: "tree2", file: "CommonTree_2.gltf", pos: new Vector3(0, 0, 2), clonePos: new Vector3(-3, 0, 5) },
    { name: "tree3", file: "CommonTree_3.gltf", pos: new Vector3(-3, 0, 2), clonePos: new Vector3(3, 0, 5) },
    { name: "tree4", file: "CommonTree_1.gltf", pos: new Vector3(3, 0, -2), clonePos: new Vector3(0, 0, -5) },
    { name: "tree5", file: "CommonTree_2.gltf", pos: new Vector3(0, 0, -2), clonePos: new Vector3(-3, 0, -5) },
    { name: "tree6", file: "CommonTree_3.gltf", pos: new Vector3(-3, 0, -2), clonePos: new Vector3(3, 0, -5) },
  ];

  for (const t of treeFiles) {
    const task = assetsManager.addMeshTask(t.name + " task", "", "./assets/nature/gltf/", t.file);
    task.onSuccess = function (task) {
      const root = task.loadedMeshes[0];
      root.position = t.pos;
      root.scaling = new Vector3(0.5, 0.5, 0.5);
      task.loadedMeshes.forEach(mesh => (mesh.isVisible = true));
      const clone = root.clone(t.name + "_clone", null, true);
      clone!.position = t.clonePos;
    };
  }

  assetsManager.onTaskErrorObservable.add(task =>
    console.log("task failed", task.errorObject.message)
  );

  return assetsManager;
}

// ----------------------------------------------------
// MAIN SCENE CREATION
// ----------------------------------------------------

export default async function createStartScene(engine: Engine) {

  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    ground?: PhysicsMesh;
    camera?: Camera;
    box1?: PhysicsAggregate;
    box2?: PhysicsAggregate;
    box3?: PhysicsAggregate;
    box4?: PhysicsAggregate;
    skybox?: Mesh;
  }

  let that: SceneData = { scene: new Scene(engine) };

  // Init physics
  const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
  const hk: HavokPlugin = new HavokPlugin(true, havokInstance);
  that.scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

  // Scene setup
  that.skybox = createSky(that.scene);
  that.light = createLight(that.scene);
  that.ground = createGround(that.scene); // Sand ground
  createWater(that.scene); // Water plane
  that.camera = createArcRotateCamera(that.scene);
  that.box1 = createBox(that.scene, "box1", new Vector3(-1, 3, 1));
  that.box2 = createBox(that.scene, "box2", new Vector3(-0.7, 5, 1));
  that.box3 = createBox(that.scene, "box3", new Vector3(-0.7, 5, 1));
  that.box4 = createBox(that.scene, "box4", new Vector3(-0.7, 5, 1));

  const assetsManager = addAssets(that.scene);
  assetsManager.load();

  return that;
}
