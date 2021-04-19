const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = async function () {

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  var xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
          sessionMode: "immersive-ar",
      },
      optionalFeatures: true
  });

  const fm = xr.baseExperience.featuresManager;

  const xrTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

  const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
  marker.isVisible = false;
  marker.rotationQuaternion = new BABYLON.Quaternion();

  xrTest.onHitTestResultObservable.add((results) => {
      if (results.length) {
          marker.isVisible = true;
          hitTest = results[0];
          hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
      } else {
          marker.isVisible = false;
      }
  });

  return scene;

};

const pointerDown = function (mesh) {
  mesh.dispose();
};

var createObjects = function () {
  const boxes = [10];
  boxes.forEach(function (item, i) {
    item = BABYLON.MeshBuilder.CreateBox("box" + i, { size: 0.5 });
    item.position.x = i;
    item.position.y = i;
    item.isVisible = false;
    item.rotationQuaternion = new BABYLON.Quaternion();
  });
  return boxes;
};

const scene = createScene(); //Call the createScene function
