<template>
  <div ref="canvasContainer" id="three-canvas"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)
let scene, camera, renderer
let particles = []
let animationId

onMounted(() => {
  initThreeBackground()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

function initThreeBackground() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建粒子系统
  createParticles()

  // 设置光源
  const ambientLight = new THREE.AmbientLight(0x404040, 1)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x4f46e5, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  camera.position.z = 50

  animate()

  window.addEventListener('resize', onWindowResize)
}

function createParticles() {
  const particleCount = 50 // 减少粒子数量
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80

    colors[i * 3] = 0.3 + Math.random() * 0.2
    colors[i * 3 + 1] = 0.3 + Math.random() * 0.2
    colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5, // 减小粒子尺寸
    vertexColors: true,
    transparent: true,
    opacity: 0.6, // 降低透明度
    blending: THREE.AdditiveBlending
  })

  const particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)
  particles.push(particleSystem)

  // 减少连接线数量
  createConnections()
}

function createConnections() {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4f46e5,
    transparent: true,
    opacity: 0.05 // 降低透明度
  })

  // 减少连接线数量
  for (let i = 0; i < 8; i++) { // 从20减少到8
    const points = []
    points.push(new THREE.Vector3(
      (Math.random() - 0.5) * 60, // 减小范围
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60
    ))
    points.push(new THREE.Vector3(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60
    ))

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(lineGeometry, lineMaterial)
    scene.add(line)
    particles.push(line)
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  particles.forEach(particle => {
    particle.rotation.x += 0.001
    particle.rotation.y += 0.002
  })

  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>