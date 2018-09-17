<template>
  <div :key="routeinfo">
    <div style="padding-top: 2%;overflow-y: scroll;height: 78vh;width:calc(100vw - 200px);background-color: #fffefe">
      <el-table
        ref="multipleTable"
        :data="tableData8"
        v-if="tablestatus"

        height="73vh"
        border
      >
        <!--highlight-current-row-->
        <!--@selection-change="handleSelectionChange">-->

        <!--@row-click="clickrow"-->
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--style="width:10%;">-->
        <!--</el-table-column>-->
        <el-table-column
          label="随访名称"
          prop="SFTITLE"
          align="center">
        </el-table-column>
        <el-table-column
          label="随访对象"
          align="center"
          prop="PATNAME">
        </el-table-column>
        <el-table-column
          label="随访对象电话"
          align="center"
          prop="VERIFYCODE">
        </el-table-column>
        <el-table-column
          label="随访状态"
          align="center"
          prop="SFSTATUS"
          :formatter="FormatSF"
          :filters="[{ text: 'true', value: '已到访' }, { text: 'false', value: '未到访' }]"
          :filter-method="filterTag">
        </el-table-column>
        <el-table-column
          label="随访时间"
          align="center"
          prop="CycleTime">
        </el-table-column>
        <el-table-column
          label="随访负责人"
          align="center"
          prop="ECREATER">
        </el-table-column>
        <el-table-column
          label="随访负责人电话"
          align="center"
          prop="VERIFYCODE">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-document" size="small" @click="openDoSf(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
              <div :style="'overflow: scroll;overflow-x:hidden;margin-left: 2%;background: #ffffff;color: #1f150b;font-size: 22px;height:55vh'">
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
                  <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    width="120">
                    <template slot-scope="scope">
                      <el-button type="success" icon="el-icon-phone-outline" size="small" @click="callPhone(scope.row)">拨打电话</el-button>
                    </template>
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

          <el-row :gutter="10" >
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
        <div style="overflow-x:hidden;flex: 0 0 100%">
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
          <el-tabs type="border-card" v-show="NextMubanShow">

            <el-tab-pane label="查看模板">
              <div style="text-align: center">
                <div v-for="item in this.$store.state.Flup.EntityDetail" style="text-align: left;margin-left: 25vw">
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
            </el-tab-pane>
            <el-tab-pane label="编辑随访模板">
              <router-view></router-view>
            </el-tab-pane>
          </el-tabs>
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
  import Pagepagination from "@/components/pagepagination/index";
  export default {

    components: {Pagepagination},
    name: "Statistical",
    data() {
      return {

        activeName2: 'first',
        pickerOptions1: {
          shortcuts: [{
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 + 2);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        Flupstates: [],
        list: [],
        PatInfoVisable: false,
        Dodialog: false,
        TableInfoVisable: false,
        InfoVisable: false,
        mubanform: {},
        mubanstatus: true,//表示调查表的是否可填写
        PatInfo: {},
        checkinfo: '',
        SFTableTitle: '',
        beizhuitem: [], //本次随访备注状态
        checkedCities1: [], //本次随访选择框状态
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
        doform: {
          DeatilOrdrowid: '',
          PICIID: '',
          PATID: '',
          MAINID: '',
          MAINNAME: '',
          USETYPE: ''
        },
        NextTime: '', // 下次随访时间
        options4: [],
        value9: [],
        loading: false, //loading状态
        nextdata: {},//下次随访状态
        nextform: [
          {
            id: '',
            children: [
              {
                label: '',
                ordrowid: '',

              }
            ]
          }
        ], //下次随访模板状态
        checkedCities2: [], //下次随访所用模板选择框
        beizhuitem2: [], //下次随访所用模板输入框数据
        nextformstatus: false,//下次随访模板模态框状态
        LookMubanStatus: false,
        Look0rdrowid: '',// 下次模板编辑选择框选中数据
        MubanSelectOption: '',//选择框选中项
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
        beizhuitem3: [], //查看模态框输入框
        NextMubanShow:true, // 模板状态 当没有下次模板时隐藏模板
        pagingData:{
          pagingTotal:1, //总条数
          pagingShow :true, //展示与否
          pagesize:20, //初始页面大小
          pagesizes:[3,20,50,100,150],  //分页 每页大小
          currentpage:1, //去往第几页
          pagenum:1
        },
        tablestatus:true,
        visittype:''
      }
    },
    watch:{
      routeinfo(){
        this.pagemethod() //观察route变动 并调用页面相关函数

      },
    },
    mounted() {

    },
    filters: {
      formatTime(value) {


        if (value != undefined) {
          if (value.time != undefined) {
            var date = new Date(value.time);
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
          } else {
            return '时间错误'
          }
        } else {
          return '时间错误'
        }


      } //格式化时间
    },
    computed: {
      routeinfo(){
        console.log('routeinfo',this.$store.state.ROUTEINFO)
        return this.$store.state.ROUTEINFO
      },
      tableDataA() {
        if (this.$store.state.Flup.Medicalinfo != undefined) {


          console.log('AAA', this.$store.state.Flup.Medicalinfo)
          return this.$store.state.Flup.Medicalinfo
        }
        else {
          return [{}]
        }

      }, //计算病历信息
      tableData8() {
        var tempdata = []
        for (var i in this.$store.state.Flup.Statistical) {
          if (this.$store.state.Flup.Statistical[i].CycleTime != null) {
            tempdata.push(this.$store.state.Flup.Statistical[i])
          }
        }
        return tempdata
      }, //计算计划数据
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
    },
    methods: {
      clearSelect() {
        this.MubanSelectOption = ''
      }, //清除选中项
      EntityChange(val) {
        this.Look0rdrowid = val
        console.log(this.tableDataN, '当前选择框数据')
      }, //获取选择的数据
      removebr(val) {
        if (val.checkresult != undefined) {
          return val.checkresult.replace('<br />', '')
        }
        else {
          return val
        }
      }, //过滤器 去除br标签
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
      },//格式化element库时间格式
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
      }, //筛选函数
      filterTag(value, row) {
        return row.SFSTATUS === value;
      }, //表格筛选函数
      FormatType(row, column, d) {
        if (d == 'manual') {
          return '手动任务'
        } else if (d == 'auto') {
          return '自动任务'
        }

      }, //任务类型过滤器函数
      FormatSF(row, column, d) {
        if (d == 'false') {
          return '未到访'
        } else if (d == 'true') {
          return '已到访'
        } else if (d == 'usetrue') {
          return '已填写调查表'
        }

      },//随访状态过滤器函数




      PageAction(val){
        var that=this
        this.pagingData.pagenum =val
        this.pagemethod()
      }, //切换页面动作
      PageChangeSize(val){
        this.pagingData.pagesize = val
        console.log(val,'改变大小')
      },
// ------------------------------- 下方为包含全局变量--------------------------------------------------------------------
      pagemethod(){

        const loading = this.$loading({
          lock: true,
          text: '拼命加载中.........',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var that=this
        let VisitType=this.$route.params.visittype
        if(VisitType != undefined){
          that.visittype  = VisitType

        }
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.Visiting,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data:{
            _xsrf:this.$store.state.Token,
            VisitType:that.visittype,
            pagenum:this.pagingData.pagenum,
            pagesize:this.pagingData.pagesize
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success:function (e) {
            if (e != '[{"status":"400"}]'){

              that.$store.state.Flup.Statistical =[]
              console.log('QuestionDetail',e)
              var data = e
              if(data.length !=0){
                that.tablestatus = false
                that.$store.state.Flup.Statistical=data.slice(1,)
                that.tablestatus = true
                that.pagingData.pagingTotal =data[0].PAGETOTALS
                console.log('Statistical',that.$store.state.Flup.Statistical)
              }
              // that.$store.state.Flup.patinfo=data[0]

              loading.close()
            } else {
              loading.close()
              that.$router.push({path:'/'})
            }
          }})
      }, //获取随访任务列表
      //拨打电话
      callPhone(row){
          this.$calltel.call("913451238413")
      },
      openDoSf(row) {
        this.clearSelect()
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
        this.NextMubanShow =true//获取下次随访规则
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
            pagenum: this.pagingData.pagenum,
            pagesize: 0
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
                  PATID: that.PatInfo.PATID,
                  pagenum: that.pagingData.pagenum,
                  pagesize: 0
                },
                headers: {
                  //     // 跨域请求 这个配置不能少
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                  'Accept': 'application/json'
                },
                success: function (e) {
                  if (e != '[{"status":"400"}]') {
                    that.$store.state.Flup.Medicalinfo = []
                    // e = e.replace(/\\r/g, '<br /> ').replace(/\\n/g, ' ')
                    var data = e
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
                    loading.close()
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
                  pagenum: that.pagingData.pagenum,
                  pagesize: 0
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

                  console.log('执行模板1111',e)
                  var muban = e

                  if (muban.length != 0) {
                    that.checkedList1 = []
                    that.beizhuitem = []
                    var QNameList = []
                    var QList = []
                    var Qindex = 1
                    that.nextdata=[]              //初始化数据


                    that.$store.state.Flup.panelobject.mubanTitle = muban[0].ename
                    that.$store.state.Flup.panelobject.mubanID = muban[0].ordrowid
                    that.doform.PICI = muban[0].PICI
                    that.doform.PATID = muban[0].PATID
                    that.doform.DeatilOrdrowid = muban[0].ORDROWID
                    that.doform.MAINID = muban[0].MAINID
                    that.doform.MAINNAME = muban[0].MAINNAME
                    that.doform.USETYPE = muban[0].USETYPE

                    that.NextMubanShow  =false


                    for (var i in muban) {
                      if(muban[i].USETYPE != ''){
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
                        that.NextMubanShow =true
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
            } else {
              loading.close()
              that.$router.push({path:'/'})
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
            pagenum: 1,
            pagesize: 0
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

              var data = e
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
              that.MubanSelectOption = ''
              that.Dodialog = true
              loading.close()
            } else {
              loading.close()
              that.$router.push({path: '/'})
            }
          }
        }) //获取模板数据

      }, //打开查看按钮
      DOSF() {
        var that = this
        // if(this.mubanstatus != false){
        //   if (this.value9.length == 0) {
        //
        //
        //     var nextNewOrdrowid = ''
        //
        //   } else {
            var nextNewOrdrowid = this.MubanSelectOption
          // }
          console.log('开始执行模板调查问卷', this.mubanform, nextNewOrdrowid)
        if(1==1){
          if (this.NextTime != '') {
            if(this.mubanstatus == true){
              this.PostData()
            }
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
        }
        // } else {
        //   that.$message({
        //     message: '请先提交调查表',
        //     type: 'error'
        //   });
        // }

      }, //提交随访数据
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

        //console.log('最终提交数据', JSON.stringify(postdata), this.beizhuitem)

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
        that.$store.state.Flup.SFNextData = that.nextdata
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
              var data = e
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
              var data =  e
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
                if(muban[i].USETYPE != '') {
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

              that.$router.push({path: '/sftask/Statistical/flupedit'})
            } else {
              that.nextformstatus = true
              that.$message({
                message: '随访已经全部完成',
                type: 'info'
              });
            }
          }


        }) //获取模板数据

      },  //查看编辑下次随访模板
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

  }



</script>

<style scoped>
  .el-col {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
   }
  }
  .DOROLESPAN {
    margin-top: 10px;
  }
</style>
