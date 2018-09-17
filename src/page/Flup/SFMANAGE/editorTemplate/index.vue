<template>
  <div>
    <div style="margin: 10px 0">
      <div class="design" @click="allow">设计</div>
      <div class="preview" @click="drad">预览</div>
      <div class="keep">保存</div>
    </div>
    <div class="edit" ref="edit">
      <!--<div class="user-name" :style="style" >-->
      <!--<span class="user-text" @mousedown="move">手机</span>-->
      <!--<div class="inp-box">-->
      <!--<input type="text" class="user-inp" placeholder="请输入手机号码">-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="user-name" :style="style" >-->
      <!--<span class="user-text" @mousedown="move">出生年月</span>-->
      <!--<div class="inp-box">-->
      <!--<input type="date" class="user-inp">-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="user-name" :style="style">-->
      <!--<span class="user-text" @mousedown="move">家庭地址</span>-->
      <!--<div class="inp-box">-->
      <!--<input type="text" class="user-inp" placeholder="请输入地址">-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="user-name" :style="style">-->
      <!--<span class="user-text" @mousedown="move">最近状况</span>-->
      <!--<div class="inp-box">-->
      <!--<textarea class="user-inp" @click="addText"></textarea>-->
      <!--</div>-->
      <!--</div>-->
      <component :is="tagName" :move="move" v-for="(tagName, index) in arr" :key="index" :position="elements[index]"
                 :currentIndex="index"
                 :scale="scale"></component>
    </div>
    <div class="edit-menu">
      <!--<el-tree-->
        <!--class="filter-tree"-->
        <!--:data="twoMenu"-->
        <!--:props="defaultProps"-->
        <!--ref="tree2">-->
      <!--</el-tree>-->
      <div class="menu-box" v-for="(menuItem, itemIndex) in twoMenu">
        <span style="margin-left:10px;display:inline-block;width: 100%;height: 35px;line-height: 35px;text-align: left;cursor: pointer" @click.prevent="openMenu(menuItem)"><i class="el-icon-caret-right" v-show="iconSh"></i><i class="el-icon-caret-bottom" v-show="iconF"></i>{{ menuItem.label}}</span>
        <div class="menu-list" ref="towmenu"><p v-for='(item, index) in menuItem.children' class="Qname" v-if="menuItem.itemtype" @click="btnName('username')"><span style="margin-left: 20px">{{item.label}}</span></p></div>
      </div>
       <div class="btn" @click="btnName(menuItem)" v-for="(menuItem, key, index) in createMenu">{{ key }}</div>
    </div>

  </div>
</template>

