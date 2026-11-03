(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Static particle field, gently rotating — no per-frame buffer rewrites
  // (that caused the jittery / "glitchy" look).
  function makeField(count, spread, color, size, opacity) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size,
      color,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      depthWrite: false
    });
    return new THREE.Points(geometry, material);
  }

  const isMobile = window.innerWidth < 760;

  const fieldA = makeField(
    isMobile ? 140 : 260,
    { x: 24, y: 16, z: 10 },
    0xff5a3c,
    0.045,
    0.38
  );
  const fieldB = makeField(
    isMobile ? 90 : 170,
    { x: 28, y: 18, z: 14 },
    0x4dd0e1,
    0.032,
    0.24
  );

  scene.add(fieldA);
  scene.add(fieldB);

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();

    fieldA.rotation.y = t * 0.012;
    fieldA.rotation.x = Math.sin(t * 0.05) * 0.03;
    fieldB.rotation.y = -t * 0.008;

    mouseX += (targetX - mouseX) * 0.03;
    mouseY += (targetY - mouseY) * 0.03;
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    render();
  }
})();
