import * as THREE from 'three';

const scene = new THREE.Scene();

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetColors = [
  0xb1b1b1, 0xe5c07b, 0x2e70ff, 0xc1440e,
  0xd2b48c, 0xf5deb3, 0x7fffd4, 0x4169e1
];
const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
const orbitColors = [
  0x999999, 0xffcc00, 0x3399ff, 0xff3300,
  0xff9966, 0xffcc99, 0x66ffff, 0x3333ff
];

const planets = [];
const orbitSpeeds = [];

for (let i = 0; i < 8; i++) {
  const planetGeometry = new THREE.SphereGeometry(0.7 + i * 0.2, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: planetColors[i],
    roughness: 0.7,
    metalness: 0.2
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);
  planets.push({ mesh: planet, distance: 10 + i * 5 });
  orbitSpeeds.push(0.01 + i * 0.002);

  const orbitGeometry = new THREE.BufferGeometry();
  const segments = 150;
  const points = [];
  const radius = 10 + i * 5;
  for (let j = 0; j <= segments; j++) {
    const theta = (j / segments) * Math.PI * 2;
    points.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
  }
  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: orbitColors[i] });
  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  scene.add(orbit);
}

let isPaused = false;
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
});

function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    const time = Date.now() * 0.001;
    planets.forEach((planetObj, index) => {
      const distance = planetObj.distance;
      const angle = time * orbitSpeeds[index];
      planetObj.mesh.position.x = Math.cos(angle) * distance;
      planetObj.mesh.position.z = Math.sin(angle) * distance;
    });
  }
  renderer.render(scene, camera);
}
animate();
