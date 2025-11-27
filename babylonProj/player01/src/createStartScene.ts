//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
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
  Texture,
  StandardMaterial,
  CubeTexture,
  Color3,
} from "@babylonjs/core";
import { taaPixelShader } from "@babylonjs/core/Shaders/taa.fragment";

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

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
      maxHeight: 10,
    },
    scene
  );

  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;

  return largeGround;
}

function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture(
    "./assets/environments/playergrass.png"
  );
  groundMaterial.diffuseTexture.hasAlpha = true;
  groundMaterial.backFaceCulling = false;
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16 },
    scene
  );
  ground.material = groundMaterial;
  ground.position.y = 0.01;
  return ground;
}


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

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.attachControl(true);
  return camera;
}

function addAssets(scene: Scene) {
  // add assets here
  const assetsManager = new AssetsManager(scene);
  const tree1 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_1.gltf"
  );
  tree1.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(3, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
        // Clone tree1
    const tree1Clone = task.loadedMeshes[0].clone("tree1_clone", null);
    tree1Clone!.position = new Vector3(0, 0, 5);
  };

  const tree2 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_2.gltf"
  );
  tree2.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(0, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
        // Clone tree2
    const tree2Clone = task.loadedMeshes[0].clone("tree2_clone", null);
    tree2Clone!.position = new Vector3(-3, 0, 5);
  };

  const tree3 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_3.gltf"
  );
  tree3.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(-3, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree3
    const tree3Clone = task.loadedMeshes[0].clone("tree3_clone", null);
    tree3Clone!.position = new Vector3(3, 0, 5);
  };

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception
    );
  });
  return assetsManager;
}

export default function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    ground?: Mesh;
    camera?: Camera; 
    skybox?: Mesh;
   
  }

  let that: SceneData = { scene: new Scene(engine) };
  //that.scene.debugLayer.show();
  that.skybox = createSky(that.scene);
  that.light = createLight(that.scene);
  that.ground = createGround(that.scene);
  createTerrain(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  const assetsManager = addAssets(that.scene);
  assetsManager.load();
  return that;
}
