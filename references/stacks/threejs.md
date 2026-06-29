# Three.js / React Three Fiber UI/UX Guidelines

## When to read this
Use when building WebGL scenes, 3D product viewers, interactive data visualization, creative canvases, or scroll-driven 3D experiences with Three.js or React Three Fiber (R3F).

---

## Recommended Libraries

| Library | Purpose | Install |
|---|---|---|
| three | Core WebGL renderer | `npm install three` |
| @react-three/fiber | React renderer for Three.js | `npm install @react-three/fiber` |
| @react-three/drei | R3F helpers (OrbitControls, Environment, Text…) | `npm install @react-three/drei` |
| @react-three/postprocessing | Post-processing (bloom, SSR, depth of field) | `npm install @react-three/postprocessing` |
| GSAP | Animation timelines + ScrollTrigger | `npm install gsap` |
| Leva | Debug panel for scene parameters | `npm install leva` |
| @types/three | TypeScript types | `npm install -D @types/three` |

---

## Style Recommendations by Use Case

| Use Case | Visual Style | Camera | Lighting |
|---|---|---|---|
| Product showcase | Dark bg, clean geometry, rim lighting | Orbit / turntable | 3-point: key + fill + rim |
| Interactive art / portfolio | Aurora/Neon, full-screen canvas | Free orbit | HDR environment map |
| Scroll-driven narrative | Cinematic, fog, depth | GSAP ScrollTrigger path | Directional + ambient |
| Data visualization | Minimal, muted palette, labeled axes | Orthographic or fixed perspective | Flat ambient only |
| Game / immersive | Full-screen, minimal HUD | First-person or follow cam | Dynamic point lights |
| SaaS hero / landing | Subtle 3D accent, no full-screen | Fixed, no user control | Soft ambient + directional |

---

## Two Approaches

### Vanilla Three.js (imperative)
Best for: standalone canvas, full control, no React.

### React Three Fiber (declarative)
Best for: integrating 3D into a React/Next.js app, sharing state with UI, composable scene graphs.

---

## Top UX Patterns

### 1. Core Renderer Setup (Vanilla)

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // NEVER skip the cap
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Accessibility
renderer.domElement.setAttribute('role', 'img');
renderer.domElement.setAttribute('aria-label', 'Interactive 3D scene. Drag to rotate, scroll to zoom.');

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta(); // call ONCE per frame — never call getDelta() again this frame
  controls.update();
  renderer.render(scene, camera);
});
```

### 2. Core Setup (React Three Fiber)

```tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5; // delta = framerate-independent
  });
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 75 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      aria-label="Interactive 3D scene"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <RotatingBox />
      <OrbitControls enableDamping />
      <Environment preset="sunset" />
    </Canvas>
  );
}
```

### 3. Delta-Time Animation (framerate-independent)

```javascript
// BAD — speed varies with frame rate (2× faster on 120Hz vs 60Hz)
mesh.rotation.y += 0.01;

// GOOD — consistent speed regardless of frame rate
const dt = clock.getDelta(); // called once at top of animate()
mesh.rotation.y += dt * 0.8;

// Lerp for smooth follow/easing
camera.position.x += (targetX - camera.position.x) * 0.05;
```

### 4. Responsive Canvas

```javascript
// ResizeObserver for container-aware sizing (not window.resize)
const ro = new ResizeObserver(entries => {
  const { width, height } = entries[0].contentRect;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
ro.observe(canvas.parentElement); // observe container, not window

// Touch support for mobile
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  mouse.x = (t.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(t.clientY / canvas.clientHeight) * 2 + 1;
}, { passive: false });
```

### 5. Pause Render Loop When Tab Hidden

```javascript
// Use setAnimationLoop as the driver — it can be paused
renderer.setAnimationLoop(animate);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) renderer.setAnimationLoop(null);   // pause — saves battery
  else renderer.setAnimationLoop(animate);                 // resume
});
```

### 6. InstancedMesh for 50+ Repeated Objects

```javascript
const COUNT = 500;
const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
const matrix = new THREE.Matrix4();

for (let i = 0; i < COUNT; i++) {
  matrix.setPosition(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  mesh.setMatrixAt(i, matrix);
}
mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);
// Result: 1 draw call instead of 500
```

### 7. GLTF Model Loading

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('model.glb', (gltf) => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Failed to load model:', error);
});

// R3F version:
function Model() {
  const { scene } = useGLTF('/model.glb');
  return <primitive object={scene} />;
}
useGLTF.preload('/model.glb');
```

### 8. Scroll-Driven Camera with GSAP ScrollTrigger

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // must call before use

gsap.to(camera.position, {
  x: 3,
  y: 1,
  z: 2,
  ease: 'none',
  scrollTrigger: {
    trigger: '.canvas-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1, // 1-second lag for cinematic smoothness
  },
});
```

### 9. Particle System

```javascript
const COUNT = 3000; // safe mobile baseline — profile before raising
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particles = new THREE.Points(
  geometry,
  new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, sizeAttenuation: true })
);
scene.add(particles);

