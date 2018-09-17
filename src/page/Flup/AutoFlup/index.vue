<template>
    <div>
      <div style="margin: 5px;padding-left: 40px">

        <el-button type="primary" size="small"  @click="AddAutoInfo">新建自动随访计划</el-button>
        <el-button type="success" size="small" @click="EditAutoInfo">修改自动随访计划</el-button>
        <el-button type="danger" size="small" @click="DeleteAutoInfo" >删除自动随访计划</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="800"

        highlight-current-row
        @current-change="JHChange"
      >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="ename"
          label="自动随访计划使用表"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="计划创建时间">
        </el-table-column>
        <el-table-column
          prop="ROLETYPE"
          :formatter="FormatType"
          label="计划执行类型">
        </el-table-column>
        <el-table-column
          prop="SFTIME"
          label="计划执行周期（天）">
        </el-table-column>
        <!--<el-table-column label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--@click="handleLook(scope.$index, scope.row)">查看</el-button>-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--@click="OpenhandleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="danger"-->
              <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
</template>

<script>
  import $ from 'jquery'
  export default {
        name: "AutoFlup",
    data() {
      return {
        SFJH:'',
        tableData: [{

        },],
      }
      },
        mounted(){
          var that=this
          $.ajax({
            type: 'get',
            url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.AutoRoleQuery,
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
                console.log('计划数据1803', data)
                that.tableData = data
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
        },
        computed:{

        },
        methods:{
          JHChange(val) {
            this.SFJH = val;
            console.log('自动随访计划',val)
          },
          FormatType(row,column,d){
            if (d == 'manual'){
              return '手动任务'
            } else  if (d == 'auto'){
              return '自动任务'
            }

          },
          AddAutoInfo(){
            debugger
            var that=this
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
                  Ecreater: this.$store.state.user.name
                  // usename: _this.$store.state.server.dictinfo.username
                },
                headers: {
                  //     // 跨域请求 这个配置不能少
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                  'Accept': 'application/json'
                },
                success: function (e) {
                  if (e != '[{"status":"400"}]') {


                    var data =  e
                    that.$store.state.Flup.EntityList = []
                    var tempdata = []
                    var entitydata = data
                    for (var i in entitydata) {
                      if (entitydata[i].ECREATER != null) {
                        tempdata.push({
                          ETYPE: entitydata[i].ETYPE,//随访类型
                          ENAME: entitydata[i].ENAME,//随访名称
                          ECODE: entitydata[i].ECODE,//随访代码
                          EDES: entitydata[i].EDES,//随访描述
                          ORDROWID: entitydata[i].ORDROWID,//随访计划ordrowid
                          ECREATER: entitydata[i].ECREATER,//随访计划创建人ID
                          CREATETIME: entitydata[i].CREATETIME,//随访计划最后更新时间
                        })
                      }
                    }
                    console.log(tempdata)
                    that.$store.state.Flup.EntityList = tempdata
                    that.$store.state.Flup.panelobject.AutoStatus = true
                    console.log('新建随访计划', that.$store.state.Flup.EntityList)
                    that.$router.push({path: '/server/cFlup'})
                  }
                }
              })
          },
          EditAutoInfo(){
            if (this.SFJH != '') {
              var that=this
              that.$store.state.Flup.panelobject.newOrUpdate =true
              that.$store.state.Flup.MainForRole =this.SFJH
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


                    var data =  e
                    that.$store.state.Flup.EntityList = []
                    var tempdata = []
                    var entitydata = data
                    for (var i in entitydata) {
                      if (entitydata[i].ECREATER != null) {
                        tempdata.push({
                          ETYPE: entitydata[i].ETYPE,//随访类型
                          ENAME: entitydata[i].ENAME,//随访名称
                          ECODE: entitydata[i].ECODE,//随访代码
                          EDES: entitydata[i].EDES,//随访描述
                          ORDROWID: entitydata[i].ORDROWID,//随访计划ordrowid
                          ECREATER: entitydata[i].ECREATER,//随访计划创建人ID
                          CREATETIME: entitydata[i].CREATETIME,//随访计划最后更新时间
                        })
                      }
                    }
                    console.log(tempdata)
                    that.$store.state.Flup.EntityList = tempdata

                    that.$store.state.Flup.panelobject.AutoStatus = true
                    console.log('新建随访计划', that.$store.state.Flup.EntityList)

                    that.$router.push({path: '/server/cFlup'})
                  }
                }
              })
            } else {
              this.$message.error('错了哦，请选择一个计划');
            }
            }
          },
          DeleteAutoInfo(){
            var that=this
            if (this.SFJH != '') {
              $.ajax({
                type: 'DELETE',
                url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.ROLEDel+'/'+this.SFJH.ordrowid,
                async: true,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  _xsrf: this.$store.state.Token,
                  ORDROWID: this.SFJH.ordrowid
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
              this.$message.error('错了哦，请选择一个计划');
            }
          }

    }
</script>

<style scoped>

</style>
