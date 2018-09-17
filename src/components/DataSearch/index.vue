<template>
  <div style="margin: 5px;background: #f6f9fa">
    <el-row :gutter="6" style="margin-top: 5px">
      <el-row style="text-align: left;margin-top: 5px;">
        <el-col :span="2" style="padding-left: 2%;" >
          <el-row :gutter="30"  >
            <el-col :span="24" >
              <el-button size="small" icon="el-icon-plus" type="primary" @click="addtemPlate()"  plain  >新增</el-button>
            </el-col>
          </el-row>
        </el-col>
          <slot name="otherbutton1"></slot>
          <slot name="otherbutton2"></slot>
        <el-col :span="16">
          <el-row style="padding-left: 2%;">

            <el-col :span="24">
              <el-input :placeholder="moduleinfo.Searchtips" size="small" v-model="SearchKeyData" class="input-with-select" >

                <el-button slot="append" size="small" icon="el-icon-search" @click="SearchData"></el-button>
              </el-input>
            </el-col>

          </el-row>
        </el-col>
        <el-col :span="2" style="text-align: right;">
          <el-button
            style="margin-right: 5px"
            icon="el-icon-refresh"
            size="small"
            type="success"
            @click="initTemplateData">
            刷新
          </el-button>
        </el-col>
      </el-row>

      <el-row :span="24"   style="text-align: left;padding-left: 2%;margin-top: 5px"  >
        <el-col :span="24"
                style="margin-top: 5px"
                v-for="(PanelData,PanelIndex) in SearchPanelData"
                :key="PanelData.SearchName"
                :value="PanelIndex"

        >
          <el-col :span="24" v-if="PanelData.SelectTypes.length != 0" >
          <el-col :span="24" v-if="PanelData.typeMethod == 'button'">
            <div >
              <el-button type="primary" size="small" > {{PanelData.SearchName}} </el-button>
              &nbsp;&nbsp;
              <el-button v-for="(item,index) in PanelData.SelectTypes"
                         :key="item.key"
                         :index="index"
                         :label="item.label"
                         :value="item.key"
                         @click="Goto(item.key,index,PanelIndex)"
                         :type="item.type"
                         size="mini"

              >{{item.label}}</el-button>
            </div>
          </el-col>
          <el-col :span="24" v-if="PanelData.typeMethod == 'range'">
            <div >
              <el-col :span="2">
                <el-button type="primary" size="small" > {{PanelData.SearchName}} </el-button>
              </el-col>
              <el-col :span="16">
                <el-slider
                  range
                  show-stops
                  v-model="PanelData.SelectTypes[0].values"
                  :max="PanelData.SelectTypes[0].max"

                ></el-slider>
              </el-col>
            </div>
          </el-col>
        </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: left;padding-left: 2%;margin-top: 5px">
          <div >
          <el-col :span="10" >
            <el-button size="small" type="primary" >查询时间</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <j-date-picker
              v-model="DateTimePickerData.value1"
              :width="DateTimePickerData.width"
              :placeholder="DateTimePickerData.placeholder"
              :picker-options="DateTimePickerData.pickerOptions"
              :rangeSeparator="DateTimePickerData.rangeSeparator"
              :disabled="DateTimePickerData.disabled"
              :showLunarClass="DateTimePickerData.showLunarClass"
              :showLunarControl="DateTimePickerData.showLunarControl"
              :type="DateTimePickerData.type"
              :showBackYears="DateTimePickerData.showBackYears"
              :showLunarIcon="DateTimePickerData.showLunarIcon"
              :format="DateTimePickerData.format"

            ></j-date-picker>
          </el-col>
          <el-col :span="10" v-for="(item,index) in moduleinfo.extraData" :index="index" :key="item.SearchName">
            <el-row :gutter="20">
              <el-col :span="6" >
                <el-button size="small" type="primary" >{{item.SearchName }}</el-button>
              </el-col>
              <el-col :span="10">
                <j-date-picker
                  v-model="item.values"
                  :width="DateTimePickerData.width"
                  :placeholder="DateTimePickerData.placeholder"
                  :picker-options="DateTimePickerData.pickerOptions"
                  :rangeSeparator="DateTimePickerData.rangeSeparator"
                  :disabled="DateTimePickerData.disabled"
                  :showLunarClass="DateTimePickerData.showLunarClass"
                  :showLunarControl="DateTimePickerData.showLunarControl"
                  :type="DateTimePickerData.type"
                  :showBackYears="DateTimePickerData.showBackYears"
                  :showLunarIcon="DateTimePickerData.showLunarIcon"
                  :format="DateTimePickerData.format"

                ></j-date-picker>
              </el-col>
            </el-row>
          </el-col>
          </div>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>


// 共有3个插槽  新增附近一个   时间选择器附近2个

