import { GLTFLoader } from './js/GLTFLoader.js';

export function loadModel() {
    // loader = new GLTFLoader();
    // console.log(loader);
    // loader.load('./models/draft/scene.gltf', function(gltf) {
    //     scene.add(gltf.scene);
    // }, undefined, function(error) {
    //     console.error(error);
    // });

    const gltfLoader = new GLTFLoader();
    const url = './models/tesla/scene.gltf';
    gltfLoader.load(url, (gltf) => {
        const root = gltf.scene;
        root.scale.set(0.2, 0.2, 0.2);
        root.position.set(10, 10, 10);
        renderer.render(scene, camera);
        scene.add(root);
    });
};