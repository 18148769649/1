<template>
  <div class="user-name" :style="basicStyle" @click="btnHidden">
    <span class="user-text" @mousedown.prevent="move($event, currentIndex)" :style="nameStyle">地址</span>
    <div class="inp-box">
      <input type="text" placeholder="请输入地址" class="user-inp" :style="inputStyle">
    </div>
    <span class="edge top" @mousedown.prevent="scale($event, currentIndex, 'top')" v-show="borS"></span>
    <span class="edge left" @mousedown.prevent="scale($event, currentIndex, 'left')" v-show="borS"></span>
    <span class="edge bottom" @mousedown.prevent="scale($event, currentIndex, 'bottom')" v-show="borS"></span>
    <span class="edge right" @mousedown.prevent="scale($event, currentIndex, 'right')" v-show="borS"></span>
  </div>
</template>

<script>
  export default {
    props: ['move','position', 'currentIndex', 'scale'],
    data () {
      return {
        borS: false
      }
    },
    computed: {
      basicStyle() {
        return {
          top: this.position.top + 'px',
          left: this.position.left + 'px',
          width: this.position.width + 'px',
          height: this.position.height + 'px'
        }
      },
      nameStyle() {
        return {
          width: this.position.width * 0.2 + 'px',
          lineHeight: this.position.height + 'px'
        }
      },
      inputStyle() {
        return {
          width: this.position.width * .7 + 'px',
          lineHeight: this.position.height + 'px'
        }
      },

    },
    methods: {
      btnHidden (){
        this.borS = true
      }
    }
  }
</script>

<style lang='stylus' scoped>
  .user-name
    position absolute
    padding 10px 10px
    .user-text
      cursor default
      display inline-block
      padding 0 5px
      text-align left
      font-weight 700
    .edge
      position absolute
      display inline-block
    .top
      position absolute
      width 100%
      height 2px
      background-color #d2d2d2
      top 0
      left 0
      cursor n-resize
    .left
      position absolute
      width 2px
      height 100%
      background-color #d2d2d2
      top 0
      left 0
      cursor w-resize
    .bottom
      position absolute
      width 100%
      height 2px
      background-color #d2d2d2
      bottom 0
      left 0
      cursor s-resize
    .right
      position absolute
      width 2px
      height 100%
      background-color #d2d2d2
      top 0
      right 0
      cursor e-resize
    .inp-box
      /*position absolute*/
      display inline-block
      border 1px solid #bdbbbb
      .user-inp
        border 0
        margin-left 5px
        outline none
</style>
