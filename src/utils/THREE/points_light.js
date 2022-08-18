import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const conf = {
  el: 'canvas',
  fov: 75,
  cameraZ: 140,
}

const getNormalizedMousePos = (e) => {
  return {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1,
  }
}
const curlTubeVertexShader = `
#define GLSLIFY 1
// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec4 getWorldPosition(mat4 modelMat,vec3 pos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    return worldPosition;
}

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
    vNormal=normal;
    vWorldPosition=getWorldPosition(modelMatrix,position).xyz;
}
`
const curlTubeFragmentShader = `
#define GLSLIFY 1
// https://ijdykeman.github.io/graphics/simple_fog_shader
// https://lusion.co/
float getScatter(vec3 start,vec3 dir,vec3 lightPos,float d,float lightDivider,float lightPow){
    // light to ray origin
    vec3 q=start-lightPos;
    
    // coefficients
    float b=dot(dir,q);
    float c=dot(q,q);
    
    // evaluate integral
    float t=c-b*b;
    float s=1./sqrt(max(.0001,t));
    float l=s*(atan((d+b)*s)-atan(b*s));
    
    return pow(max(0.,l/lightDivider),lightPow);
}

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uSpotLight;
uniform float uScatterDivider;
uniform float uScatterPow;
uniform float uIsTube;
uniform float uIsPlane;
uniform vec3 uPlaneColor;
uniform vec3 uTubeColor;
uniform vec3 uSpotColor;
uniform float uVelocity;
uniform float uTubeThreshold;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main(){
    // scatter
    vec3 cameraToWorld=vWorldPosition-cameraPosition;
    vec3 cameraToWorldDirection=normalize(cameraToWorld);
    float cameraToWorldDistance=length(cameraToWorld);
    float scatter=getScatter(cameraPosition,cameraToWorldDirection,uSpotLight,cameraToWorldDistance,uScatterDivider,uScatterPow);
    
    // color
    vec3 color=vec3(0.,0.,0.);
    if(uIsTube==1.){
        color+=mix(vec3(0.),uTubeColor,scatter);
    }
    if(uIsPlane==1.){
        color+=uPlaneColor;
        color+=mix(vec3(0.),uSpotColor,scatter);
    }
    
    // tube movement
    if(uIsTube==1.){
        float tubeMovement=sin(vUv.x*5.+uTime*uVelocity);
        if(tubeMovement<uTubeThreshold){
            discard;
        }
    }
    
    gl_FragColor=vec4(color,1.);
}
`
class Base {
  constructor(sel) {
    this.container = document.querySelector(sel)
    this.cameraPosition = new THREE.Vector3(0, 3, 10)
    this.mousePos = new THREE.Vector2(0, 0)
  }
  // 创建场景
  createScene() {
    const scene = new THREE.Scene()
    this.scene = scene
  }

  // 创建渲染
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById(conf.el),
    })
    // this.resizeRendererToDisplaySize();
    this.camera = new THREE.PerspectiveCamera(conf.fov)
    this.camera.far = 10000
    this.camera.position.z = conf.cameraZ
    this.camera.position.x = this.camera.position.x + 1000
    let cameraCtrl = new OrbitControls(this.camera, this.renderer.domElement)
    cameraCtrl.enableKeys = false
    cameraCtrl.enableDamping = true
    cameraCtrl.dampingFactor = 0.1
    cameraCtrl.rotateSpeed = 0.1
    this.controls = cameraCtrl
  }
  // 调整渲染器尺寸
  resizeRendererToDisplaySize() {
    const { renderer } = this
    if (!renderer) {
      return
    }
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const { clientWidth, clientHeight } = canvas
    const width = (clientWidth * pixelRatio) | 0
    const height = (clientHeight * pixelRatio) | 0
    const isResizeNeeded = canvas.width !== width || canvas.height !== height
    if (isResizeNeeded) {
      renderer.setSize(width, height, false)
    }
    return isResizeNeeded
  }
  // 创建网格
  createMesh(meshObject, container = this.scene) {
    const {
      geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d9dfc8'),
      }),
      position = new THREE.Vector3(0, 0, 0),
    } = meshObject
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)
    setTimeout(() => {
      container.add(mesh)
    }, 3500)

    return mesh
  }

  // 渲染
  setLoop() {
    this.renderer.setAnimationLoop(() => {
      this.resizeRendererToDisplaySize()
      this.update()
      this.renderer.render(this.scene, this.camera)
    })
  }

  // 创建点选模型
  createRaycaster() {
    this.raycaster = new THREE.Raycaster()
    this.trackMousePos()
  }
  // 追踪鼠标位置
  trackMousePos() {
    window.addEventListener('mousemove', (e) => {
      this.setMousePos(e)
    })
    window.addEventListener(
      'touchstart',
      (e) => {
        this.setMousePos(e.touches[0])
      },
      { passive: false },
    )
    window.addEventListener('touchmove', (e) => {
      this.setMousePos(e.touches[0])
    })
  }
  // 设置鼠标位置
  setMousePos(e) {
    const { x, y } = getNormalizedMousePos(e)
    this.mousePos.x = x
    this.mousePos.y = y
  }
  // 获取点击物
  getInterSects(container = this.scene) {
    this.raycaster.setFromCamera(this.mousePos, this.camera)
    const intersects = this.raycaster.intersectObjects(container.children, true)
    return intersects
  }
  // 选中点击物时
  onChooseIntersect(target, container = this.scene) {
    const intersects = this.getInterSects(container)
    const intersect = intersects[0]
    if (!intersect || !intersect.face) {
      return null
    }
    const { object } = intersect
    return target === object ? intersect : null
  }
}
class CurlTube extends Base {
  constructor(sel, debug) {
    super(sel, debug)
    this.cameraPosition = new THREE.Vector3(0, 0, 1.2)
    this.colorParams = {
      planeColor: '#000000',
      tubeColor: '#3282b8',
      spotLightColor: '#3282b8',
    }
    this.params = {
      scatterDivider: 50,
      scatterPow: 2,
      planeScatterDivider: 0.5,
      velocity: 0.5,
      tubeThreshold: 0.3,
    }
  }
  // 初始化
  init() {
    this.createScene()
    this.createRenderer()
    this.createScatterMaterial()
    this.createPlaneScene()
    this.createPlaneMaterial()
    this.createPlane()
    this.createRaycaster()
    this.trackMouseOnPlane()
    this.setLoop()
  }

