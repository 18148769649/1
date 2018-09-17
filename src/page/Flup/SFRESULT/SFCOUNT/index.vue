<template>
    <div style="height: 70vh;background-color: #ffffff">
      <div style="height: 10vh">
        <el-row :gutter="20" >
          <el-col :span="24" :style="'text-align: center;background-color:'+PanelStatus.background ">
            <span style="font-size: 30px;margin: 0px 10px;flex: 0 0 100%">
              随访查询
            </span>
          </el-col>
          <el-col :span="24"  >
            <el-row align="middle" style="height: 10vh"  type="flex">
              <el-col :span="24" style="text-align: center">
                <el-date-picker
                  v-model="PanelParam.SearchTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="$SelfUtils.pickerOptions2">
                </el-date-picker>
                <el-button @click="GetAction">时间查询</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="charts"  >
          <div id="myChart"   v-if="PanelStatus.chartstatus" ref="CountEcharts" :style="'width:calc(95vw - 200px);height:'+ChartHeight+'vh'"></div>
        </div>
      </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "SFCOUNT",
        data(){
          return {
            SearchKey: {
              STIME: '',
              ETIME: ''
            }, //搜索关键词
            PanelStatus: {
              ToggleNum:0,
              SearchKeyShow: false,
              ChartHeight:80,
              chartstatus:true,
              background:'#e4e4e4'
            },
            PanelParam:{
              SearchTime:''
            },
            ChartsData:{
              RoleNum:0, //随访次数
              PatList:[]  //随访人员列表
            },
            myChart:{

            },
            ChartsOptions:{
              PatOption:{
                BarColors:[],
                TDOA:[],
                patlists:[],
                Xseries:[],
                picilist:[]
              }
            },
            resp:[]
          }
        },
        methods:{
          RESIZE(){
            if(this.myChart.id != undefined){
              console.log('调用chart')
              this.myChart.resize({
                height:'auto'
              })
            }
          },
          ToggleView(){

            var that=this
            var option={
            }

            if( that.PanelStatus.ToggleNum == 1){
              let SFTRUE=0
              let SFFALSE=0
              let SFUSETRUE=0
              let SFSTSTUS=[]
              let SFPICILIST=[]
              let PICIINDEX=0
              for(let i in that.resp){
                PICIINDEX = SFPICILIST.indexOf(that.resp[i].PICI)
                if(PICIINDEX == '-1') {
                  SFPICILIST.push(that.resp[i].PICI)
                  PICIINDEX = SFPICILIST.indexOf(that.resp[i].PICI)
                  SFSTSTUS[PICIINDEX] ={

                  }
                  SFSTSTUS[PICIINDEX].data = [{
                    'name': '已随访', value: 0
                  }, {
                    'name': '未随访', value: 0
                  }, {
                    'name': '已填写调查表', value: 0
                  }]
                  SFSTSTUS[PICIINDEX].name=that.resp[i].PlanName
                }
                  if(that.resp[i].SFSTATUS == 'true'){
                    SFTRUE=SFTRUE+1
                    SFSTSTUS[PICIINDEX].data[0].value= SFSTSTUS[PICIINDEX].data[0].value +1
                  } else if(that.resp[i].SFSTATUS == 'false'){
                    SFFALSE=SFFALSE+1
                    SFSTSTUS[PICIINDEX].data[1].value= SFSTSTUS[PICIINDEX].data[1].value +1
                  } else  if(that.resp[i].SFSTATUS == 'usetrue'){
                    SFUSETRUE=SFUSETRUE+1
                    SFSTSTUS[PICIINDEX].data[2].value= SFSTSTUS[PICIINDEX].data[2].value +1
                  }
            }

              //---开始初始化各option变量----------
              let Xdata= [
                {
                  name: '总随访次数',
                  type: 'pie',
                  radius : '30%',
                  center: ['20%', '50%'],
                  color:['#36e4bb','#52aede','#b17839'],
                  data:[
                    {value:SFTRUE, name:'已随访'},
                    {value:SFFALSE, name:'未随访'},
                    {value:SFUSETRUE, name:'已填写调查表'},
                  ],
                  label: {
                    normal: {
                      formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                      backgroundColor: '#eee',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,

                      rich: {
                        b: {
                          fontSize: 11,
                          lineHeight: 20
                        },
                        per: {
                          color: '#eee',
                          backgroundColor: '#334455',
                          padding: [2, 4],
                          borderRadius: 2
                        }
                      }
                    }
                  },

                }]
              let TitleData= [{
                text: '时间段内随访计划',
                subtext: that.SearchKey[0]+'-------'+that.SearchKey[1],
                x:'center'
              }]
              let Xstart = 45
              let Ystart = 0
              let Ymiddle=0 //中间间隔

              if(SFSTSTUS.length>9){
                that.PanelStatus.ChartHeight=that.PanelStatus.ChartHeight +20*(Math.ceil((SFSTSTUS.length-9),3))
                that.PanelStatus.background='#b17839'
              }
              Ystart = 20*100/that.PanelStatus.ChartHeight
              Ymiddle = 22*100/that.PanelStatus.ChartHeight
              for(let j in SFSTSTUS){
                TitleData.push({
                  text:SFSTSTUS[j].name,
                  x:(Xstart+5)+'%',
                  y:(Ystart) +'%'
                }) //添加饼图标题数据
                Xdata.push({
                  name:SFSTSTUS[j].name ,
                  type: 'pie',
                  radius: '18%',
                  center: [Xstart+'%', Ystart+'%'],
                  color:['#36e4bb','#52aede','#b17839'],
                  data:SFSTSTUS[j].data,
                  label: {
                    normal: {
                      formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                      backgroundColor: '#eee',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,

                      rich: {
                        b: {
                          fontSize: 11,
                          lineHeight: 20
                        },
                        per: {
                          color: '#eee',
                          backgroundColor: '#334455',
                          padding: [2, 4],
                          borderRadius: 2
                        }
                      }
                    }
                  },
                }) //添加饼图数据
                // if(Xstart <101 && Xstart>30){
                  if(Xstart+20 < 100){
                    Xstart=Xstart+20
                  } else {
                    Xstart = 45
                    Ystart =Ystart + Ymiddle
                  }

                // } else {
                //   if(Xstart == 20){
                //     Xstart == 90
                //   } else if (Xstart == 80){
                //     Xstart =30
                //     Ystart =Ystart+20
                //   }
                // } //计算饼图各饼位置

              }
              option = {
                title : TitleData,
                toolbox: {
                  show: true,
                  feature: {
                    mark: {show: true},
                    dataView: {
                      show: true,
                      readOnly: true,

                    },
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true},
                    mySumView0: {
                      show: true,
                      title: '切换到设计视图',
                      icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cuc2ZvbnQuY24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5zZm9udC5jbiA8L21ldGFkYXRhPg0KPGc+PHBhdGggZD0iTTk2OS42LDM0OS43bDAuMSwwLjFsLTE3LjQsMTUuNkg3NzAuM0g0MDFsMCwwSDI3OS4ybDAsMEgxMzdoLTY2Yy0zMy42LDAtNjAuOS0yNy4zLTYwLjktNjAuOWMwLTMzLjYsMjcuMy02MC45LDYwLjktNjAuOWgxNTguOGwwLDBoLTExLjZsMCwwaDI2My45bDAsMGgyODguMWwtODUuMS03Ni41bDAuMS0wLjFjLTEyLjMtMTEuMS0yMC40LTI3LjItMjAuNC00NS4yYzAtMzMuNiwyNy4zLTYwLjksNjAuOS02MC45YzE1LjYsMCwyOS45LDYuMSw0MC42LDE1LjdsMC4xLTAuMWwyMDMuMSwxODIuN2wtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMkM5OTAsMzIyLjUsOTgyLDMzOC42LDk2OS42LDM0OS43eiIvPjxwYXRoIGQ9Ik0xMCw2OTUuNWMwLTE4LDcuOS0zNCwyMC40LTQ1LjJsLTAuMS0wLjFsMTcuNS0xNS43bDE4MiwwLjFoMjg4LjFsMCwwaDI2NGwwLDBoLTExLjZsMCwwaDE1OC44YzMzLjYsMCw2MC45LDI3LjMsNjAuOSw2MC45YzAsMzMuNi0yNy4zLDYwLjktNjAuOSw2MC45aC02Nkg3MjAuOWwwLDBINTk5LjFsMCwwSDIyOS43bDg1LjEsNzYuNWwtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMmMwLDMzLjYtMjcuMyw2MC45LTYwLjksNjAuOWMtMTUuNiwwLTI5LjktNi4xLTQwLjYtMTUuN2wtMC4xLDAuMUwzMC40LDc0MC44bDAuMS0wLjFDMTgsNzI5LjMsMTAsNzEzLjQsMTAsNjk1LjV6Ii8+PC9nPg0KPC9zdmc+',
                      onclick: function () {
                        that.PanelStatus.ToggleNum = 0
                        that.ToggleView();
                      }


                    },
                  },
                },
                calculable : true,
                tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : Xdata
              };

              console.log('饼图',option,that.PanelStatus.ChartHeight)
            }else if (  that.PanelStatus.ToggleNum == 0){
              option = {
                title: [{
                  text: '随访工作量统计图',
                  x: '10%',
                  y:'0%',
                  top:'0%',
                  textAlign: 'center'
                }],
                color:that.ChartsOptions.PatOption.BarColors,
                toolbox: {
                  show : true,
                  orient:'vertical',
                  top:50,
                  feature : {
                    mark : {show: true},
                    dataView : {
                      show: true,
                      readOnly: true,
                      optionToContent: function (opt) {
                        let axisData = opt.xAxis[0].data; //坐标数据
                        let DOPEOPLE = opt.series[0].DOPEOPLE
                        let series = opt.series; //折线图数据
                        let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                        let tdBodys = ''; //数据
                        series.forEach(function (item) {
                          //组装表头
                          tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
                        });
                        let table = `<div>执行人:${DOPEOPLE}</div><table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center;width: 98%;color: #B03A5B"><tbody><tr>${tdHeads} </tr>`;
                        for (let i = 0, l = axisData.length; i < l; i++) {
                          for (let j = 0; j < series.length; j++) {
                            //组装表数据
                            tdBodys += `<td>${ series[j].data[i]}</td>`;
                          }
                          table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
                          tdBodys = '';
                        }
                        table += '</tbody></table>';
                        return table;
                      }
                    },
                    magicType: {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true},
                    mySumView1 : {
                      show : true,
                      title : '切换到统计视图',
                      icon : 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cuc2ZvbnQuY24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5zZm9udC5jbiA8L21ldGFkYXRhPg0KPGc+PHBhdGggZD0iTTk2OS42LDM0OS43bDAuMSwwLjFsLTE3LjQsMTUuNkg3NzAuM0g0MDFsMCwwSDI3OS4ybDAsMEgxMzdoLTY2Yy0zMy42LDAtNjAuOS0yNy4zLTYwLjktNjAuOWMwLTMzLjYsMjcuMy02MC45LDYwLjktNjAuOWgxNTguOGwwLDBoLTExLjZsMCwwaDI2My45bDAsMGgyODguMWwtODUuMS03Ni41bDAuMS0wLjFjLTEyLjMtMTEuMS0yMC40LTI3LjItMjAuNC00NS4yYzAtMzMuNiwyNy4zLTYwLjksNjAuOS02MC45YzE1LjYsMCwyOS45LDYuMSw0MC42LDE1LjdsMC4xLTAuMWwyMDMuMSwxODIuN2wtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMkM5OTAsMzIyLjUsOTgyLDMzOC42LDk2OS42LDM0OS43eiIvPjxwYXRoIGQ9Ik0xMCw2OTUuNWMwLTE4LDcuOS0zNCwyMC40LTQ1LjJsLTAuMS0wLjFsMTcuNS0xNS43bDE4MiwwLjFoMjg4LjFsMCwwaDI2NGwwLDBoLTExLjZsMCwwaDE1OC44YzMzLjYsMCw2MC45LDI3LjMsNjAuOSw2MC45YzAsMzMuNi0yNy4zLDYwLjktNjAuOSw2MC45aC02Nkg3MjAuOWwwLDBINTk5LjFsMCwwSDIyOS43bDg1LjEsNzYuNWwtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMmMwLDMzLjYtMjcuMyw2MC45LTYwLjksNjAuOWMtMTUuNiwwLTI5LjktNi4xLTQwLjYtMTUuN2wtMC4xLDAuMUwzMC40LDc0MC44bDAuMS0wLjFDMTgsNzI5LjMsMTAsNzEzLjQsMTAsNjk1LjV6Ii8+PC9nPg0KPC9zdmc+',
                      onclick : function (){
                        that.PanelStatus.ToggleNum=1
                        that.ToggleView();
                      }
                    },
                  }
                },
                calculable : true,
                tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                legend:{

                  data:that.ChartsOptions.PatOption.picilist,

                  selectedMode:'multiple',
                  pageFormatter:'{current}/ {total}',
                  type:'scroll',
                  tooltip: {
                    show: true
                  },
                  orient:'horizontal',
                  scrollDataIndex:0,
                  pageIconColor: "#00aaef",
                  pageIconSize: [
                    11,
                    11
                  ],
                  top:'3%',
                  left:'2%'
                },
                grid: {
                  left: '2%',
                  right: '5%',
                  bottom: '5%',
                  top:'10%',
                  containLabel: true,
                  borderWidth:'1'
                },
                xAxis : [
                  {
                    type : 'category',
                    data :that.ChartsOptions.PatOption.TDOA,
                    axisTick: {
                      alignWithLabel: true
                    },

                  }
                ],
                yAxis : [
                  {
                    type : 'value',
                    max: function(value) {
                      return value.max *1.2;
                    }
                  }
                ],
                dataZoom: [
                  {
                    show: true,
                    start: 0,
                    end: 100,
                    fillerColor:"#818181",
                    backgroundColor:"#25de9b",
                  },
                ],
                visualMap: {
                  type: 'continuous',
                  dimension: 1,
                  text: ['High', 'Low'],
                  calculable: true,
                  min: 0,
                  max: 100,
                  top:'20%',
                  left: '94%',
                  inRange: {
                    colorLightness: [0.4, 0.8]
                  },
                  outOfRange: {
                    color: '#bbb'
                  },
                  controller: {
                    inRange: {
                      color: '#2f4554'
                    }
                  }
                },
                series : that.ChartsOptions.PatOption.Xseries
              };
              that.PanelStatus.ChartHeight =80
              that.PanelStatus.background= '#e4e4e4'
              console.log('柱状图',option)
            }
            that.PanelStatus.chartstatus=false


            this.myChart.setOption(option,true); //设置参数

            that.PanelStatus.chartstatus=true
            setTimeout( function(){
              that.myChart.resize()
            }, 100 );

          },
          count(){
              this.$SelfUtils.TestFunction()
            var options={
                url:this.FlupBaseURL + this.AnswerQuery,
                method:'get',
                data:{
                  _xsrf:this.$store.state.Token,
                  pagenum:1
                }
            }
            this.$SelfUtils.get(options).then(function (resp) {
              console.log(resp)
            })
          },
          GetAction(){
            var that=this
             this.myChart = this.$echarts.init(this.$refs.CountEcharts); //获取当前实例
            var tempdatas=[]
            this.SearchKey = this.$SelfUtils.formatPickerTime(this.PanelParam.SearchTime)
            tempdatas.push({
              'query': this.SearchKey
            })
            var DATAoptions={
              url:this.FlupBaseURL + this.roleWork,
              method:'get',
              data:{
                _xsrf:this.$store.state.Token,
                STIME:this.SearchKey[0],
                ETIME:this.SearchKey[1]
                // Datas:JSON.stringify(tempdatas)
              }
            }
            const loading = this.$loading({
              lock: true,
              text: '加载中....',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$SelfUtils.get(DATAoptions).then(function (resp) {
              resp= resp
              that.resp=resp
              console.log(resp)
              var tempdata=[]
              var respnum=0
              var patlists=[] //本次随访人员列表
              var xdata=[] //本次随访每个人员次数
              let picilist =[]
              let picinum=0
              that.ChartsData.PatList =[]
              that.ChartsData.RoleNum = resp.length
              for(let i in resp){
                respnum= tempdata.indexOf(resp[i].PATID)
                picinum = picilist.indexOf(resp[i].PICI)

                if(respnum == '-1'){
                   tempdata.push(resp[i].PATID)
                   patlists.push(resp[i].PATNAME)
                   that.ChartsData.PatList.push({

                     name:resp[i].PATNAME,
                     type:'bar',
                     data:[]
                   })
                }
                if(picinum == '-1'){
                  picilist.push(resp[i].PICI)
                }
              }
              var Xseries = []
              var num=0
              var  TDOA = that.$SelfUtils.getDayAll(that.SearchKey) //遍历开始及结束时间获得一串时间字符串列表
              var BarColors =[]
              let thiscolor=0
              for(let j in TDOA){
                for(let i in resp){
                  picinum = picilist.indexOf(resp[i].PICI)
                  if(Xseries[picinum] == undefined) {
                    Xseries[picinum] = {
                      DOPEOPLE:resp[i].username,
                      name: resp[i].PlanName,
                      type: 'bar',
                      data: [],
                      label: {
                        normal: {
                          show: true,
                          position: 'top'
                        }
                      },
                    }
                    thiscolor=that.$SelfUtils.getColor()
                    if(BarColors.indexOf(thiscolor) == '-1'){
                      BarColors.push(thiscolor)
                    } else {
                      while (BarColors.indexOf(thiscolor) != '-1') {
                        thiscolor = that.$SelfUtils.getColor()
                        if (BarColors.indexOf(thiscolor) == '-1') {
                          BarColors.push(thiscolor)
                        }
                      }
                    }
                  }
                  if((new Date(resp[i].CycleTime.slice(0,10)).getTime()) -(new Date(TDOA[j]).getTime()) ==0 ){  //判断日期是否相等


                    if(Xseries[picinum].data[j] == undefined){
                      Xseries[picinum].data[j]=0
                    }
                    Xseries[picinum].data[j]= Xseries[picinum].data[j] +1

                  }

                  if(Xseries[picinum].data[j] == undefined){
                    Xseries[picinum].data[j]=0
                  }
                }
              }
              // for(let i in TDOA){
              //   for(let j in resp){
              //     let tempnum = tempdata.indexOf(resp[j].PATID)
              //     if((new Date(resp[j].CycleTime.slice(0,10)).getTime()) -(new Date(TDOA[i]).getTime()) ==0){
              //       if(Xseries[i] == undefined){
              //         Xseries[i]={
              //           name:TDOA[i],
              //           type:'bar',
              //
              //           data:[],
              //           label: {
              //             normal: {
              //               show: true,
              //               position: 'top'
              //             }
              //           },
              //         }
              //         Xseries[i].data[tempnum] =1
              //       } else {
              //         if(Xseries[i].data[tempnum] == undefined){
              //           Xseries[i].data[tempnum] =1
              //         } else {
              //           Xseries[i].data[tempnum]=Xseries[i].data[tempnum]+1
              //         }
              //       }
              //     } else {
              //       if(Xseries[i] == undefined){
              //         Xseries[i]={
              //           name:TDOA[i],
              //           type:'bar',
              //           data:[],
              //           label: {
              //             normal: {
              //               show: true,
              //               position: 'top'
              //             }
              //           },
              //         }
              //       }
              //       if(Xseries[i].data[tempnum] == undefined){
              //         Xseries[i].data[tempnum]=0
              //       }
              //
              //     }
              //
              //   }
              //   let thiscolor=that.$SelfUtils.getColor()
              //   if(BarColors.indexOf(thiscolor) == '-1'){
              //     BarColors.push(thiscolor)
              //   } else {
              //     while (BarColors.indexOf(thiscolor) != '-1'){
              //       thiscolor = that.$SelfUtils.getColor()
              //       if(BarColors.indexOf(thiscolor) == '-1'){
              //         BarColors.push(thiscolor)
              //       }
              //     }
              //   }//生成不同颜色的代码
              // } // 以人员为X轴的方法
              var option = {
                title: [{
                  text: '随访工作量统计图',
                  x: '10%',
                  y:'0%',
                  top:'0%',
                  textAlign: 'center'
                }],
                color: BarColors,
                toolbox: {
                  orient:'vertical',
                  top:50,
                  show : true,
                  feature : {
                    mark : {show: true},
                    dataView : {
                      show: true,
                      readOnly: true,
                      optionToContent: function (opt) {
                        let axisData = opt.xAxis[0].data; //坐标数据
                        let DOPEOPLE = opt.series[0].DOPEOPLE
                        let series = opt.series; //折线图数据
                        let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                        let tdBodys = ''; //数据
                        series.forEach(function (item) {
                          //组装表头
                          tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
                        });
                        let table = `<div>执行人:${DOPEOPLE}</div><table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center;width: 98%;color: #B03A5B"><tbody><tr>${tdHeads} </tr>`;
                        for (let i = 0, l = axisData.length; i < l; i++) {
                          for (let j = 0; j < series.length; j++) {
                            //组装表数据
                            tdBodys += `<td>${ series[j].data[i]}</td>`;
                          }
                          table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
                          tdBodys = '';
                        }
                        table += '</tbody></table>';
                        return table;
                      }
                    },
                    magicType: {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true},
                    mySumView : {
                      show : true,
                      title : '切换到统计视图',
                      icon : 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cuc2ZvbnQuY24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5zZm9udC5jbiA8L21ldGFkYXRhPg0KPGc+PHBhdGggZD0iTTk2OS42LDM0OS43bDAuMSwwLjFsLTE3LjQsMTUuNkg3NzAuM0g0MDFsMCwwSDI3OS4ybDAsMEgxMzdoLTY2Yy0zMy42LDAtNjAuOS0yNy4zLTYwLjktNjAuOWMwLTMzLjYsMjcuMy02MC45LDYwLjktNjAuOWgxNTguOGwwLDBoLTExLjZsMCwwaDI2My45bDAsMGgyODguMWwtODUuMS03Ni41bDAuMS0wLjFjLTEyLjMtMTEuMS0yMC40LTI3LjItMjAuNC00NS4yYzAtMzMuNiwyNy4zLTYwLjksNjAuOS02MC45YzE1LjYsMCwyOS45LDYuMSw0MC42LDE1LjdsMC4xLTAuMWwyMDMuMSwxODIuN2wtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMkM5OTAsMzIyLjUsOTgyLDMzOC42LDk2OS42LDM0OS43eiIvPjxwYXRoIGQ9Ik0xMCw2OTUuNWMwLTE4LDcuOS0zNCwyMC40LTQ1LjJsLTAuMS0wLjFsMTcuNS0xNS43bDE4MiwwLjFoMjg4LjFsMCwwaDI2NGwwLDBoLTExLjZsMCwwaDE1OC44YzMzLjYsMCw2MC45LDI3LjMsNjAuOSw2MC45YzAsMzMuNi0yNy4zLDYwLjktNjAuOSw2MC45aC02Nkg3MjAuOWwwLDBINTk5LjFsMCwwSDIyOS43bDg1LjEsNzYuNWwtMC4xLDAuMWMxMi4zLDExLjEsMjAuNCwyNy4yLDIwLjQsNDUuMmMwLDMzLjYtMjcuMyw2MC45LTYwLjksNjAuOWMtMTUuNiwwLTI5LjktNi4xLTQwLjYtMTUuN2wtMC4xLDAuMUwzMC40LDc0MC44bDAuMS0wLjFDMTgsNzI5LjMsMTAsNzEzLjQsMTAsNjk1LjV6Ii8+PC9nPg0KPC9zdmc+',
                      onclick : function (){
                        that.PanelStatus.ToggleNum=1
                        that.ToggleView();
                      }
                    },
                  }
                },
                calculable : true,
                tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                legend:{

                  data:picilist,

                  selectedMode:'multiple',
                  pageFormatter:'{current}/ {total}',
                  type:'scroll',
                  tooltip: {
                    show: true
                  },
                  orient:'horizontal',
                  scrollDataIndex:0,
                  pageIconColor: "#00aaef",
                  pageIconSize: [
                    11,
                    11
                  ],
                  top:'3%',
                  left:'2%'
                }, //对应相应X内分类
                grid: {
                  left: '2%',
                  right: '5%',
                  bottom: '5%',
                  top:'10%',
                  containLabel: true,
                  borderWidth:'1'
                },
                xAxis : [
                  {
                    type : 'category',
                    data :TDOA,
                    axisTick: {
                      alignWithLabel: true
                    },

                  }
                ], //X轴数据
                yAxis : [
                  {
                    type : 'value',
                    max: function(value) {
                      return value.max *1.2;
                    }
                  }
                ],
                dataZoom: [
                  {
                    show: true,
                    start: 0,
                    end: 100,
                    fillerColor:"#818181",
                    backgroundColor:"#25de9b",
                  },
                ],
                visualMap: {
                  type: 'continuous',
                  dimension: 1,
                  text: ['High', 'Low'],
                  calculable: true,
                  min: 0,
                  max: 100,
                  top:'20%',
                  left: '94%',
                  inRange: {
                    colorLightness: [0.4, 0.8]
                  },
                  outOfRange: {
                    color: '#bbb'
                  },
                  controller: {
                    inRange: {
                      color: '#2f4554'
                    }
                  }
                },
                series : Xseries
            };
             //echarts参数
              that.PanelStatus.ChartHeight=80
              console.log('option选项',option)
              that.ChartsOptions.PatOption.BarColors = BarColors
              that.ChartsOptions.PatOption.TDOA = TDOA
              that.ChartsOptions.PatOption.patlists=patlists
              that.ChartsOptions.PatOption.Xseries=Xseries
              that.ChartsOptions.PatOption.picilist=picilist
              that.myChart.setOption(option,true); //设置参数
              setTimeout( function(){
                that.myChart.resize()
              }, 1000 );
              loading.close();
            })
          }
        },
        computed:{
          ChartHeight(){
            console.log(this.PanelStatus.ChartHeight,'当前高度')
            return this.PanelStatus.ChartHeight
          },
          ...mapState({
          FlupBaseURL:state => state.urlobjects.FlupBaseUrl,
          AnswerQuery:state => state.urlobjects.AnswerQuery,
          roleWork:state => state.urlobjects.roleWork
        })},
        watch:{
          ChartHeight(){
            if (this.myChart.id != undefined){
              this.myChart.resize()
            }
          }
        }
    }
</script>

<style scoped>

</style>
