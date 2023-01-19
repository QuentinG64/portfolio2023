import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes helper if needed, uncomment
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
/**
 * Models
 */

const gltfLoader = new GLTFLoader();

const hand = new THREE.Group();
const david = new THREE.Group();

// gltfLoader.load("/models/hand/scene.gltf", (gltf) => {
//   gltf.scene.scale.set(2.7, 2.7, 2.7);
//   gltf.scene.rotation.set(0, 83.7, 0);
//   gltf.scene.position.set(0, -0.65, 0);
//   hand.add(gltf.scene);
//   scene.add(hand);
// });

gltfLoader.load("https://sandbox.dsply.fr/quentin/avatar_wireframe/autoportraitv2.gltf", (gltf) => {
  gltf.scene.scale.set(2.9, 2.9, 2.9);
  gltf.scene.rotation.set(0, 1.5, -0.01);
  gltf.scene.position.set(0, -0.3, 0);
  david.add(gltf.scene);
  david.traverse((node) => {
    if (!node.isMesh) return;
    node.material.wireframe = true;
  });
  scene.add(david);
});

/**
 * Lights
 */

const backLight = new THREE.PointLight(0xffffff, 3, 20);
backLight.position.set(-5, 5, -5);
scene.add(backLight);

const fillLight = new THREE.PointLight(0xffffff, 0.7, 20);
fillLight.position.set(-5, 0, 5);
scene.add(fillLight);

const keyLight = new THREE.PointLight(0xffffff, 2, 20);
keyLight.position.set(5, 0, 0);
scene.add(keyLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-0.9, 1, 1);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0.75, 0);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x040404);

/**
 * Animate
 */

let viewMouseX = 0;
let viewMouseY = 0;
window.addEventListener("mousemove", (event) => {
  let mouseY = event.clientY;
  let mouseX = event.clientX;
  viewMouseY = mouseY / sizes.height - 0.5;
  viewMouseX = mouseX / sizes.width - 0.5;
});

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  camera.lookAt(scene.position);
  // Hand animation
  // hand.rotation.y = viewMouseX * 3;
  // hand.rotation.x = viewMouseY * 1.5;

  // David animation
  // david.rotation.y = viewMouseX * 0.3;
  david.rotation.y = elapsedTime * 0.3;
  // david.rotation.x = viewMouseY * 0.2;
  backLight.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const lightAngle = -elapsedTime * 0.32;

  fillLight.position.x = Math.cos(lightAngle) * viewMouseX;
  fillLight.position.y = Math.sin(lightAngle) * viewMouseY;

  backLight.position.x = Math.cos(lightAngle) * 3;
  backLight.position.y = Math.sin(lightAngle) * 1.5;

  keyLight.position.x = Math.cos(lightAngle) * 5;
  keyLight.position.y = Math.sin(lightAngle) * 5;

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
