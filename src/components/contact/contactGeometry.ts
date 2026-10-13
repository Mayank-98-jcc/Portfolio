import {
  DataTexture,
  Float32BufferAttribute,
  ExtrudeGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Path,
  PlaneGeometry,
  RepeatWrapping,
  Shape,
} from 'three';

export function stoneTexture() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const noise = Math.sin(i * 127.1) * 43758.5453;
    const value = 145 + Math.floor((noise - Math.floor(noise)) * 70);
    data.set([value, value, value, 255], i * 4);
  }
  const texture = new DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 4);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function archGeometry() {
  const shape = new Shape();
  shape.moveTo(-2.12, 0);
  shape.lineTo(-2.12, 3.35);
  shape.absarc(0, 3.35, 2.12, Math.PI, 0, true);
  shape.lineTo(2.12, 0);
  shape.lineTo(1.77, 0);
  shape.lineTo(1.77, 3.35);
  shape.absarc(0, 3.35, 1.77, 0, Math.PI, false);
  shape.lineTo(-1.77, 0);
  shape.closePath();
  return new ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 40,
  });
}

export function wallGeometry() {
  const shape = new Shape();
  shape.moveTo(-8, -0.1);
  shape.lineTo(8, -0.1);
  shape.lineTo(8, 9);
  shape.lineTo(-8, 9);
  shape.closePath();
  const hole = new Path();
  hole.moveTo(-1.77, -0.05);
  hole.lineTo(-1.77, 3.35);
  hole.absarc(0, 3.35, 1.77, Math.PI, 0, true);
  hole.lineTo(1.77, -0.05);
  hole.closePath();
  shape.holes.push(hole);
  return new ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false, curveSegments: 40 });
}

/** Layered terrain with ridged silhouettes and actual front-to-back relief. */
export function mountainGeometry(layer: number, compact: boolean) {
  const geometry = new PlaneGeometry(18, 6, compact ? 96 : 160, compact ? 14 : 24);
  const position = geometry.attributes.position;
  const colors: number[] = [];
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const row = (position.getY(i) + 3) / 6;
    const ridge =
      1.3 +
      Math.sin(x * 1.12 + layer) * 0.55 +
      Math.sin(x * 2.45 + layer * 2) * 0.3 +
      Math.sin(x * 5.4) * 0.16 +
      Math.sin(x * 13.7 + layer) * 0.09;
    position.setY(i, -2.2 + row * (ridge + 2.2));
    position.setZ(i, Math.sin(x * 5.2 + row * 9) * 0.26 * row + (1 - row) * 1.5);
    const tone = 0.68 + Math.sin(x * 8.3 + row * 17) * 0.1 + row * 0.17;
    const snow = row > 0.91 && ridge > 1.6 ? 0.16 : 0;
    colors.push(tone + snow, tone + snow, tone + snow);
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export const skyVertex = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
export const skyFragment = `varying vec2 vUv;
void main(){
 vec3 horizon=vec3(1.,.38,.13), upper=vec3(.15,.105,.18);
 vec3 sky=mix(horizon,upper,smoothstep(.32,.8,vUv.y));
 float glow=exp(-length((vUv-vec2(.58,.48))*vec2(4.,5.))*2.);
 gl_FragColor=vec4(sky+vec3(.28,.15,.06)*glow,1.);
 #include <colorspace_fragment>
}`;
