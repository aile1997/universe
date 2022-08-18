<template>
  <div><trans-text ref="TransText" @retunClick="retunClick" :text="OverText" :lan="lan"></trans-text></div>
  <canvas id="canvas"></canvas>
  <div id="covers">
    <div id="coversPoint" ref="coversPoint"></div>
    <div id="top" @click="returnHome">
      <p>Threebody</p>
      <p>DAO</p>
    </div>
    <div id="left" v-if="lanFlag">
      <transition-group tag="ul" :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <li :key="1" :data-index="1" v-if="show" class="li1">
          <h3>{{ this.change[0] }}</h3>
        </li>
        <li :key="2" :data-index="2" v-if="show" class="li2">
          <h1>{{ this.change[1] }}</h1>
          <h1>{{ this.change[2] }}</h1>
        </li>
        <li :key="3" :data-index="3" v-if="show" class="li3">
          <p>{{ this.change[3] }}</p>
          <p>{{ this.change[4] }}</p>
          <p>{{ this.change[5] }}</p>
          <p>{{ this.change[6] }}</p>
          <p>{{ this.change[7] }}</p>
        </li>
        <li :key="4" :data-index="4" v-if="show" class="li4">
          <span>{{ this.change[8] }}</span>
          <div class="circleButton">
            <div class="ButtonCover" @click="canvasTrans"><span>→</span><span>→</span></div>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
  <div>
    <div v-for="(item, index) in text" :key="item" :ref="'css2d' + index">
      <Csss2d :text="item" @ClickToCss2d="ClickToCss2d" @ClickToCss2dOut="ClickToCss2dOut" @moves="moves(item[1])" ref="Csss2d"> </Csss2d>
    </div>
  </div>
  <div id="blackCover" ref="blackCover"></div>
  <div id="Frame">
    <Frame @changeLan="changeLan"> </Frame>
  </div>
</template>

<script>
import * as THREE from 'three'
import gsap from 'gsap'

import { tag, labelRenderer } from '@/utils/Universe/css2d_render.js'
import Csss2d from '@/components/Universe/css2d_ref.vue'
import TransText from '@/components/Universe/trans_text.vue'
import Frame from '@/components/Common/frame.vue'

import { start, curlTube } from '@/utils/THREE/points_light.js'

import transition from '@/utils/Universe/move/transition.js'

const conf = {
  el: 'canvas',
  fov: 75,
  cameraZ: 140,
  background: 0x00001a,
  numCircles: 40,
  numPointsPerCircle: 1500,
}

let renderer, scene, camera, cameraCtrl, startTime
let width, height

const numPoints = conf.numCircles * conf.numPointsPerCircle
let points, meshs

const mouse = new THREE.Vector2(0.1, 0.5)
let mouseX = 0,
  mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2
const { randFloat: rnd, randFloatSpread: rndFS } = THREE.Math
let pointLight
let setTime = []
let flage = false
let durations = 0
let need = true
let flageNum = 0

export default {
  components: {
    Csss2d,
    TransText,
    Frame,
  },
  data() {
    return {
      show: false,
      text: [
        ['', 'BBS', this.$Helper.image.require('football.svg')],
        ['', 'PA', this.$Helper.image.require('biology.svg')],
        ['', 'NFT', this.$Helper.image.require('physics.svg')],
        ['', 'Token supply', this.$Helper.image.require('science.svg')],
        ['', 'Whitepaper', this.$Helper.image.require('activity.svg')],
        ['', 'Metaverse', this.$Helper.image.require('logo.ico')],
      ],
      OverText: 'text',
      lan: 'English',
      lanFlag: 'true',
    }
  },
  mounted() {
    this.change = this.$messages.en.commons.change
    console.log(this.$messages)
    this.$refs.blackCover.style.display = 'block'
    gsap.to(this.$refs.blackCover.style, {
      opacity: 0,
      duration: 0.5,
    })
    start('#app')
    this.init()
    this.$Helper.timeOut.set(
      setTime,
      {
        show: () => {
          this.show = true
        },
      },
      700,
      'time1',
    )
    this.textGroup()
  },
  methods: {
    textGroup() {
      let textGroup = new THREE.Group()
      let positionArr = []
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        positionArr = [
          [-40, -10, -110], //右上
          [50 * 1.8 - 40, -10, -110], //下
          [65.4 * 1.8 - 40, -10, 47.5 * 2 - 110], //右
          [25 * 1.8 - 40, -10, 76.9 * 2 - 110], //左
          [-15.4 * 1.8 - 40, -10, 47.5 * 2 - 110], //左上
          [5, 0, -15], //左上
        ]
      } else {
        positionArr = [
          [-55, -10, -110], //右上
          [50 * 2.5 - 55, -10, -110], //下
          [65.4 * 2.5 - 55, -10, 47.5 * 2.5 - 110], //右
          [25 * 2.5 - 55, -10, 76.9 * 2.5 - 110], //左
          [-15.4 * 2.5 - 55, -10, 47.5 * 2.5 - 110], //左上
          [10, 10, 10], //左上
        ]
      }

      for (let index = 0; index < this.text.length; index++) {
        textGroup.add(tag(this.$refs[`css2d${index}`][0], positionArr[index][0], positionArr[index][1], positionArr[index][2]))
      }
      scene.add(textGroup)
    },
    init() {
      let par = curlTube.returns()
      renderer = par[0]
      camera = par[1]
      cameraCtrl = par[2]
      pointLight = par[3]
      meshs = par[4]
      this.updateSize()
      window.addEventListener('resize', this.updateSize, false)
      renderer.domElement.addEventListener('mousemove', this.onPointerMove)
      startTime = Date.now()
      this.initScene()
      this.animate()
    },

    initScene() {
      scene = new THREE.Scene()
      // if (conf.background) scene.background = new THREE.Color(conf.background);

      const positions = new Float32Array(numPoints * 3)
      const colors = new Float32Array(numPoints * 3)
      const sizes = new Float32Array(numPoints)
      const rotations = new Float32Array(numPoints)
      const sCoef = new Float32Array(numPoints)
      const ci = new Float32Array(numPoints)
      const cj = new Float32Array(numPoints)

      const position = new THREE.Vector3()
      const cscale = chroma.scale([0x71533d, 0x525258, 0x989396, 0x78521a])
      let index, color
      for (let i = 0; i < conf.numCircles; i++) {
        for (let j = 0; j < conf.numPointsPerCircle; j++) {
          index = conf.numPointsPerCircle * i + j
          if (j < conf.numPointsPerCircle - 100) {
            position.set(rndFS(10), rndFS(10), rndFS(1.5 * (conf.numCircles - i)))
          } else {
            position.set(rndFS(10), rndFS(10), rndFS(100 * (conf.numCircles - i)))
          }

          position.toArray(positions, index * 3)
          color = new THREE.Color(cscale(rnd(0, 1)).hex())
          color.toArray(colors, index * 3)
          sizes[index] = rnd(2, 30)
          sCoef[index] = rnd(0.0001, 0.005)
          rotations[index] = rnd(0, Math.PI)
          ci[index] = i + 1
          cj[index] = j + 1
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1))
      geometry.setAttribute('sCoef', new THREE.BufferAttribute(sCoef, 1))
      geometry.setAttribute('ci', new THREE.BufferAttribute(ci, 1))
      geometry.setAttribute('cj', new THREE.BufferAttribute(cj, 1))

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: mouse },
          uTexture: {
            value: new THREE.TextureLoader().load('https://klevron.github.io/codepen/misc/star.png'),
          },
          uRCoef: { value: 9 },
          uACoef: { value: (2 * Math.PI) / conf.numPointsPerCircle },
        },

        vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uRCoef;
      uniform float uACoef;
      attribute vec3 color;
      attribute float size;
      attribute float rotation;
      attribute float sCoef;
      attribute float ci;
      attribute float cj;
      varying vec4 vColor;
      varying float vRotation;
      void main() {
        vColor = vec4(color, 1.);
        vRotation = rotation;

        float rx = ci * uRCoef;
        float ry = rx * 0.6;
        float a = cj * uACoef;
        float t = uTime * 0.00005;
        vec2 p2 = vec2(cos(a+t) * rx, sin(a+t) * ry) + position.xy;

        a = ci * 0.25 - t;
        float ca = cos(a), sa = sin(a);
        p2 = p2 * mat2(ca, -sa, sa, ca);

        vec3 p = vec3(p2, position.z);

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;

        float psize = size * (200. / -mvPosition.z);
        gl_PointSize = psize * (1. + .5*sin(uTime*sCoef + position.x));
      }
    `,
        fragmentShader: `
      uniform sampler2D uTexture;
      varying vec4 vColor;
      varying float vRotation;
      void main() {
        vec2 v = gl_PointCoord - .5;
        float ca = cos(vRotation), sa = sin(vRotation);
        mat2 rmat = mat2(ca, -sa, sa, ca);
        gl_FragColor = vColor * texture2D(uTexture, v*rmat + .5);
      }
    `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      })

      points = new THREE.Points(geometry, material)
      // points.rotation.y = 0.2;
      // points.rotation.x = -2.1;
      // points.position.x = points.position.x + 70;
      // points.position.z = points.position.z - 50;
      points.scale.set(10, 10, 10)
      gsap.to(points.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 3,
      })
      gsap.to(points.position, {
        x: points.position.x + 70,
        z: points.position.z - 50,
        y: points.position.y + 30,
        duration: 1,
      })
      gsap.to(points.rotation, {
        x: -1.9,
        duration: 1,
      })

      // points.rotation.x = -1.9;
      // points.position.x = points.position.x + 70;
      // points.position.z = points.position.z - 50;
      // points.position.y = points.position.y + 30;

      scene.add(points)
      // renderer.domElement.addEventListener('mouseup', (e) => {
      // })
    },

    animate() {
      this.webAni()
      this.camMove()
    },
    webAni() {
      requestAnimationFrame(this.animate)
      const time = Date.now() - startTime
      points.material.uniforms.uTime.value = time
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    },
    camMove() {
      camera.position.x += ((mouseX - camera.position.x) * 0.05) / 4
      camera.position.y += ((-mouseY + 200 - camera.position.y) * 0.05) / 4

      camera.lookAt(scene.position)

      if (cameraCtrl) cameraCtrl.update()
    },
    meshMove() {
      points.position.x += ((mouseX - points.position.x) * 0.1) / 4
      points.position.y += ((-mouseY - points.position.y) * 0.1) / 4
    },
    updateSize() {
      width = window.innerWidth
      height = window.innerHeight
      renderer.setSize(width, height)
      labelRenderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    },
    onPointerMove(event) {
      if (event.isPrimary === false) return

      mouseX = (event.clientX - windowHalfX) / 100
      mouseY = (event.clientY - windowHalfY) / 100
    },
    canvasTrans() {
      this.show = false
      flage = false
      durations = 0

      for (let index = 0; index < this.text.length; index++) {
        this.$Helper.timeOut.set(
          setTime,
          {
            show: () => {
              this.$refs.Csss2d[index].fatherClick(true, 1500, 1)
            },
          },
          index * 100,
          'time' + index + setTime.length,
        )
      }
    },

    ClickToCss2d() {
      if (need == true) {
        gsap.to(points.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1,
        })
      }
    },
    ClickToCss2dOut() {
      if (need == true) {
        gsap.to(points.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
        })
      }
    },
    retunClick() {
      need = true
      flageNum = 0
      transition.movesTurn(this, pointLight, meshs, camera, points)
      for (let index = 0; index < this.text.length; index++) {
        this.$refs.Csss2d[index].fatherClick(true, 0, 4)
      }
    },

    beforeEnter(el) {
      transition.beforeEnter(el)
    },
    enter(el, done) {
      transition.enter(el, done, this, flage, points, durations)
    },
    leave(el, done) {
      transition.leave(el, done, this, points)
    },
    moves(text) {
      this.OverText = text
      need = false
      flageNum = 1
      transition.moves(this, pointLight, meshs, camera, points)
      for (let index = 0; index < this.text.length; index++) {
        this.$refs.Csss2d[index].fatherClick(false, 0, 3)
      }
    },

    returnHome() {
      if (flageNum == 0) {
        this.returnMast()
      } else {
        this.retunClick()
      }
    },
    returnMast() {
      this.show = true
      flage = true
      durations = 1.5
      for (let index = 0; index < this.text.length; index++) {
        this.$Helper.timeOut.set(
          setTime,
          {
            show: () => {
              this.$refs.Csss2d[index].fatherClick(false, 0, 2)
            },
          },
          index * 100,
          'time' + index + setTime.length,
        )
      }
    },
    changeLan(item) {
      if (item == 'English') {
        this.text[0][1] = '论坛'
        this.text[1][1] = '公告'
        this.text[2][1] = '数字收藏品'
        this.text[3][1] = '代币供应'
        this.text[4][1] = '白皮书'
        this.lan = '中文'
        this.change = this.$messages.zh.commons.change
        this.lanFlag = false
        this.$nextTick(() => {
          this.lanFlag = true
        })
      } else {
        this.text[0][1] = 'BBS'
        this.text[1][1] = 'PA'
        this.text[2][1] = 'NFT'
        this.text[3][1] = 'Token supply'
        this.text[4][1] = 'Whitepaper'
        this.lan = 'English'
        this.change = this.$messages.en.commons.change
        this.lanFlag = false
        this.$nextTick(() => {
          this.lanFlag = true
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
#blackCover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 9999;
  pointer-events: none;
  background-color: #000000;
  opacity: 1;
}
#covers {
  // box-shadow: 0 0 3rem 3rem rgba(0, 0, 0, 0.692) inset;
  font-size: 0.16rem;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  #coversPoint {
    box-shadow: 0 0 3rem 3rem rgba(0, 0, 0, 0.692) inset;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  #top {
    position: absolute;
    pointer-events: all;
    left: 50%;
    transform: translateX(-50%);
    top: 0.2rem;
    text-align: center;
    font-size: 0.22rem;
    width: 5rem;
    z-index: 999;
    cursor: pointer;
  }
  #left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8vw;
    ul {
      li {
        padding: 2.2vh 0;
      }
      .li1 {
        font-size: 0.2rem;
        color: #ededed;
      }
      .li2 {
        font-size: 0.6rem;
      }
      .li3 {
        font-size: 0.2rem;
        color: #a4a4a4;
        p {
          padding: 0.4vh 0;
        }
      }
      .li4 {
        font-size: 0.25rem;
        .circleButton {
          position: relative;
          display: inline-block;
          top: 0.3rem;
          margin-left: 0.5rem;
          pointer-events: all;
          color: #fff;
          cursor: pointer;
          line-height: 0.8rem;
          height: 0.8rem;
          width: 0.8rem;
          border-radius: 50%;
          text-decoration: none;
          outline: 1px solid;
          outline-color: #345bb591;
          outline-offset: 0px;
          transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
          overflow: hidden;
          font-size: 0.5rem;
          .ButtonCover {
            position: absolute;
            top: 0;
            right: 0.15rem;
            transition: 0.2s;
            span:nth-of-type(1) {
              padding-left: 0.5rem;
            }
            span:nth-of-type(2) {
              padding-left: 0.5rem;
            }
          }
          .ButtonCover:hover {
            right: -0.9rem;
          }
        }
        .circleButton:hover {
          transform: scale(1.1, 1.1);
        }
      }
    }
  }
}
</style>
