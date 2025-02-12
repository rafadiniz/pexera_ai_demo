///// IMPORT
import './main.css';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import {AsciiEffect}  from 'three/examples/jsm/effects/AsciiEffect.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader.js';
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// import { log } from 'three/src/nodes/TSL.js';
// import {textG} from './textG.js';

let camera, controls, scene, renderer, composer;
let textMov = new THREE.Mesh;
let arcade = new THREE.LineSegments;
let arcadeMov = false;
let textGameOver = new THREE.LineSegments;
let textProjetos = new THREE.LineSegments;
let textContato = new THREE.LineSegments;
let textDiretores = new THREE.LineSegments;

let rocketLS = new THREE.LineSegments;
let cactusLS = new THREE.LineSegments;
let cactusMov = false;
let skullLS = new THREE.LineSegments;
let skullMov = false;
let chapadaLS = new THREE.LineSegments;
let ascii;
//let controls = new OrbitControls;

// Perlin noise setup
const perlin = new ImprovedNoise();
let ty = 0.0;
let tz = 0.0;

let viewArcade = false;

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', renderAscii);

const home = document.getElementById( 'home' );
home.addEventListener( 'click', introAnimation);

///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div');
document.body.appendChild(container);


///// SCENE CREATION
scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(10, 154, 244)');
//scene.fog = new THREE.FogExp2('rgb(247, 11, 212)',0.04);

///// RENDERER CONFIG
renderer = new THREE.WebGLRenderer({ antialias: true}); // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding; // set color encoding
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
//renderer.setAnimationLoop( renderLoop,introAnimation);
container.appendChild(renderer.domElement); // add the renderer to html div


///// CAMERAS CONFIG
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(10,15,-70);
camera.rotateY(Math.PI*0.9);
scene.add(camera);

///// scene lights
const ambient = new THREE.AmbientLight('rgb(155, 157, 158)', 0.12);
ambient.castShadow = true;
scene.add(ambient);

const sunLight = new THREE.PointLight('rgba(251, 248, 248, 0.95)', 3.8);
sunLight.castShadow = true;
sunLight.position.set(0,2,-5);
scene.add(sunLight);

// postprocessing

composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const filmPass = new FilmPass(
  2.85, // noise intensity
  0.8,  // scanline intensity
  8,  // scanline count
  false // false to keep colors
);

composer.addPass(filmPass);

const shaderBleach = BleachBypassShader;
const effectBleach = new ShaderPass( shaderBleach );
effectBleach.uniforms[ 'opacity' ].value = 0.50;
composer.addPass(effectBleach);


//const effect1 = new DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 10.8 );;
// effect1.uniforms[ 'scale' ].value = 4;
//composer.addPass( effect1 );

const effect2 = new ShaderPass( RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0050;
effect2.uniforms[ 'angle' ].value = 90;
composer.addPass( effect2 );

///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    composer.setSize( window.innerWidth, window.innerHeight );
})

 // CSS2DRenderer for HTML content
 const labelRenderer = new CSS3DRenderer();
 labelRenderer.setSize(window.innerWidth, window.innerHeight);
 labelRenderer.domElement.style.position = 'absolute';
 labelRenderer.domElement.style.top = '0';
 document.body.appendChild(labelRenderer.domElement);


///// orbit controls
// controls = new OrbitControls(camera, renderer.domElement);
// controls.object.position.set(0,0,-80);


//FP controls
controls = new FirstPersonControls(camera, renderer.domElement);
				controls.movementSpeed = 10;
				controls.lookSpeed = 0;
				controls.lookVertical = true;
        controls.enableZoom = false;



// const effect3 = new OutputPass();
// composer.addPass( effect3 );


///// grid ground 
const grid1 = new THREE.GridHelper( 200, 20, 0x444444, 0x444444 );
grid1.rotation.z = Math.PI * 0.5;
//scene.add(grid1 );

const grid2 = new THREE.GridHelper( 200, 20, 'rgb(154, 152, 152)','rgb(121, 118, 118)' );
scene.add( grid2 );

const grid3 = new THREE.GridHelper( 400, 30, 'rgb(135, 131, 131)','rgb(134, 129, 129)' );
grid3.position.set(0,0,40)
grid3.rotation.x = Math.PI * 0.5;
scene.add(grid3);


// // Create a plane geometry
// const geometry = new THREE.PlaneGeometry(1, 1); // width, height
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Green plane
// const plane = new THREE.Mesh(geometry, material);
// // Add the plane to the scene
// scene.add(plane);

// Mouse and raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickableArcade = []; // Array to store objects that can be clicked
let clickableCactus = [];
let clickableSkull = []; 
let clickableChapada = [];
let clickableLinks = [];
let clickableProjetos = [];


// const video = document.createElement('video');
// video.src = 'video/v1.mp4'; // Change to your video file
// video.crossOrigin = 'anonymous'; // Enable cross-origin video loading
// video.loop = true;
// video.muted = true;
// video.autoplay = true;
// video.playsInline = true; // Required for mobile autoplay
// video.load();
// video.play();

//document.body.appendChild(video);

