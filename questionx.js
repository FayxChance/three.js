import { GLTFLoader } from './js/GLTFLoader.js';


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
var tesla = null;
var curTime = Date.now();
var controls = null;

// This function is called whenever the document is loaded
export function init() {
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
    var mapDirtUrl = "images/dirt.jpg";
    var mapDirt = new THREE.TextureLoader().load(mapDirtUrl);
    var matDirt = new THREE.MeshPhongMaterial({map: mapDirt});
    var geo = new THREE.BoxGeometry(1, 1, 1);
    ovni = new THREE.Mesh(geo, matDirt);
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
    scene.add(solarSystem);

    const gltfLoader = new GLTFLoader();
    const url = './models/tesla/scene.gltf';
    gltfLoader.load(url, (gltf) => {
        tesla = gltf.scene;
        tesla.name = "tesla";
        tesla.scale.set(0.2, 0.2, 0.2);
        tesla.position.set(20, 0, 20);
        tesla.rotation.set(0, -80, 0);

        // Ces lignes servent à definir si on peut utiliser le systeme d'ombre sur tout les composant du modele donne
        // Nous les avons commentes car cela rendait ce modele plus taillé et moins joli
        // Si vous les decommentez, les ombres fonctionneront
        // tesla.traverse( function( node ) {
        //     if ( node.isMesh ) {
        //         node.castShadow = true;
        //         node.receiveShadow = true;
        //     }
        // });

        renderer.render(scene, camera);
        scene.add(tesla);
    });

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
export function run() {
    // Ask to call again run
    requestAnimationFrame(run);

    // Render the scene
    render();

    // Calls the animate function if objects or camera should move
    animate();
}

// This function is called regularly to take care of the rendering.
function render() {
    renderer.shadowMap.enabled = true;
    // rendu coûteux mais plus joli (default: THREE.PCFShadowMap)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    light.castShadow = true;
    // On peut aussi paramétrer la qualité du calcul
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;    // default
    light.shadow.camera.far = 50;
    mars.castShadow = true;
    mars.receiveShadow = true;
    ovni.castShadow = true;
    ovni.receiveShadow = true;

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


    if(tesla.position.x > 100) {
        tesla.position.x = -100;
        if(tesla.position.z < -20) tesla.position.z = 20;
        else tesla.position.z -= 1;
    }
    else tesla.position.x += 1;
}
