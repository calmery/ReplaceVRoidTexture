// https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_vrm.html
import * as THREE from "./three";

// Sass

import "./index.scss";

// Vrm

import calmeryVrm from "./Calmery.vrm";

// Main

const container = document.createElement("div");
document.body.appendChild(container);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.25,
  20
);
camera.position.set(0, 1.6, -2.2);

const controls = new THREE.OrbitControls(camera);
controls.target.set(0, 0.9, 0);
controls.update();

const scene = new THREE.Scene();
const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
light.position.set(0, 1, 0);
scene.add(light);

const loader = new THREE.VRMLoader();

loader.load(calmeryVrm, (vrm: any) => {
  vrm.scene.traverse((object: any) => {
    if (object.material) {
      if (Array.isArray(object.material)) {
        for (let i = 0, il = object.material.length; i < il; i++) {
          const material = new THREE.MeshBasicMaterial();
          THREE.Material.prototype.copy.call(material, object.material[i]);
          material.color.copy(object.material[i].color);
          material.map = object.material[i].map;
          material.lights = false;
          material.skinning = object.material[i].skinning;
          material.morphTargets = object.material[i].morphTargets;
          material.morphNormals = object.material[i].morphNormals;
          object.material[i] = material;
        }
      } else {
        const material = new THREE.MeshBasicMaterial();
        THREE.Material.prototype.copy.call(material, object.material);
        material.color.copy(object.material.color);
        material.map = object.material.map;
        material.lights = false;
        material.skinning = object.material.skinning;
        material.morphTargets = object.material.morphTargets;
        material.morphNormals = object.material.morphNormals;
        object.material = material;
      }
    }
  });
  scene.add(vrm.scene);
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
container.appendChild(renderer.domElement);
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
