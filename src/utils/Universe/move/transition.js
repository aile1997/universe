import gsap from 'gsap'
import _ from 'lodash'
let newObj, newCam
function enterOrleave(done, that, points, param) {
  that.$refs.coversPoint.style.display = param.bool
  gsap.to(that.$refs.coversPoint.style, {
    opacity: param.op,
    duration: 2,
  })
  gsap.to(points.position, {
    y: points.position.y - param.y,
    x: points.position.x - param.x,
    onComplete: done,
    duration: 5,
  })
  gsap.to(points.rotation, {
    z: points.rotation.z + param.rz,
    x: points.rotation.x + param.rx,
    onComplete: done,
    duration: 5,
  })
}

function movesPoint(that, pointLight, meshs, camera, points, param, fun) {
  that.animate = () => {
    that.webAni()
  }
  that.$refs.TransText.$el.style.display = param.flage
  gsap.to(that.$refs.TransText.$el.style, {
    opacity: param.op,
    duration: 2,
  })
  gsap.to(camera.position, {
    x: param.x,
    y: param.y,
    z: param.z,
    duration: 2,
    onUpdate() {
      camera.lookAt(0, 0, 0)
    },
  })
  gsap.to(points.scale, {
    x: param.sx,
    y: param.sy,
    z: param.sz,
    duration: 1,
    onComplete: () => {
      {
        that.animate = () => {
          that.webAni()
          param.ani()
        }
      }
      if (fun) {
        fun.fun()
      }
    },
  })
}

export default {
  beforeEnter: (el) => {
    el.style.opacity = 0
  },
  enter: (el, done, that, flage, points, durations) => {
    gsap.to(el, {
      delay: durations,
      onComplete: () => {
        {
          gsap.to(el, {
            opacity: 1,
            delay: el.dataset.index * 0.1,
            onComplete: done,
            duration: 0.5,
          })
        }
      },
    })

    if (flage == true) {
      enterOrleave(done, that, points, {
        bool: 'false',
        op: 0,
        y: -70,
        x: -70,
        rz: -0.1,
        rx: -0.1,
      })
    }
  },
  leave: (el, done, that, points) => {
    gsap.to(el, {
      opacity: 0,
      translateY: '-3rem',
      delay: el.dataset.index * 0.03,
      onComplete: () => {
        {
          enterOrleave(done, that, points, {
            bool: 'block',
            op: 1,
            y: 70,
            x: 70,
            rz: 0.1,
            rx: 0.1,
          })
        }
      },
      duration: 0.3,
    })
  },
  moves: (that, pointLight, meshs, camera, points) => {
    pointLight.remove(meshs)
    newObj = _.cloneDeep(points.position)
    newCam = _.cloneDeep(camera.position)
    movesPoint(that, pointLight, meshs, camera, points, {
      flage: 'block',
      op: '1',
      x: newCam.x - 1.9,
      y: newCam.y - 200,
      z: newCam.z - 130,
      sx: 5,
      sy: 5,
      sz: 5,
      ani: () => {
        that.meshMove()
      },
    })
  },
  movesTurn: (that, pointLight, meshs, camera, points, fun) => {
    pointLight.add(meshs)
    points.position.x = newObj.x
    points.position.y = newObj.y
    points.position.z = newObj.z
    console.log(newCam)
    movesPoint(
      that,
      pointLight,
      meshs,
      camera,
      points,
      {
        flage: 'none',
        op: '0',
        x: newCam.x,
        y: newCam.y,
        z: newCam.z,
        sx: 1,
        sy: 1,
        sz: 1,
        ani: () => {
          that.camMove()
        },
      },
      {
        fun: () => {
          fun
        },
      },
    )
  },
}
