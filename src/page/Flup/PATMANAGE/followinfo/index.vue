<template>
  <div>

    <div style="height: 60vh">
      <DataSearch
        @refresh="initTemplateData"
        @add="addinfo"
        :moduleinfo="moduleinfo"
        :pagingData="pagingData"
        ref="searchmodule"
      >
        <el-col :span="2" slot="otherbutton1">
          <el-button type="primary" size="small" @click="getFlupData()"  plain >新建随访任务</el-button>
        </el-col>
        <el-col :span="2"  slot="otherbutton2" v-show="false">
          <el-button type="primary" size="small"  plain  @click="sendMessageVisible = true">发送短信</el-button>
        </el-col>


      </DataSearch>
      <el-table
        ref="multipleTable1"
        :data="tableData6"
        height="35vh"
        border
        v-if="tablestatus"
        highlight-current-row
        @row-click="clickrow"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          style="width:10%;">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row :gutter="10">
                <el-col  :span="11">
                  <el-form-item label="ID">
                    <span>{{ props.row.PATID }}</span>
                  </el-form-item>
                </el-col>
                <el-col  :span="11">
                  <el-form-item label="姓名">
                    <span>{{ props.row.PATNAME }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col  :span="11">
                  <el-form-item label="性别">
                    <span>{{ props.row.PATSEX }}</span>
                  </el-form-item>
                </el-col>
                <el-col  :span="11">
                  <el-form-item label="联系人姓名">
                    <span>{{ props.row.AMAN }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="电话">
                    <span>{{ props.row.TEL }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="qq">
                    <span>{{ props.row.QQ }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="邮箱">
                    <span>{{ props.row.EMAIL }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="住址">
                    <span>{{ props.row.ADDRESS }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="PATNAME"
          align="center">
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          prop="PATSEX">
        </el-table-column>
        <el-table-column
          label="ID"
          align="center"
          prop="PATID">
        </el-table-column>
        <el-table-column
          label="生日"
          align="center"
          prop="BOTHYEAR">
        </el-table-column>
        <el-table-column
          label="联系人姓名"
          align="center"
          prop="AMAN">
        </el-table-column>
        <el-table-column
          label="联系方式"
          align="center"
          prop="TEL">
        </el-table-column>
        <el-table-column
          label="地址"
          align="center"
          prop="ADDRESS">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button-group>

              <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            </el-button-group>
            <el-button size="mini" icon="el-icon-delete"  type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <pagepagination
        :pageDataSizes=pagingData.pagesizes
        :pageDataSize=pagingData.pagesize
        :PageDatanum=pagingData.pagingTotal
        :pageShowStatus=pagingData.pagingShow
        @change="PageAction"
        @currentDataPage="PageAction"
        @ChangeSize="PageChangeSize"
      ></pagepagination>
    </div>

    <!--用户*修改新增模态框-->

    <el-dialog title="用户编辑列表" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="mubanform" ref="mubanforminfo">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="姓名" prop="PATNAME">
              <el-input v-model="mubanform.PATNAME" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-row style="margin-top: 1.7vh;text-align: left">
              <el-col :span="24">
                <span>性别</span>
              </el-col>
              <el-col :span="24">
                <el-select v-model="mubanform.PATSEX"  placeholder="请选择性别" style="width: 100%">
                  <el-option :key="'男'" :label="'男'" :value="'男'"> </el-option>
                  <el-option :key="'女'" :label="'女'" :value="'女'"></el-option>
                </el-select>
              </el-col>
            </el-row>


            <!--<el-form-item label="性别" prop="PATSEX">-->
              <!--<el-input v-model="mubanform.PATSEX" auto-complete="off" clearable></el-input>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查ID" prop="PATID">
              <el-input v-model="mubanform.PATID" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="年龄" prop="PATAGE">
              <el-input v-model="mubanform.PATAGE" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-row style="margin-top: 1.7vh;text-align: left">
              <el-col :span="24">
                <span>出生日期</span>
              </el-col>
              <el-col :span="24">
              <el-date-picker
                style="width: 100%"
                v-model="mubanform.BOTHYEAR"
                type="date"
                placeholder="选择日期" clearable>
              </el-date-picker>
              <!--<el-input v-model="mubanform.BOTHYEAR" auto-complete="off" clearable></el-input>-->
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-form-item label="ISYEAR" prop="ISYEAR">
              <el-input v-model="mubanform.ISYEAR" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label=" 联系人姓名:" prop="AMAN">
              <el-input v-model="mubanform.AMAN" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-row style="margin-top: 1.7vh;text-align: left">
              <el-col :span="24">
                <span>性别</span>
              </el-col>
              <el-col :span="24">
                <el-select v-model="mubanform.AMSEX"  placeholder="请选择性别" style="width: 100%">
                  <el-option :key="'男'" :label="'男'" :value="'男'"> </el-option>
                  <el-option :key="'女'" :label="'女'" :value="'女'"></el-option>
                </el-select>
              </el-col>
            </el-row>


              <!--<el-input v-model="mubanform.AMSEX" auto-complete="off" clearable></el-input>-->

          </el-col>
          <el-col :span="8">
            <el-form-item label="地址" prop="ADDRESS">
              <el-input v-model="mubanform.ADDRESS" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="电话" prop="TEL">
              <el-input v-model="mubanform.TEL" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="QQ" prop="QQ">
              <el-input v-model="mubanform.QQ" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="EMAIL">
              <el-input v-model="mubanform.EMAIL" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="EMSG" prop="EMSG">
              <el-input v-model="mubanform.EMSG" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="标记" prop="REMARK">
              <el-input v-model="mubanform.REMARK" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="最后检查时间" prop="LASTCHECKDATE">
              <el-date-picker
                v-model="mubanform.LASTCHECKDATE"
                type="date"
                placeholder="选择日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24" style="text-align: right">
            <el-form-item prop="pass">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateuseinfo('form')">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog  title="发送短信"  :visible.sync="sendMessageVisible" width="60%">
        <!--<el-select  >-->
          <!--<el-option></el-option>-->
        <!--</el-select >-->
      <el-button @click="sendmessage">发送短信</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import $ from 'jquery'
  import Pagepagination from "@/components/pagepagination/index";
  import Template from "../../SFMANAGE/Template/index";
  import DataSearch from '@/components/DataSearch/index';

  export default {
    name: "followinfo",
    components: {

      Template,
      Pagepagination,
      DataSearch
    },
    computed: {
      tableData6() {
        console.log('当前随访表数据', this.$store.state.Flup.patlist)
        return this.$store.state.Flup.patlist
      }
    },
    data() {
      return {
        multipleSelection: [],
        value: '',
        //actiontype:'',//用于控制批量操作方法为重置还是删除   reset/delete
        stringmessage: '',//控制弹出消息内容
        stringmethod: 'success',//控制消息类型 success warning
        UpdateORInsertStatus: false,//控制更新模块为更新还是新增  默认更新
        dialogTableVisible: false,//编辑模态框状态
        dialogFormVisible: false,//模态框
        sendurl: '',
        mubanform: {
          PATNAME: '', //姓名
          PATSEX: '', //性别
          PATID: '', // ID
          PATAGE: '', // 年龄
          BOTHYEAR: '',//出生日期
          BOTNINA: '', //
          ISBOTH: '', //
          ISYEAR: '',
          AMAN: '',//联系人姓名
          AMSEX: '',//联系人性别
          AMMOTH: '', //
          ADDRESS: '', //地址
          TEL: '', //电话
          QQ: '', //QQ
          EMAIL: '',//邮箱
          EMSG: '', //
          REMARK: '', //标记
          LASTCHECKDATE: '',//最后检查时间
          CREATOR: '',//创建人
          CREATESDATE: '',//创建时间
          ORDROWID: '',
        },
        pagingData: {
          pagingTotal: 1, //总条数
          pagingShow: true, //展示与否
          pagesize: 20, //初始页面大小
          pagesizes: [2, 20, 50, 100, 150],  //分页 每页大小
          currentpage: 1,//去往第几页
          pagenum: 1

        },
        moduleinfo:{
          modulename:'patlist', //对应table在 vuex 中的key
          moduleurl:'/patmanage/followinfo/outpatient', //发送请求前缀
          Searchtips:'试试 姓名？联系人名？地址。。。', //搜索框提示文字
          initStatus:false,// 表示是否需要初始化数据
          typesinfo:[
            {
              SearchName:'性别',
              Searchprop:'PATSEX', //搜索参数
              typeMethod:'button', // 表示是按钮类型还是范围选择器类型
              SelectTypes: [
                {
                  key: '男',
                  label: '男',
                  type: ''
                },
                {
                  key: '女',
                  label: '女',
                  type: ''
                },
              ]  //按钮信息
            },
            {
              SearchName:'年龄',
              Searchprop:'PATAGE',
              typeMethod:'range',
              SelectTypes:
                [{
                  max:200,
                  values:[0,200]
                }]

            },
          ],
          extraData:[

            // {
            //   SearchName:'出生时间',
            //   Searchprop:'BOTHYEAR',
            //   typeMethod:'time',
            //   values:[]
            // },
            {
              SearchName:'最后检查时间',
              Searchprop:'checkdate',
              typeMethod:'time',
              values:[]
            },
      ]
        },
        Messagemoduleinfo:{
          modulename:'Message',
          moduleurl:'/sfmanage/message',
          initStatus:true,// 表示是否需要初始化数据
          Searchtips:'试试 信息名？。。。',
          typesinfo:[
            {
              SearchName:'消息类型',
              Searchprop:'TYPE',
              typeMethod:'button',
              SelectTypes: [

              ],
            },
            {
              SearchName:'所属科室',
              Searchprop:'DEPARTMENTS',
              typeMethod:'button',
              SelectTypes: [

              ],
            }
          ]
        },  //短信信息
        tablestatus: true,
        sendMessageVisible:false
      }
    },
    methods: {
      //初始化表格数据
      initTemplateData(){
        var that = this
        this.$refs.searchmodule.GETDATATYPE()
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中.........',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var that = this

        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.OutpatientQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: this.pagingData.pagenum,
            pagesize: this.pagingData.pagesize
          }
        }
        this.$SelfUtils.get(DATAoptions).then(function (e) {
          if (e != '[{"status":"400"}]') {
            that.tablestatus = false
            that.$store.state.Flup.patlist = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[1]
            that.$store.state.Flup.patlist = data.slice(1,)
            console.log('进入患者管理--消化内科', that.$store.state.Flup.patlist)
            that.pagingData.pagingTotal = parseInt(data[0].ORDROWID)
            that.tablestatus = true
            loading.close()
          } else {
            loading.close()
            that.$router.push({path: '/'})
          }
        })
      },

      getFlupData() {
        var that = this

        if (this.multipleSelection.length != 0) {

          // 获取计划表
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.PlanQuery,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              _xsrf: this.$store.state.Token,
              Ecreater: this.$store.state.user.ordrowid
              // usename: _this.$store.state.server.dictinfo.username
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              if (e != '[{"status":"400"}]') {

                console.log('新建随访入口', e)

                var data = e
                that.$store.state.Flup.PlanList = []
                that.$store.state.Flup.PlanSonList = []
                var tempdata = []  //计划列表
                var tempdatason = [] //计划子规则
                var entitydata = data
                var tmplf = [] //计划标题
                var Planindex = 0
                for (var i in entitydata) {
                  if (tmplf.indexOf(entitydata[i].PlanID) == -1) {
                    tempdata.push({
                      id: Planindex,
                      PlanID: entitydata[i].PlanID,
                      Plandes: entitydata[i].Plandes,
                      CTIME: entitydata[i].CTIME,
                      children: [
                        {
                          Roledes: entitydata[i].Roledes,
                          RoleItemID: entitydata[i].RoleItemID,
                          PlanID: entitydata[i].PlanID,
                          Plandes: entitydata[i].Plandes,
                          CTIME: entitydata[i].CTIME,
                          ename: entitydata[i].ename,
                          RoleItemList: entitydata[i].RoleItemList
                        }
                      ]
                    })
                    tmplf.push(entitydata[i].PlanID)
                    Planindex = Planindex + 1
                  } else {
                    tempdata[tmplf.indexOf(entitydata[i].PlanID)].children.push({
                      Roledes: entitydata[i].Roledes,
                      RoleItemID: entitydata[i].RoleItemID,
                      PlanID: entitydata[i].PlanID,
                      Plandes: entitydata[i].Plandes,
                      CTIME: entitydata[i].CTIME,
                      ename: entitydata[i].ename,
                      RoleItemList: entitydata[i].RoleItemList
                    })
                  }
                }
                console.log(tempdata)
                that.$store.state.Flup.PlanList = tempdata
                that.$store.state.Flup.PlanSonList = tempdatason
                that.$store.state.Flup.patlist = that.multipleSelection
                console.log('新建随访计划', that.$store.state.Flup.PlanList)
                that.$router.push({path: '/patmanage/cFlup'})

              }
            }
          })
        } else {
          this.$message.error('请最少选择一个患者后新建');
        }
      },
      messagebox() {

        this.$message({
          showClose: true,
          message: this.stringmessage,
          type: this.stringmethod
        })
      },
      formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      },
      //实时获取选中列
      handleSelectionChange(val) {
        //console.log('table', val)

        this.mubanform = val[0]
        this.multipleSelection = val;
      },
      //编辑方法
      handleEdit(row) {
        // console.log(index, row);
        this.UpdateORInsertStatus = false
        this.dialogFormVisible = true
        this.mubanform = row
      },
      messagebox() {

        this.$message({
          showClose: true,
          message: this.stringmessage,
          type: this.stringmethod
        })
      },
      //更新方法
      updateuseinfo(formName) {
        var _this = this
        let ajaxtype='post'
        if (this.UpdateORInsertStatus === false) {
          this.sendurl = this.$store.state.urlobjects.OutpatientUpdate
          this.iscurrent = true
          ajaxtype='put'
        } else {
          this.sendurl = this.$store.state.urlobjects.OutpatientAdd
        }
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        this.dialogFormVisible = false
        $.ajax({
          type: ajaxtype,
          url: this.$store.state.urlobjects.FlupBaseUrl + this.sendurl,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            ORDROWID: this.mubanform.ORDROWID,//必填 修改根据次ID
            PATNAME: this.mubanform.PATNAME, //姓名
            PATSEX: this.mubanform.PATSEX, //性别
            PATID: this.mubanform.PATID, //PATID
            PATAGE: this.mubanform.PATAGE, //年龄
            BOTHYEAR: this.formatDateTime(this.mubanform.BOTHYEAR),
            BOTNINA: this.mubanform.BOTNINA,
            ISBOTH: this.mubanform.ISBOTH,
            ISYEAR: this.mubanform.ISYEAR,//
            AMAN: this.mubanform.AMAN,//联系人姓名
            AMSEX: this.mubanform.AMSEX, //
            AMMOTH: this.mubanform.AMMOTH, //
            ADDRESS: this.mubanform.ADDRESS, //地址
            TEL: this.mubanform.TEL, //电话
            QQ: this.mubanform.QQ,
            EMAIL: this.mubanform.EMAIL,
            EMSG: this.mubanform.EMSG,
            REMARK: this.mubanform.REMARK,//标记
            LASTCHECKDATE: this.formatDateTime(this.mubanform.LASTCHECKDATE),//最后检查时间
            CREATOR: this.$store.state.user.ordrowid, //创建人
            _xsrf: this.$store.state.Token,
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {
            if (e != '[{"status":"400"}]') {
              // $.ajax({
              //   type: 'get',
              //   url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.OutpatientQuery,
              //   async: true,
              //   xhrFields: {
              //     withCredentials: true
              //   },
              //   crossDomain: true,
              //   data: {
              //     _xsrf: _this.$store.state.Token,
              //     pagenum: 1,
              //     pagesize: this.pagingData.pagesize
              //   },
              //   headers: {
              //     //     // 跨域请求 这个配置不能少
              //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              //     'Accept': 'application/json'
              //   },
              //   success: function (e) {
              //     if (e != '[{"status":"400"}]') {
              //       _this.$store.state.Flup.patlist = []
              //       //console.log('QuestionDetail',eval('('+e+')'))
              //
              //       var data = e
              //       _this.$store.state.Flup.patinfo = data[0]
              //       _this.$store.state.Flup.patlist = data
              //     } else {
              //       _this.$router.push({path: '/'})
              //     }
              //   }
              // })
              _this.initTemplateData()
              if (_this.UpdateORInsertStatus == true) {
                _this.stringmessage = '新增成功'
                _this.stringmethod = 'success'
                _this.messagebox()
                _this.$emit('refresh')
              } else {
                _this.stringmessage = '修改成功'
                _this.stringmethod = 'success'
                _this.messagebox()
                _this.$emit('refresh')
              }
              _this.UpdateORInsertStatus = false
              // console.log(this.mubanform)
            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
        //   } else {
        //     console.log('类型错误')
        //     // _this.stringmessage = '内容错误'
        //     // _this.stringmethod='error'
        //     // _this.messagebox()
        //     //  return false;
        //   }
        // });
      },
      //添加方法
      addinfo() {
        if (this.multipleSelection == 0) {
          this.passwordtemp = ''
          this.mubanform.PATNAME = '',
            this.mubanform.PATSEX = '', //用户名称
            this.mubanform.PATID = '', //电话
            this.mubanform.PATAGE = '', //邮箱
            this.mubanform.BOTHYEAR = '',
            this.mubanform.BOTNINA = '', //用户类型
            this.mubanform.ISBOTH = '',//医院名称
            this.mubanform.ISYEAR = '',
            this.mubanform.AMAN = '', //电话
            this.mubanform.AMSEX = '', //邮箱
            this.mubanform.AMMOTH = '',
            this.mubanform.ADDRESS = '', //用户类型
            this.mubanform.TEL = '',//医院名称
            this.mubanform.QQ = '',
            this.mubanform.EMAIL = '', //电话
            this.mubanform.EMSG = '', //邮箱
            this.mubanform.REMARK = '',
            this.mubanform.LASTCHECKDATE = '', //用户类型
            this.mubanform.CREATOR = '',//医院名称
            this.mubanform.CREATESDATE = '',
            this.UpdateORInsertStatus = true,
            this.dialogFormVisible = true
        } else {
          this.multipleSelection = 0
          this.$message({
            showClose: true,
            message: '请勿在有勾选的情况下新增',
            type: 'error'
          });
        }
      },
      //删除方法
      handleDelete(row) {
        // console.log(index, row);
        var that = this
        this.$msgbox('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            return this.deleteuseinfo(that,row)
          }
        ).catch(() => {
          this.stringmessage = '已经取消删除'
          this.stringmethod = 'info'
          this.messagebox()


        })
      },
      // 删除方法
      deleteuseinfo(that,row) {
        var _this = that
          $.ajax({
            type: 'DELETE',
            url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.OutpatientDel+"/"+row.ORDROWID,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              _xsrf: _this.$store.state.Token,
              ordrowid:row.ORDROWID,
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              console.log('eeeeee', e)
              if (e != '[{"status":"400"}]') {
                _this.stringmessage = '删除成功'
                _this.stringmethod = 'warning'
                _this.messagebox()
                _this.initTemplateData()
                // $.ajax({
                //   type: 'get',
                //   url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.OutpatientQuery,
                //   async: true,
                //   xhrFields: {
                //     withCredentials: true
                //   },
                //   crossDomain: true,
                //   data: {
                //     _xsrf: _this.$store.state.Token,
                //     pagenum: 1
                //   },
                //   headers: {
                //     //     // 跨域请求 这个配置不能少
                //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                //     'Accept': 'application/json'
                //   },
                //   success: function (e) {
                //     if (e != '[{"status":"400"}]') {
                //       _this.$store.state.Flup.patlist = []
                //       //console.log('QuestionDetail',eval('('+e+')'))
                //
                //       var data = e
                //       _this.$store.state.Flup.patinfo = data[0]
                //       _this.$store.state.Flup.patlist = data
                //     } else {
                //       _this.$router.push({path: '/'})
                //     }
                //   }
                // })
              } else {
                _this.$router.push({path: '/'})
              }
            }
          })

      },
      clickrow(a) {
        console.log('点击', a)
        //debugger
        this.$store.state.Flup.patinfo = a

      },



      sendmessage(){
        let messagedata=this.$refs.searchmodule.GETDATATYPE(this.Messagemoduleinfo)
       console.log( messagedata,'发送短信')
        debugger
      },
      PageAction(val) {
        var that = this

        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.OutpatientQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: val,
            pagesize: this.pagingData.pagesize
          }
        }
        this.$SelfUtils.get(DATAoptions).then(function (e) {

          if (e != '[{"status":"400"}]') {
            that.$store.state.Flup.patlist = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[1]
            that.$store.state.Flup.patlist = data.slice(1,)
            console.log('进入患者管理--消化内科', that.$store.state.Flup.patlist)
            that.pagingData.pagingTotal = parseInt(data[0].ORDROWID)
          } else {
            that.$router.push({path: '/'})
          }
        })
      },
      PageChangeSize(val) {
        this.pagingData.pagesize = val
        console.log(val, '改变大小')
      },
    },
    mounted() {
      this.initTemplateData()
    }
  }
</script>

<style scoped>

</style>
