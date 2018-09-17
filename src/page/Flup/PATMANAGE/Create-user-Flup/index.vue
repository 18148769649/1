<template>
  <div style="display: flex;
     flex-wrap: wrap;height: 85vh;
">


    <div style="flex: 0 0 100%;text-align: center;height: 15vh">
      <h2>随访计划创建</h2>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="步骤 1" description="选择随访计划"></el-step>
        <el-step title="步骤 2" description="选择随访周期"></el-step>
        <el-step title="步骤 3" description="预览无误提交随访计划"></el-step>
      </el-steps>
    </div>
    <div style="margin-bottom: 20px;
      flex: 0 0 100%;
      height: 5vh;
">
      <el-button @click="setCurrent()">取消选择</el-button>
      <!--<el-button @click="getFlupData()" v-show="this.active==0">获取随访计划数据</el-button>-->
      <el-button style="margin-top: 12px;" @click="upStep">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next"><span v-show=" this.active !=3 ">下一步</span><span
        v-show="this.active ==3"> 检查无误后保存</span></el-button>
      <el-button @click="NewPlan()" v-show=" this.active ==0 ">新建随访计划</el-button>
    </div>
    <div v-show="this.active==0" style="flex: 0 0 100%;height: 70vh">
      <div style="height: 35vh">
        <el-table
          style="margin-bottom: 20px"
          ref="singleTable"
          :data="tableData"
          highlight-current-row

          @current-change="handleCurrentChange"
          @row-click="PlanTableClick"
        >
          <el-table-column
            type="index"
            width="50">
          </el-table-column>

          <el-table-column
            property="Plandes"
            label="随访计划名称"
          >
          </el-table-column>
          <el-table-column
            property="CTIME"
            label="最后更新时间">
          </el-table-column>
        </el-table>
      </div>
      <div >
        <div style="overflow: scroll;height: 30vh">
          <el-table
            ref="PlanSonTable"
            :data="tableDataSon"
            highlight-current-row
            @current-change="handleCurrentSONChange"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>

            <el-table-column
              property="Roledes"
              label="计划子规则名称"
            >
            </el-table-column>
            <el-table-column
              property="ename"
              label="计划子规则所用表"
            >
            </el-table-column>
            <el-table-column
              property="CTIME"
              label="最后更新时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--<el-button-->
                <!--size="mini"-->

                <!--@click="RoleItemEdit(scope.$index, scope.row)">编辑-->
                <!--</el-button>-->
                <el-button
                  size="mini"
                  type="danger"
                  @click="RoleItemDelete(scope.$index, scope.row)">移除该规则
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button style="width: 100%" @click="openAddRoleItem">点击添加新规则</el-button>
      </div>
    </div>
    <div class="block" v-show="this.active==1" style="flex: 0 0 80%;margin-left: 10%;height: 70vh">
      <el-row>
        <el-col :span="8">
          <h2>请选择合适执行时间</h2>
        </el-col>
        <el-col :span="16">
          <div style="display: flex;justify-content: center;align-items:center;height: 80px">

            <el-date-picker
              v-model="SFTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions1"
              style="flex: 0 0 100%"
            >
            </el-date-picker>

          </div>
        </el-col>

      </el-row>
    </div>
    <div v-show="this.active==3" style="clear: both;display: flex;width: 100%;height: 70vh">
      <div style="flex: 0 0 20%">
        <h2 style="color: #3a8ee6;text-align: center">
          当前已选择患者
        </h2>

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="(item,index) in selectList" :title="'       '+item.PATNAME" :name="index"
                            :key="item.ORDROWID">
            <span>患者邮箱:</span>{{item.EMAIL}} &nbsp;<br>
            <span>患者QQ：</span>{{item.QQ}}&nbsp;<br>
            <span>患者电话:</span>{{item.TEL}} &nbsp;<br>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div style="flex: 0 0 80%;background: #bfc2c7">
        <div>
          <el-row>
            <el-col :span="24">
              <h2>请确认本次随访信息是否正确:</h2>
            </el-col>

            <div>
              <el-col v-for="(item,index) in this.currentRow.children"  :key="index" >
                <span>随访规则名：{{item.Roledes}}</span> &nbsp; &nbsp; &nbsp; &nbsp;
                <span>随访所用表名：{{item.ename}} </span><br>
              </el-col>
              <br/>
              <el-col :span="24">
                <span>随访目的：{{SFTitle}}</span><br>
              </el-col>

              <el-col :span="24">
                <span>随访备注：{{SFdesc}}</span><br>
              </el-col>

              <el-col>
                <span>执行时间：{{ SFTime }}</span><br>
              </el-col>

            </div>
          </el-row>

        </div>
      </div>
    </div>
    <div v-show="this.active==2" style="clear: both;width: 100%;height: 70vh">
      <el-row style="text-align: center">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-col :span="4">请输入本次随访目的：</el-col>
            <el-col :span="20">
              <el-input v-model="SFTitle" placeholder="请输入本次随访目的" clearable>

              </el-input>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple-light">
            <el-col :span="4">
              请输入本次随访备注：
            </el-col>
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入本次随访备注"
                clearable
                v-model="SFdesc">
              </el-input>
            </el-col>
          </div>
        </el-col>
      </el-row>

    </div>

    <el-dialog
      title="从已有规则库中添加进入"
      :visible.sync="RoleItemVisible"
      width="70%"
    >
      <el-dialog
        width="70%"
        title="添加全新规则"
        :visible.sync="innerVisible"
        append-to-body>
        <div style="width: 100%;display: flex;flex-wrap: wrap;height: 900px">
          <div style="flex: 0 0 100%;height: 30px"> 请输入本次规则说明
            <el-input v-model="Roledes" ></el-input>
          </div>

          <div style="flex: 0 0 100%">

            <el-table
              ref="EntitySonTable"
              :data="this.entityList"
              highlight-current-row
            >

              <el-table-column
                type="index"
                width="50">
              </el-table-column>

              <el-table-column
                property="ENAME"
                label="请选择一个调查表进行随访"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="EntityTableClick(scope.$index, scope.row)">查看相应表</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>



          <div style="flex:  0 0 100%">


            <el-switch
              v-model="value2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="按循环天数"
              inactive-text="按固定日期"
              style="width: 20%;margin: 20px 0px"
            >
            </el-switch>
            <div style="width: 80%">


              <el-slider
                v-show="value2"
                v-model="RoleItemCycletime"
                show-input
              ></el-slider>
              <el-date-picker
                v-show="value2 == false"
                v-model="RoleItemTime"
                type="datetime"
                placeholder="选择固定日期时间">
              </el-date-picker>
            </div>
          </div>

        </div>
        <el-button type="primary" @click="AddNewRoleItem">确 定</el-button>

        <el-dialog
          width="100%"
          title="查看调查表"
          :visible.sync="mubanVisible"
          append-to-body>
          <div style="flex: 0 0 77%;margin-left: 2%;background: #ffffff;color: #1f150b">
            <h2>{{this.$store.state.Flup.panelobject.mubanTitle}}</h2>
            <div v-for="item in stepData3">
              {{item.id}}:{{item.label|formatQuestion(item.ATYPE)}}

              <el-checkbox-group
                v-model="checkedCities1[item.id-1]"
              >
                <el-checkbox v-for="city in item.children" :label="city.label" :key="city.ordrowid">
                  <span v-show="city.type != '备注'" style="color: #1f150b">{{city.label}}</span>
                  <el-input v-model="beizhuitem" szie="mini" v-show="city.type == '备注' "></el-input>
                </el-checkbox>
              </el-checkbox-group>

            </div>
          </div>

        </el-dialog>

      </el-dialog>

      <div style="display: flex;flex-wrap: wrap">
        <div v-show="IsNewStatus" style="flex:  0 0 100%">
          <el-input style="width: 80%"  placeholder="请输入本次计划创建作用" clearable v-model="PlanName"></el-input>
          <el-input  style="width: 80%" placeholder="请输入本次计划创建备注" type="textarea"  v-model="Plandes"  :rows="2"></el-input>
        </div>
        <div  style="flex:  0 0 100%">
          <div class="color-list" style="width: 70vw;text-align: center;font-size: 18px">
            <el-row >
              <el-col :span="2">
               勾选框
              </el-col>
              <el-col :span="2">
                执行顺序
              </el-col>
              <el-col :span="5">
                随访表
              </el-col>
              <el-col :span="5">
                随访规则描述
              </el-col>
              <el-col :span="5">
                随访循环时间(天)
              </el-col>
              <el-col :span="5">
               随访创建时间
              </el-col>
            </el-row>
            <el-row>

                <el-col :span="24"
                        class="color-item"
                        v-for="(Role,index) in RoleItemList" v-dragging="{ item: Role, list: RoleItemList, group: 'Role' }"
                        :key="Role.RoleItemID"

                >
                  <el-col :span="2" >
                    <el-checkbox v-model="RoleItemCheck[index]">
                    </el-checkbox>
                  </el-col>

                  <el-col :span="2">
                    {{index+1}}
                  </el-col>
                  <el-col :span="5">
                    {{Role.ename}}
                  </el-col>
                  <el-col :span="5">
                    {{Role.Roledes}}
                  </el-col>
                  <el-col :span="5">
                    {{Role.RoleValues}}
                  </el-col>
                  <el-col :span="5">
                    {{Role.CTIME}}
                  </el-col>
                </el-col>



            </el-row>
          </div>

        <el-table
          v-show="false"
          ref="RoleItemTable"
          :data="this.RoleItemList"
          highlight-current-row
          @selection-change="RoleItemTableClick"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            property="ename"
            label="规则使用表格"
          >
          </el-table-column>
          <el-table-column
            property="Roledes"
            label="请选择一条适宜规则进行添加"
          >
          </el-table-column>
          <el-table-column
            property="RoleType"
            label="规则类型"
            :formatter="FormatType"
          >
          </el-table-column>
          <el-table-column
            property="RoleValues"
            label="规则时间"
          >
          </el-table-column>



        </el-table>
        </div>
      </div>


      <span slot="footer" class="dialog-footer">
    <el-button @click="RoleItemVisible = false">取 消</el-button>
        <el-button @click="RoleItemAdd">添加全新规则</el-button>
    <el-button type="primary" @click="addRoleItem">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'


  export default {

    components: {},
    name: "CreateUserFlup",
    data() {
      return {
        entityList: [{}],//随访表格列表
        SFTime: '',//随访时间选择
        SFTitle: '',//随访标题
        SFdesc: '',//随访描述
        SFUpdateID: '',//随访更新ID
        mubanVisible:false,
        active: 0,
        currentRow: [{
          children:[]
        }],
        currentSonRow: null,
        timeNUM: 7,
        PATLIST: [{},
          {}
        ],
        activeNames: ['1'],
        PATHINFO:
          {
            checkno: '',//检查号
            patname: '',//患者名
            patsex: '',//患者性别
            pathage: '',//患者年龄
            checkdoctor: '',//检查患者医生
            Clinical_diagnosis: '',//临床诊断
            ordrowid: '',//检查唯一ID

          },
        checkedCities1: [],
        beizhuitem: '',
        pickerOptions1: {
          shortcuts: [{
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '两天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          },
            {
              text: '三天后',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
                picker.$emit('pick', date);
              }
            },
            {
              text: '一周后',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            },

          ]
        }, //时间快速选择器
        PlanIndex: 0,
        RoleItemVisible: false,
        value2: true,
        RoleItemCycletime: 7,
        RoleItemTime: '',
        thisROW: [], //表示当前选中随访表
        Roledes: '', //规则描述
        innerVisible:false,//表示内层模态框状态
        RoleItemList:[],// 表示规则全部列表

        RoleItemListItem:[],//全部规则中选中项
        IsNewStatus:false,  //表示是否是新建计划
        PlanName:'', //新建计划名称
        Plandes:'' ,// 新建计划描述
        RoleItemCheck:[false,false]
      }
    },
    filters: {
      checkitems(data, type) {
        var temp = []

        for (var i in data) {
          temp.push({
              label: data[i].label,
              orderid: data[i].orderid
            }
          )

        }

        return temp
      },
      formatQuestion(data, atype) {

        if (atype != undefined) {
          var QBrange = atype.split(',')[0]
          var QLrange = atype.split(',')[1]
          var beizhustatus = atype.split(',')[2]
          if (QBrange == '0') {
            if (beizhustatus == 'null') {
              return data + '(单选题）'
            } else {
              return data + '(单选一个或者填入输入框中）'
            }

          } else {
            if (beizhustatus == 'null') {
              return data + '( 从中选出' + QLrange + '个答案来)'
            } else {
              return data + '( 从中选出' + QLrange + '个答案来,且可填入输入框)'
            }
          }
        } else{
          return data
        }
      },
    },
    mounted() {
      this.checkedCities1 = []
      if( this.$store.state.Flup.PlanList.length !=0){
        this.currentRow = this.$store.state.Flup.PlanList[0]
      } else {
        this.currentRow=
          {
            children:[{
              Roledes:'',
              ename:'',
            }]
          }

      }

      for (var i in this.$store.state.Flup.EntityDetail) {

        this.checkedCities1.push([])
      }
      this.$dragging.$on('dragged', ({ value }) => {
        // console.log(value.item)
        // console.log(value.list)
        // console.log(value.otherData)
        this.RoleItemList = value.list
      })
      this.$dragging.$on('dragend', () => {

      })



    },
    computed: {
      tableDataSon() {

        if(this.$store.state.Flup.PlanList[this.PlanIndex] != undefined){
          return this.$store.state.Flup.PlanList[this.PlanIndex].children
        } else {
          return [{
            id:'',
            order:'',
            lable:'',
            Roledes:'',
            ename:'',
            CTIME:''
          }]
        } //计算返回规则数据

      },
      tableData() {
        if (this.$store.state.Flup.PlanList.length != 0){
          return this.$store.state.Flup.PlanList
        }
        else {
          return [{
            Plandes:'',
            CTIME:''
          }]

        }

      },
      selectList() {
        return this.$store.state.Flup.patlist
      },
      stepData3() {

        return this.$store.state.Flup.EntityDetail
      },

    },
    methods: {

      RoleItemEdit(a, b) {

        console.log(a, b, '计划编辑')
      },

      RoleItemDelete(a, b) {
        var that = this
        if (1==1){
          $.ajax({
          type: 'DELETE',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.PlanItemDel+'/'+b.RoleItemID+'/'+b.PlanID,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: this.$store.state.Token,
            RoleItemID: b.RoleItemID,
            PlanID: b.PlanID
            // usename: _this.$store.state.server.dictinfo.username
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {
            if (e != '[{"status":"400"}]') {
              console.log('更新随访规则',  e)

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
                        RoleItemList:entitydata[i].RoleItemList
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
                    RoleItemList:entitydata[i].RoleItemList
                  })
                }
              }
              //console.log(tempdata)
              that.$store.state.Flup.PlanList = tempdata
              that.$store.state.Flup.PlanSonList = tempdatason
              that.$store.state.Flup.patlist = that.multipleSelection

              console.log('删除规则后更新随访计划', that.$store.state.Flup.PlanList)
            }

            //console.log('添加新规则', eval('(' + e + ')').ReminderExper)

            else {
              that.$router.push({path: '/'})
            }
          }


        })
        }
          console.log(a, b, '计划删除')
      },
      NewPlan() {
        var that=this
        this.Plandes=''
        this.PlanName=''
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleItemQuery,
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
              var a=e
              console.log("从已有规则中添加数据",a)


              for(var i in a){
                that.RoleItemCheck[i] = false
              } // 初始化check选择状态

              that.RoleItemList=a
              that.RoleItemVisible  = true
              that.IsNewStatus  =true
            }
          }
        })

      },
      PlanTableClick(a) {
        this.PlanIndex = a.id
          //console.log('正在点击表格', a)
      },//计算当前所用表ID  进而实时计算子规则ID
