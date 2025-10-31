// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
} from "@babylonjs/core";

// --- GEOMETRY CREATION FUNCTIONS ---

function createEllipsoid(scene: Scene) {
  const ellipsoid = MeshBuilder.CreateSphere(
    "ellipsoid",
    { diameter: 0.7, diameterY: 2, segments: 16 },
    scene
  );
  ellipsoid.position.x = 0;
  ellipsoid.position.y = 1;
  return ellipsoid;
}

function createBox(scene: Scene) {
  const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
  box.position.y = 3;
  return box;
}

function createCylinder(scene: Scene) {
  const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, height: 2 }, scene);
  cylinder.position.x = 5;
  cylinder.position.y = 1;
  return cylinder;
}

function createCone(scene: Scene) {
  const cone = MeshBuilder.CreateCylinder(
    "cone",
    { diameterTop: 0, diameterBottom: 1, height: 2 },
    scene
  );
  cone.position.x = 7;
  cone.position.y = 1;
  return cone;
}

function createTriangle(scene: Scene) {
  const triangle = MeshBuilder.CreateCylinder(
    "triangle",
    { diameter: 1, height: 2, tessellation: 3 },
    scene
  );
  triangle.position.x = 9;
  triangle.position.y = 1;
  return triangle;
}

function createCapsule(scene: Scene) {
  const capsule = MeshBuilder.CreateCapsule(
    "capsule",
    { radius : 0.5, height: 2, tessellation: 4, subdivisions:4 },
    scene
  );
  capsule.position.x = -3;
  capsule.position.y = 1;
  return capsule;
}


// --- LIGHTING, CAMERA, AND GROUND ---

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createSphere(scene: Scene) {
  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
  sphere.position.y = 1;
  return sphere;
}

function createGround(scene: Scene) {
  const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  return ground;
}

function createArcRotateCamera(scene: Scene) {
  const camAlpha = -Math.PI / 2;
  const camBeta = Math.PI / 2.5;
  const camDist = 10;
  const camTarget = new Vector3(0, 0, 0);
  const camera = new ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
  camera.attachControl(true);
  return camera;
}

// --- SCENE SETUP ---

export default function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    box?: Mesh;
    light?: Light;
    sphere?: Mesh;
    ellipsoid?: Mesh;
    cylinder?: Mesh;
    cone?: Mesh;
    triangle?: Mesh;
    capsule?: Mesh;
    ground?: Mesh;
    camera?: Camera;
  }

  const that: SceneData = { scene: new Scene(engine) };

  // that.scene.debugLayer.show();

  that.box = createBox(that.scene);
  that.light = createLight(that.scene);
  that.sphere = createSphere(that.scene);
  that.ellipsoid = createEllipsoid(that.scene);
  that.cylinder = createCylinder(that.scene);
  that.cone = createCone(that.scene);
  that.triangle = createTriangle(that.scene);
  that.capsule = createCapsule(that.scene);
  that.ground = createGround(that.scene);
  that.camera = createArcRotateCamera(that.scene);

  return that;
}