// Create Video Texture
// const videoTexture = new THREE.VideoTexture(video);
// videoTexture.minFilter = THREE.LinearFilter;
// videoTexture.magFilter = THREE.LinearFilter;
// videoTexture.format = THREE.RGBAFormat;

// // Create Material and Plane
// const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, opacity: 0.3 });
// const geometryS = new THREE.PlaneGeometry( 1.4, 1.4);
// const planeVideo = new THREE.Mesh( geometryS, videoMaterial);
// //clickableLinks.push(planeScreen);
// planeVideo.visible = false;
// planeVideo.position.set(-10, 0, 30);
// planeVideo.rotateY(Math.PI * 0.9);
// scene.add(planeVideo); 

// Create a canvas to draw the webpage
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;


const iframe = document.createElement('iframe');
//function iframeProjetos(){
  iframe.src = 'https://www.youtube.com/embed/D033sL9lq8U'; // Replace with the desired URL
  iframe.style.position = 'absolute';
  iframe.style.width = canvas.width/5 + 'px';
  iframe.style.height = canvas.height/5 + 'px';
  iframe.style.border = 'none';
  iframe.style.display = 'none';
  //document.body.appendChild(iframe);

  
//}
//iframeProjetos();


// Create HTML content
const htmlContent = document.createElement('div');
htmlContent.innerHTML = '<h1>Projeto 1</h1> <p>Aq vem o texto do projeto bem bonitino direitinho falando do projeto </p>';
htmlContent.style.color = 'rgb(255,0,0)';
htmlContent.style.backgroundColor = 'rgba(0,0,0,0.6)';
htmlContent.style.padding = '10px';

// Create a CSS2DObject and add it to the scene
const label = new CSS3DObject(htmlContent);
label.position.set(-8.5,5, 30);
label.scale.set(0.1,0.1,0.1);
label.visible = false; 
//scene.add(label);

const videoProjeto1 = new CSS3DObject(iframe);
videoProjeto1.position.set(-8.5,3, 30);
videoProjeto1.scale.set(0.1,0.1,0.1);
videoProjeto1.rotateY(Math.PI * 0.9);
videoProjeto1.visible = false; 
//scene.add(videoProjeto1);


const loaderH = new THREE.FileLoader();
let cssProjeto1;
loaderH.load(
  'pag/video.html', // Replace with the path to your HTML file
  function (data) {
    // Create a container for the loaded HTML
    const div = document.createElement('div');
    div.innerHTML = data;
    div.style.position = 'absolute';
    div.style.color = 'rgb(19, 18, 18)';
    div.style.fontSize = '40px';
    div.style.backgroundColor = 'rgba(12, 207, 241, 0.8)';
    div.style.padding = '10px';

    // Create a CSS3DObject and add it to the scene
    const cssObject = new CSS3DObject(div);
    cssObject.position.set(-9, 0, 25);
    cssObject.scale.set(0.005, 0.005, 0.005); // Adjust scale as needed
    cssObject.rotateY(Math.PI * 0.9);
    cssObject.visible = false;
    scene.add(cssObject);

    cssProjeto1 = cssObject;

    //document.body.appendChild(div);
  },
  undefined,
  function (err) {
    console.error('An error occurred while loading the HTML file:', err);
  }
);



// const totalFrames = 600;
// const images = [];
// const loader = new THREE.TextureLoader();

// for (let i = 1; i <= totalFrames; i++) {
//   let filename = `video/v1/f_${String(i).padStart(5, '0')}.png`; // Adjust based on your naming convention
//   images.push(loader.load(filename));
// }


// and this is example code to get it to be on a plane
const loaderImg = new THREE.TextureLoader().load('img/sertao1.jpg');
const geometryNE = new THREE.PlaneGeometry( 250, 120);
const materialNE = new THREE.MeshBasicMaterial( { map: loaderImg, transparent: true, opacity: 0.2 });
const planeNE = new THREE.Mesh( geometryNE, materialNE);
//clickableLinks.push(planeScreen);
planeNE.visible = true;
planeNE.position.set(-10, 4, 80);
planeNE.rotateY(Math.PI * 0.9);
scene.add(planeNE); 

const tvimg = document.createElement('img');
tvimg.src = 'img/tv2.jpg'

tvimg.style.position = 'fixed';
tvimg.style.width = window.innerWidth + 'px';
tvimg.style.height = window.innerHeight + 'px';
tvimg.style.border = 'none';
tvimg.style.paddingLeft = '0px';
tvimg.style.paddingTop = '0px';
tvimg.style.opacity = 0.0;
//document.body.appendChild(tvimg);


let secProjetos = [];
function planeImage3D(nome, x, y){
  //clickableLinks.push(planeScreen);
  const textureSec = new THREE.TextureLoader().load( nome );
  // and this is example code to get it to be on a plane
  const geometrySec = new THREE.PlaneGeometry( 2.5, 2.5);
  const materialSec = new THREE.MeshBasicMaterial( { map: textureSec, transparent: true, opacity: 0.8 });
  const planeScreen = new THREE.Mesh( geometrySec, materialSec);
  
  planeScreen.visible = false;
  planeScreen.position.set(x, y, 30);
  planeScreen.rotateY(Math.PI * 0.9);
  secProjetos.push(planeScreen);

  //console.log(secProjetos);

  return planeScreen;
  
}

