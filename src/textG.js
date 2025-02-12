import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class textG extends THREE.Mesh {
  constructor(text, options = {}, materialOptions = {}) {
    super();
    // Set default options for the text geometry
    const defaultOptions = {
      fontUrl: 'fonts/Jersey 15_Regular.json', // URL to the font file
      size: 10,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3,
    };

    // Merge default options with provided options
    const params = { ...defaultOptions, ...options };

    // Load the font and create the geometry
    const loader = new FontLoader();
    loader.load(params.fontUrl, (font) => {
      const geometry = new TextGeometry(text, {
        font: font,
        size: params.size,
        height: params.height,
        curveSegments: params.curveSegments,
        bevelEnabled: params.bevelEnabled,
        bevelThickness: params.bevelThickness,
        bevelSize: params.bevelSize,
        bevelOffset: params.bevelOffset,
        bevelSegments: params.bevelSegments,
      });

      // Center the geometry
      geometry.computeBoundingBox();
      const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(centerOffset, 0, 0);

      // Create the material
      const material = new THREE.MeshPhongMaterial(materialOptions);

      // Call the parent class constructor
      super(geometry, material);

      // Enable shadows if needed
      this.position.copy(position);
      this.castShadow = true;
      this.receiveShadow = true;
    });

    
  }

}