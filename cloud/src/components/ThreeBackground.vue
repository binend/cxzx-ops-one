<template>
  <div ref="canvasContainer" class="three-background"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)
let scene, camera, renderer
let particles = []
let animationId

// 初始化Three.js场景
function initThreeJS() {
  // 创建场景
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xf8f9fa, 1, 3000)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  )
  camera.position.z = 1000

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0xf8f9fa, 0)
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建粒子系统
  createParticleSystem()

  // 创建几何体动画
  createFloatingGeometry()

  // 创建连线系统
  createConnectionLines()
}

// 创建粒子系统
function createParticleSystem() {
  const particleCount = 150
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 2000
    positions[i3 + 1] = (Math.random() - 0.5) * 1500
    positions[i3 + 2] = (Math.random() - 0.5) * 1000

    // 白色系配色
    const colorChoice = Math.random()
    if (colorChoice < 0.3) {
      colors[i3] = 0.2
      colors[i3 + 1] = 0.4
      colors[i3 + 2] = 0.8 // 蓝色
    } else if (colorChoice < 0.6) {
      colors[i3] = 0.2
      colors[i3 + 1] = 0.8
      colors[i3 + 2] = 0.4 // 绿色
    } else {
      colors[i3] = 0.9
      colors[i3 + 1] = 0.9
      colors[i3 + 2] = 0.9 // 白色
    }

    sizes[i] = Math.random() * 3 + 1
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.3);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;

      void main() {
        float r = distance(gl_PointCoord, vec2(0.5, 0.5));
        if (r > 0.5) discard;

        float alpha = 1.0 - smoothstep(0.0, 0.5, r);
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)
  particles.push(particleSystem)
}

// 创建浮动几何体
function createFloatingGeometry() {
  const geometries = []

  // 创建多个几何体
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 20 + 10, 0)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.5, 0.7, 0.8),
      transparent: true,
      opacity: 0.3,
      wireframe: Math.random() > 0.5
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(
      (Math.random() - 0.5) * 1500,
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 500
    )
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      floatSpeed: Math.random() * 0.5 + 0.2,
      floatRadius: Math.random() * 50 + 20
    }

    scene.add(mesh)
    geometries.push(mesh)
  }

  particles.push(...geometries)
}

// 创建连线系统
function createConnectionLines() {
  const lineCount = 20
  const maxDistance = 500

  for (let i = 0; i < lineCount; i++) {
    const points = []
    const pointCount = Math.floor(Math.random() * 3) + 2

    for (let j = 0; j < pointCount; j++) {
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 1500,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 500
      ))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.6, 0.5, 0.7),
      transparent: true,
      opacity: 0.2
    })

    const line = new THREE.Line(geometry, material)
    scene.add(line)
    particles.push(line)
  }
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)

  const time = Date.now() * 0.001

  // 更新粒子
  particles.forEach((particle, index) => {
    if (particle.isPoints) {
      // 粒子系统动画
      particle.material.uniforms.time.value = time
      particle.rotation.y += 0.001
    } else if (particle.isMesh) {
      // 几何体动画
      particle.rotation.x += particle.userData.rotationSpeed.x
      particle.rotation.y += particle.userData.rotationSpeed.y
      particle.rotation.z += particle.userData.rotationSpeed.z

      // 浮动动画
      particle.position.y += Math.sin(time * particle.userData.floatSpeed + index) * 0.5
    } else if (particle.isLine) {
      // 线条动画
      particle.material.opacity = 0.1 + Math.sin(time + index) * 0.1
    }
  })

  // 相机轻微移动
  camera.position.x = Math.sin(time * 0.1) * 50
  camera.position.y = Math.cos(time * 0.15) * 30

  renderer.render(scene, camera)
}

// 处理窗口大小变化
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initThreeJS()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)

  // 清理Three.js资源
  particles.forEach(particle => {
    if (particle.geometry) particle.geometry.dispose()
    if (particle.material) particle.material.dispose()
  })

  if (renderer) {
    renderer.dispose()
    if (canvasContainer.value && renderer.domElement) {
      canvasContainer.value.removeChild(renderer.domElement)
    }
  }
})
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.three-background :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>