let wireProjetos = [];
function wireGreen(x, y){

  // Create an EdgesGeometry from the plane geometry
  const geometrySec = new THREE.PlaneGeometry( 2.5, 2.5);
  const edgesGeometry = new THREE.EdgesGeometry(geometrySec);
  const lineMaterial = new THREE.LineBasicMaterial( {color:'rgb(0,255,0)' });
  const wireframe = new THREE.LineSegments(edgesGeometry, lineMaterial);
  wireframe.position.set(x, y, 30);
  wireframe.rotateY(Math.PI * 0.9);
  wireframe.visible = false;
  wireProjetos.push(wireframe);
  //scene.add(wireframe);

  return wireframe;
  
}


 // Diretores
 const geometryS = new THREE.PlaneGeometry( 12, 6);
 const edgesGeometry = new THREE.EdgesGeometry(geometryS);
 const lineMaterial = new THREE.LineBasicMaterial( {color:'rgb(0,255,0)' });
 const wireframe = new THREE.LineSegments(edgesGeometry, lineMaterial);
 wireframe.position.set(-10, -7, 30);
 wireframe.rotateY(Math.PI * 0.9);
 //scene.add(wireframe);


 // contato
 const geometryC = new THREE.PlaneGeometry( 6, 8);
 const edgesGeometryC = new THREE.EdgesGeometry(geometryC);
 const lineMaterialC = new THREE.LineBasicMaterial( {color:'rgb(0,255,0)' });
 const wireframeC = new THREE.LineSegments(edgesGeometryC, lineMaterialC);
 wireframeC.position.set(0, 0, 30);
 wireframeC.rotateY(Math.PI * 0.9);
 //scene.add(wireframeC);


// Function to create a text mesh
let textMeshes = [];
function createTextMesh(text, font, x, y) {
  const geometry = new TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0, // No extrusion
  });

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.position.set(x,y,30);
  mesh.rotation.y = Math.PI * 0.9;

  // Add the mesh to the array
  textMeshes.push(mesh);

  return mesh;
}

// Example usage inside the font loader callback

let selProjetos = [];
const loaderF = new FontLoader();
loaderF.load('fonts/Jersey 15_Regular.json', function (font) {
  const text1 = createTextMesh('projeto1', font,-8.5,4);
  const img1 = planeImage3D('img/t.png',-10,4);
  selProjetos.push(img1);
  const wf1 = wireGreen(-10,4);
  
  const text2 = createTextMesh('projeto2', font,-8.5,1);
  const img2 = planeImage3D('img/t2.png',-10,1);
  const wf2 = wireGreen(-10,1);
  
  const text3 = createTextMesh('projeto3', font,-8.5,-2);
  const img3 = planeImage3D('img/t3.png',-10,-2);
  const wf3 = wireGreen(-10,-2);

  // Add meshes to the scene
  scene.add(text1);
  scene.add(img1);
  scene.add(wf1);

  scene.add(text2);
  scene.add(img2);
  scene.add(wf2);

  scene.add(text3);
  scene.add(img3);
  scene.add(wf3);
});

// Iterate over the text meshes array
textMeshes.forEach((mesh) => {
  mesh.visible = false;
});
secProjetos.forEach((mesh) => {
  mesh.visible = false;
});
wireProjetos.forEach((mesh) => {
  mesh.visible = false;
});
    
// textDisplay('projeto1',-8.5,4);
// planeImage3D('img/t.png',-10,4);
  
// textDisplay('projeto2',-8.5,1)
// planeImage3D('img/t2.png',-10,1);

// textDisplay('projeto3',-8.5,-2)
// planeImage3D('img/t3.png',-10,-2);


// textDisplay('projeto4',-12,4)
// planeImage3D('img/t.png',-13.5,4);
  
// textDisplay('projeto5',-12,1)
// planeImage3D('img/t2.png',-13.5,1);

// textDisplay('projeto6',-12,-2)
// planeImage3D('img/t3.png',-13.5,-2);

// secProjetos.addEventListener( 'click', displaySecProjetos);
// secProjetos.addEventListener( 'click', projetosSel);

// secDiretores.addEventListener( 'click', imgProjetos);
// if(iimg){
//   iimg.remove();
// }
// secDiretores.addEventListener( 'click', diretoresSel);

// secContato.addEventListener( 'click', iframeProjetos);
// secContato.addEventListener( 'click', contatoSel);

// // Create a CanvasTexture from the canvas
// const linkTexture = new THREE.CanvasTexture(canvas);
// let linkmaterial = new THREE.MeshBasicMaterial({ map: linkTexture });


// Load a font and create TextGeometry
const loadFont = new FontLoader();
loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
    const textGeometry = new TextGeometry('pexera', {
        font: font,
        size: 0.3,
        height: 0.0,
        opacity: 0.3,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.002,
        bevelSegments: 1,
    });
    // Create wireframe geometry
    const wireframeGeometry = new THREE.WireframeGeometry(textGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 'rgb(248, 12, 12)'});
    const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      
    wireframeMesh.geometry.center();
    textMov = wireframeMesh;
  
    // Position and add to scene
    wireframeMesh.position.set(0.38, 1.9, -1);
    wireframeMesh.rotation.y = Math.PI * 0.9
    scene.add(textMov);

});

