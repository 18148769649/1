<template>
    <div style="height: 90vh;width: calc(100vw - 200px)">
      <div>
        <el-row :gutter="20" >
          <el-col :span="24" style="text-align: center;background-color: #e4e4e4">
            <span style="font-size: 30px;margin: 0px 10px;flex: 0 0 100%">
              随访查询
            </span>
          </el-col>
          <el-col :span="24"  >
            <el-row align="middle" style="height: 10vh"  type="flex">
              <el-col :span="24" style="text-align: center">
                <el-date-picker
                  v-model="value2"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
                <el-button @click="GetAction">时间查询</el-button>
              </el-col>
            </el-row>
            <el-row align="middle" style="height: 10vh"  type="flex">
              <el-col v-show="PanelStatus.SearchKeyShow">
                <b>本次查询时间:</b>{{ SearchKey.STIME}}----{{ SearchKey.ETIME}}
              </el-col>
            </el-row>
          </el-col>

          <el-col>
            <el-table
              :data="countData.PICI"
              style="width: 100%"
              border
              height="60vh"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-row>
                    <el-col :span="6">
                      <span><b>该批次随访计划名:</b>{{ props.row.PlanName }}</span>
                    </el-col>
                    <el-col :span="6">
                      <span><b>随访目的：</b>{{props.row.SFTITLE}}</span>
                    </el-col>
                    <el-row :gutter="12" >
                       <el-col style="text-align: center">
                         <el-col :span="6">
                           序号
                         </el-col>
                         <el-col  :span="5">
                           随访所使用调查表
                         </el-col>
                         <el-col  :span="5">
                           完成状况
                         </el-col>
                         <el-col :span="8">
                           操作
                         </el-col>
                       </el-col>
                        <el-col  v-for="(item,index) in props.row.children" :key="index" :span="24" style="margin: 10px 0;text-align: center">
                          <el-col :span="6">
                             {{index}}
                          </el-col>
                          <el-col  :span="5">
                             {{item.ename}}

                           </el-col>
                          <el-col  :span="5">
                            完成:{{item.sftrue}} / 未完成 ：{{item.sffalse}}  /填写调查表 ：{{item.sfusetrue}}

                          </el-col>

                          <el-col  :span="8">
                              <el-button @click="LookFormDetail(item)" >
                                查看表格回馈具体情况
                              </el-button>
                           </el-col>

                        </el-col>
                    </el-row>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="SFTITLE"
                label="随访目的"
                >
              </el-table-column>
              <el-table-column
                prop="PlanName"
                label="随访所用计划">
              </el-table-column>
              <el-table-column
                prop="CTIME"
                label="创建时间">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col>
            <el-tabs v-model="ToggleButton"  v-show="false"  type="card">
              <el-tab-pane label="已随访人员" name="first">
                <el-table
                  :data="countData.PATS"
                  style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">

                      <el-row :gutter="20" style="font-size: 20px">
                        <el-col :span="12">
                          <span class="expendProp">患者名：</span><span>{{ props.row.PATNAME }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">患者性别：</span><span>{{ props.row.PATSEX }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">随访频次：</span> <span>{{ props.row.HZ }}次</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">随访时间：</span><span>{{ props.row.CYCLETIME }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">患者地址：</span><span>{{ props.row.ADDRESS }}</span>
                        </el-col>
                      </el-row>

                    </template>
                  </el-table-column>
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="PATNAME"
                    label="姓名"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="ADDRESS"
                    label="地址">
                  </el-table-column>
                  <el-table-column
                    prop="PATSEX"
                    label="性别">
                  </el-table-column>
                  <el-table-column
                    prop="HZ"
                    label="随访次数">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已接受反馈数" name="second">
                <el-table
                  :data="countData.ROLES"
                  style="width: 100%"
                  height="60vh"
                >
                  <el-table-column type="expand">
                    <template slot-scope="props">

                      <el-row :gutter="20" style="font-size: 20px" class="expendROLES">
                        <el-col :span="12">
                          <span class="expendProp">患者名：</span><span>{{ props.row.PATNAME }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">患者性别：</span><span>{{ props.row.PATSEX }}</span>
                        </el-col>

                        <el-col :span="12">
                          <span class="expendProp">患者地址：</span><span>{{ props.row.ADDRESS }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">随访时间：</span><span>{{ props.row.CycleTime }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">患者目的：</span><span>{{ props.row.SFTITLE }}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="expendProp">患者备注：</span><span>{{ props.row.SFdesc }}</span>
                        </el-col>
                        <el-col :span="24">
                          <span class="expendProp">随访建议：</span><p>{{ props.row.SFSUGGEST }}</p>
                        </el-col>
                        <el-col :span="24">
                          <span class="expendProp">随访分析：</span><p>{{ props.row.SFANYLISE }}</p>
                        </el-col>
                        <el-col :span="24">
                          <span class="expendProp">随访结果：</span><p>{{ props.row.SFREST }}</p>
                        </el-col>
                      </el-row>

                    </template>
                  </el-table-column>
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="PATNAME"
                    label="患者名">
                  </el-table-column>
                  <el-table-column
                    prop="SFTITLE"
                    label="目的">
                  </el-table-column>
                  <el-table-column
                    prop="CycleTime"
                    label="随访时间">
                  </el-table-column>
                  <el-table-column
                    prop="SFSTATUS"
                    label="随访状态"
                    :formatter="FormataStatus"
                    :filters="[{ text: '未完成', value: 'false' }, { text: '已填下调查表', value: 'usetrue' },{ text: '完成随访', value: 'true' }]"
                    :filter-method="filterTag"
                  >
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="当前">

              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        title="查看调查问卷结果"
        :visible.sync="dialogVisible"
        width="40%"
        top = "5vh"
        >
        <questionnaire :data='ResultData.data'   @DivClick="DivClick"  ></questionnaire>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>

    </div>
</template>

<script>
     import  $ from  'jquery'
     import questionnaire from '@/components/questionnaire'
     import ElDialog from "element-ui/packages/dialog/src/component";
     export default {
       components: {
         ElDialog,
         questionnaire
       },
       name: "ANALYSIS",
       data() {
         return {
           ToggleButton: 'first',//切换状态
           pickerOptions2: {
             shortcuts: [{
               text: '最近一周',
               onClick(picker) {
                 const end = new Date();
                 const start = new Date();
                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                 picker.$emit('pick', [start, end]);
               }
             }, {
               text: '最近一个月',
               onClick(picker) {
                 const end = new Date();
                 const start = new Date();
                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                 picker.$emit('pick', [start, end]);
               }
             }, {
               text: '最近三个月',
               onClick(picker) {
                 const end = new Date();
                 const start = new Date();
                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                 picker.$emit('pick', [start, end]);
               }
             }]
           },//时间选择器快捷选项
           value2: [new Date(), new Date()], //时间查询默认值
           countData: {
             PATS: [{
               PATNAME: '',
               PATID: ''
             }],
             ROLES: [{}],
             PICI: [{}]
           },
           SFCOUNT: {
             sftrue: [], //初始化随访完成计数值
             sffalse: [], //初始化随访未完成计数值
             sfusetrue: [] //初始化随访仅填写随访计数值
           },
           SearchKey: {
             STIME: '',
             ETIME: ''
           }, //搜索关键词
           PanelStatus: {
             SearchKeyShow: false
           },
           ResultData:{
             data:[],
             size:0
           },
           dialogVisible:false
         }
       },
       methods: {

         filterTag(value, row) {
           return row.SFSTATUS === value;
         }, //过滤标签
         FormataStatus(val) {
           if (val.SFSTATUS == 'true') {
             return '完成随访'
           } else if (val.SFSTATUS == 'usetrue') {
             return '已填下调查表'
           } else if (val.SFSTATUS == 'false') {
             return '未完成'
           }
         },//格式化随访状态
         formatDateTime(inputTime) {
           var date = inputTime;
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
         GetAction() {
           this.PanelStatus.SearchKeyShow = true
           var that = this
           var tempdatas = []
           var tempdata = []
           var TempDataString

           tempdata[0] = this.formatDateTime(this.value2[0])
           tempdata[1] = this.formatDateTime(this.value2[1])
           this.SearchKey.STIME = tempdata[0]
           this.SearchKey.ETIME = tempdata[1]
           tempdatas.push({
             'query': tempdata
           })
           tempdatas.push({
             'key1': 'test1'
           })
           TempDataString = JSON.stringify(tempdatas)

           if (1 == 1) {
             $.ajax({
               type: 'get',
               url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.roleWork,
               async: true,
               xhrFields: {
                 withCredentials: true
               },
               crossDomain: true,
               data: {
                 _xsrf: this.$store.state.Token,
                 // Datas: TempDataString
                 STIME:tempdata[0],
                 ETIME:tempdata[1]
                 // usename: _this.$store.state.server.dictinfo.username
               },
               headers: {
                 //     // 跨域请求 这个配置不能少
                 "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                 'Accept': 'application/json'
               },
               success: function (e) {
                 if (e != '[{"status":"400"}]') {
                   const SearchRoleData = e
                   console.log('原始数据', SearchRoleData)
                   var tempPICIList = [] //暂时存放PICI数组
                   var tempFormList = [] //暂时存放表格数据
                   var tempRoleList = []  //存放随访计划数据
                   that.countData.PICI = [] //初始化数据
                   var nowPICI = 0 //当前PICI在数组中的序号
                   var nowForm = 0  //当前form数组
                   var tempSearchData = []
                   for (var i in SearchRoleData) {
                     nowPICI = tempPICIList.indexOf(SearchRoleData[i].PICI)  //获得 tempPICILIST 序号
                     if (nowPICI == '-1') {
                       console.log(1)
                       tempSearchData = JSON.parse(JSON.stringify(SearchRoleData[i]))
                       tempSearchData.children = []
                       tempSearchData.children[0] = JSON.parse(JSON.stringify(SearchRoleData[i]))
                       tempSearchData.children[0].children=[]
                       tempSearchData.children[0].children[0] = JSON.parse(JSON.stringify(SearchRoleData[i]))

                       that.countData.PICI.push(tempSearchData)
                       tempSearchData = null
                       tempPICIList.push(SearchRoleData[i].PICI)
                       tempFormList[tempPICIList.indexOf(SearchRoleData[i].PICI)] = [SearchRoleData[i].PlanID]
                       nowPICI = tempPICIList.indexOf(SearchRoleData[i].PICI)
                       that.countData.PICI[nowPICI].children[0].sffalse = 0
                       that.countData.PICI[nowPICI].children[0].sftrue = 0
                       that.countData.PICI[nowPICI].children[0].sfusetrue = 0
                       nowForm = 0
                     }
                     else {

                       nowForm = tempFormList[nowPICI].indexOf(SearchRoleData[i].PlanID) // 判断是否在相应PICI里面  form是否存在 存在取得其序号
                       if (nowForm == '-1') {
                         console.log(2)
                         that.countData.PICI[nowPICI].children.push(JSON.parse(JSON.stringify(SearchRoleData[i])))
                         tempFormList[nowPICI].push(SearchRoleData[i].PlanID)
                         nowForm = tempFormList[nowPICI].indexOf(SearchRoleData[i].PlanID)
                         that.countData.PICI[nowPICI].children[nowForm].sffalse = 0
                         that.countData.PICI[nowPICI].children[nowForm].sftrue = 0
                         that.countData.PICI[nowPICI].children[nowForm].sfusetrue = 0
                       }  //判断是否form 是该pici新增  如果是 则初始化
                       if (that.countData.PICI[nowPICI].children[nowForm].children == undefined) {
                         console.log(3)
                         that.countData.PICI[nowPICI].children[nowForm].children = []
                       }

                       that.countData.PICI[nowPICI].children[nowForm].children.push(JSON.parse(JSON.stringify(SearchRoleData[i])))
                     }

                     if (SearchRoleData[i].SFSTATUS == 'true') {
                       that.countData.PICI[nowPICI].children[nowForm].sftrue = that.countData.PICI[nowPICI].children[nowForm].sftrue + 1
                     } else if (SearchRoleData[i].SFSTATUS == 'false') {
                       that.countData.PICI[nowPICI].children[nowForm].sffalse = that.countData.PICI[nowPICI].children[nowForm].sffalse + 1
                     } else {
                       that.countData.PICI[nowPICI].children[nowForm].sfusetrue = that.countData.PICI[nowPICI].children[nowForm].sfusetrue + 1
                     }

                   }

                   console.log('搜索结果', that.countData, SearchRoleData)
                 }
               }
             })
           }    //根据条件查询随访
         },
         LookFormDetail(item) {
           var that=this
           var temp = [] //

           if (item.children !== undefined) {
             for (var i in item.children) {
               temp.push({
                 ORDROWID: item.children[i].ORDROWID,
                 PATID: item.children[i].PATID,
                 PICI: item.children[i].PICI,
                 SFSTATUS: item.children[i].SFSTATUS
               })
             }
           } else {
             temp.push({
               ORDROWID: item.ORDROWID,
               PATID: item.PATID,
               PICI: item.PICI,
               SFSTATUS: item.SFSTATUS
             })
           }  //格式化必要的数据到后台
          console.log('当前输入数据',temp)

           $.ajax({
             type: 'POST',
             url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.roleResultDetail,
             async: true,
             xhrFields: {
               withCredentials: true
             },
             crossDomain: true,
             data: {
               _xsrf: this.$store.state.Token,
               Datas: JSON.stringify(temp)
               // usename: _this.$store.state.server.dictinfo.username
             },
             headers: {
               //     // 跨域请求 这个配置不能少
               "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
               'Accept': 'application/json'
             },
             success: function (e) {
               if (e != '[{"status":"400"}]') {
                 console.log('查看随访表格反馈结果', e)
                 var muban= e
                 var QNameList = []
                 var QList = []
                 var Qindex = 1
                 var tempITEMS=[]
                 var sumitems=[]
                 for (var i in muban) {
                     if (QNameList.indexOf(muban[i].QUESTIONNAME) == -1) {
                       QNameList.push(muban[i].QUESTIONNAME)
                       QList.push({
                         id: Qindex,
                         label: muban[i].QUESTIONNAME,
                         orderid: muban[i].QUESTIONID,
                         children: []
                       })
                       tempITEMS[Qindex-1] =[]
                       sumitems[Qindex-1] =[]
                       Qindex = Qindex + 1

                     }
                 }
                 var templetList = QList
                 var nums=0
                 for (var j in muban) {
                   for (var q in templetList) {
                     if (templetList[q].label == muban[j].QUESTIONNAME) { //判断是否属于该问题下 是则进行添加答案


                        nums=tempITEMS[templetList[q].id-1].indexOf(muban[j].ITEMVALUE) //获得相应题下该答案在数组中的序号
                       tempITEMS[templetList[q].id-1].push(muban[j].ITEMVALUE)
                       if(nums == '-1'){
                         nums=tempITEMS[templetList[q].id-1].indexOf(muban[j].ITEMVALUE)  //判断是否为新答案  如果是则获得添加后的新索引
                         sumitems[templetList[q].id-1][nums] =0 // 初始化该答案值为 0
                         templetList[q].children.push({
                           id: muban[j].ITEMID,
                           label: muban[j].ITEMVALUE,
                           orderid: muban[j].ITEMID,
                           dostatus: muban[j].DOSTATUS,
                           nums:sumitems[templetList[q].id-1][nums]
                         })
                         }
                       if(muban[j].DOSTATUS == 'true' || muban[j].DOSTATUS =='usetrue' ){

                          sumitems[templetList[q].id-1][nums] =sumitems[templetList[q].id-1][nums]+1 //否则在该答案索引+1
                          templetList[q].children[nums].nums=sumitems[templetList[q].id-1][nums]


                       }
                     }
                   }
                 }

                 console.log('本次随访结果统计',templetList)
                 that.ResultData.data  =templetList
                 that.ResultData.size = QList.length
                 that.dialogVisible =true
               }
             }
           })
         },
         DivClick(val){
           console.log('子组件事件方法',val)
         }
       }
     }
</script>

<style scoped>
  .SecondContent {
    font-size: 20px;
  }
  .SecondTitle{
    font-size: 20px;
    font-weight: bold;
  }
  .expendProp{
    font-weight: bold;
  }
  .expendROLES P{
    margin-left: 3vh;
  }
</style>
