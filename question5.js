// Checks that your browser supports WebGL.
if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer = null;
var scene = null;
var camera = null;
var earth = null;
var moon = null;
var sun = null;
var moonGroup = null;
var earthGroup = null;

var curTime = Date.now();

// This function is called whenever the document is loaded
function init() {
  // Get display canvas
  var canvas = document.getElementById("webglcanvas");
  console.log(canvas);

  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);
  // Create a new Three.js scene
  scene = new THREE.Scene();
  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.set(-25, 15 , -25);
  camera.lookAt(0,0,0);


  // Sphere texture material
  var mapUrl = "images/earth_atmos_2048.jpg";
  var map = new THREE.TextureLoader().load(mapUrl);
  var material = new THREE.MeshPhongMaterial({ map: map });
  var geometry = new THREE.SphereGeometry(2, 32, 32);
  earth = new THREE.Mesh(geometry, material);
  earth.position.set(0, 0, 0);

  // Cube phong material
  var mapUrl = "images/moon_1024.jpg";
  var map = new THREE.TextureLoader().load(mapUrl);
  var material = new THREE.MeshPhongMaterial({ map: map });
  var geometry = new THREE.SphereGeometry(1, 32, 32);
  moon = new THREE.Mesh(geometry, material);
  moon.position.set(2, 1, 2);

  // First group
  moonGroup = new THREE.Group();
  moonGroup.position.set(5, 0, 10);
  moonGroup.add(earth);
  moonGroup.add(moon);
  scene.add(moonGroup);

  var mapSunUrl = "images/sun.jpg";
  var mapSun = new THREE.TextureLoader().load(mapSunUrl);
  var matSun = new THREE.MeshBasicMaterial({map: mapSun});
  var geometrySun = new THREE.SphereGeometry(4, 32, 32);
  sun = new THREE.Mesh(geometrySun, matSun);
  sun.position.set(0, 0, 0);

  earthGroup = new THREE.Group();
  earthGroup.position.set(0, 0, 0);
  earthGroup.add(sun);
  earthGroup.add(moonGroup);
  scene.add(earthGroup)

  // Add a white point light
  light = new THREE.PointLight( 0xffffff, 1.5);
  light.position.set(0,0,0);
  scene.add( light );

  controls = new THREE.OrbitControls( camera, renderer.domElement );
            controls.maxPolarAngle = Math.PI * 0.5;
            controls.minDistance = 1;
            controls.maxDistance = 4000;
}

// This function is called regularly to update the canvas webgl.
function run() {
  // Ask to call again run
  requestAnimationFrame(run);

  // Render the scene
  render();

  // Calls the animate function if objects or camera should move
  animate();
}

// This function is called regularly to take care of the rendering.
function render() {
  // Render the scene
  renderer.render(scene, camera);
}

// This function is called regularly to update objects.
function animate() {
  // Computes how time has changed since last display
  var now = Date.now();
  var deltaTime = now - curTime;
  curTime = now;
  var fracTime = deltaTime / 1000; // in seconds
  // Now we can move objects, camera, etc.
  // Example: rotation sphere
  var angle = fracTime * Math.PI * 2;

    // Notez que l'axe y est l'axe "vertical" usuellement.
    sun.rotation.y += angle / 27;
    earthGroup.rotation.y += angle / 365; // la terre tourne en 365 jours
    earth.rotation.y      += angle; // et en un jour sur elle-même
    moonGroup.rotation.y  += angle / 28; // la lune tourne en 28 jours autour de la terre
    moon.rotation.y       += angle /28; // et en 28 jours aussi sur elle-même pour faire face à la terre
}
