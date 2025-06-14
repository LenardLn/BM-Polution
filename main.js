const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Set camera position depending on screen size
camera.position.z = window.innerWidth < 600 ? 5 : 8;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio || 1); // Handle device pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight);

// Load Texture
const textureLoader = new THREE.TextureLoader();
const mapTexture = textureLoader.load("map-bg.webp");
const material = new THREE.MeshBasicMaterial({
  map: mapTexture,
  side: THREE.DoubleSide,
});

// Adjust the plane size for mobile devices
const updatePlaneSize = () => {
  const aspect = window.innerWidth / window.innerHeight;

  let planeWidth, planeHeight;

  if (window.innerWidth < 600) {
    // For mobile, stop the map horizontally (use fixed dimensions)
    planeWidth = 5; // Fixed width for mobile
    planeHeight = planeWidth / aspect; // Maintain the correct ratio
  } else {
    // For larger screens, use responsive behavior
    planeHeight = 5; // Adjust height
    planeWidth = planeHeight * aspect; // Responsive width based on aspect ratio
  }

  // Create or update the plane geometry with the new size
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  plane.geometry = geometry; // Reassign geometry to update the plane

  // Reposition the plane and camera if needed
  plane.position.set(0, 0, 0);
};

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
scene.add(plane);

// Function to check if the device is mobile
const isMobile = () => {
  return window.innerWidth < 600;
};

// Update canvas background and visibility for mobile devices
const updateCanvasVisibility = () => {
  if (isMobile()) {
    canvas.style.backgroundColor = "transparent"; // Set background to transparent for mobile
    canvas.style.display = "none"; // Hide canvas on mobile if you don't want it to render
  } else {
    canvas.style.display = "block"; // Show canvas on desktop
    canvas.style.backgroundColor = "transparent"; // Ensure the background is transparent on desktop
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updatePlaneSize(); // Set initial size of the plane
  updateCanvasVisibility(); // Update canvas visibility based on the screen size
  requestAnimationFrame(animateOnce);
});

// Handle window resizing (responsive scaling)
window.addEventListener("resize", () => {
  // Update camera aspect ratio and size of the renderer
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Adjust plane size based on the new aspect ratio
  updatePlaneSize();

  // Adjust canvas visibility on window resize
  updateCanvasVisibility();
});

// Adjust the camera position dynamically
if (window.innerWidth < 600) {
  camera.position.z = 5; // Closer for mobile screens
} else {
  camera.position.z = 8; // Standard for larger screens
}
