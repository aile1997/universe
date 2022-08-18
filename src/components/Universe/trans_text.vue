<template>
  <div id="transText" ref="transText">
    <div id="transCover" @click="retunClick">{{ out }}</div>
    <dl>
      <dt>
        <h6>{{ text }}</h6>
        <div v-if="MINT" class="flexw nftText">
          <div>{{ MINT[0] }}</div>
          <div>{{ MINT[1] }}</div>
        </div>
        <div class="imgCovers" ref="transImg">
          <img v-if="Whitepaper" :src="Whitepaper" alt="" />

          <div v-if="replace" class="replaceText">{{ replace }}</div>
        </div>
      </dt>
      <dd></dd>
    </dl>
  </div>
</template>

<script>
// import gsap from "gsap";
import { defineComponent } from 'vue'
import WhiteE from '../../assets/img/overImg/Whitepaper/English.png'
import WhiteC from '../../assets/img/overImg/Whitepaper/Chinese.png'
import TokenE from '../../assets/img/overImg/Token/English.gif'
import TokenC from '../../assets/img/overImg/Token/Chinese.gif'
export default defineComponent({
  props: ['text', 'lan'],
  data() {
    return {
      Whitepaper: null,
      replace: null,
      out: 'BACK',
      MINT: null,
      textFlage: null,
    }
  },
  watch: {
    text: {
      handler() {
        this.textFlage = this.text

        if (this.text != 'Whitepaper' && this.text != '白皮书' && this.text != 'Token supply' && this.text != '代币供应') {
          this.Whitepaper = null
          this.replace = '敬请期待'
          console.log(this.text)
          if (this.text == 'NFT' || this.text == '数字收藏品') {
            this.MINT = ['MINT', 'MARTKET']
          }
        } else {
          this.MINT = null
          this.replace = ''
          this.judge()
        }
      },
      // immediate: true,
    },
    lan: {
      handler() {
        if (this.lan == '中文') {
          this.out = '后退'
          // this.replace = '敬请期待'
          switch (this.textFlage) {
            case 'BBS':
              this.textFlage = '论坛'
              break
            case 'PA':
              this.textFlage = '公告'
              break
            case 'NFT':
              this.textFlage = '数字收藏品'
              break
            case 'Token supply':
              this.textFlage = '代币供应'
              break
            case 'Whitepaper':
              this.textFlage = '白皮书'
              break
            default:
              break
          }
        } else {
          this.out = 'BACK'
          // this.replace = 'Coming online soon...'
          switch (this.textFlage) {
            case '论坛':
              this.textFlage = 'BBS'
              break
            case '公告':
              this.textFlage = 'PA'
              break
            case '数字收藏品':
              this.textFlage = 'NFT'
              break
            case '代币供应':
              this.textFlage = 'Token supply'
              break
            case '白皮书':
              this.textFlage = 'Whitepaper'
              break
            default:
              break
          }
        }

        if (this.replace) return
        this.judge()
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    retunClick() {
      this.$emit('retunClick', 'none')
    },
    judge() {
      if (this.lan == '中文') {
        console.log(this.textFlage)
        switch (this.textFlage) {
          case '白皮书':
            this.Whitepaper = WhiteC
            break
          case '代币供应':
            this.Whitepaper = TokenC
            break
          default:
            break
        }
      } else {
        console.log(this.textFlage)
        switch (this.textFlage) {
          case 'Whitepaper':
            this.Whitepaper = WhiteE
            break
          case 'Token supply':
            this.Whitepaper = TokenE
            break
          default:
            break
        }
      }
    },
  },
})
</script>

<style lang="less" scoped>
#transText {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  top: 0;
  background-color: rgba(0, 0, 0, 0.178);
  pointer-events: none;
  display: none;
  opacity: 0;
  #transCover {
    position: absolute;
    top: 0.2rem;
    left: 0.5rem;
    z-index: 999;
    cursor: pointer;
    pointer-events: all;
    font-size: 0.2rem;
  }
  dl {
    text-align: center;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    dt {
      h6 {
        font-size: 0.4rem;
        margin-bottom: 0.5rem;
      }
      .nftText {
        font-size: 0.3rem;
        padding: 0.5rem 2rem;
        cursor: pointer;
      }

      .imgCovers {
        pointer-events: all;
        width: 20rem;
        height: 11.6rem;
        // overflow: hidden;
        overflow: scroll;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        overflow-x: hidden;
        border: 0.1rem solid rgba(214, 207, 207, 0.267);
        // overflow-y: hidden;
        .replaceText {
          font-size: 0.8rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        img {
          width: 100%;
          opacity: 0.9;
        }
      }
      @media screen and (min-width: 1680px) {
        .imgCovers {
          width: 15rem;
          height: 8.5rem;
        }
      }
      /* 定义滚动条样式 */
      ::-webkit-scrollbar {
        width: 0.06rem;
        height: 0.06rem;
        // background-color: rgba(240, 240, 240, 1);
      }
      /*定义滚动条轨道 内阴影+圆角*/
      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0.1rem rgba(240, 240, 240, 0.5);
        border-radius: 0.1rem;
        background-color: rgba(240, 240, 240, 0.5);
      }

      /*定义滑块 内阴影+圆角*/
      ::-webkit-scrollbar-thumb {
        border-radius: 0.1rem;
        box-shadow: inset 0 0 10rem rgba(240, 240, 240, 0.5);
        background-color: rgba(240, 240, 240, 0.5);
      }

      h1 {
        font-size: 0.4rem;
      }
    }
    dd {
      padding-bottom: 1rem;
      transform: scale(0.8);

      ul {
        flex-wrap: wrap;
        width: 12rem;
        margin-top: 0.5rem;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        li {
          padding: 0rem 0.3rem;
          font-size: 0.32rem;
          cursor: pointer;
          pointer-events: all;
          img {
            width: 2.3rem;
            height: 1.5rem;
          }
        }
      }
    }
  }
}
</style>