<script>
  import JDatePicker from "vue-jlunar-datepicker";

    export default {
      components: {
        JDatePicker,
      },
      name: "DataSearch",
      data(){
        return{

          SearchKeyData: '',  //搜索选择内容
          SelectType2:'',//搜索选择方法
          DateTimePickerData:{
            value1:[],
            type:'DATERANGE',
            showLunarClass:'MIX',
            showBackYears:2,
            showLunarIcon:true,
            showLunarControl:false,
            width:'300',
            format:'YYYY-MM-DD HH:MM:SS',
            placeholder:'请输入查询时间',
            rangeSeparator:'-',
            disabled:false,
            editable:true,
            clearable:true,

          },
          SearchPanelData:[
          ],
        }
      },
      props:[
        'moduleinfo',
        'pagingData'
      ],

      methods:{
        addtemPlate(){
            this.$emit('add')
        },
        initTemplateData(){
            this.$emit('refresh')
        },
        Goto(val,index,PanelIndex){
          for(let j in this.SearchPanelData){
            if(j == PanelIndex){
              for(let i in this.SearchPanelData[j].SelectTypes){
                if(i == index){

                  if(this.SearchPanelData[j].SelectTypes[i].type == "primary"){
                    this.SearchPanelData[j].SelectTypes[i].type =''
                  }else{
                    this.SearchPanelData[j].SelectTypes[i].type ='primary'
                  }

                }else{
                  this.SearchPanelData[j].SelectTypes[i].type=""
                }
              }
            }
          }
          this.SearchData()
        }, //按钮表面颜色
        SearchData(){
          var that = this;
           let TempArray =[]
           for(let i in this.SearchPanelData){
            for(let j in this.SearchPanelData[i].SelectTypes){
              if(this.SearchPanelData[i].SelectTypes[j].type != undefined) { //判断是否为按钮类型
                if (this.SearchPanelData[i].SelectTypes[j].type != '') {
                  TempArray.push({
                    key: this.SearchPanelData[i].Searchprop,
                    value: this.SearchPanelData[i].SelectTypes[j].key
                  })
                }
              } else{
                TempArray.push({
                  key:this.SearchPanelData[i].Searchprop+'min',
                  value: this.SearchPanelData[i].SelectTypes[0].values[0]
                },{
                  key:this.SearchPanelData[i].Searchprop+'max',
                  value: this.SearchPanelData[i].SelectTypes[0].values[1]
                })
              }


            }
           }
          let data={
            SearchKey:this.SearchKeyData,
            SearchTime:this.DateTimePickerData.value1,
            SearchOthers:TempArray
          }

          let getdata = {
            SEARCHKEY: data.SearchKey,
            STIME: data.SearchTime[0],
            ETIME: data.SearchTime[1],
            pagesize: this.pagingData.pagesize,
            pagenum: this.pagingData.pagenum
          }
          for (let i in data.SearchOthers) {
            getdata[data.SearchOthers[i].key] = data.SearchOthers[i].value
          }

          console.log('规则查询数据', getdata)
          if(this.moduleinfo.initStatus == false){
             for(let i in this.moduleinfo.extraData){
               getdata[this.moduleinfo.extraData[i].Searchprop+'min'] = this.moduleinfo.extraData[i].values[0]
               getdata[this.moduleinfo.extraData[i].Searchprop+'max'] = this.moduleinfo.extraData[i].values[1]
             }
          }
          if (1 == 1) {
            var DATAoptions = {
              url: this.moduleinfo.moduleurl+"/conQuery",
              method: 'get',
              data: getdata
            }
            this.$SelfUtils.get(DATAoptions).then(function (e) {
              if (e != '[{"status":"400"}]') {
                that.$store.state.Flup[that.moduleinfo.modulename] =e
                console.log(e, '查询结果',that.moduleinfo.modulename )
                that.$emit('Search',data)
              }
            })
          }
        },
        GETDATATYPE(extradata){
          if(extradata == undefined){
            if(this.moduleinfo.initStatus){
              var that=this
              var DATAoptions = {
                url:this.moduleinfo.moduleurl+"/queryType",
                method: 'get',
              }
              this.$SelfUtils.get(DATAoptions).then(function (e) {
                if (e != '[{"status":"400"}]') {
                  let tempdata=[]
                  for(let i=0; i< that.SearchPanelData.length;i++){
                    tempdata[i]=[]
                    that.SearchPanelData[i].SelectTypes=[]
                  } //初始化个数组
                  let ekey =''
                  for(let i in e){
                    for (let j in e[i]){
                      for(let k in that.SearchPanelData){
                        if(tempdata[k].indexOf(e[i][j]) == '-1'){  //判断是否数组中是否已有该选项 如果无则新增
                          if(that.SearchPanelData[k].Searchprop == j){  //当searchprop 和 单个属性相同时则添加选项
                            that.SearchPanelData[k].SelectTypes.push({
                              key: e[i][j],
                              label: e[i][j],
                              type: ''
                            })
                          }
                          tempdata[k].push(e[i][j]) //添加完成后则回写进暂存数组

                        }
                      }
                    }
                  }
                  console.log(that.SearchPanelData,'类别111')
                }
              })
            }
          } else{
            var that=this
            var DATAoptions = {
              url:extradata.moduleurl+"/queryType",
              method: 'get',
            }
            this.$SelfUtils.get(DATAoptions).then(function (e) {
              if (e != '[{"status":"400"}]') {
                let tempdata=[]
                for(let i=0; i< extradata.typesinfo.length;i++){
                  tempdata[i]=[]
                  extradata.typesinfo[i].SelectTypes=[]
                } //初始化个数组
                let ekey =''

                for(let i in e){
                  for (let j in e[i]){
                    for(let k in extradata.typesinfo){

                      if(tempdata[k].indexOf(e[i][j]) == '-1'){  //判断是否数组中是否已有该选项 如果无则新增
                        if(extradata.typesinfo[k].Searchprop == j){  //当searchprop 和 单个属性相同时则添加选项
                          extradata.typesinfo[k].SelectTypes.push({
                            key: e[i][j],
                            label: e[i][j],
                            type: ''
                          })
                        }
                        tempdata[k].push(e[i][j]) //添加完成后则回写进暂存数组

                      }
                    }
                  }
                }

              }
            })
            return extradata
          }


        },
      },
      mounted(){
        this.SearchPanelData = this.moduleinfo.typesinfo
        //console.log(this.SearchPanelData,'初始化数据')
      }
    }
</script>

<style scoped>

</style>
