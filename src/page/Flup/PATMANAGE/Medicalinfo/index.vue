<template>
    <div style="height: 18vh">
      <el-tabs type="border-card" id="fastlookSf" @tab-click="getSF">
        <el-tab-pane label="患者信息">
          <div style="background: #bfc2c7;height: 100%;width: calc(100vw - 200px)">
            <el-row>
              <el-col :span="6"><div class="grid-content bg-purple">
                姓名:{{this.$store.state.Flup.patinfo.PATNAME}}
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple-light">
                性别: {{this.$store.state.Flup.patinfo.PATSEX}}
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                年龄: {{this.$store.state.Flup.patinfo.PATAGE}}
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple-light">
                最后检查时间: {{this.$store.state.Flup.patinfo.LASTCHECKDATE}}
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                地址: {{this.$store.state.Flup.patinfo.ADDRESS}}
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple-light">
                电话: {{this.$store.state.Flup.patinfo.TEL}}
              </div></el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="病历管理">

            <div style="background: #b9e692;height: 100% ;width: calc(100vw - 200px)">
              <el-table
                :data="tableDataA"
                border>
                <el-table-column
                  label="姓名"
                  prop="patname"
                  align="center">
                </el-table-column>
                <el-table-column
                  label="PatID"
                  align="center"
                  prop="PatID">
                </el-table-column>
                <el-table-column
                  label="检查所见"
                  align="center"
                  :formatter="removebr"
                  prop="checkresult">
                </el-table-column>
                <el-table-column
                  label="检查时间"
                  align="center"
                  prop="checkdate">
                </el-table-column>
              </el-table>
            </div>
        </el-tab-pane>
        <el-tab-pane  label="随访管理">
          <div style="background: lightblue;height: 20vh;width: calc(100vw - 200px)">
            <!--<div style="width: 100%;height: 13%;background: #e4e7ed;padding-left: 20px;display: flex;align-items: center"><div>-->
              <!--&lt;!&ndash;<el-button size="mini" @click="getFlupData">新建随访计划</el-button>&ndash;&gt;-->
            <!--</div>-->
            <!--</div>-->
            <div style="height: 20vh;width:  100%;overflow: scroll;overflow-x: hidden">
              <!--&nbsp;&nbsp;&nbsp;&nbsp;随访计划查看：-->
              <el-table
                :data="tableData"
                size="mini"
                highlight-current-row
                @current-change="JHChange"
              >
                <el-table-column
                  prop="PATNAME"
                  label="患者姓名"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="SFTITLE"
                  label="计划目的"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="SFTIME"
                  label="计划执行时间">
                </el-table-column>
                <el-table-column
                  prop="creater"
                  label="计划执行人">
                </el-table-column>
                <el-table-column
                  prop="SFSTATUS"
                  label="随访状态"
                  :formatter="FormatSF"
                  :filters="[{ text: '完成', value: 'true' }, { text: '未完成', value: 'false' }]"
                  :filter-method="filterTag"
                >
                </el-table-column>
                <el-table-column
                  prop="ROLETYPE"
                  :formatter="FormatType"
                  label="计划执行类型">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleLook(scope.$index, scope.row)">查看</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="执行随访任务"
        :visible.sync="Dodialog"
        width="95%"
        center
        top="10vh"
      >
        <div style="display: flex">
          <div style="flex: 0 0 50%;margin: 30px">
            <el-tabs v-model="activeName2" type="card">
              <el-tab-pane label="调查表填写" name="first">
                <div :style="'overflow: scroll;overflow-x:hidden;margin-left: 2%;background: #ffffff;color: #1f150b;font-size: 22px'">
                  <div style="text-align: center">
                    <h2>{{doform.MAINNAME}}</h2>
                  </div>
                  <div v-for="item in stepData3">
                    <span style="height: 30px">第{{item.id}}题:{{item.label}}</span>
                    <el-row :gutter="10" >
                      <el-checkbox-group
                        v-model="checkedCities1[item.id]"
                      >
                        <el-col :span="24" v-for="(city,index) in item.children" :key="city.id"
                                style="margin:5px 20px" >

                          <el-checkbox  :label="city.label"
                                        :value="city.ordrowid"
                          >
                            {{index +1}} 、
                            <span v-show="city.type != '备注'  || mubanstatus == false"
                                  style="color: #1f150b;font-size: 18px">
                              {{city.label}}
                            </span>
                            <el-input
                              type="textarea"
                              :autosize="{ minRows: 1, maxRows: 4}"
                              v-model="beizhuitem[item.id]" size="mini" style="width: 400px"
                              v-show="city.type == '备注' && mubanstatus == true">
                            </el-input>
                            <br>
                          </el-checkbox>
                        </el-col>
                      </el-checkbox-group>
                    </el-row>
                  </div>
                </div>
                <el-button @click="PostData" v-show="mubanstatus" type="primary"  round  style="margin-top: 20px;width: 200px">提交调查表</el-button>
              </el-tab-pane>
              <el-tab-pane label="患者检查" name="second">
                <div style="flex:  0 0 100%">
                  <el-table
                    :data="tableDataA"
                    border
                  >
                    <el-table-column
                      label="姓名"
                      prop="patname"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      label="PatID"
                      align="center"
                      prop="PatID">
                    </el-table-column>
                    <el-table-column
                      label="检查所见"
                      align="center"
                      :formatter="removebr"
                      prop="checkresult">
                    </el-table-column>
                    <el-table-column
                      label="检查时间"
                      align="center"
                      prop="checkdate">
                    </el-table-column>
                  </el-table>
                </div>

              </el-tab-pane>
            </el-tabs>
          </div>
          <div style="flex:  0 0 45%;font-size: 22px">
            <el-row :gutter="20">
              <el-col :span="12" >
                <div class="grid-content bg-purple">
                  本次随访目的：<b><span style="font-size: 22px">{{mubanform.SFTITLE}}</span></b>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  本次随访备注：<b><span style="font-size: 22px">{{ mubanform.SFdesc }}</span></b>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  患者名：<b>{{PatInfo.PATNAME}}</b>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  患者性别：<b>{{PatInfo.PATSEX}}</b>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  患者电话：<b>{{PatInfo.TEL}}</b>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  患者年龄：<b>{{PatInfo.PATAGE}}</b>
                </div>
              </el-col>
              <el-col :span="24">
                <span >随访结果：</span>
                <div class="DOROLESPAN">
                  <el-input type="textarea"
                            clearable
                            placeholder="请输入随访结果，不可超过4000字"
                            v-model="mubanform.SFREST"
                            :autosize="{ minRows: 3, maxRows: 8}">

                  </el-input>
                </div>


              </el-col>
              <el-col :span="24">
                <span >随访分析：</span>
                <div class="DOROLESPAN">
                  <el-input type="textarea"
                            clearable
                            placeholder="请输入随访分析，不可超过4000字"
                            v-model="mubanform.SFANYLISE"
                            :autosize="{ minRows: 3, maxRows: 8}">

                  </el-input>

                </div>

              </el-col>
              <el-col :span="24">
                <span >随访建议：</span>
                <div class="DOROLESPAN">
                  <el-input type="textarea"
                            clearable
                            placeholder="请输入随访建议,不可超过4000字"
                            v-model="mubanform.SFSUGGEST"
                            :autosize="{ minRows: 3, maxRows: 8}">

                  </el-input>
                </div>

              </el-col>
              <el-col :span="24">
                下次随访调查规则 :
                <b style="font-size: 20px">{{nextdata.SFTITLE}}</b> &nbsp;&nbsp;
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="24">
                <el-button type="success" size="small" @click="LookNext">查看编辑下次调查表</el-button>
                <br/>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-show="mubanstatus">
              <el-col :span="24">
                选择下次随访日期时间：
                <el-date-picker
                  v-model="NextTime"
                  type="datetime"
                  placeholder="选择下次随访日期时间"
                  align="right"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-col>
            </el-row>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">

          <div style="text-align: right">
            <el-button type="info" @click="Dodialog = false">取 消</el-button>
            <el-button type="success" @click="DOSF">提交本次随访信息</el-button>
          </div>
        </span>
      </el-dialog>
      <el-dialog
        title="对下次调查表进行修改"
        :visible.sync="nextformstatus"
        width="95%"
        border
        top="10vh"
        :fullscreen=true
      >
        <div style="display: flex;flex-wrap: wrap;">
          <div style="overflow: auto;overflow-x:hidden;flex: 0 0 100%">
            <div style="margin-bottom: 20px">
            <span style="color: crimson;font-size: 22px">
            不合适选择模板选择，注意此处选中会导致下方模板编辑结果失效：
          </span>
              <el-select
                v-model="MubanSelectOption"
                @change="EntityChange"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in tableDataN"
                  :key="item.ORDROWID"
                  :label="item.ENAME"
                  :value="item.ORDROWID">
                </el-option>
              </el-select>
              <el-button @click="LookMuban">
                查看选择模板内容
              </el-button>
              <el-button @click="clearSelect">
                清空选择框数据
              </el-button>
            </div>
            <router-view></router-view>
          </div>
        </div>
        <el-dialog
          title="调查表内容"
          :visible.sync="LookMubanStatus"
          width="70%"
          append-to-body

        >


          <div v-for="item in nextform2">
            <span style="height: 30px;font-size: 22px">第{{item.id}}题:{{item.label}}</span>
            <div>
              <el-checkbox-group
                v-model="checkedCities3[item.id]"
              >
                <el-checkbox
                  v-for="(city,index) in item.children" :label="city.label" :key="city.id"
                  :value="city.ordrowid"
                >
                  <span v-show="city.type != '备注'"
                        style="color: #1f150b;font-size: 18px"
                  >
                  {{index +1}}.{{city.label}}
                  </span>
                  <el-input v-model="beizhuitem2[item.id]" szie="mini"
                            v-show="city.type == '备注' ">

                  </el-input>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
