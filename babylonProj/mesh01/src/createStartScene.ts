//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    StandardMaterial,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Texture,
    Engine,
  } from "@babylonjs/core";
  
    function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );

     // Create a standard material
    const material = new StandardMaterial("sphereMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/bowling.webp", scene);

    // Assign the material to the cylinder
    sphere.material = material;

    sphere.position.x = 0;
    sphere.position.y = 1;

     // Rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Rotate the cone on each frame
    scene.registerBeforeRender(() => {
        sphere.rotation.y += rotationSpeed;
    });

    return sphere;
  }

  function createBox(scene: Scene) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.x = 3;
    box.position.y = 1;

     // Create a standard material

    const material = new StandardMaterial("boxMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/cardboard.jpg", scene);

    // Assign the material to the cylinder
    box.material = material;

     // Rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Rotate the cone on each frame
    scene.registerBeforeRender(() => {
        box.rotation.y += rotationSpeed;
    });

    return box;
  }

function createCylinder(scene: Scene) {
    // Create the cylinder
    const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, tessellation: 24 }, scene);

    // Position the cylinder
    cylinder.position = new Vector3(5, 1, 0);

    // Create a standard material
    const material = new StandardMaterial("cylinderMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/propane.jpg", scene);

    // Assign the material to the cylinder
    cylinder.material = material;

     // Rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Rotate the cone on each frame
    scene.registerBeforeRender(() => {
        cylinder.rotation.y += rotationSpeed;
    });

    return cylinder;
}

  function createCone(scene: Scene) {
    const cone = MeshBuilder.CreateCylinder("cone",{diameterTop:0, height:2, tessellation:24, arc:0.5}, scene);
    cone.position.x = 7;
    cone.position.y = 1;

    // Create a standard material
    const material = new StandardMaterial("coneMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/road-cone.jpg", scene);

    // Assign the material to the cylinder
    cone.material = material;

     // Rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Rotate the cone on each frame
    scene.registerBeforeRender(() => {
        cone.rotation.y += rotationSpeed;
    });
    return cone;

    
  }

 function createTriangle(scene: Scene) {
    const cone = MeshBuilder.CreateCylinder("tri", { height: 2, tessellation: 3 }, scene);
    cone.position.x = 9;
    cone.position.y = 1;

    // Create a standard material
    const material = new StandardMaterial("coneMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/prism.jpg", scene);

    // Assign the material to the cylinder
    cone.material = material;

    // Rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Rotate the cone on each frame
    scene.registerBeforeRender(() => {
        cone.rotation.y += rotationSpeed;
    });

    return cone;
}

  
  
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  

  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
    );

     // Create a standard material
    const material = new StandardMaterial("groundMat", scene);

    // Load a texture
    material.diffuseTexture = new Texture("./textures/concrete-.jpg", scene);

    // Assign the material to the cylinder
    ground.material = material;
    return ground;
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
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      sphere?: Mesh;
      cylinder?: Mesh;
      cone?: Mesh;
      triangle?: Mesh;
      light?: Light;
      
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    //that.scene.debugLayer.show();
  
    that.box = createBox(that.scene);
    that.sphere = createSphere(that.scene);
    that.cylinder = createCylinder(that.scene);
    that.cone = createCone(that.scene);
    that.triangle = createTriangle(that.scene);
    that.light = createLight(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }