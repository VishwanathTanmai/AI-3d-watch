
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Watch Base
const geometry = new THREE.CylinderGeometry(2, 2, 0.5, 64);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x555555,
    metalness: 0.9,
    roughness: 0.2,
    reflectivity: 0.8,
});
const watchBase = new THREE.Mesh(geometry, material);
scene.add(watchBase);

// Watch Screen
const screenGeometry = new THREE.BoxGeometry(3.5, 2.5, 0.2);
const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x101010, emissiveIntensity: 0.5 });
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.y = 0.3;
scene.add(screen);

// Strap
const strapGeometry = new THREE.BoxGeometry(0.5, 8, 0.2);
const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
const strap = new THREE.Mesh(strapGeometry, strapMaterial);
strap.position.set(0, -4, 0);
scene.add(strap);

// Dashboard Animation
const dashboardTexture = new THREE.CanvasTexture(document.createElement('canvas'));
const ctx = dashboardTexture.image.getContext('2d');
dashboardTexture.image.width = 512;
dashboardTexture.image.height = 512;
dashboardTexture.needsUpdate = true;

function updateDashboard() {
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.8)';
    ctx.arc(256, 256, 100 + Math.sin(Date.now() * 0.005) * 20, 0, Math.PI * 2);
    ctx.fill();
    dashboardTexture.needsUpdate = true;
}
setInterval(updateDashboard, 50);

// Apply Dashboard Texture
screen.material.map = dashboardTexture;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Watch Rotation
    watchBase.rotation.y += 0.005;

    // Dashboard Updates
    updateDashboard();

    renderer.render(scene, camera);
}
animate();

// Camera Position
camera.position.set(0, 5, 10);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();
