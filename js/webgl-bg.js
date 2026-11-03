(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Particle field — subtle, audio-waveform inspired
  const COUNT = window.innerWidth < 760 ? 220 : 460;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    speeds[i] = 0.2 + Math.random() * 0.6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    color: 0xff5a3c,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // second subtler layer, cyan
  const COUNT2 = window.innerWidth < 760 ? 120 : 260;
  const positions2 = new Float32Array(COUNT2 * 3);
  for (let i = 0; i < COUNT2; i++) {
    positions2[i * 3] = (Math.random() - 0.5) * 26;
    positions2[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions2[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
  }
  const geometry2 = new THREE.BufferGeometry();
  geometry2.setAttribute("position", new THREE.BufferAttribute(positions2, 3));
  const material2 = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x4dd0e1,
    transparent: true,
    opacity: 0.35
  });
  const points2 = new THREE.Points(geometry2, material2);
  scene.add(points2);

  let mouseX = 0, mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const pos = geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      const base = positions[i * 3 + 1];
      pos.array[i * 3 + 1] = base + Math.sin(t * speeds[i] + i) * 0.35;
    }
    pos.needsUpdate = true;

    points.rotation.y = t * 0.02;
    points2.rotation.y = -t * 0.012;

    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
})();