<script>
  import username from './inputText/index.vue'
  import gender from './gender/index.vue'
  import phoneNumber from './phoneNumber/index.vue'
  import dateBirth from './date/index.vue'
  import addressText from './addressText/index.vue'
  import recentlyState from './recentlyState/index.vue'
  import index from 'vue'

  export default {
    name: "TemplateEdit",
    data() {
      return {
        style: {
          left: '430px'
        },
        borS: false,
        listDiv: [],
        language: {
          'a': ['官洲啊', '驱蚊器二达群', '按单位'],
          'b': ['官洲啊', '脾气哦我了群', '按单位'],
          'c': ['官洲啊', '爱仕达群', '按单位'],
          'd': ['官洲啊', '跑跑看了群', '按安全无儿女'],
          'e': ['官洲啊', '爱仕达群', '的加我'],
        },
        inNumber: 0,
        iconSh: false,
        iconF:true,
        rightList: '',
        shFlag: false,
        createList: [],
        inputText: [],
        arr: [],
        elements: [],
        createMenu: [],
        twoMenu: [],
        MenuText: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dragT: true
      }
    },
    computed: {
    },
    components: {
      username,
      gender,
      phoneNumber,
      dateBirth,
      addressText,
      recentlyState
    },
    mounted() {
      this.rightList = Object.keys(this.language)[0]
      this.$nextTick(()=>{
        let _this = this
        this.getRequest('/sfmanage/flupedit/question/query').then(function (res) {
          alert('成功')
          _this.createMenu = res.data
          var tempdtypelist = []
          var dtypeindex =0
          for(let i = 1;i<_this.createMenu.length;i++){
            dtypeindex = tempdtypelist.indexOf(_this.createMenu[i].Dtype)
            if (_this.createMenu[i].Dtype != 1){
              if ( _this.twoMenu[dtypeindex] == undefined){
                _this.twoMenu.push({
                  id:i,
                  label:_this.createMenu[i].Dtype,
                  itemtype:_this.createMenu[i].itemtype,
                  children:[]
                })
              }
              if (dtypeindex == '-1'){
                tempdtypelist.push(_this.createMenu[i].Dtype)
                dtypeindex=tempdtypelist.indexOf(_this.createMenu[i].Dtype)
                if ( _this.twoMenu[dtypeindex] == undefined){
                  _this.twoMenu.push({
                    id:i,
                    label:_this.createMenu[i].Dtype,
                    itemtype:_this.createMenu[i].itemtype,
                    children:[]
                  })
                }
                _this.twoMenu[dtypeindex].children.push(
                  {
                    label: _this.createMenu[i].QNAME,
                    id:_this.createMenu[i].QNAME
                  }
                )
              } else {
                _this.twoMenu[dtypeindex].children.push(
                  {
                    label: _this.createMenu[i].QNAME,
                    id:_this.createMenu[i].QNAME
                  }

                )
              }}
            }
//            if (_this.createMenu[i].Dtype = _this.MenuText[i]) {
//              console.log(_this.createMenu[i].QNAME)
//              console.log(_this.createMenu[i].Dtype)
//              _this.MenuText.手术信息.push(_this.createMenu[i].QNAME)
//            }
          console.dir(_this.twoMenu)
          _this.twoMenu = Array.from(new Set(_this.twoMenu))
           console.log(_this.twoMenu)
        }).catch(function (error) {
          console.log(error)
        })
      })
    },
    methods: {
      allow () {
        this.dragT = true
      },
      drad (){
          this.dragT = false
      },
      openMenu (menuItem, index) {
        let _this = this
        menuItem.itemtype = !menuItem.itemtype
        if (_this.iconSh != true){
          alert(1)
          _this.iconSh = true
          _this.iconF = false
        }else{
          alert()
          _this.iconSh = false
          _this.iconF = true
        }

      },
      close() {
        this.shFlag = false
      },
      addText() {
        this.shFlag = true
      },
      btnName(username) {
        this.arr.push(username)
        console.log(this.arr)
        this.elements.push({
          top: this.elements.length * 50 + 10,
          left: 0,
          width: 221,
          height: 26
        })
      },
      move(e, currentIndex) {
        if (this.dragT){
          let mouseDownX = e.clientX // 鼠标按下时的初始位置
          let mouseDownY = e.clientY
          // 当前初始化的值
          let Top0 = this.elements[currentIndex].top
          let left0 = this.elements[currentIndex].left
          document.onmousemove = (e) => {
            //鼠标按下并移动的事件
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - mouseDownX
            let top = e.clientY - mouseDownY
            //移动当前元素
            this.elements[currentIndex].left = left + left0
            this.elements[currentIndex].top = top + Top0
            if (this.elements[currentIndex].left < 0) {
              this.elements[currentIndex].left = 0
            }
            if (this.elements[currentIndex].top < 0) {
              this.elements[currentIndex].top = 0
            }
            if (this.elements[currentIndex].left >= 840) {
              this.elements[currentIndex].left = 840
            }
            if (this.elements[currentIndex].top > 845) {
              this.elements[currentIndex].top = 840
            }
          }
        }
        document.onmouseup = (e) => {
          //       this.borS = false
          document.onmousemove = null
          document.onmouseup = null
        };

      },
      scale(e, currentIndex, posi) {
        if (this.dragT){
          let mouseDownX = e.clientX // 鼠标按下时的位置
          let mouseDownY = e.clientY
          let Top0 = this.elements[currentIndex].top
          let left0 = this.elements[currentIndex].left
          let height0 = this.elements[currentIndex].height
          let width0 = this.elements[currentIndex].width
          document.onmousemove = e => {
            let left = e.clientX - mouseDownX
            let top = e.clientY - mouseDownY
            console.log(posi)
            switch (posi) {
              case 'top':
                this.elements[currentIndex].top = Top0 + top
                this.elements[currentIndex].height = height0 - top
                break
              case 'bottom':
                this.elements[currentIndex].height = height0 + top
                break
              case 'left':
                this.elements[currentIndex].left = left0 + left
                this.elements[currentIndex].width = width0 - left
                break
              case 'right':
                this.elements[currentIndex].width = width0 + left
                break
            }
          }
        }

        document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .design, .preview, .keep
    display inline-block
    width 60px
    height 30px
    line-height 30px
    font-weight 700
    background-color #20a0ff
    border-radius 5px
    color #ffffff
    cursor pointer
  .edit
    border 1px solid #bdbbbb
    padding 10px 0
    width 800px
    min-height 870px
    border-radius 5px
    margin 0 auto
    position relative
    .user-name
      position absolute
      text-align left
      .inp-box
        display inline-block
        border 1px solid #bdbbbb
        .user-inp
          border 0
          margin-left 5px
          outline none
    .edge
      position absolute
      display inline-block
    .borderSize
      border 1px solid #000000

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

  .edit-menu
    position fixed
    right 253px
    top 145px
    width 220px
    height 870px
    border 1px solid #cccccc
    border-radius 5px
    text-align left
    .menu-box:hover
      background-color #f5f7fa
    .menu-box
      .menu-list
        width 100%
        .Qname
          font-size 14px
        .Qname:hover
          background-color #ebedf0
          cursor pointer
    .btn
      height 40px
      line-height 40px
    .btn:hover
      background-color #cccccc
</style>