</template>

<script>
  import $ from 'jquery'

   export default {


     components: {},
     name: "Medicalinfo",


      data() {
        return {
          options4: [],
          value9: [],
          list: [],
          loading: false,
          Flupstates: [],

          options: [{
            value: 'true',
            label: '已完成'
          }, {
            value: 'false',
            label: '未完成'
          }],
          pickerOptions1: {
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '明天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周后',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          }, //时间选择器快捷选项


          tableData: [{

          },],
          SFJH:'',
          SFZT:'',
          fastlookshow:false,//模态框状态
          lookOrUpdate:true,//查看 or编辑状态
          sfData:{

            DOPEOPLE:'',
            PATID:'',
            PATNAME:'',
            PlanID:'',
            ROLETYPE:'',
            SFMean:'',
            SFSTATUS:'',
            SFTIME:'',
            SFbeizhu:'',
            VERIFYCODE:'',
            creater:'',
            createtime:'',
            ecreater:'',
            ename:'',
            ordrowid:''
          },
          sfTime:'',
          roleForm:{

          },


          //模态框数据
          Dodialog:false,//待删除
          activeName2:'first',
          mubanstatus: true,//随访调查表填写状态
          doform: {
            DeatilOrdrowid: '',
            PICIID: '',
            PATID: '',
            MAINID: '',
            MAINNAME: '',
            USETYPE: ''
          }, //模板数据
          stepData3: [
            {
              id: '',
              children: [
                {
                  label: '',
                  ordrowid: '',
                  type: ''
                }
              ]
            }
          ], //本次随访调查表状态
          beizhuitem: [], //本次随访备注状态
          checkedCities1: [], //本次随访选择框状态
          PatInfo: {},
          mubanform: {},//模板相关数据
          NextTime: '', // 下次随访时间数据
          nextdata: {},//下次随访状态
          nextformstatus: false,//下次随访模板模态框状态
          MubanSelectOption: '',//选择框选中项
          LookMubanStatus: false,
          nextform2: [
            {
              id: '',
              children: [
                {
                  label: '',
                  ordrowid: '',

                }
              ]
            }
          ], //下次模板编辑中下拉框选择模板的选项数据
          checkedCities3: [], //选择框选择状态
          beizhuitem2: [], //下次随访所用模板输入框数据
      }
      },
      filters:{

      },
      methods:{
        clearSelect() {
          this.MubanSelectOption = ''
        }, //清除选中项
        removebr(val){
          if(val.checkresult != undefined && val.checkresult != null){
            return val.checkresult.replace('<br />','')
          }
          else {
            return val
          }
        },
        filterTag(value, row) {
          return row.SFSTATUS === value;
        },
        FormatType(row,column,d){
          if (d == 'manual'){
            return '手动任务'
          } else  if (d == 'auto'){
            return '自动任务'
          }

        },
        FormatSF(row,column,d){
          if (d == 'false'){
            return '未完成'
          } else  if (d == 'true'){
            return '已完成'
          }

        },
        JHChange(val) {
          this.SFJH = val;
          console.log('计划',val)
        },
        EntityChange(val) {

          this.Look0rdrowid = val

          console.log(this.tableDataN, '当前选择框数据')
        }, //获取选择的数据
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

        remoteMethod(query) {
          if (query !== '') {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.options4 = this.list.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              });
            }, 200);
          } else {
            this.options4 = [];
          }
        },
       //------------以下为需要发送请求的函数----------------------------------
        handleLook(index,row){
          console.log(index,row,'look')
          //this.value9[0]=row.PlanID
          this.value9 =[]
          this.sfData = row
          this.sfTime = row.SFTIME


          this.beizhuitem = [], //本次随访备注状态
          this.checkedCities1 = [], //本次随访选择框状态
          this.stepData3 = [
            {
              id: '',
              children: [
                {
                  label: '',
                  ordrowid: '',
                  type: ''
                }
              ]
            }
          ], //本次随访调查表状态
          console.log(row, '调查表数据')
          this.Look0rdrowid = ''
          for (var i in this.$store.state.Flup.Statistical) {
            if (this.$store.state.Flup.Statistical[i].PICI == row.PICI && this.$store.state.Flup.Statistical[i].PATID == row.PATID && this.$store.state.Flup.Statistical[i].CycleTime == null) {
              this.nextdata = this.$store.state.Flup.Statistical[i]
            }
          } //获取下次随访规则
          console.log('下次随访情况数据', this.nextdata)
          this.mubanform = row
          this.mubanstatus = true   //用于检测该随访调查表是否是已经填写 填写则不做修改 true表示可进行填写
          var that = this
          const loading = this.$loading({
            lock: true,
            text: '拼命加载中.........',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.OutpatientQuery,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              PATID: this.mubanform.PATID,//必填 修改根据次ID
              _xsrf: this.$store.state.Token,
              pagenum:0,
              pagesize:0
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              if (e != '[{"status":"400"}]') {
                var data = e
                console.log('人员信息', data)
                that.PatInfo = data[0]
                $.ajax({
                  type: 'get',
                  url: that.$store.state.urlobjects.FlupBaseUrl + that.$store.state.urlobjects.MedicalCheck,
                  async: true,
                  xhrFields: {
                    withCredentials: true
                  },
                  crossDomain: true,
                  data: {
                    _xsrf: that.$store.state.Token,
                    PATID: that.PatInfo.PATID
                  },
                  headers: {
                    //     // 跨域请求 这个配置不能少
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    'Accept': 'application/json'
                  },
                  success: function (e) {
                    if (e != '[{"status":"400"}]') {
                      that.$store.state.Flup.Medicalinfo = []

                      var data =e
                      that.$store.state.Flup.Medicalinfo = data
                      console.log('病历管理', that.$store.state.Flup.Medicalinfo)

                      if (that.mubanstatus) {
                        that.TableInfoVisable = true
                      } else {
                        that.lastshow = true
                        that.$message({
                          message: '调查问卷已填写',
                          type: 'info'
                        });
                      }
                    } else {
                      that.$router.push({path: '/'})
                    }
                  }
                })

                $.ajax({
                  type: 'get',
                  url: that.$store.state.urlobjects.FlupBaseUrl + that.$store.state.urlobjects.MainQuery,
                  async: true,
                  xhrFields: {
                    withCredentials: true
                  },
                  crossDomain: true,
                  data: {
                    ROLEID: row.ORDROWID,
                    // PICI: that.mubanform.ORDROWID,
                    // VCode: that.PatInfo.PATID,
                    // usename: _this.$store.state.server.dictinfo.username
                  },
                  headers: {
                    //     // 跨域请求 这个配置不能少
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    'Accept': 'application/json'
                  },
                  success: function (e) {
                    console.log('执行模板', e)
                    var muban = e

                    if (muban.length != 0) {
                      that.$store.state.Flup.panelobject.mubanTitle = muban[0].ename
                      that.$store.state.Flup.panelobject.mubanID = muban[0].ordrowid
                      that.doform.PICI = muban[0].PICI
                      that.doform.PATID = muban[0].PATID
                      that.doform.DeatilOrdrowid = muban[0].ORDROWID
                      that.doform.MAINID = muban[0].MAINID
                      that.doform.MAINNAME = muban[0].MAINNAME
                      that.doform.USETYPE = muban[0].USETYPE
                      var QNameList = []
                      var QList = []
                      var Qindex = 1
                      that.checkedList1 = []
                      that.beizhuitem = []
                      for (var i in muban) {
                        if(muban[i].USETYPE != '') {
                          if (muban[i].DOSTATUS == 'true') {
                            that.mubanstatus = false
                          }
                          if (QNameList.indexOf(muban[i].QUESTIONNAME) == -1) {
                            QNameList.push(muban[i].QUESTIONNAME)

                            QList.push({
                              id: Qindex,
                              label: muban[i].QUESTIONNAME,
                              orderid: muban[i].QUESTIONID,
                              children: []
                            })
                            Qindex = Qindex + 1
                          }
                        } else {
                          that.nextdata = muban[i]
                        }

                      }
                      //console.log('QLIST',QList)
                      var templetList = QList
                      for (var j in muban) {
                        for (var q in templetList) {
                          if (muban[j].QUESTIONNAME == templetList[q].label) {
                            templetList[q].children.push({
                              id: muban[j].ITEMID,
                              label: muban[j].ITEMVALUE,
                              orderid: muban[j].ITEMID,
                              dostatus: muban[j].DOSTATUS,
                              type: muban[j].itemtype
                            })
                          }
                        }
                      }
                      that.checkedCities1[0] = []
                      for (var m = 0; m < templetList.length; m++) {
                        if (templetList[m] != undefined) {
                          that.checkedCities1.push([],
                          )
                          for (var n = 0; n < templetList[m].children.length; n++) {

                            if (templetList[m].children[n] != undefined) {
                              if (templetList[m].children[n].dostatus == 'true') {
                                that.checkedCities1[m + 1].push(templetList[m].children[n].label)
                              }
                            }
                          }
                        }
                        that.beizhuitem[m] = ''
                      }
                      console.log('执行随访中的第一个表格', templetList)
                      that.stepData3 = templetList
                      that.InputStatus = false
                    }
                  } //模板数据
                })
              }
            }
          }) //获取人员信息
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.TemplateQuery,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              _xsrf: this.$store.state.Token,
              pagenum: 0,
              pagesize:0
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              if (e != '[{"status":"400"}]') {
                that.$store.state.Flup.followinfo = []
                //console.log('QuestionDetail',eval('('+e+')'))

                var data =  e
                that.Flupstates = []
                for (var i in data) {
                  that.Flupstates.push({
                    key: data[i].ORDROWID,
                    label: data[i].ENAME
                  })
                }
                that.list = that.Flupstates.map(item => {
                  return {value: item.key, label: item.label};
                });
                that.$store.state.Flup.followinfo = data
                console.log('模板列表', that.$store.state.Flup.followinfo)

              }
              that.Dodialog=true
              that.lookOrUpdate=true
              loading.close()
              // else {
              //   that.$router.push({path: '/'})
              // }
            }
          }) //获取模板数据
        },
        getFlupData(){
          var that=this
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.TemplateQuery,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data:{
              _xsrf:this.$store.state.Token,
              Ecreater:this.createname
              // usename: _this.$store.state.server.dictinfo.username
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success:function (e) {
              if (e != '[{"status":"400"}]'){


                var data=e
                that.$store.state.Flup.EntityList=[]
                var tempdata=[]
                var entitydata = data
                for (var i in entitydata){
                  if(entitydata[i].ECREATER != null){
                    tempdata.push({
                      ETYPE:entitydata[i].ETYPE,//随访类型
                      ENAME:entitydata[i].ENAME,//随访名称
                      ECODE:entitydata[i].ECODE,//随访代码
                      EDES:entitydata[i].EDES,//随访描述
                      ORDROWID:entitydata[i].ORDROWID,//随访计划ordrowid
                      ECREATER:entitydata[i].ECREATER,//随访计划创建人ID
                      CREATETIME:entitydata[i].CREATETIME,//随访计划最后更新时间
                    })
                  }
                }
                that.$store.state.Flup.EntityList=tempdata
                console.log('aaasdasd',that.$store.state.Flup.EntityList)
                that.$router.push({path:'/server/cFlup'})
              }}})
        },
        getSF(a,b){
          var that=this
          if(a.index=='8') {
            $.ajax({
              type: 'get',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MainQuery,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                PATID: this.$store.state.Flup.patinfo.ORDROWID
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                console.log(e)
                if (e != '[{"status":"400"}]') {


                  var data = e
                  console.log('计划数据', data)

                  that.tableData=data.sort(compareUp("VERIFYCODE",data));
                  function compareUp(propertyName,data) { // 升序排序
                    if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
                      return function(object1, object2) {
                        var value1 = object1[propertyName];
                        var value2 = object2[propertyName];
                        return value1.localeCompare(value2);
                      }
                    }
                    else {
                      return function(object1, object2) { // 属性值为数字
                        var value1 = object1[propertyName];
                        var value2 = object2[propertyName];
                        return value1 - value2;
                      }
                    }
                  }
                  // that.tableData=[]
                // for (var i in data){
                //
                //   that.tableData.push({
                //     patname:data[i].PATID,
                //     JHname:data[i].ename,
                //     JHtime:data[i].CTIME
                //   })
                // console.log('计划数据',that.tableData)
                }
              }
            })


          }
        },
        handleDelete(index, row){
          var that=this
          if (row.SFSTATUS == 'false') {
          console.log(index,row,'delete')

          $.ajax({
            type: 'DELETE',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.ROLEDel+'/'+row.ordrowid,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              _xsrf: this.$store.state.Token,
              ORDROWID:row.ordrowid
              // usename: _this.$store.state.server.dictinfo.username
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              console.log(e)
              if (e != '[{"status":"400"}]') {


                var data = e
                console.log('删除结果', data)
                that.tableData=data.sort(compareUp("VERIFYCODE",data));
                function compareUp(propertyName,data) { // 升序排序
                  if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
                    return function(object1, object2) {
                      var value1 = object1[propertyName];
                      var value2 = object2[propertyName];
                      return value1.localeCompare(value2);
                    }
                  }
                  else {
                    return function(object1, object2) { // 属性值为数字
                      var value1 = object1[propertyName];
                      var value2 = object2[propertyName];
                      return value1 - value2;
                    }
                  }
                }
                // that.tableData=[]
                // for (var i in data){
                //
                //   that.tableData.push({
                //     patname:data[i].PATID,
                //     JHname:data[i].ename,
                //     JHtime:data[i].CTIME
                //   })
                // console.log('计划数据',that.tableData)
              }
            }
          })
          } else {
            this.$message.error('已完成的只可查看');
          }
        },
        changeSF(){

            debugger


          this.fastlookshow = false
          if (this.value9.length != 0 ){
              var roleitems = this.value9[0]
          } else {
              var roleitems = this.sfData.PlanID
          }
          console.log('本次数据', this.sfData,roleitems)
          if (1==1) {
            $.ajax({
              type: 'put',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleUpdate,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                ORDROWID: this.sfData.ordrowid,
                CYCLETIME: this.formatDateTime(this.sfData.SFTIME),
                PlanID:roleitems,
                SFTITLE: this.sfData.SFMean,
                SFDESC: this.sfData.SFbeizhu,
                SFSTATUS: this.sfData.SFSTATUS
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                console.log('sfupdate', e)

              }
            })
          }
        },
        PostData() {
          var that = this
          var postdata = []
          for (var i = 1; i < this.checkedCities1.length; i++) {
            for (var m = 0; m < this.checkedCities1[i].length; m++)
              for (var j = 0; j < this.stepData3[i - 1].children.length; j++) {
                if (this.stepData3[i - 1].children[j].label == this.checkedCities1[i][m]) {
                  if (this.stepData3[i - 1].children[j].type == '单选') {
                    var tempValue = this.stepData3[i - 1].children[j].label

                  } else {

                    var tempValue = this.beizhuitem[i]

                  }

                  postdata.push({
                    questionid: this.stepData3[i - 1].orderid,
                    questionname: this.stepData3[i - 1].label,
                    itemid: this.stepData3[i - 1].children[j].id,
                    itemname: tempValue,
                    PICI: this.doform.PICI,
                    PATID: this.doform.PATID,
                    DETAILID: this.doform.DeatilOrdrowid,
                    MAINID: this.doform.MAINID,
                    MAINNAME: this.doform.MAINNAME,
                    USETYPE: this.doform.USETYPE
                  })

                  break
                }

              }

          } //获得勾选项数据

          console.log('最终提交数据', JSON.stringify(postdata), this.beizhuitem)

          if (1 == 1) {
            $.ajax({
              type: 'POST',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MainAdd,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                ITEMS: JSON.stringify(postdata),
                ORDROWID: this.mubanform.ORDROWID
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  that.mubanstatus = false
                  that.$message({
                    message: '提交成功 谢谢您',
                    type: 'success'
                  });

                }
              }
            })
          }
          that.TableInfoVisable = false

        }, //提交调查表选择的数据
        LookNext() {
          var that = this

          for(var i in this.tableData){
            if(parseInt(this.tableData[i].VERIFYCODE) > parseInt(this.sfData.VERIFYCODE)){
              this.nextdata= this.tableData[i]
              break
            }
          }

          if(1==1){
            $.ajax({
              type: 'get',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.AnswerQuery,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                pagenum: 1
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  that.$store.state.Flup.ItemDetail = []
                  var ItemDetail = that.$store.state.Flup.ItemDetail
                  var data =  e
                  for (var i in data) {
                    if (data[i].ECREATER != null) {
                      ItemDetail.push({
                        id: data[i].ORDROWID,
                        label: data[i].ITEMNAME,
                        orderid: data[i].ORDROWID,
                      })
                    }
                  }
                  that.$store.state.Flup.ItemDetail = ItemDetail
                  console.log('答案库数据', that.$store.state.Flup.ItemDetail)
                } else {
                  that.$router.push({path: '/'})
                }
              }
            })//获得当前所有答案列表
            $.ajax({
              type: 'get',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.QuestionQuery,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                pagenum: 1
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  that.$store.state.Flup.QuestionDetail = []
                  var ItemDetail = that.$store.state.Flup.QuestionDetail
                  var data = e
                  var index = 0
                  for (var i in data) {
                    if (data[i].ecreater != null) {

                      ItemDetail.push({


                        id: index,
                        label: data[i].QNAME,
                        orderid: data[i].ORDROWID,

                      })
                      index = index + 1
                    }
                  }
                  that.$store.state.Flup.QuestionDetail = ItemDetail
                  console.log('问题库数据', that.$store.state.Flup.QuestionDetail)
                } else {
                  that.$router.push({path: '/'})
                }
              }
            })//获得当前所有问题列表
            $.ajax({
              type: 'get',
              url: that.$store.state.urlobjects.FlupBaseUrl + that.$store.state.urlobjects.MainQuery,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                ROLEID: that.nextdata.ORDROWID,
                // VCode: that.PatInfo.PATID,
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {

                var muban = e
                if (muban.length != 0) {
                  var QNameList = []
                  var QList = []
                  var Qindex = 1
                  for (var i in muban) {
                    if(muban[i].USETYPE != ''){
                    if (QNameList.indexOf(muban[i].QUESTIONNAME) == -1) {
                      QNameList.push(muban[i].QUESTIONNAME)
                      QList.push({
                        id: Qindex,
                        label: muban[i].QUESTIONNAME,
                        orderid: muban[i].QUESTIONID,
                        children: []
                      })
                      Qindex = Qindex + 1
                    }
                  } else {
                    that.nextdata = muban[i]

                  }
                  }
                  var templetList = QList
                  for (var j in muban) {
                    for (var q in templetList) {
                      if (muban[j].QUESTIONNAME == templetList[q].label) {
                        templetList[q].children.push({
                          id: muban[j].ITEMID,
                          label: muban[j].ITEMVALUE,
                          orderid: muban[j].ITEMID,
                          dostatus: muban[j].DOSTATUS
                        })
                      }
                    }
                  }
                  console.log('下次模板编辑用数据：', templetList)
                  that.$store.state.Flup.EntityDetail = templetList
                  that.nextformstatus = true
                  that.$store.state.Flup.panelobject.flupeditstatus = false

                  that.$router.push({path: '/server/followinfo/flupedit'})
                } else {
                  that.nextformstatus = true
                  that.$message({
                    message: '随访已经全部完成',
                    type: 'info'
                  });
                }
              }


            }) //获取模板数据
          }
          that.$store.state.Flup.SFNextData = that.nextdata


        },  //查看编辑下次随访模板
        DOSF() {
          var that = this
          if(this.mubanstatus != false){
            if (this.value9.length == 0) {


              var nextNewOrdrowid = ''

            } else {

              var nextNewOrdrowid = this.MubanSelectOption

            }
            console.log('开始执行模板调查问卷', this.mubanform, nextNewOrdrowid)

            if (this.NextTime != '') {
              $.ajax({
                type: 'post',
                url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.DORole,
                async: true,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  _xsrf: this.$store.state.Token,
                  nextNewOrdrowid: nextNewOrdrowid,
                  thisOrdrowid: this.mubanform.ORDROWID,
                  nextOrdrowid: this.nextdata.ORDROWID,
                  CYCLETIME: this.formatDateTime(this.NextTime),
                  SFANYLISE: this.mubanform.SFANYLISE,
                  SFREST: this.mubanform.SFREST,
                  SFSUGGEST: this.mubanform.SFSUGGEST
                },
                headers: {
                  //     // 跨域请求 这个配置不能少
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                  'Accept': 'application/json'
                },
                success: function (e) {
                  if (e != '[{"status":"400"}]') {
                    console.log(e, '执行请求')
                    //console.log('提交执行请求', eval('(' + e + ')'))
                    that.Dodialog = false
                    that.NextTime = ''
                    that.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                  }
                }
              })
            } else {
              that.$message({
                message: '下次时间不可为空',
                type: 'error'
              });
            }
          } else {
            that.$message({
              message: '请先提交调查表',
              type: 'error'
            });
          }

        }, //提交随访数据
        LookMuban() {

          var that = this

          if (this.Look0rdrowid != '') {
            $.ajax({
              type: 'get',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.getlist,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                ORDROWID: this.Look0rdrowid
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {

                  console.log('选择的模板数据', e)
                  var muban = e

                  if (muban.length != 0) {
                    var QNameList = []
                    var QList = []
                    var Qindex = 1
                    for (var i in muban) {

                      if (QNameList.indexOf(muban[i].QNAME) == -1) {
                        QNameList.push(muban[i].QNAME)

                        QList.push({
                          id: Qindex,
                          label: muban[i].QNAME,
                          orderid: muban[i].ORDROWID,
                          ATYPE: muban[i].ATYPE,
                          children: []
                        })
                        Qindex = Qindex + 1
                      }
                    }
                    //console.log('QLIST',QList)
                    var templetList = QList
                    for (var j in muban) {
                      for (var q in templetList) {
                        if (muban[j].QNAME == templetList[q].label) {
                          templetList[q].children.push({
                            id: muban[j].ITEMORDROWID,
                            label: muban[j].itemname,
                            orderid: muban[j].ITEMORDROWID,
                            type: muban[j].itemtype
                          })
                        }
                      }
                    }


                  }
                  else {
                    templetList = [{
                      id: 1,
                      label: '先选择个问题',
                      orderid: '',
                      ATYPE: '',
                      children: [{
                        id: 4,
                        label: '后移除本问题',
                        orderid: '1'
                      }]
                    }]
                  }
                  console.log('当前模板数据', templetList)
                  that.LookMubanStatus = true
                  that.nextform2 = templetList
                } else {
                  that.$router.push({path: '/'})
                }
              }
            })
          } else {
            this.$message({
              message: '请选择个模板',
              type: 'error'
            });
          }
          //模板数据
        }  //查看选择中的模板数据
      },
      mounted(){
       var that=this
        console.log('初始化病历显示',this.$store.state.Flup.patinfo.PATID)
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MedicalCheck,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data:{
            _xsrf:this.$store.state.Token,
            PATID: this.$store.state.Flup.patinfo.PATID
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success:function (e) {
            if (e != '[{"status":"400"}]'){
              that.$store.state.Flup.Medicalinfo =[]
              console.log('病历管理',e)
              // e=e.replace(/\\r/g,'<br /> ').replace(/\\n/g,' ')
              var data = e
              that.$store.state.Flup.Medicalinfo=data
              console.log('病历管理',that.$store.state.Flup.Medicalinfo)
            } else {
              that.$router.push({path:'/'})
            }
          }}) //病历管理
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleQuery,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: this.$store.state.Token,
            PATID: this.$store.state.Flup.patinfo.ORDROWID
            // usename: _this.$store.state.server.dictinfo.username
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {

            if (e != '[{"status":"400"}]') {

              var data = e
              console.log('随访管理--计划数据', data)
              that.tableData=data.sort(compareUp("VERIFYCODE",data));
              function compareUp(propertyName,data) { // 升序排序
                if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
                  return function(object1, object2) {
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    return value1.localeCompare(value2);
                  }
                }
                else {
                  return function(object1, object2) { // 属性值为数字
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    return value1 - value2;
                  }
                }
              }
            }
          }
        }) //随访管理 获取随访记录

      },
     watch:{
       getRowInfo(val){
          console.log(val,'watch')

         var that=this
         if(this.$store.state.Flup.patinfo.PATID != null){
           $.ajax({
             type: 'get',
             url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MedicalCheck,
             async: true,
             xhrFields: {
               withCredentials: true
             },
             crossDomain: true,
             data:{
               _xsrf:this.$store.state.Token,
               PATID: this.$store.state.Flup.patinfo.PATID
             },
             headers: {
               //     // 跨域请求 这个配置不能少
               "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
               'Accept': 'application/json'
             },
             success:function (e) {
               if (e != '[{"status":"400"}]'){
                 that.$store.state.Flup.Medicalinfo =[]
                 // e=e.replace(/\\r/g,'<br /> ').replace(/\\n/g,' ')
                 var data = e
                 console.log('病历管理',that.$store.state.Flup.Medicalinfo)
                 that.$store.state.Flup.Medicalinfo=data


               } else {
                 that.$router.push({path:'/'})
               }
             }})
           //debugger
           $.ajax({
             type: 'get',
             url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleQuery,
             async: true,
             xhrFields: {
               withCredentials: true
             },
             crossDomain: true,
             data: {
               _xsrf: this.$store.state.Token,
               PATID: this.$store.state.Flup.patinfo.ORDROWID
               // usename: _this.$store.state.server.dictinfo.username
             },
             headers: {
               //     // 跨域请求 这个配置不能少
               "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
               'Accept': 'application/json'
             },
             success: function (e) {
               //console.log(e)
               if (e != '[{"status":"400"}]') {


                 var data = e
                 console.log('计划数据WW', data)

                 that.tableData=data.sort(compareUp("VERIFYCODE",data));
                 function compareUp(propertyName,data) { // 升序排序
                   if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
                     return function(object1, object2) {
                       var value1 = object1[propertyName];
                       var value2 = object2[propertyName];
                       return value1.localeCompare(value2);
                     }
                   }
                   else {
                     return function(object1, object2) { // 属性值为数字
                       var value1 = object1[propertyName];
                       var value2 = object2[propertyName];
                       return value1 - value2;
                     }
                   }
                 }
                 // that.tableData=[]
                 // for (var i in data){
                 //
                 //   that.tableData.push({
                 //     patname:data[i].PATID,
                 //     JHname:data[i].ename,
                 //     JHtime:data[i].CTIME
                 //   })
                 // console.log('计划数据',that.tableData)
               }
             }
           })  //获取随访记录
         }

       }
     },
     computed:{
       getRowInfo(){
         return  this.$store.state.Flup.patinfo
       },
       tableDataA(){
         if (this.$store.state.Flup.Medicalinfo != undefined) {


           console.log('AAA', this.$store.state.Flup.Medicalinfo)
           return this.$store.state.Flup.Medicalinfo
         }
         else {
           return [{}]
         }
       },
       tableDataN() {

         if (this.$store.state.Flup.followinfo.length != 0) {
           return this.$store.state.Flup.followinfo
         } else {
           return [{
             ENAME: '',
             ORDROWID: ''
           }]
         }


       }  //计算最里面的表格数据
     }
  }
</script>

<style  >
  #fastlookSf > .el-tabs__content {
    padding: 0px;
  }
</style>
