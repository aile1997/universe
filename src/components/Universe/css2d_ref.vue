<template>
  <div id="csss2d" @click="moves">
    <transition-group tag="div" :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <h6 :key="1" :data-index="1" v-if="show">{{ text[0] }}</h6>
      <h3 :key="2" :data-index="2" v-if="show">{{ text[1] }}</h3>
      <div class="circleCover" :key="3" :data-index="3" v-if="show">
        <img :src="text[2]" @mouseover="closePop" @mouseout="closePopOut" />
      </div>
    </transition-group>
  </div>
</template>

<script>
let setTime = []
import gsap from 'gsap'
export default {
  props: ['text'],
  data() {
    return {
      show: false,
    }
  },
  methods: {
    fatherClick(bool, time, index) {
      this.setTimeouts(
        {
          show: () => {
            this.show = bool
          },
        },
        time,
        `time${index}`,
      )
    },
    setTimeouts(fun, num, name) {
      name = setTimeout(() => {
        fun.show()
      }, num)
      setTime.push(name)
    },
    closePop() {
      this.$emit('ClickToCss2d', 'none')
    },
    closePopOut() {
      this.$emit('ClickToCss2dOut', 'none')
    },
    moves() {
      this.$emit('moves', 'none')
    },
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.bottom = '-1rem'
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        bottom: '0rem',
        delay: el.dataset.index * 0.001,
        onComplete: done,
        duration: 1,
      })
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        translateY: '-3rem',
        delay: el.dataset.index * 0.03,
        onComplete: done,
        duration: 0.3,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.centers {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
#csss2d {
  text-align: center;
  overflow: hidden;
  padding: 0.3rem;
  h6 {
    position: relative;
    font-size: 0.22rem;
  }
  h3 {
    position: relative;
    font-size: 0.26rem;
  }
  .circleCover {
    position: relative;
    color: #fff;
    cursor: pointer;
    line-height: 0.8rem;
    height: 0.8rem;
    width: 0.8rem;
    border-radius: 50%;
    text-decoration: none;
    box-shadow: inset 0 0 2rem rgba(0, 0, 0, 0.959);
    outline: 1.5px solid;
    outline-color: rgba(255, 255, 255, 0.664);
    outline-offset: 0px;
    transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.2rem;
  }
  img {
    width: 0.5rem;
    .centers();
  }
  @media screen and (max-width: 1200px) {
    h6 {
      font-size: 0.16rem;
    }
    h3 {
      font-size: 0.2rem;
    }
    .circleCover {
      line-height: 1.6rem;
      height: 1.6rem;
      width: 1.6rem;
    }
    img {
      width: 1.2rem;
    }
  }
  .circleCover:hover {
    border: 1px solid;
    box-shadow: inset 0 0 20px rgb(255 255 255 / 50%), 0 0 20px rgb(255 255 255 / 20%);
    outline-color: rgba(255, 255, 255, 0);
    outline-offset: 15px;
    text-shadow: 1px 1px 2px #427388;
  }
}
</style>
