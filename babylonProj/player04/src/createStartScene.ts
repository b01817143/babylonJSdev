//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
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
// TERRAIN
// ----------------------------------------------------

export function createTerrain(scene: Scene) {
  const largeGroundMat = new StandardMaterial("largeGroundMat", scene);
  largeGroundMat.diffuseTexture = new Texture(
    "./assets/environments/valleygrass.png",
    scene
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "./assets/environments/villageheightmap.png",
    {
      width: 150,
      height: 150,
      subdivisions: 20,
      minHeight: 0,
      maxHeight: 10
    },
    scene
  );

  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;

  return largeGround;
}


// ----------------------------------------------------
// GROUND (mesh + physics)
// ----------------------------------------------------

function createGround(scene: Scene): PhysicsMesh {
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new Texture("./assets/environments/playergrass.png", scene);
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

function createBox1(scene: Scene) {
  let box = MeshBuilder.CreateBox("box1", { width: 1, height: 1 }, scene);
  box.position.set(-1, 3, 1);

  const texture = new StandardMaterial("reflective1", scene);
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

function createBox2(scene: Scene) {
  let box = MeshBuilder.CreateBox("box2", { width: 1, height: 1 }, scene);
  box.position.set(-0.7, 5, 1);

  const texture = new StandardMaterial("reflective2", scene);
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

function createBox3(scene: Scene) {
  let box = MeshBuilder.CreateBox("box3", { width: 1, height: 1 }, scene);
  box.position.set(-0.7, 5, 1);

  const texture = new StandardMaterial("reflective3", scene);
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

function createBox4(scene: Scene) {
  let box = MeshBuilder.CreateBox("box4", { width: 1, height: 1 }, scene);
  box.position.set(-0.7, 5, 1);

  const texture = new StandardMaterial("reflective4", scene);
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

  // Tree 1
const tree1 = assetsManager.addMeshTask(
  "tree1 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_1.gltf"
);

tree1.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(3, 0, 2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);
  task.loadedMeshes.forEach(mesh => (mesh.isVisible = true));

  const clone = root.clone("tree1_clone", null, true);
  clone!.position = new Vector3(0, 0, 5);
};

// Tree 2
const tree2 = assetsManager.addMeshTask(
  "tree2 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_2.gltf"
);

tree2.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(0, 0, 2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);

  const clone = root.clone("tree2_clone", null, true);
  clone!.position = new Vector3(-3, 0, 5);
};

// Tree 3
const tree3 = assetsManager.addMeshTask(
  "tree3 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_3.gltf"
);

tree3.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(-3, 0, 2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);

  const clone = root.clone("tree3_clone", null, true);
  clone!.position = new Vector3(3, 0, 5);
};

// Tree 4
const tree4 = assetsManager.addMeshTask(
  "tree4 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_1.gltf"
);

tree4.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(3, 0, -2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);

  const clone = root.clone("tree4_clone", null, true);
  clone!.position = new Vector3(0, 0, -5);
};

// Tree 5
const tree5 = assetsManager.addMeshTask(
  "tree5 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_2.gltf"
);

tree5.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(0, 0, -2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);

  const clone = root.clone("tree5_clone", null, true);
  clone!.position = new Vector3(-3, 0, -5);
};

// Tree 6
const tree6 = assetsManager.addMeshTask(
  "tree6 task",
  "",
  "./assets/nature/gltf/",
  "CommonTree_3.gltf"
);

tree6.onSuccess = function (task) {
  const root = task.loadedMeshes[0];
  root.position = new Vector3(-3, 0, -2);
  root.scaling = new Vector3(0.5, 0.5, 0.5);

  const clone = root.clone("tree6_clone", null, true);
  clone!.position = new Vector3(3, 0, -5);
};


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
  that.ground = createGround(that.scene);
  createTerrain(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  that.box1 = createBox1(that.scene);
  that.box2 = createBox2(that.scene);
   that.box3 = createBox3(that.scene);
  that.box4 = createBox4(that.scene);

  const assetsManager = addAssets(that.scene);
  assetsManager.load();

  return that;
}
