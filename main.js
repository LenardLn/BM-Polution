const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Load Texture
const textureLoader = new THREE.TextureLoader();
const mapTexture = textureLoader.load("map-bg.webp");
const material = new THREE.MeshBasicMaterial({
  map: mapTexture,
  side: THREE.DoubleSide,
});

// Create Plane
const aspect = window.innerWidth / window.innerHeight;
const planeHeight = 5; // Adjust based on your image proportions
const planeWidth = planeHeight * aspect;

const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Position Camera
camera.position.z = 8;

// Animation
document.addEventListener("DOMContentLoaded", () => {
  const duration = 4000; // 4 seconds
  let startTime = null;

  function animateOnce(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalize [0,1]

    // Rotation: full 360°
    plane.rotation.z = Math.PI * 2 * t;

    // Scale: ease-in-out growth and shrink
    const scale = 1 + Math.sin(Math.PI * t); // Goes from 1 to 2 to 1
    plane.scale.set(scale, scale, 1);

    renderer.render(scene, camera);

    if (t < 1) {
      requestAnimationFrame(animateOnce);
    } else {
      // Reset to original transform
      plane.rotation.z = 0;
      plane.scale.set(1, 1, 1);
      plane.position.set(0, 0, 0);
    }
  }

  requestAnimationFrame(animateOnce);
});

// Responsive Resize
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

const locker = document.getElementById("cyanide-btn");
let triggered = false;

locker.onclick = () => {
  triggered = !triggered;

  if (triggered) {
    document.body.classList.add("screen-locker");
    document.body.style.paddingRight = getScrollbarWidth() + "px";
  } else {
    document.body.classList.remove("screen-locker");
    document.body.style.paddingRight = "";
  }
};

if (window.innerWidth < 1200) {
  locker.style.display = "block";
} else {
  locker.style.display = "none";
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);