let tvColor;
const loaderG = new GLTFLoader().setPath( 'models/tv1/' );
loaderG.load( 'scene.gltf', async function ( gltf ) {

  const model = gltf.scene;
  arcade = model;
  arcade.scale.set(1.5,1.5,1.5);
  arcade.position.set(-0.4,0.5,1);
  arcade.rotation.y = Math.PI * 0.3;
  //arcade.rotation.x = Math.PI * 0.5;

  // model.traverse((child) => {
  //   if (child.isMesh) {
  //       console.log(child.name); // Log object names
  //       child.material.color.set('rgb(250, 248, 248)'); // Change color to Red
  //   }
  //});

  clickableArcade.push(arcade);
  scene.add(arcade);


} );
  ///// loading arcade fbx model
  // const loader = new GLTFLoader();
  // loader.load( 'models/tv1/scene.gltf',  function (object) {
  //     object.traverse(function (child) {
  //       if (child.isMesh) {
  //          // Add mesh to clickable objects
  //         const wireframe = new THREE.WireframeGeometry(child.geometry);
  //         const lineMaterial = new THREE.LineBasicMaterial({
  //       color: 'rgb(31, 248, 11)', // Set the color (e.g., red)
  //       depthTest: true, // Ensures wireframe is always visible
  //       opacity: 0.6, // Adjust transparency
  //       transparent: true,
  //       });
  //     const line = new THREE.LineSegments(wireframe,lineMaterial);
  //     wireframe.scale(2,2,2);
  //     //skeleton = child.skeleton;
  //     line.position.set(-0.6,0.4,1);
  //     line.rotation.y = Math.PI * 0.9;
  //     //line.rotation.x = Math.PI * 0.5
      
  //     arcade = object;
  //     arcade.scale.set(0.01,0.01,0.01);
  //     arcade.position.set(-0.6,-2,1);
  //     //arcade.rotation.y = Math.PI * 0.9;
  //     //arcade.rotation.x = Math.PI * 0.5;
  //     //arcade.castShadow = true;
     
  //     //console.log('Model loaded and clickable:', arcade);
  //     //scene.add(line);
  //     scene.add(arcade);

    
  //     clickableArcade.push(arcade);

  //       }
  //     });

      
  //   },
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  //     //assetCount = xhr.loaded / xhr.total * 100;
  //   },
  //   function (error) {
  //     console.error('An error occurred:', error);
  //   }
  // );


  loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
      const textGeometry = new TextGeometry('GAME OVER', {
          font: font,
          size: 0.25,
          height: 0.0,
          opacity: 0.2,
          curveSegments: 2,
          bevelEnabled: false,
          bevelThickness: 0.01,
          bevelSize: 0.02,
          bevelSegments: 1,
      });
      // Create wireframe geometry
      const wireframeGeometry = new THREE.WireframeGeometry(textGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({ color: 'rgba(0,0,0,0.2)'});
      const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        
      wireframeMesh.geometry.center();
      textGameOver = wireframeMesh;
      textGameOver.visible = true;
    
      // Position and add to scene
      textGameOver.position.set(0.0, 0.5, 0);
      textGameOver.rotation.y = Math.PI * 0.9
      clickableSkull.push(textGameOver); 
      //scene.add(textGameOver);

  });

  
let clickProjetos = [];
let clickDiretores = [];
let clickContato = [];


loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
  const textGeometry = new TextGeometry('PROJETOS', {
      font: font,
      size: 0.7,
      height: 0.0,
      opacity: 0.2,
      curveSegments: 2,
      bevelEnabled: false,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelSegments: 1,
  });
 
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textProjetos = textMesh;
  textProjetos.visible = false;

  // Position and add to scene
  textProjetos.position.set(-6.1, 5, 28);
  textProjetos.rotation.y = Math.PI * 0.9
  clickProjetos.push(textProjetos);
  scene.add(textProjetos);

});


  loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
    const textGeometry = new TextGeometry('DIRETORES', {
        font: font,
        size: 0.7,
        height: 0.0,
        opacity: 0.2,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 1,
    });

   
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
    textDiretores = textMesh;
    textDiretores.visible = false;
  
    // Position and add to scene
    textDiretores.position.set(0, 5, 28);
    textDiretores.rotation.y = Math.PI * 0.9
    scene.add(textDiretores);

});


  loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
    const textGeometry = new TextGeometry('CONTATO', {
        font: font,
        size: 0.7,
        height: 0.0,
        opacity: 0.2,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textContato = textMesh;
    textContato.visible = false;
  
    // Position and add to scene
    textContato.position.set(5, 5, 28.0);
    textContato.rotation.y = Math.PI * 0.9
    scene.add(textContato);

  });

  
  let back;
  loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
    const textGeometry = new TextGeometry('<', {
        font: font,
        size: 0.4,
        height: 0.0,
        opacity: 0.2,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 'rgb(0,200,0)' }); // Red color
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    back = textMesh;
    back.visible = false;
  
    // Position and add to scene
    back.position.set(-5.3, 1, 20.0);
    back.rotation.y = Math.PI * 0.9
    scene.add(back);

  });

  let forward;
  loadFont.load('fonts/Jersey 15_Regular.json', (font) => {
    const textGeometry = new TextGeometry('>', {
        font: font,
        size: 0.4,
        height: 0.0,
        opacity: 0.2,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 'rgb(0,200,0)' }); // Red color
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    forward = textMesh;
    forward.visible = true;
  
    // Position and add to scene
    forward.position.set(controls.object.position.x, controls.object.position.x, controls.object.position.z+20);
    //forward.rotation.y = Math.PI * 0.9
    //scene.add(forward);

  });



  //// loading cactus model
  const loadCactus = new FBXLoader();
  loadCactus.load( 'models/cactus.fbx',  function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          const wireframe = new THREE.WireframeGeometry(child.geometry);
          const lineMaterial = new THREE.LineBasicMaterial({
        color: 'rgb(242, 13, 238)', 
        depthTest: true, // Ensures wireframe is always visible
        opacity: 0.2, // Adjust transparency
        transparent: true,
        });
      const line = new THREE.LineSegments(wireframe,lineMaterial);
      
      wireframe.scale(0.3,0.3,0.3);
      line.position.set(-8,2,38);
      //line.rotation.x = Math.PI * 0.5
      //line.rotation.y = Math.PI * 0.2
      //line.rotation.z = Math.PI / 2
      
      cactusLS = line;
      cactusLS.visible = false;

      clickableCactus.push(cactusLS);
      scene.add(cactusLS);

        }
      });

      
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      //assetCount = xhr.loaded / xhr.total * 100;
    },
    function (error) {
      console.error('An error occurred:', error);
    }
  );

  //// loading goatskull model
  const loadGoat = new FBXLoader();
  loadGoat.load( 'models/goat_skull.fbx',  function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          const wireframe = new THREE.WireframeGeometry(child.geometry);
          const lineMaterial = new THREE.LineBasicMaterial({
        color: 'rgb(253, 8, 237)', 
        depthTest: true, // Ensures wireframe is always visible
        opacity: 0.2, // Adjust transparency
        transparent: true,
        });
      const line = new THREE.LineSegments(wireframe,lineMaterial);
      
      //wireframe.scale(0.08,0.08,0.08);
      line.position.set(5,-3,38);

      line.rotation.x = Math.PI * -0.5
      //line.rotation.y = Math.PI * 0.5
      line.rotation.z = Math.PI * -0.2

      skullLS = line;
      skullLS.geometry.scale(0.15,0.15,0.15);
      skullLS.visible = false;
    
      //clickableSkull.push(skullLS); 

      scene.add(skullLS);

        }
      });

      
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      //assetCount = xhr.loaded / xhr.total * 100;
    },
    function (error) {
      console.error('An error occurred:', error);
    }
  );


  //// loading chapada model
  const loadMontanha = new FBXLoader();
  loadMontanha.load( 'models/chapada.fbx',  function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          const wireframe = new THREE.WireframeGeometry(child.geometry);
          const lineMaterial = new THREE.LineBasicMaterial({
        color: 'rgb(104, 101, 101)', 
        depthTest: true, // Ensures wireframe is always visible
        opacity: 0.5, // Adjust transparency
        transparent: true,
        });
      const line = new THREE.LineSegments(wireframe,lineMaterial);
      chapadaLS = line;
      clickableChapada.push(line);
      
      wireframe.scale(1,1,1);
      line.position.set(-18,-27,4);
      line.rotation.x = Math.PI * -0.5
      //line.rotation.y = Math.PI * 0.5
      line.rotation.z = Math.PI * -0.2

      scene.add(line);

        }
      });

      
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      //assetCount = xhr.loaded / xhr.total * 100;
    },
    function (error) {
      console.error('An error occurred:', error);
    }
  );


  //ascii effect
  function renderAscii(){
  
    const overlay = document.getElementById( 'overlay' );
    overlay.remove();
    // ascii = new AsciiEffect(renderer, 'dx$#@as0_)Sdias99-',{invert: true});
    // ascii.setSize(window.innerWidth,window.innerHeight);
    // ascii.domElement.style.fontSize = '2px';
    // ascii.domElement.style.fontFamily = '"Inconsolata", monospace';
    // ascii.domElement.style.color = 'black';
    // ascii.domElement.style.backgroundColor = 'white';
    // document.body.appendChild(ascii.domElement);
    
    
    renderLoop();
    introAnimation();
    //document.body.appendChild(iframe);
  }

// Define start and end colors
const startColor = new THREE.Color('rgba(10, 154, 244, 0.9)'); // Red
const endColor = new THREE.Color('rgb(11, 16, 59)');   // Blue
const colorParams = {r: startColor.r, g: startColor.g, b: startColor.b };

