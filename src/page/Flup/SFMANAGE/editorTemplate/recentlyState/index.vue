<template>
<div>
  <div class="user-name" :style="basicStyle" @click="btnHidden">
    <span class="user-text" @mousedown.prevent="move($event, currentIndex)" :style="nameStyle">最近状况</span>
    <div class="inp-box">
      <input class="user-inp" @click="addText">
    </div>
    <span class="edge top" @mousedown.prevent="scale($event, currentIndex, 'top')" v-show="borS"></span>
    <span class="edge left" @mousedown.prevent="scale($event, currentIndex, 'left')" v-show="borS"></span>
    <span class="edge bottom" @mousedown.prevent="scale($event, currentIndex, 'bottom')" v-show="borS"></span>
    <span class="edge right" @mousedown.prevent="scale($event, currentIndex, 'right')" v-show="borS"></span>
  </div>
  <div class="inp-bounced" v-if="shFlag">
      <div class="bounced-content">
        <div class="bounced-header">
          <p class="title">选择最近状态</p>
          <p class="close" @click="close">X</p>
        </div>
        <div class="btn-content"><span v-for="item in createList" @prevent.click="addContent">{{item}}</span></div>
        <div class="according">
          <div class="bounced-left">
            <ul class="list-ul">
              <li class="list-item" :class="{ 'backW' : index === inNumber }" v-for="(item, key, index) in language"
                  @click="rightList = key">{{key}}
              </li>
            </ul>
          </div>
          <div class="bounced-right">
            <ul>
              <li v-for="item in language[rightList]" @click="addInput">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['move','position', 'currentIndex', 'scale'],
    data () {
      return {
        borS: false,
        shFlag: false,
        inNumber: 0,
        rightList: '',
        createMenu: {
          姓名: 'username',
          性别: 'gender',
          手机号码: 'phoneNumber',
          出生年月: 'dateBirth',
          地址: 'addressText',
          最近状态: 'recentlyState'
        },
        language: {
          'a': ['官洲啊', '驱蚊器二达群', '按单位'],
          'b': ['官洲啊', '脾气哦我了群', '按单位'],
          'c': ['官洲啊', '爱仕达群', '按单位'],
          'd': ['官洲啊', '跑跑看了群', '按安全无儿女'],
          'e': ['官洲啊', '爱仕达群', '的加我'],
        },
        createList: [],
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
          // width: this.position.width * .7 + 'px',
          lineHeight: this.position.height + 'px'
        }
      },

    },
    mounted () {
      this.rightList = Object.keys(this.language)[0]
    },
    methods: {
      addInput () {},
      btnHidden (){
        this.borS = true
      },
      close (){
        this.shFlag = false
        // e.preventDefault()
      },
      addText () {
        this.shFlag = true
      },
    }
  }
</script>

<style lang='stylus' scoped>
  .user-name
    position absolute
  // width 220px
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
  .inp-bounced
    position fixed
    width 100%
    height 100%
    background: rgba(0, 0, 0, 0.5)
    top 0
    left 0
    .bounced-content
      position absolute
      width 650px
      height 480px
      background-color #ffffff
      left 50%
      margin-left -325px
      top 50%
      margin-top -240px
      .bounced-header
        width 100%
        height 40px
        border-bottom 1px solid #d2d2d2
        .title
          text-align left
          margin 0 0 0 10px
          line-height 40px
          font-weight 700
        .close
          position absolute
          top -6px
          right 10px
          color #b5b4b4
          cursor pointer
        .close:hover
          color #949090
      .btn-content
        width 100%
        height 40px
        border-bottom 1px solid #d2d2d2
      .according
        width 100%
        display flex
        .bounced-left
          flex 1
          .list-ul
            list-style none
            padding 0
            margin 0
            .list-item
              height 40px
              background-color #E5E5E5
              line-height 40px
              cursor pointer
            .backW
              background-color #ffffff
            .list-item:hover
              background-color #dedada
        .bounced-right
          flex 5      
</style>