  returns() {
    return [this.renderer, this.camera, this.controls, this.planeScene, this.meshs]
  }

  // 创建散射材质
  createScatterMaterial() {
    const scatterMaterial = new THREE.ShaderMaterial({
      vertexShader: curlTubeVertexShader,
      fragmentShader: curlTubeFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uSpotLight: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uScatterDivider: {
          value: this.params.scatterDivider,
        },
        uScatterPow: {
          value: this.params.scatterPow,
        },
        uIsTube: {
          value: 0,
        },
        uIsPlane: {
          value: 0,
        },
        uPlaneColor: {
          value: new THREE.Color(this.colorParams.planeColor),
        },
        uTubeColor: {
          value: new THREE.Color(this.colorParams.tubeColor),
        },
        uSpotColor: {
          value: new THREE.Color(this.colorParams.spotLightColor),
        },
        uVelocity: {
          value: this.params.velocity,
        },
        uTubeThreshold: {
          value: this.params.tubeThreshold,
        },
      },
    })
    this.scatterMaterial = scatterMaterial
  }

  // 创建平面场景，作为底层的渲染
  createPlaneScene() {
    this.renderer.autoClear = false
    const planeScene = new THREE.Scene()
    this.planeScene = planeScene
  }
  // 创建平面材质
  createPlaneMaterial() {
    const planeMaterial = this.scatterMaterial.clone()
    planeMaterial.uniforms.uScatterDivider.value = this.params.planeScatterDivider
    planeMaterial.uniforms.uIsPlane.value = 1
    this.planeMaterial = planeMaterial
  }
  // 创建平面
  createPlane() {
    const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000)
    const planeMaterial = this.planeMaterial
    const plane = this.createMesh(
      {
        geometry: planeGeometry,
        material: planeMaterial,
      },
      this.planeScene,
    )
    this.meshs = plane
    plane.rotation.x = -0.7
    this.plane = plane
  }
  // 追踪鼠标在平面上的位置
  trackMouseOnPlane() {
    window.addEventListener('mousemove', (e) => {
      const target = this.onChooseIntersect(this.plane, this.planeScene)
      if (target) {
        this.mousePosOnPlane = target.point
      }
    })
  }
  // 动画
  update() {
    if (this.planeMaterial && this.mousePosOnPlane) {
      this.planeMaterial.uniforms.uSpotLight.value = this.mousePosOnPlane
    }
    this.renderPlaneScene()
  }
  // 先渲染平面层，再渲染主层，使两者叠加
  renderPlaneScene() {
    if (this.planeScene) {
      this.renderer.clear()
      this.renderer.render(this.planeScene, this.camera)
      this.renderer.clearDepth()
    }
  }
}
let curlTube = null
const start = (name) => {
  curlTube = new CurlTube(name, false)
  curlTube.init()
}
export { start, curlTube }
// start();