let arcadeTrans = false;
let freeCamera = false;
//// INTRO CAMERA ANIMATION USING TWEEN
function introAnimation() {
    
    //sections.style.display = 'none';
    tvimg.style.opacity = 0.0;
    freeCamera = false
    //scene.background = new THREE.Color('rgb(242, 199, 156)');
    controls.enabled = false; //disable orbit controls to animate the camera
    
    new TWEEN.Tween(camera.position.set(camera.position.x,camera.position.y,camera.position.z)).to({ // from camera position
        x: 3.3, //desired x position to go
        y: 0, //desired y position to go
        z: -10 //desired z position to go 
    }, 3000) // time take to animate
    .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
    .onComplete(function () { //on finish animation
        controls.enabled = true; //enable orbit controls
        setOrbitControlsLimits(); //enable controls limits
        interact();
        TWEEN.remove(this); // remove the animation from memory
        arcadeTrans = false;
    })
  
    // Set up the tween
    new TWEEN.Tween(colorParams)
    .to({ r: startColor.r, g: startColor.g, b: startColor.b }, 1000)
    .delay(2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      // Update the scene's background color
      scene.background = new THREE.Color(colorParams.r, colorParams.g, colorParams.b);
    })
    .start()
    .onComplete(function () { //on finish animation
      TWEEN.remove(this); 
    })
 
}
//introAnimation() // call intro animation on start


//// INTRO CAMERA ANIMATION USING TWEEN
function arcadeChange() {
  
arcadeTrans = true;
  //controls.enabled = false; //disable orbit controls to animate the camera
new TWEEN.Tween(camera.position.set(camera.position.x,camera.position.y,camera.position.z)).to({ // from camera position
    x: -4, //desired x position to go
    y: 1, //desired y position to go
    z: 10 //desired z position to go 
}, 1000) // time take to animate
.delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
.onComplete(function () { //on finish animation
   //enable orbit controls
    //setOrbitControlsLimits(); //enable controls limits
    //interact();
    TWEEN.remove(this); // remove the animation from memory
    //sections.style.display = 'block';
    tvimg.style.opacity = 0.3;
    textProjetos.visible = true;
    textDiretores.visible = true;
    textContato.visible = true;
    skullLS.visible = true;
    cactusLS.visible = true;
    //secProjetos.visible = true;
    freeCamera = true;
    textMeshes.forEach((mesh, index) => {
      mesh.visible = true;
    });
    secProjetos.forEach((mesh) => {
      mesh.visible = true;
    });
    wireProjetos.forEach((mesh) => {
      mesh.visible = true;
    });
    
})

  // Set up the tween
  new TWEEN.Tween(colorParams)
  .to({ r: endColor.r, g: endColor.g, b: endColor.b }, 1000)
  .delay(1000)
  .easing(TWEEN.Easing.Quadratic.InOut)
  .onUpdate(() => {
    // Update the scene's background color
    scene.background = new THREE.Color(colorParams.r, colorParams.g, colorParams.b);
  })
  .start()
  .onComplete(function () { //on finish animation
    TWEEN.remove(this); 
  })

}