//----------------------计划表操作---------------------------


      FormatType(row,column,d){
        if (d == 'cycle'){
          return '循环定时任务'
        } else  if (d == 'single'){
          return '周期类任务'
        }

      },

      openAddRoleItem(){
        var that=this
        this.IsNewStatus  =false
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleItemQuery,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: this.$store.state.Token,
            pagenum:0,
            pagesize:0,
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
              var a=e
              console.log("从已有规则中添加数据",a)


                for (var j in that.tableDataSon){
                  a.splice(a.findIndex(item => item.RoleItemID === that.tableDataSon[j].RoleItemID), 1)

                }

              that.RoleItemList=a

            }
          }
        })
        this.RoleItemVisible = true
      },//打开模态框 展示所有列表数据

      RoleItemTableClick(a){
        this.RoleItemListItem=a
        console.log('规则库表格点击数组',a)

      },// 表示全部规则列表点击事件

      EntityTableClick(b,a) {
        var that = this
        this.thisRow = a

        that.$store.state.Flup.panelobject.mubanTitle = ''
        that.$store.state.Flup.EntityDetail = []
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
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
            ORDROWID: a.ORDROWID
            // usename: _this.$store.state.server.dictinfo.username
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {
            if (e != '[{"status":"400"}]') {

              console.log('MUBAN', e)
              var muban = e
              if (muban.length != 0) {
                that.$store.state.Flup.panelobject.mubanTitle = muban[0].EntityName
                that.$store.state.Flup.panelobject.mubanID = muban[0].TempletID
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
                        type:muban[j].itemtype
                      })
                    }
                  }
                }
                that.mubanVisible=true
                console.log('添加子规则模板预览', templetList)
                that.$store.state.Flup.EntityDetail = templetList
                loading.close()
              } else {
                that.$store.state.Flup.EntityDetail = []
              }

            } else {
              that.$router.push({path: '/'})
            }
          }
        })
        console.log("当前选择的调查表为", a)

      },
      addRoleItem() {
        var that=this
        var tempdata=[]
        var tempindex=1
        for(var i in this.RoleItemCheck){
          if (this.RoleItemCheck[i]  == true){
            var tempDataMini = this.RoleItemList[i]
            tempDataMini.index=tempindex
            tempdata.push(tempDataMini)
            tempindex =tempindex+1
          }
        }

        if (this.IsNewStatus == false) {

          if(1==1){
            $.ajax({
              type: 'post',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.PlanAddRole,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                Ecreater: this.$store.state.user.ordrowid,
                PlanID:this.currentRow.PlanID,
                RoleItemID:JSON.stringify(tempdata),
                Plandes:this.currentRow.Plandes
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  console.log('从已知库添加',e)

                  var data = e
                  that.$store.state.Flup.PlanList = []
                  that.$store.state.Flup.PlanSonList = []
                  var tempdata = []  //计划列表
                  //var tempdatason = [] //计划子规则
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
                            RoleItemList:entitydata[i].RoleItemList
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
                        RoleItemList:entitydata[i].RoleItemList
                      })
                    }

                      that.RoleItemCheck[i] = false  //初始化选择框

                  }
                  //debugger
                  that.$store.state.Flup.PlanList = tempdata
                  //that.$store.state.Flup.PlanSonList = tempdatason
                  that.$store.state.Flup.patlist = that.multipleSelection

                }
              }
            })
          }

        } //添加全新子规则
        else
        {
          //console.log('传入后台的数据 计划名:', this.PlanName, '计划说明', this.Plandes, '计划列表', this.RoleItemList, '计划创建', this.RoleItemCheck)
          console.log('提交新计划数据',tempdata)
          if(this.Plandes !='' && this.PlanName !=''){
            $.ajax({
              type: 'post',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.PlanAdd,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                Ecreater: this.$store.state.user.ordrowid,
                PlanName:this.PlanName,
                Plandes:this.Plandes,
                RoleItemID:JSON.stringify(tempdata),
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  console.log('从已知库添加',e)

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
                            RoleItemList:entitydata[i].RoleItemList
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
                        RoleItemList:entitydata[i].RoleItemList
                      })
                    }
                    that.RoleItemCheck[i] = false
                  }
                  that.$store.state.Flup.PlanList = tempdata
                  that.$store.state.Flup.PlanSonList = tempdatason
                  that.$store.state.Flup.patlist = that.multipleSelection
                }
              }
            })
          } else {
            this.$message.error('请填写计划名及计划备注');
          }
          this.IsNewStatus = false
            }
        this.RoleItemVisible = false
      }, // 新建计划
      AddNewRoleItem() {
        var that = this
        if (this.value2 == true) {
          var RoleItemType = 'single'
          var RoleItemTime = this.RoleItemCycletime
        } else {
          var RoleItemType = 'cycle'
          var RoleItemTime = this.formatDateTime(this.RoleItemTime)
        }


        if (1 == 1) {
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleItemAdd,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              _xsrf: this.$store.state.Token,
              EntityID: this.thisRow.ORDROWID,
              RoleType: RoleItemType,
              Roledes: this.Roledes,
              RoleValues: RoleItemTime,
              CREATER: this.$store.state.user.ordrowid,
              PlanID: this.tableDataSon[0].PlanID,
              Plandes: this.tableDataSon[0].Plandes
              // usename: _this.$store.state.server.dictinfo.username
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success: function (e) {
              if (e != '[{"status":"400"}]') {
                console.log('更新随访规则', e)

                var data = e
                that.$store.state.Flup.PlanList = []
                //that.$store.state.Flup.PlanSonList = []
                var tempdata = []  //计划列表
                //var tempdatason = [] //计划子规则
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
                          RoleItemList:entitydata[i].RoleItemList
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
                      RoleItemList:entitydata[i].RoleItemList
                    })
                  }
                }
                console.log(tempdata)
                that.innerVisible=false
                that.$store.state.Flup.PlanList = tempdata
                //that.$store.state.Flup.PlanSonList = tempdatason
                //that.$store.state.Flup.patlist = that.multipleSelection
                //debugger
                console.log('添加规则后更新随访计划', that.$store.state.Flup.PlanList)
              }
              else {
                that.$router.push({path: '/'})
              }

            }
          })
        }
        console.log('提交数据,调查表：', this.thisRow.ORDROWID, '规则类型', RoleItemType, '规则时间', RoleItemTime)
        this.RoleItemVisible = false
      },

      RoleItemAdd() {

        var that = this
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

              console.log('MUBAN', e )
              var muban =  e
              if (muban.length != 0) {
                that.entityList = muban
                //console.log('QLIST',QList)


              } else {
                that.$store.state.Flup.EntityDetail = []
              }

            } else {
              that.$router.push({path: '/'})
            }
          }
        })
        this.innerVisible = true

      }, //添加全新规则使用
      //-----------------模态框操作------------

      handleCurrentSONChange(val) {
        this.currentSonRow = val;
        console.log('当前计划子规则', val)
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
      },  //工具  用于格式化时间 为 2018-03-09  14:22:00
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
        console.log('取消选择随访计划', this.currentRow)
      },
      handleChange(val) {
        console.log(val);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        //console.log('当前计划数据', val)
      },

      //---------------------页面动作----------------------
      upStep() {
        if (this.active - 1 >= 0) {
          this.active--
        }
      }, //控制后退动作
      next() {
        var that = this
        if (this.active == 0) {
          if (this.currentRow != undefined) {

            console.log('已完成当前步骤', this.currentRow)
            this.active = this.active + 1
          } else {

            this.$message.error('请选择后提交');
          }
        } else if (this.active == 1) {


          if (this.SFTime != "" || this.$store.state.Flup.panelobject.AutoStatus == true) {
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
                ORDROWID: this.currentRow.ORDROWID
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {

                  console.log('MUBAN', e)
                  var muban = e
                  if (muban.length != 0) {
                    that.$store.state.Flup.panelobject.mubanTitle = muban[0].EntityName
                    that.$store.state.Flup.panelobject.mubanID = muban[0].TempletID
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

                          })
                        }
                      }
                    }

                    console.log('sf', templetList)
                    that.$store.state.Flup.EntityDetail = templetList
                  } else {
                    that.$store.state.Flup.EntityDetail = []
                  }

                } else {
                  that.$router.push({path: '/'})
                }
              }
            })

            this.active = this.active + 1
            console.log('预览步骤', this.active, this.$store.state.Flup.EntityDetail)
          }

          else {
            this.$message.error('请选择一个时间后提交');
          }


        } else if (this.active == 2) {


          // if (1==1) {
          if (this.SFTitle == ''){
            this.$message.error('请填写本次随访目的');
          } else {
            console.log('提交', this.active)
            this.active = this.active + 1
          }
          //}
        } else if (this.active == 3) {
            if(1==1){
              //debugger
              $.ajax({
                type: 'post',
                url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleAdd,
                async: true,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  ECREATER: this.$store.state.user.ordrowid,
                  _xsrf: this.$store.state.Token,
                  CYCLETIME: this.formatDateTime(this.SFTime),
                  SFTITLE: this.SFTitle,
                  SFDESC: this.SFdesc,
                  PlanID: this.currentRow.PlanID,
                  PATID: JSON.stringify(this.selectList),
                  ROLETYPE: 'manual',
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
                    that.active = that.active + 1
                    console.log("save", data)
                    that.$router.push({path:'/patmanage/followinfo'})
                  }
                }
              })
            }
          console.log('本次随访将产生的数据：  随访名',this.currentRow.PlanID,'随访目的',this.SFTitle,'随访备注',this.SFdesc,'开始时间',this.formatDateTime(this.SFTime),'分发人物',this.selectList)
          if(1==2) {
            if (this.SFTitle != '' && (this.SFTime != '' || this.$store.state.Flup.panelobject.AutoStatus == true)) {
              if (this.$store.state.Flup.panelobject.newOrUpdate == false) {


                console.log('保存', this.active)
                if (this.$store.state.Flup.panelobject.AutoStatus == true) {
                  var timetemp = this.timeNUM
                  var roletype = 'auto'
                } else {
                  var timetemp = this.formatDateTime(this.SFTime)
                  var roletype = 'manual'
                }  //根据  Autostatus 判断是否 该更新数据是 自动更新数据还是手动设置数据 自动更新数据则进行设置  更新类型及更新时间周期设置
                console.log('当前时间', timetemp)
                $.ajax({
                  type: 'get',
                  url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleAdd,
                  async: true,
                  xhrFields: {
                    withCredentials: true
                  },
                  crossDomain: true,
                  data: {
                    _xsrf: this.$store.state.Token,
                    TEMPLATEID: this.currentRow.ORDROWID,
                    CYCLETIME: timetemp,
                    ECREATER: this.$store.state.user.ordrowid,
                    PATID: JSON.stringify(this.selectList),
                    DOPEOPLE: this.$store.state.user.ordrowid,
                    SFTITLE: this.SFTitle,
                    SFDESC: this.SFdesc,
                    ROLETYPE: roletype,
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
                      that.active = that.active + 1
                      console.log("save", data)
                      if (that.$store.state.Flup.panelobject.AutoStatus == true) {
                        that.$store.state.Flup.panelobject.AutoStatus = false

                        that.$router.push({path: '/server/autoflup'})
                      } else {
                        that.$store.state.Flup.panelobject.AutoStatus = false
                        that.$router.push({path: '/patmanage/followinfo'})
                      }
                    }
                  }
                })
              }
              else {
                if (this.$store.state.Flup.panelobject.AutoStatus == true) {
                  var timetemp = this.timeNUM
                  var roletype = 'auto'
                  var ordrowid = this.$store.state.Flup.MainForRole.ordrowid
                } else {
                  var timetemp = this.formatDateTime(this.SFTime)
                  var roletype = 'manual'
                  var ordrowid = this.$store.state.Flup.MainForRole.ROLEID
                }
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
                    CYCLETIME: timetemp,
                    SFTITLE: this.SFTitle,
                    SFDESC: this.SFdesc,
                    SFUpdateID: ordrowid,
                    TEMPLATEID: this.currentRow.ORDROWID,
                    PATID: JSON.stringify(this.selectList),
                    ROLETYPE: roletype,
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
                      that.active = that.active + 1
                      console.log("save", data)
                      this.$store.state.Flup.panelobject.AutoStatus = false
                      this.$store.state.Flup.panelobject.newOrUpdate = false
                      that.$router.push({path: '/patmanage/followinfo'})
                    }
                  }
                })
              }
            } else {
              this.$message.error('请填下标题和描述后提交');
            }
          }
        }

      }  //控制前进动作
    }
  }
</script>

<style scoped>

</style>
