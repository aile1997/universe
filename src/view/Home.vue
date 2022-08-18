<template>
  <Renderer ref="renderer" pointer resize="window">
    <Camera :position="{ z: 0 }" :fov="50" />
    <Scene>
      <Points ref="points" :position="{ z: -150 }">
        <BufferGeometry :attributes="attributes" />
        <ShaderMaterial
          :props="{
            uniforms: uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            blending: 2,
            depthTest: false,
          }"
        >
          <Texture src="https://assets.codepen.io/33787/sprite.png" uniform="uTexture" />
        </ShaderMaterial>
      </Points>
    </Scene>
    <EffectComposer>
      <RenderPass />
      <UnrealBloomPass :strength="2" :radius="0" :threshold="0" />
      <ZoomBlurPass :strength="zoomStrength" />
    </EffectComposer>
  </Renderer>
  <div id="covers" ref="covers">
    <div id="top">
      <p>Threebody</p>
      <p>DAO</p>
    </div>
    <div id="center">
      <p @click="updateColors" @mouseenter="targetTimeCoef = 100" @mouseleave="targetTimeCoef = 1" class="btn btn-5">BEGIN</p>
    </div>
  </div>
  <div id="blackCover" ref="blackCover"></div>
</template>

<script>
import {
  lerp,
  BufferGeometry,
  Camera,
  EffectComposer,
  Points,
  Renderer,
  RenderPass,
  Scene,
  ShaderMaterial,
  Texture,
  UnrealBloomPass,
  ZoomBlurPass,
} from 'troisjs'
import { Clock, Color, MathUtils, Vector3 } from 'three/build/three.module.js'
const { randFloat: rnd, randInt, randFloatSpread: rndFS } = MathUtils

import gsap from 'gsap'

export default {
  components: {
    BufferGeometry,
    Camera,
    EffectComposer,
    Points,
    Renderer,
    RenderPass,
    Scene,
    ShaderMaterial,
    Texture,
    UnrealBloomPass,
    ZoomBlurPass,
  },

  setup() {
    const vertexShader = `
  uniform float uTime;
  attribute vec3 color;
  attribute float size;
  attribute float velocity;
  varying vec4 vColor;
  void main(){
    vColor = vec4(color, 1.0);
    vec3 p = vec3(position);
    p.z = -150. + mod(position.z + uTime, 300.);
    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = size * (-50.0 / mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

    const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
  }
`
    const POINTS_COUNT = 50000

    const palette = niceColors[15]

    const positions = new Float32Array(POINTS_COUNT * 3)
    const colors = new Float32Array(POINTS_COUNT * 3)
    const sizes = new Float32Array(POINTS_COUNT)
    const v3 = new Vector3(),
      color = new Color()
    for (let i = 0; i < POINTS_COUNT; i++) {
      v3.set(rndFS(200), rndFS(200), rndFS(300))
      v3.toArray(positions, i * 3)
      color.set(palette[Math.floor(rnd(0, palette.length))])
      color.toArray(colors, i * 3)
      sizes[i] = rnd(5, 20)
    }

    const attributes = [
      { name: 'position', array: positions, itemSize: 3 },
      { name: 'color', array: colors, itemSize: 3 },
      { name: 'size', array: sizes, itemSize: 1 },
    ]

    const uniforms = { uTime: { value: 0 } }
    console.log(uniforms)
    const clock = new Clock()

    const timeCoef = 1,
      targetTimeCoef = 1
    return {
      POINTS_COUNT,
      attributes,
      uniforms,
      vertexShader,
      fragmentShader,
      clock,
      timeCoef,
      targetTimeCoef,
    }
  },
  data() {
    return {
      zoomStrength: 0,
    }
  },
  mounted() {
    const renderer = this.$refs.renderer

    const positionN = renderer.three.pointer.positionN
    const points = this.$refs.points.points

    renderer.onBeforeRender(() => {
      this.timeCoef = lerp(this.timeCoef, this.targetTimeCoef, 0.02)
      this.uniforms.uTime.value += this.clock.getDelta() * this.timeCoef * 4
      this.zoomStrength = this.timeCoef * 0.004

      const da = 0.05
      const tiltX = lerp(points.rotation.x, positionN.y * da, 0.02)
      const tiltY = lerp(points.rotation.y, -positionN.x * da, 0.02)
      points.rotation.set(tiltX, tiltY, 0)
    })
  },
  methods: {
    updateColors() {
      // const colorAttribute = this.$refs.points.geometry.attributes.color;
      // const ip = randInt(0, 99);
      // console.log(ip);
      // const palette = niceColors[ip];
      // const color = new Color();
      // for (let i = 0; i < this.POINTS_COUNT; i++) {
      //   color.set(palette[randInt(0, palette.length)]);
      //   color.toArray(colorAttribute.array, i * 3);
      // }
      // colorAttribute.needsUpdate = true;
      this.$refs.blackCover.style.display = 'block'
      gsap.to(this.$refs.blackCover.style, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          this.$router.push({
            path: `/Universe`,
          })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
body,
html {
  margin: 0;
}
#blackCover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 99999;
  pointer-events: none;
  background-color: #000000;
  opacity: 0;
}
#covers {
  font-size: 0.16rem;
  width: 50%;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 0.7rem 0;
  text-align: center;
  opacity: 1;
  padding-bottom: 5rem;
  #center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    .btn {
      color: #fff;
      cursor: pointer;
      line-height: 1.6rem;
      height: 1.6rem;
      width: 1.6rem;
      border-radius: 50%;
      text-decoration: none;
      box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
      outline: 1px solid;
      outline-color: #747a91;
      outline-offset: 0px;
      transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    }
    .btn-5:hover {
      border: 1px solid;
      box-shadow: inset 0 0 20px rgb(255 255 255 / 50%), 0 0 20px rgb(255 255 255 / 20%);
      outline-color: rgba(255, 255, 255, 0);
      outline-offset: 15px;
      text-shadow: 1px 1px 2px #427388;
    }
  }
}
</style>
