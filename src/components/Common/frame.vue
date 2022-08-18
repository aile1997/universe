<template>
  <div id="cover">
    <div id="top" class="flexw">
      <div @click="ale">{{ text[0] }}</div>
      <div @click="link">{{ text[1] }}</div>
      <div @click="changeLan">{{ lan }}</div>
    </div>
    <div id="bottom" class="flexw">
      <a href="https://medium.com/" target="_blank"><img src="../../assets/img/icon/Medium.png" alt="" /></a>
      <a href="https://twitter.com/ThreeBodyDAO" target="_blank"><img src="../../assets/img/icon/Twitter.png" alt="" /></a>
      <a href="https://t.me/ThreeBodyDAO" target="_blank"><img src="../../assets/img/icon/Telegram.png" alt="" /></a>
      <a href="https://vm.tiktok.com/ZSevusn5L/ 6.facebook: https://www.facebook.com/profile.php?id=100078032813602" target="_blank"
        ><img src="../../assets/img/icon/tiktok.png" alt=""
      /></a>
      <a href="https://discord.gg/gCh7k3V46n" target="_blank"><img src="../../assets/img/icon/Discord.png" alt="" /></a>
      <a href="https://github.com/" target="_blank"><img src="../../assets/img/icon/Github.png" alt="" /></a>
      <a href="https://www.youtube.com/channel/UCnlZ5Z1OXBs9sxG5iLHmBxw" target="_blank"><img src="../../assets/img/icon/Youtube.png" alt="" /></a>
      <a href="https://weibo.com/p/1005052455756252/home?from=page_100505&mod=TAB&is_all=1#place" target="_blank"
        ><img src="../../assets/img/icon/Weibo.png" alt=""
      /></a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lan: 'English',
      text: ['BUY $ THB', 'Connect Wallet'],
    }
  },
  methods: {
    async link() {
      //判断用户是不是安装了metamask
      if (typeof window.ethereum !== 'undefined') {
        const ethereum = window.ethereum
        //禁止自动刷新，meta mask要求写的
        ethereum.autoRefreshOnNetworkChange = false

        try {
          //这一步就是第一次和metamask进行链接
          await ethereum.enable()
          console.log('链接成功小狐狸！！')
        } catch (e) {}
      } else {
        console.log('没有安装小狐狸!')
      }
    },
    ale() {
      alert('敬请期待')
    },

    changeLan() {
      this.$emit('changeLan', this.lan)
      if (this.lan == 'English') {
        this.lan = '中文'
        this.text[1] = '链接钱包'
      } else {
        this.lan = 'English'
        this.text[1] = 'Connect Wallet'
      }
    },
  },
}
</script>

<style lang="less" scoped>
#cover {
  #top {
    position: absolute;
    top: 0;
    z-index: 9;
    width: 100%;
    padding-left: 79%;
    padding-right: 2%;
    margin-top: 1%;
    cursor: pointer;
    font-size: 0.2rem;
  }

  #bottom {
    position: absolute;
    bottom: 0rem;
    z-index: 999;
    width: 100%;
    padding: 0 8rem;
    box-shadow: 0 0 0.3rem 0.3rem rgba(0, 0, 0, 0.692) inset;
    background-color: rgba(0, 0, 0, 0.37);
    height: 1rem;
    a {
      img {
        width: 0.5rem;
        line-height: 0.5rem;
        transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
      }
      img:hover {
        width: 0.7rem;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    #top {
      font-size: 0.4rem;
      position: absolute;
      top: 2rem;
      padding: 1rem 2rem;
      z-index: 9;
    }
    #bottom {
      position: absolute;
      bottom: 0rem;
      z-index: 999;
      width: 100%;
      padding: 0 3rem;
      box-shadow: 0 0 0.3rem 0.3rem rgba(0, 0, 0, 0.692) inset;
      background-color: rgba(0, 0, 0, 0.37);
      height: 2rem;
      a {
        img {
          width: 1rem;
          line-height: 1rem;
          transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
        }
        img:hover {
          width: 1.4rem;
        }
      }
    }
  }
}
</style>