// Animating particles — must set needsUpdate
function animate() {
  const pos = geometry.attributes.position.array;
  for (let i = 1; i < pos.length; i += 3) {
    pos[i] += Math.sin(clock.getElapsedTime() + i) * 0.001;
  }
  geometry.attributes.position.needsUpdate = true; // GPU re-upload — REQUIRED
}
```

### 10. Geometry and Material Disposal (Memory Management)

```javascript
// Always dispose when removing objects
function removeObject(mesh) {
  mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(m => m.dispose());
  } else {
    mesh.material.dispose();
  }
  if (mesh.material.map) mesh.material.map.dispose();
  scene.remove(mesh);
}

// R3F: dispose in useEffect cleanup
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

---

## Best Practices by Category

### Scene Setup
- Always `setPixelRatio(Math.min(devicePixelRatio, 2))` — beyond 2 is invisible but doubles GPU load
- `antialias: true` must be set in constructor — cannot be changed after
- Use `ACESFilmicToneMapping` for perceptually accurate colors
- `SRGBColorSpace` for output — prevents washed-out colors

### Animation
- `clock.getDelta()` exactly **once** per `animate()` frame — store in `dt`, reuse it
- All motion multiplied by `dt` — framerate-independent at 30fps, 60fps, 120fps
- Use `renderer.setAnimationLoop()` not recursive `requestAnimationFrame` — enables pause
- Lerp (`value += (target - value) * alpha`) for organic easing without libraries
- GSAP timelines for multi-step sequences; `scrub` for scroll-driven camera

### Performance
- `InstancedMesh` for 50+ identical objects — 1 draw call vs N
- `LOD` (Level of Detail) for objects at varying distances
- `FogExp2` for atmospheric depth + implicitly culls far objects
- `BufferGeometry` + `Points` for particles — never individual `Mesh` objects
- Particle ceiling: 3,000 safe baseline; 50,000+ drops frames on mid-range mobile

### Memory
- Dispose geometry, material, and textures when removing objects
- Never create new geometries/materials inside `animate()` — allocates each frame
- Reuse geometry and material instances across objects

### Responsive
- `ResizeObserver` on container (not `window resize`) — fires on any container resize
- Use `canvas.clientWidth/Height` not `window.innerWidth/Height` for contained canvases
- Touch events alongside mouse events for mobile interactivity

### Accessibility
- `role="img"` + descriptive `aria-label` on canvas — screen readers get context
- Gate all auto-animation on `prefers-reduced-motion` — track changes with `addEventListener`
- Provide keyboard alternative for any pointer-only interactions

---

## Common Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|---|---|---|
| `devicePixelRatio` without cap | 3× GPU cost on retina displays, no visual gain | `Math.min(devicePixelRatio, 2)` |
| `getDelta()` called twice per frame | Second call always returns ~0 | Call once, store in `dt` |
| No `geometry.dispose()` | Memory leak — GPU VRAM never freed | Dispose on removal |
| `window.innerWidth` for contained canvas | Wrong dimensions in flex/grid layouts | `ResizeObserver` on container |
| 500 individual `Mesh` for particles | 500 draw calls per frame | `Points` + `BufferGeometry` |
| No `prefers-reduced-motion` check | Causes vestibular disorders | Gate all auto-animation |
| GSAP without `registerPlugin` | TypeError: ScrollTrigger is not a constructor | `gsap.registerPlugin(ScrollTrigger)` |
| Inline `requestAnimationFrame` (self-referencing) | Cannot be paused | `renderer.setAnimationLoop()` |
| Fixed `+= 0.01` animation | 2× faster on 120Hz | Multiply by `clock.getDelta()` |
| Missing `needsUpdate = true` | Particle positions frozen on GPU | Set after mutating buffer array |

---

## Performance Checklist

- [ ] `setPixelRatio(Math.min(devicePixelRatio, 2))`
- [ ] `getDelta()` called once at top of `animate()`, reused as `dt`
- [ ] All animations multiplied by `dt` (framerate-independent)
- [ ] `renderer.setAnimationLoop()` as loop driver (pauseable)
- [ ] `visibilitychange` pauses loop on hidden tab
- [ ] `dispose()` geometry + material + textures on removal
- [ ] `InstancedMesh` for 50+ identical objects
- [ ] Particle count ≤ 3,000 (test on mobile before raising)
- [ ] `needsUpdate = true` after mutating `BufferAttribute` arrays
- [ ] `ResizeObserver` on container (not `window resize`)
- [ ] `prefers-reduced-motion` gating all auto-animation
- [ ] `role="img"` + `aria-label` on canvas element
- [ ] GSAP `registerPlugin(ScrollTrigger)` before any ScrollTrigger use
- [ ] `scrub: 1` (not `onEnter`) for scroll-driven camera paths
- [ ] Production: Vite + `npm install three` for tree-shaking
