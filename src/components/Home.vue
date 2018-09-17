<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">随访管理系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-badge style="margin-right: 30px" :is-dot="this.$store.state.nfDot">
            <i class="fa fa-bell-o" @click="goChat" style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
    {{user.name}}
    <i><img v-if="user.userface!=''" :src="user.userface"
            style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
  </span>
            <el-dropdown-menu slot="dropdown" style="text-align: center;font-size: 24px;font-weight: bold;">
              <el-dropdown-item command="person">个人资料</el-dropdown-item>
              <el-dropdown-item command="upsetPW">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <el-menu style="background: #ececec;width: 180px;" unique-opened router>
              <template v-for="(item,index) in this.routes" v-if="!item.hidden">
                <el-submenu :key="index" :index="index+''">
                  <template slot="title">
                    <i :class="item.iconCls" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>

                  <template v-if="item.children[0].children.length !=0">
                    <el-submenu
                      width="180px"
                      style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                      v-for="(child,index1) in item.children"
                      :index="child.path"
                      :key="child.path"
                    >
                      <template slot="title">
                        {{child.name}}
                      </template>
                      <el-menu-item
                        v-for="(son,index2) in child.children"
                        :index="son.path"
                        :key="son.path"
                      >
                        {{son.name}}
                      </el-menu-item>
                    </el-submenu>
                  </template>
                  <template v-else>
                    <el-menu-item width="180px"
                    style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                    v-for="child in item.children"
                    :index="child.path"
                    :key="child.path">{{child.name}}
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!this.$route.meta.keepAlive"></router-view>
            <router-view class="viewtable1" name="tablebtn" > </router-view>

            <router-view class="viewtable2" name="tablemain"  ></router-view>
            <!--<main-content></main-content>-->


            <router-view class="viewtable3" name="tablemainPage"  ></router-view>

          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog  title="修改密码"
                :visible.sync="psw.dialogstatus"
                width="40%">
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            原密码：
          </el-col>
          <el-col :span="18">
            <el-input v-model="psw.oldpassword"  type="password"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            新密码：
          </el-col>
          <el-col :span="18">
            <el-input v-model="psw.newpassword" type="password"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            确认新密码：
          </el-col>
          <el-col :span="18">
            <el-input v-model="psw.renewpassword" type="password"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="23">
          <el-button @click="psw.dialogstatus = false">取 消</el-button>
          <el-button type="primary" @click="updatepassword">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="查看&修改用户"
      :visible.sync="updatehr"
      width="40%">
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            用户名:
          </el-col>
          <el-col :span="18">
            <el-input v-model="user.name"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            手机号码:
          </el-col>
          <el-col :span="18">
            <el-input v-model="user.phone"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            电话号码:
          </el-col>
          <el-col :span="18">
            <el-input v-model="user.telephone"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            地址:
          </el-col>
          <el-col :span="18">
            <el-input v-model="user.address"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="22">
          <el-col :span="6">
            备注:
          </el-col>
          <el-col :span="18">
            <el-input v-model="user.remark"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px;">
        <el-col :span="23">
          <el-button size="small"  @click="updatehr = false">取消</el-button>
          <el-button size="small" type="primary" @click="updateHRdata">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

  import Template from "../page/Flup/SFMANAGE/Template/index";
  import ElDialog from "element-ui/packages/dialog/src/component";
  import ElButton from "element-ui/packages/button/src/button";

  export default{
    components: {
      ElButton,
      ElDialog,
      Template
    },
    mounted: function () {
//      this.devMsg();
      this.loadNF();
    },
    methods: {
      loadNF(){
        var _this = this;
        this.getRequest("/chat/sysmsgs").then(resp=> {
          var isDot = false;
          resp.data.forEach(msg=> {
            if (msg.state == 0) {
              isDot = true;
            }
          })
          _this.$store.commit('toggleNFDot', isDot);
        })
      },
      goChat(){
        this.$router.push({path: '/chat'});
      },
      devMsg(){
        this.$alert('为了确保所有的小伙伴都能看到完整的数据演示，数据库只开放了查询权限和部分字段的更新权限，其他权限都不具备，完整权限的演示需要大家在自己本地部署后，换一个正常的数据库用户后即可查看，这点请大家悉知!', '友情提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$notify({
              title: '重要重要!',
              type: 'warning',
              message: '小伙伴们需要注意的是，目前只有权限管理模块完工了，因此这个项目中你无法看到所有的功能，除了权限管理相关的模块。权限管理相关的模块主要有两个，分别是 [系统管理->基础信息设置->权限组] 可以管理角色和资源的关系， [系统管理->操作员管理] 可以管理用户和角色的关系。',
              duration: 0
            });
          }
        });
      },
      handleCommand(cmd){
        var _this = this;
        if (cmd == 'logout') {
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.getRequest("/logout");
            _this.$store.commit('logout');
            _this.$router.replace({path: '/'});
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }else if(cmd == 'upsetPW'){
          _this.psw.dialogstatus =true
        }else if(cmd == 'person'){
          _this.updatehr =true
        }
      },
      updateHRdata() {
        var _this = this
        this.putRequest("/system/hr/mm", {
          name: this.user.name,
          phone: this.user.phone,
          telephone: this.user.telephone,
          enable:'1',
          address: this.user.address,
          username: this.user.username,
          remark: this.user.remark,
          id: this.user.id,
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            this.updatehr = false
            if (data.status == 'error') {
              _this.$message({type:'error',message:'错误'})
            }
          } else {
            _this.$message({type:'error',message:'服务器错误'})
          }
        })
      },
      updatepassword(){
        var _this=this
        if(this.psw.newpassword == '' | this.psw.renewpassword == ''){
          _this.$message({
            type: 'warning',
            message: '密码不可为空'
          });
        }
        else if(this.psw.newpassword == this.psw.oldpassword){
          _this.$message({
            type: 'warning',
            message: '新旧密码不可一致'
          });
        }else if(this.psw.newpassword != this.psw.renewpassword){
          _this.$message({
            type: 'warning',
            message: '两次密码不一样'
          });
        }else{
          var _this = this;
          this.putRequest("/system/hr/updatePW",{
            OLDPASSWORD:_this.psw.oldpassword,
            PASSWORD:_this.psw.newpassword
          }).then(resp=> {
            if (resp && resp.status == 200) {
              _this.$message({
                type: 'success',
                message: '成功更改'
              });
              _this.psw.dialogstatus = false
              _this.getRequest("/logout");
              _this.$store.commit('logout');
              _this.$router.replace({path: '/'});
            }
          })
        }
      }
    },
    data(){
      return {
        isDot: false,
        updatehr: false,//用户模态框
        psw:{
          dialogstatus:false,
          oldpassword:'',//'旧密码',
          newpassword:"",//新密码
          renewpassword:"",//再输的新密码
        }
      }
    },
    computed: {
      user(){
        return this.$store.state.user;
      },
      routes(){
        // let temproutes=[]
        // let temproutesnames=[]
        // let routeindex=0
        // let routechildren={}
        // if(this.$store.state.routes.length != 0) {
        //
        //   for (let i in  this.$store.state.routes) {
        //     for (let j in this.$store.state.routes[i].children) {
        //       if (temproutesnames[i] == undefined) {
        //         temproutesnames[i] = [] //初始化temproutesnames
        //       }
        //       routeindex = temproutesnames[i].indexOf(this.$store.state.routes[i].children[j].name) //获取当前
        //
        //       if (routeindex == '-1') {
        //         if (temproutes[i] == undefined) {
        //           routechildren = JSON.parse(JSON.stringify(this.$store.state.routes[i]))
        //           routechildren.children = []
        //           temproutes[i] = routechildren
        //         }
        //         temproutes[i].children.push(this.$store.state.routes[i].children[j])
        //         temproutesnames[i].push(this.$store.state.routes[i].children[j].name)
        //       } else {
        //         temproutes[i].children[routeindex].children.push(this.$store.state.routes[i].children[j])
        //       }
        //     }
        //   }
        //
        // }else{
        //   temproutes =
        // }
        // console.log(temproutes,'路由加载')
        console.log(this.$store.state.routes)

        return this.$store.state.routes
      }
    },
    watch:{
      "$route" (){

        this.$store.state.ROUTEINFO = this.$route.params.visittype
        //console.log('route',this.$store.state.ROUTEINFO)
      }
    }
  }
</script>
<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>
