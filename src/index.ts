// https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_vrm.html
import * as THREE from "./three";

// Sass

import "./index.scss";

// Vrm

import calmeryVrm from "./Calmery.vrm";

// Helper Functions

const generateInputForMaterials = () => {
  const inputs = document.getElementById("inputs");

  [].slice.call(inputs.children).forEach((input: HTMLElement) => {
    inputs.removeChild(input);
  });

  Object.keys(state.materials).forEach(materialName => {
    const div = document.createElement("div");

    const label = document.createElement("span");
    label.innerHTML = materialName;

    const input = document.createElement("input");
    input.type = "file";
    input.onchange = event => {
      const file = (event.target as any).files[0];
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const loader = new THREE.TextureLoader();

        loader.load(fileReader.result, (texture: THREE.Texture) => {
          texture.flipY = false;
          state.materials[materialName] = texture;

          loadVrm(calmeryVrm);
        });
      };

      fileReader.readAsDataURL(file);
    };

    div.appendChild(label);
    div.appendChild(input);

    inputs.appendChild(div);
  });
};

// Main

const state = {
  vrm: null,
  materials: {}
};

// FIXME: とりあえず THREE.GLTFLoader で参照できるようにした
(window as any).state = state;

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
const loadVrm = (url: string) => {
  if (state.vrm !== null) {
    scene.remove(state.vrm.scene);
  }

  const materialNames = [];

  loader.load(url, (vrm: any) => {
    vrm.scene.traverse((object: any) => {
      if (object.material && Array.isArray(object.material)) {
        for (let i = 0; i < object.material.length; i++) {
          if (object.material[i].name.includes("CLOTH")) {
            materialNames.push(object.material[i].name);
          }
        }
      }
    });

    const materials = {};
    materialNames
      .filter((material, index) => materialNames.indexOf(material) === index)
      .forEach(materialName => {
        materials[materialName] = state.materials[materialName] || null;
      });

    state.materials = materials;
    state.vrm = vrm;

    generateInputForMaterials();

    scene.add(vrm.scene);
  });
};

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
document.getElementById("container").appendChild(renderer.domElement);

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

loadVrm(calmeryVrm);
animate();
