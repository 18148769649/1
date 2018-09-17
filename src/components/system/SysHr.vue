<template>
  <div style="margin-top: 10px" v-loading="fullloading">
    <div style="height: 80vh">
    <div style="margin-bottom: 10px;display: flex;justify-content: center;align-items: center">
      <el-input
        placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
        v-model="keywords">
      </el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="dialogVisible =true"> 添加新用户</el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <div v-if="false">
        <el-card style="width: 350px;margin-bottom: 20px" v-for="(item,index) in hrs" :key="item.id"
                 v-loading="cardLoading[index]">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button type="text"
                       style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                       icon="el-icon-delete" @click="deleteHr(item.id)"></el-button>
          </div>
          <div>
            <div style="width: 100%;display: flex;justify-content: center">
              <img :src="item.userface" alt="item.name" style="width: 70px;height: 70px;border-radius: 70px">
            </div>
            <div style="margin-top: 20px">
              <div><span class="user-info">用户名:{{item.name}}</span></div>
              <div><span class="user-info">手机号码:{{item.phone}}</span></div>
              <div><span class="user-info">电话号码:{{item.telephone}}</span></div>
              <div><span class="user-info">地址:{{item.address}}</span></div>
              <div class="user-info" style="display: flex;align-items: center;margin-bottom: 3px">
                用户状态:
                <el-switch
                  style="display: inline;margin-left: 5px"
                  v-model="item.enabled"
                  active-color="#13ce66"
                  inactive-color="#aaaaaa"
                  active-text="启用"
                  :key="item.id"
                  @change="switchChange(item.enabled,item.id,index)"
                  inactive-text="禁用">
                </el-switch>
              </div>
              <div class="user-info">
                用户角色:
                <el-tag
                  v-for="role in item.roles"
                  :key="role.id"
                  type="success"
                  size="mini"
                  style="margin-right: 5px"
                  :disable-transitions="false">{{role.nameZh}}
                </el-tag>
                <el-popover
                  v-loading="eploading[index]"
                  placement="right"
                  title="角色列表"
                  width="200"
                  @hide="updateHrRoles(item.id,index)"
                  :key="item.id"
                  trigger="click">
                  <el-select v-model="selRoles" multiple placeholder="请选择角色">
                    <el-option
                      v-for="ar in allRoles"
                      :key="ar.id"
                      :label="ar.nameZh"
                      :value="ar.id">
                    </el-option>
                  </el-select>
                  <el-button type="text" icon="el-icon-more" style="color: #09c0f6;padding-top: 0px" slot="reference"
                             @click="loadSelRoles(item.roles,index)" :disabled="moreBtnState"></el-button>
                  <!--                <i class="el-icon-more" style="color: #09c0f6;cursor: pointer" slot="reference"
                                     @click="loadSelRoles(item.roles,index)" disabled="true"></i>-->
                </el-popover>
              </div>
              <div><span class="user-info">备注:{{item.remark}}</span></div>
            </div>
          </div>
        </el-card>
      </div>
      <el-table
        :data="temphrs"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="telephone"
          label="座机"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="phone"
          label="手机"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="address"
          label="地址"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="enabled"
          label="是否启用"
          :formatter="$SelfUtils.statusfilter"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="roles"
          label="角色"
          :formatter="arrayfilter"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300px"
          align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="editHR(scope.row)">编辑</el-button>
            <el-button icon="el-icon-refresh" type="warning" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button icon="el-icon-delete"  type="danger" size="mini" @click="deleteHr(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
    <pagepagination
      :pageDataSizes=pagingData.pagesizes
                    :pageDataSize=pagingData.pagesize
                    :PageDatanum=pagingData.pagingTotal
                    :pageShowStatus=pagingData.pagingShow
      @change="PageAction"
      @currentDataPage="PageAction"
      @ChangeSize="PageChangeSize"
    ></pagepagination>
    <el-dialog
      title="添加新用户"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="USERFORM" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24">
            <el-col :span="8">
              用户名:
            </el-col>
            <el-form-item>
              <el-col :span="16">
                <el-input v-model="USERFORM.name"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              用户登录名:
            </el-col>
            <el-form-item>
              <el-col :span="16">
                <el-input v-model="USERFORM.username" @blur="checkusername(USERFORM.username)"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :span="24">
              <span
                v-if="formstatus.useinfo"
                style="color:red"
              >
                该用户名已经存在
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              <span>用户座机:</span>
            </el-col>
            <el-form-item>
              <el-col :span="16">
                <el-input v-model="USERFORM.phone"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              用户电话:
            </el-col>
            <el-form-item>
              <el-col :span="16">
                <el-input v-model="USERFORM.telephone"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              用户地址:
            </el-col>
            <el-form-item>
              <el-col :span="16">
                <el-input v-model="USERFORM.address"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              <span>用户密码:</span>
            </el-col>

            <el-form-item prop="password">
              <el-col :span="16">
                <el-input type="password" v-model="USERFORM.password"></el-input>
              </el-col>
            </el-form-item>


          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              <span>再次输入用户密码:</span>
            </el-col>

            <el-form-item prop="checkPass">
              <el-col :span="16">
                <el-input type="password" v-model="repassword"></el-input>
              </el-col>
            </el-form-item>


          </el-col>
          <el-col :span="24">
            <div class="user-info">
              <el-col :span="8">
                <span>用户角色:</span>
              </el-col>
              <el-select v-model="USERFORM.roles" multiple placeholder="请选择角色">
                <el-option
                  v-for="ar in allRoles"
                  :key="ar.id"
                  :label="ar.nameZh"
                  :value="ar.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              <span>用户状态:</span>
            </el-col>
            <el-switch
              v-model="USERFORMENABLED"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
            >
            </el-switch>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addusr" :disabled="formstatus.useinfo">确 定</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="updatehr"
      width="40%">
      <el-row>
        <el-col :span="24">
            <div slot="header" class="clearfix">
              <span>{{USEINFO.name}}</span>
            </div>
            <div>
              <div style="margin-top: 15px;padding: 5px;">
                <el-row :gutter="10">
                  <el-col :span="5">
                    用户名:
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="USEINFO.name"></el-input>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="5">
                    手机号码:
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="USEINFO.phone"></el-input>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="5">
                    电话号码:
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="USEINFO.telephone"></el-input>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="5">
                    地址:
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="USEINFO.address"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="5">
                    备注:
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="USEINFO.remark"></el-input>
                  </el-col>
                </el-row>
              </div>
              <div class="user-info" style="">
                  用户状态:
                  <el-switch
                    style="display: inline;margin-left: 5px"
                    v-model="USEINFO.enabled"
                    active-color="#13ce66"
                    inactive-color="#aaaaaa"
                    active-text="启用"
                    :key="USEINFO.id"
                    @change="switchChange(USEINFO.enabled,USEINFO.id,1)"
                    inactive-text="禁用">
                  </el-switch>
              </div>
              <div class="user-info">
                  用户角色:
                  <el-tag
                    v-for="role in USEINFO.roles"
                    :key="role.id"
                    type="success"
                    size="mini"
                    style="margin-right: 5px"
                    :disable-transitions="false">{{role.nameZh}}
                  </el-tag>
                  <el-popover
                    placement="right"
                    title="角色列表"
                    width="200"
                    @hide="updateHrRoles(USEINFO.id,index)"
                    :key="USEINFO.id"
                    trigger="click">
                    <el-select v-model="selRoles" multiple placeholder="请选择角色">
                      <el-option
                        v-for="ar in allRoles"
                        :key="ar.id"
                        :label="ar.nameZh"
                        :value="ar.id">
                      </el-option>
                    </el-select>
                    <el-button type="text" icon="el-icon-more" style="color: #09c0f6;padding-top: 0px" slot="reference"
                               @click="loadSelRoles(USEINFO.roles,index)" :disabled="moreBtnState"></el-button>
                    <!--                <i class="el-icon-more" style="color: #09c0f6;cursor: pointer" slot="reference"
                                       @click="loadSelRoles(item.roles,index)" disabled="true"></i>-->
                  </el-popover>
              </div>
                <!--<div><span class="user-info">备注:{{USEINFO.remark}}</span></div>-->
              </div>


        </el-col>
        <el-col style="float: right;">
          <el-button size="small" type="primary" @click="updatehr = false">取消</el-button>
          <el-button size="small" type="primary" @click="updateHRdata">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

  import Pagepagination from "../pagepagination/index";

  export default {


    components: {Pagepagination},
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.USERFORM.password !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.repassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        keywords: '',
        fullloading: false,
        hrs: [],

        cardLoading: [],
        eploading: [],
        allRoles: [],
        moreBtnState: false,
        selRoles: [],
        selRolesBak: [],
        dialogVisible: false,//添加/修改用户模态框
        updatehr: false,//用户模态框
        USERFORM: {
          name: '',
          phone: '',
          telephone: "",
          address: '',
          enabled: 1,
          username: "",
          password: "",
          remark: '',
          userface: "",
          roles: []
        },
        USERFORMROLES: [],
        USERFORMENABLED: true,
        repassword: "", //再次输入用户密码
        rules2: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        formstatus: {
          useinfo: false,//检查用户名注册是否存在
        },
        USEINFO: {}, //修改模态框数据
        USEPW:{},//密码重置
        pagingData:{
          pagingTotal:1, //总条数
          pagingShow :true, //展示与否
          pagesize:20, //初始页面大小
          pagesizes:[3,20,50,100,150],  //分页 每页大小
          currentpage:1, //去往第几页
          pagenum:1
        },
      }
    },
    mounted: function () {
      this.initCards();
      this.loadAllRoles();
    },
    methods: {
      //数组格式化方法
      arrayfilter(row, column, d) {
        let data = ''

        if (d != undefined) {

          for (let i in d) {
            data = data + "  " + d[i]['nameZh']
          }
          return data
        } else {
          return d
        }
      },
      searchClick() {
        this.initCards();
        this.loadAllRoles();
      },
      updateHrRoles(hrId, index) {
        this.moreBtnState = false;
        var _this = this;
        if (this.selRolesBak.length == this.selRoles.length) {
          for (var i = 0; i < this.selRoles.length; i++) {
            for (var j = 0; j < this.selRolesBak.length; j++) {
              if (this.selRoles[i] == this.selRolesBak[j]) {
                this.selRolesBak.splice(j, 1);
                break;
              }
            }
          }
          if (this.selRolesBak.length == 0) {
            return;
          }
        }
        this.eploading.splice(index, 1, true)
        this.putRequest("/system/hr/roles", {
          hrId: hrId,
          rids: this.selRoles
        }).then(resp => {
          _this.eploading.splice(index, 1, false);
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            if (data.status == 'success') {
              _this.refreshHr(hrId, index);
            }
          }
        });
      },
      refreshHr(hrId, index) {
        var _this = this;
        _this.cardLoading.splice(index, 1, true)
        this.putRequest("/system/hr/id/" + hrId).then(resp => {
          _this.cardLoading.splice(index, 1, false)
          _this.hrs.splice(index, 1, resp.data);
        })
      },
      loadSelRoles(hrRoles, index) {
        this.moreBtnState = true;
        this.selRoles = [];
        this.selRolesBak = [];
        hrRoles.forEach(role => {
          this.selRoles.push(role.id)
          this.selRolesBak.push(role.id)
        })
      },
      loadAllRoles() {
        var _this = this;
        this.getRequest("/system/basic/roles").then(resp => {
          _this.fullloading = false;
          if (resp && resp.status == 200) {
            _this.allRoles = resp.data;
          }
        })
      },
      switchChange(newValue, hrId, index) {
        var _this = this;
        _this.cardLoading.splice(index, 1, true)
        this.putRequest("/system/hr/", {
          enabled: newValue,
          id: hrId
        }).then(resp => {
          _this.cardLoading.splice(index, 1, false)
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            if (data.status == 'error') {
              _this.refreshHr(hrId, index);
            }
          } else {
            _this.refreshHr(hrId, index);
          }
        })
      },
      initCards() {
        this.fullloading = true;
        var _this = this;
        var searchWords;
        if (this.keywords === '') {
          searchWords = 'all';
        } else {
          searchWords = this.keywords;
        }
        this.getRequest("/system/hr/" + searchWords).then(resp => {
          if (resp && resp.status == 200) {
            _this.hrs = resp.data;
            console.log(resp.data, '当前操作员数据')

            _this.pagingData.pagingTotal = resp.data.length
            var length = resp.data.length;
            _this.cardLoading = Array.apply(null, Array(length)).map(function (item, i) {
              return false;
            });
            _this.eploading = Array.apply(null, Array(length)).map(function (item, i) {
              return false;
            });
          }
        })
      },
      deleteHr(hrId) {
        var _this = this;
        this.fullloading = true;
        this.deleteRequest("/system/hr/" + hrId).then(resp => {
          _this.fullloading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            if (data.status == 'success') {
              _this.initCards();
              _this.loadAllRoles();
            }
          }
        })
      },
      addusr() {
        var _this = this
        if (this.USERFORMENABLED == true) {
          this.USERFORM.enabled = 1
        } else {
          this.USERFORM.enabled = 0
        }
        this.$refs['ruleForm2'].validate((valid) => {
          if (valid) {
            console.log('aaaa')
            this.postRequest("/system/hr/add", {
              name: this.USERFORM.name,
              phone: this.USERFORM.phone,
              telephone: this.USERFORM.telephone,
              address: this.USERFORM.address,
              enabled: this.USERFORMENABLED,
              username: this.USERFORM.username,
              password: this.USERFORM.password,
              remark: "",
              userface: "",
              roles: this.USERFORM.roles
            }).then(resp => {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {

                  console.log(resp, '新增用户')
                  _this.dialogVisible = false
                }
              }
            )

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      checkusername(username) {
        var that = this
        this.postRequest("/system/hr/checkHr", {
          username: username,
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp.data[0])

            if (resp.data[0].num != undefined) {
              if (resp.data[0].num != 0) {
                that.formstatus.useinfo = true
              } else {

                that.formstatus.useinfo = false
              }
            }
          }
        })
      }, //检查是否数据库存在该用户名
      editHR(row) {
        console.log(row, 'aaaa')
        this.USEINFO = row
        this.updatehr = true
      },
      //重置密码
      resetPassword(row){
        var _this = this
        this.USEINFO = row
        this.putRequest("/system/hr/resetPW", {
          password: '123',
          ordrowid:this.USEINFO.ordrowid,
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: '重置密码为123'});
            this.updatehr = false
            if (data.status == 'error') {
              _this.$message({type:'error',message:'错误'})
            }
          } else {
            _this.$message({type:'error',message:'服务器错误'})
          }
        })
      },

      updateHRdata() {
        var _this = this
        this.putRequest("/system/hr/mm", {
          name: this.USEINFO.name,
          phone: this.USEINFO.phone,
          telephone: this.USEINFO.telephone,
          address: this.USEINFO.address,
          username: this.USEINFO.username,
          remark: this.USEINFO.remark,
          id: this.USEINFO.id,
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
      }, //更新操作员
      PageAction(val){
        var that=this
        this.pagingData.pagenum =val
      }, //切换页面动作
      PageChangeSize(val){
        this.pagingData.pagesize = val
        console.log(val,'改变大小')
      },
    },
    computed:{
      temphrs(){
        return this.hrs.slice(this.pagingData.pagesize*(this.pagingData.pagenum-1),this.pagingData.pagesize*this.pagingData.pagenum)
      }
    }

  }
</script>
<style>
  .user-info {
    font-size: 12px;
    color: #09c0f6;
  }
</style>
