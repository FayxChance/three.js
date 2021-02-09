// Checks that your browser supports WebGL.
if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer = null;
var scene = null;
var camera = null;
var mars = null;
var light = null;
var ovni = null;
var sun = null;
var marsGroup = null;
var solarSystem = null;
var curTime = Date.now();
var controls = null;

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

    // Add background
    var path = "images/MilkyWay/";
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];
    var textureCube    = new THREE.CubeTextureLoader().load( urls );
    textureCube.format = THREE.RGBFormat;
    scene.background   = textureCube;

    // Sphere texture material
    var mapUrl = "images/sphere.jpg";
    var map = new THREE.TextureLoader().load(mapUrl);
    var material = new THREE.MeshPhongMaterial({ map: map });
    var geometry = new THREE.SphereGeometry(2, 32, 32);
    mars = new THREE.Mesh(geometry, material);
    mars.position.set(0, 0, 0);

    // Cube phong material
    var mat = new THREE.MeshPhongMaterial({
        color: 0x0303ff,
        specular: 0xffffff
    });
    var geo = new THREE.BoxGeometry(1, 1, 1);
    ovni = new THREE.Mesh(geo, mat);
    ovni.position.set(2, 1, 2);

    // First group
    marsGroup = new THREE.Group();
    marsGroup.position.set(5, 0, 10);
    marsGroup.add(mars);
    marsGroup.add(ovni);
    scene.add(marsGroup);

    var mapSunUrl = "images/sun.jpg";
    var mapSun = new THREE.TextureLoader().load(mapSunUrl);
    var matSun = new THREE.MeshBasicMaterial({map: mapSun});
    var geometrySun = new THREE.SphereGeometry(4, 32, 32);
    sun = new THREE.Mesh(geometrySun, matSun);
    sun.position.set(0, 0, 0);

    solarSystem = new THREE.Group();
    solarSystem.position.set(0, 0, 0);
    solarSystem.add(sun);
    solarSystem.add(marsGroup);
    scene.add(solarSystem)

    // Add a white point light
    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set(0, 0, 0);
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
    // Example: rotation ovni
    var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
    solarSystem.rotation.y += angle;
    marsGroup.rotation.y -= 2*angle;
    mars.rotation.y -= angle;
    ovni.rotation.y += 3*angle;
}