function interact(){
  // // Event listener to track mouse movements
  function onMouseMove(event){
    // Normalize mouse position to [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const horizontalLine = document.querySelector('.crosshair-horizontal');
  const verticalLine = document.querySelector('.crosshair-vertical');

  // Update the position of the horizontal line
  horizontalLine.style.top = `${event.clientY}px`;

  // Update the position of the vertical line
  verticalLine.style.left = `${event.clientX}px`;

// Cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);


  // Check for intersections with clickable objects
  const intersectsArcade = raycaster.intersectObjects(clickableArcade);
  const intersectsCactus = raycaster.intersectObjects(clickableCactus);
  const intersectsSkull = raycaster.intersectObjects(clickableSkull);
  const intersectsChapada = raycaster.intersectObjects(clickableChapada);
  const intersectsLinks = raycaster.intersectObjects(clickableLinks);

  const intersectsProjeto1 = raycaster.intersectObjects(selProjetos);
  //const intersectsRestart = raycaster.intersectObjects(clickRestart);


  if (intersectsArcade.length > 0) {
  //const clickedObject = intersects[0].arcade;
  //console.log('Clicked on:', clickedObject);
  //arcade.material.color.set('rgb(255, 67, 5)');
  arcadeMov = true;
  arcade.traverse((child) => {
    if (child.isMesh) {
        child.material.color.set(Math.random() * 0xffffff); // Change color to Red
    }
    sunLight.color.set(Math.random() * 0xffffff);
});
  //textGameOver.material.color.set(Math.random() * 0xffffff);
  //textGameOver.visible = true;
  
  }else{
  //arcade.material.color.set('rgb(8, 8, 8)');
  arcadeMov = false;
  arcade.traverse((child) => {
    if (child.isMesh) {
        child.material.color.set('rgb(244, 242, 241)'); // Change color to Red
    }
  sunLight.color.set('rgb(248, 240, 240)');
});
  //textGameOver.visible = false;
  }
//  if (intersectsCactus.length > 0 && intersectsArcade.length == 0) {
//   cactusLS.material.color.set(Math.random() * 0xffffff);
//   cactusMov = true;
//   textContato.material.color.set(Math.random() * 0xffffff);
//   textContato.visible = true;
// }else{
//   cactusLS.material.color.set('rgb(0,0,0)');
//   cactusMov = false;
//   textContato.visible = false;
// }
if (intersectsSkull.length > 0 && intersectsProjeto1 == 0) {
  //skullLS.material.color.set(Math.random() * 0xffffff);
  skullMov = true;
  textGameOver.material.color.set(Math.random() * 0xffffff);
  
  
  textGameOver.visible = true;

    // Change cursor if hovering over the cube
  document.body.style.cursor =  'pointer';
}else{
  //skullLS.material.color.set('rgb(0,0,0)');
  //skullMov = false;
  textGameOver.visible = false;
  document.body.style.cursor =  'default';
}
// if (intersectsChapada.length > 0 && intersectsArcade.length == 0 && intersectsSkull.length == 0 && intersectsCactus.length == 0) {
//   chapadaLS.material.color.set(Math.random() * 0xffffff); 
// }else{
//   chapadaLS.material.color.set('rgb(0,0,0)');
// }

if (intersectsLinks.length > 0) {
  // const material = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5}); // Green plane
  // plane11.material = material;
  //plane11.material.color.set(Math.random() * 0xffffff);
  //if(planeScreen.visible){
  scene.background = new THREE.Color('rgb(9, 9, 9)');
  //}
  planeScreen.material.opacity = 0.7;
  arcade.material.color.set('rgb(198, 196, 195)');
  //textMov.material.color.set('rgb(198, 196, 195)');
  //textMov.opacity = 0.01;
  //videoMaterial.opacity = 0.8;
  //arcade.material.opacity = 0.06;
  //video.play();
  
}else{
  //plane11.material.color.set('rgb(255, 255, 255))');
  //planeScreen.material.opacity = 0.1;
  //scene.background = new THREE.Color('rgb(242, 199, 156)');
  //textMov.material.color.set('rgb(8, 8, 8)');
  //videoMaterial.opacity = 0.3;
  //arcade.material.opacity = 0.4;
  //video.pause();
  
}

if (intersectsProjeto1.length > 0 && intersectsSkull.length == 0) {
  //document.body.style.cursor =  'pointer';
  secProjetos[0].material.color.set(Math.random() * 0xffffff);
  textMeshes[0].material.color.set(Math.random() * 0xffffff);

}else{
  //document.body.style.cursor =  'default';
  secProjetos[0].material.color.set('rgb(255,0,0)');
  textMeshes[0].material.color.set('rgb(255,0,0)');
}

    

  };

  // Handle mouse clicks
  function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with clickable objects
    const intersectsArcade = raycaster.intersectObjects(clickableArcade);
    const intersectsCactus = raycaster.intersectObjects(clickableCactus);
    const intersectsSkull = raycaster.intersectObjects(clickableSkull);
    const intersectsChapada = raycaster.intersectObjects(clickableChapada);
    const intersectsLinks = raycaster.intersectObjects(clickableLinks);

    const intersectsProjeto1 = raycaster.intersectObjects(selProjetos);
    //const intersectsRestart = raycaster.intersectObjects(clickRestart);

    if (intersectsArcade.length > 0) {
      //arcadeChange();
      //planeScreen.visible = true;
      
      //skullLS.material.opacity = 0.0;
      //cactusLS.material.opacity = 0.0;
      arcadeChange();
      arcadeMov = false;
    }else{

      //planeScreen.visible = false;
    }
    if (intersectsSkull.length > 0) {
      //introAnimation();
      //document.body.appendChild(canvas);
   
      //sections.appendChild(iframe);
      //document.body.appendChild(iframe);
      //arcadeChange();
      //textMov.material.color.set('rgb(245, 245, 245)');
      //sections.style.display = 'block';
      //sections.style.color ='rgb(255,255,255)';
      //scene.background = new THREE.Color('rgb(9, 9, 9)');

    }else{
      //sections.style.display = 'none';
      //iframe.remove();
      //scene.background = new THREE.Color('rgb(242, 199, 156)');
    }

    if (intersectsLinks.length > 0 && planeScreen.visible == true) {
      //window.open('https://vimeo.com/rafadiniz', '_blank');
      viewArcade = true;
       
    }else{
      //plane11.color.set('rgb(0,0,0)');
     
    }

    if (intersectsProjeto1.length > 0) {
   
      //iframe.style.display = 'block';
      label.visible = true;
      videoProjeto1.visible = true; 
      cssProjeto1.visible = true;

      
      
    }else{
      // iframe.style.display = 'none';
      //iframe.src = '';
      cssProjeto1.visible = false;

    }
  //  if (intersectsRestart.length > 0) {
  //   //document.body.style.cursor =  'pointer';
      
      
  //     textProjetos.visible = true;
  //     textDiretores.visible = true;
  //     textContato.visible = true;
  //     back.visible = false;
  //     forward.visible = false;
      
  // }

  }
    // Add event listener for clicks
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

  
}


// let isDragging = false;
// let previousTouchX = 0;
// let previousTouchY = 0;

// document.addEventListener("touchstart", (event) => {
//   if (event.touches.length === 1) {
//     isDragging = true;
//     previousTouchX = event.touches[0].clientX;
//     previousTouchY = event.touches[0].clientY;
//   }
// });

// document.addEventListener("touchmove", (event) => {
//   if (isDragging && event.touches.length === 1) {
//     const deltaX = event.touches[0].clientX - previousTouchX;
//     const deltaY = event.touches[0].clientY - previousTouchY;

