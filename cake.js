import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

const loader = new GLTFLoader();
loader.load(
  'cake.glb',
  function(gltf) {
    scene.add(gltf.scene);
    animate();
  },
  undefined,
  function(error) {
    console.error('Fehler beim Laden des Modells:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  if (scene.children.length) {
    scene.children[scene.children.length - 1].rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
