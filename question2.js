      // Checks that your browser supports WebGL.
      if (!Detector.webgl) Detector.addGetWebGLMessage();

      var renderer = null;
      var scene = null;
      var camera = null;
      var sphere = null;
      var light = null;
      var cube = null;
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
        // Create a texture-mapped cube and add it to the scene
        // First, create the texture map
        var mapUrl = "images/sphere.jpg";
        var map = new THREE.TextureLoader().load(mapUrl);
        // Now, create a Basic material; pass in the map
        var material = new THREE.MeshBasicMaterial({ map: map });
        // Create the cube geometry
        var geometry = new THREE.SphereGeometry(2, 32, 32);
        // And put the geometry and material together into a mesh
        sphere = new THREE.Mesh(geometry, material);
        // Move the mesh back from the camera and tilt it toward the viewer
        sphere.position.z = -8;
        sphere.rotation.x = Math.PI / 5;
        sphere.rotation.y = Math.PI / 5;
        // Finally, add the mesh to our scene
        scene.add(sphere);

        // Cube phong material
        var mat = new THREE.MeshPhongMaterial({
            color: 0x0303ff,
            specular: 0xffffff
        });
        var geo = new THREE.BoxGeometry(2, 2, 2);
        cube = new THREE.Mesh(geo, mat);
        cube.position.x = 2;
        cube.position.y = 2;
        cube.position.z = -8;
        cube.rotation.y = Math.PI / 5;
        scene.add(cube);


        // Add a white point light
        light = new THREE.PointLight( 0xffffff, 1.5);
        light.position.x = 20;
        scene.add( light );
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
        // Example: rotation cube
        var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
        sphere.rotation.y += angle;
        cube.rotation.x += angle;
      }