//     camera.position.x -= deltaX * 0.05; // Adjust sensitivity
//     camera.position.y -= deltaY * 0.05;

//     previousTouchX = event.touches[0].clientX;
//     previousTouchY = event.touches[0].clientY;
//   }
// });


//// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits(){
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 4;
    controls.maxDistance = 13;
    controls.enablePan = true;
    controls.enableRotate = false;
    controls.enableZoom = true;
    //controls.maxPolarAngle = Math.PI /2;
	
}

// Wheel event listener
// document.addEventListener('wheel', (event) => {
//   // Normalize the scroll direction (cross-browser compatibility)
//   const delta = Math.sign(event.deltaY);

//   // Adjust camera zoom (PerspectiveCamera example)
//   if (delta > 0) {
//       camera.position.x += 2; // Zoom out
//   } else {
//       camera.position.x -= 2; // Zoom in
//   }

//   // // Optionally, clamp the zoom level (prevent going too close or too far)
//   camera.position.x = THREE.MathUtils.clamp(camera.position.x, 0, 11);
// });

const clock = new THREE.Clock();
let index = 0;
//// RENDER LOOP FUNCTION
function renderLoop() {

    TWEEN.update() // update animations
    if(freeCamera){
      //camera.position.set(mouse.x*-10, mouse.y*7, camera.position.z);
    }    
 
    const delta = clock.getDelta();
    controls.update(delta);
    if(!arcadeTrans){
       // update orbit controls
      //controls.update(delta);
      //cactusLS.material.opacity = 0.0;
    }

    // if(arcadeTrans){
    //   cactusLS.material.opacity += 0.00008;
    //   if(cactusLS.material.opacity >= 0.25){
    //     cactusLS.material.opacity = 0.25;
    //   }
    // }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -20, 20);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, -20, 20);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -20, 20);
    //updateCanvasTexture()

    // // Rotate the cube in the render-to-texture scene
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
  

	  //textMov.rotation.y += 0.01;
    
    
    cactusLS.rotation.y += 0.004;
    //arcade.rotation.y += 0.01;

    if(arcadeMov){
      arcade.rotation.y += 0.02;
    }else{
      //arcade.rotation.y = Math.PI * 0.7;
    }
    
    if(cactusMov){
      cactusLS.rotation.y += 0.02;
    }else{
      //cactusLS.rotation.y = 0;
    }
    if(skullMov){
      skullLS.rotation.z -= 0.003;
    }else{

      skullLS.rotation.z = Math.PI * 1.1;
    }
    
    if (rocketLS) {
      // Map mouse position to image position

      ty += 0.03;
      tz += 0.01;
      rocketLS.position.set(-13, 3+perlin.noise(ty*0.4,0,0)*1, perlin.noise(0,tz*0.1578,0)*2);

    }


  // materialNE.map = images[index]; // Update texture
  // materialNE.needsUpdate = true;
  // index = (index + 1) % images.length;

  //label.rotation.y += 0.01;

 labelRenderer.render(scene, camera);
    
  composer.render();
  requestAnimationFrame(renderLoop) //loop the render function
    
}

// Joystick logic
const joystick = document.getElementById('joystick');
document.body.appendChild(joystick);
const handle = document.getElementById('joystick-handle');
//document.body.appendChild(handle);
const maxDistance = 60; // Maximum distance the handle can move from the center

let isDragging = false;

// Event listeners for mouse and touch
handle.addEventListener('mousedown', () => isDragging = true);
handle.addEventListener('touchstart', () => isDragging = true);

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        moveHandle(e.clientX, e.clientY);
    }
});

window.addEventListener('touchmove', (e) => {
    if (isDragging) {
        moveHandle(e.touches[0].clientX, e.touches[0].clientY);
    }
});

window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('touchend', () => isDragging = false);

function moveHandle(clientX, clientY) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
    }

    handle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Normalize the delta values to a range of -1 to 1
    const normalizedDeltaX = deltaX / maxDistance;
    const normalizedDeltaY = deltaY / maxDistance;

    // Move the camera based on the joystick input
    camera.position.x += normalizedDeltaX * - 0.15;
    camera.position.y -= normalizedDeltaY * 0.15; // Invert Y axis for natural movement

// Ouça o evento popstate para detectar quando o usuário utiliza o botão "Voltar" ou "Avançar"
window.addEventListener('popstate', (event) => {
  const state = event.state;
  if (state) {
    // Atualize sua cena do Three.js aqui com base no estado recuperado
    // ...
  } else {
    // O estado é nulo, o que significa que estamos no estado inicial
    // Lide com isso conforme necessário
    // ...
  }
});
}


// Mouse Variables
let isMouseDown = false;
let prevMouseX = 0, prevMouseY = 0;
let panSpeed = 0.02;

// Mouse Down Event (Start Panning)
document.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

// Mouse Up Event (Stop Panning)
document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

// Mouse Move Event (Pan)
document.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        let deltaX = (event.clientX - prevMouseX) * panSpeed;
        let deltaY = (event.clientY - prevMouseY) * panSpeed;

        camera.position.x -= deltaX; // Move Left/Right
        camera.position.y += deltaY * -1; // Move Up/Down

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;

    }
});
