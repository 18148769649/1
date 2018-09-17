<template>
  <div style="text-align: center">


      <div style="width: 30%;text-align: center;margin-left: 35%" v-show="InputStatus">
        <p>亲爱的患者朋友,请输入您的检查号和验证码后进行填写</p>

        <el-input v-model="CheckNUM" clearable><template slot="prepend">请输入检查号：</template></el-input>

        <el-input v-model="Vcode" clearable><template slot="prepend">请输入用户ID：</template></el-input>
        <el-button @click="GoToEntity"> 确认无误后请按</el-button>
      </div>
  <div v-show="questionStatus">
    <div style="flex: 0 0 77%;margin-left: 2%;background: #375c8e;color: #e6b671">
      <h2>{{this.$store.state.Flup.panelobject.mubanTitle}}</h2>
      <div v-for="item in stepData3">
        第{{item.id}}题:{{item.label}}

        <div>
        <el-checkbox-group
          v-model="checkedCities1[item.id]"
          @change="GetUserCheck"
        >
          <el-checkbox
            v-for="city in item.children" :label="city.label" :key="city.id" :value="city.ordrowid">

            <span
            v-show="city.label != '______________________'" style="color: #e6b671"
            border
          >{{city.label}}</span>
            <el-input v-model="beizhuitem[item.id]" szie="mini"
                      v-show="city.label == '______________________' "></el-input>
          </el-checkbox>
        </el-checkbox-group>
        </div>
      </div>
      <el-button @click="PostData">提交</el-button>
    </div>
  </div>

    <div v-show="lastshow" style="margin-top: 25%">
      <h1>{{checkinfo}}</h1>
      <h1>
        亲爱的患者朋友 谢谢您的配合 祝您生活愉快 平安健康
      </h1>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

    export default {

      name: "USERQuestionnaire",
      created() {

          if (this.$route.params.CheckNUM != undefined){
            this.CheckNUM=this.$route.params.CheckNUM
          }
          if (this.$route.params.Vcode != undefined){
            this.Vcode = this.$route.params.Vcode
          }
            this.TimeLine=this.$route.params.TimeLine

      },
      updated(){
        if (this.$route.params.CheckNUM != undefined){
          this.CheckNUM=this.$route.params.CheckNUM
        }
        if (this.$route.params.Vcode != undefined){
          this.Vcode = this.$route.params.Vcode
        }
        this.TimeLine=this.$route.params.TimeLine
      },
      computed:{

      },
      methods:{
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
         },
        GoToEntity(){
           var that=this
          var nowData=new Date()

          console.log('输入数据',this.CheckNUM,this.Vcode,this.formatDateTime(nowData))
          this.InputStatus=false

          if (1==1) {
            $.ajax({
              type: 'get',
              url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MainQuery,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                PICI: this.CheckNUM,
                VCode: this.Vcode,
                timeline:this.formatDateTime(nowData)
                // usename: _this.$store.state.server.dictinfo.username
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                console.log('userpush', e)
                var muban = e

                if (muban.length != 0) {
                  that.$store.state.Flup.panelobject.mubanTitle = muban[0].ename
                  that.$store.state.Flup.panelobject.mubanID = muban[0].ordrowid
                  that.form.PICI= muban[0].PICI
                  that.form.PATID = muban[0].PATID
                  that.form.DeatilOrdrowid= muban[0].ORDROWID
                  that.form.MAINID= muban[0].MAINID
                  that.form.MAINNAME= muban[0].MAINNAME
                  that.form.USETYPE = muban[0].USETYPE
                  var QNameList = []
                  var QList = []
                  var Qindex = 1
                  that.checkedList1=[]
                  that.beizhuitem=[]
                  for (var i in muban) {
                    if (muban[i].DOSTATUS == 'true'){
                      that.mubanstatus =false
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

                        })
                      }
                    }
                  }
                  for (var m = 0 ; m< templetList.length+1;m++){
                    that.checkedCities1.push([
                      ],
                    )
                    that.beizhuitem[m]=''
                   }

                  console.log('USERFLUP', templetList)
                  that.stepData3 = templetList
                  that.InputStatus = false
                if (that.mubanstatus){
                  that.questionStatus=true
                } else {
                  that.lastshow = true
                  that.checkinfo = '您已经填过此问卷 谢谢'
                }


              }
            } //模板数据
          })
          }
        },
         GetUserCheck(a){

          //console.log('SF',this.checkedCities1,a)
         },
         PostData(){
          var that=this
           var postdata=[]
           for (var i =1;i< this.checkedCities1.length;i++){
            for(var m=0 ;m<this.checkedCities1[i].length;m++)
            for (var j=0;j <this.stepData3[i-1].children.length;j++){
                if (this.stepData3[i-1].children[j].label == this.checkedCities1[i][m]  ){
                if(this.checkedCities1[i][m] != '______________________'){
                  var tempValue=this.stepData3[i-1].children[j].label

                } else {

                  var  tempValue=this.beizhuitem[i]

                }

                    postdata.push({
                      questionid:this.stepData3[i-1].orderid,
                      questionname:this.stepData3[i-1].label,
                      itemid: this.stepData3[i-1].children[j].id,
                      itemname:tempValue,
                      PICI:this.form.PICI,
                      PATID:this.form.PATID,
                      DETAILID:this.form.DeatilOrdrowid,
                      MAINID:this.form.MAINID,
                      MAINNAME:this.form.MAINNAME,
                      USETYPE:this.form.USETYPE
                    })

                  break
                }

            }

           }

           //console.log('最终提交数据',JSON.stringify(postdata),this.beizhuitem)
           //debugger
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
               ITEMS:JSON.stringify(postdata),
               ORDROWID:this.CheckNUM
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
                that.lastshow = true
                 that.questionStatus = false
               }
             }
           })
        }
       },
       data(){
          return {
              CheckNUM:'',
              Vcode:'',
              TimeLine:'',
              InputStatus:true,
              questionStatus:false,
              lastshow:false,
              mubanstatus : true,
              checkinfo:'',
              beizhuitem:[

                ],
              checkedCities1:[],
              stepData3:[
                {
                  id:'',
                  children:[
                    {
                      label:'',
                      ordrowid:'',

                    }
                  ]
                }
              ],
            form :{
              DeatilOrdrowid:'',
              PICIID:'',
              PATID:'',
              MAINID:'',
              MAINNAME:'',
              USETYPE:''
            }


          }
       },
    }
</script>

<style scoped>

</style>
