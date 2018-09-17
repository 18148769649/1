<template>
  <div>
    <div style="height: 80vh">
      <DataSearch
        @refresh="initTemplateData"
        @add="addtemPlate"
        :moduleinfo="moduleinfo"
        :pagingData="pagingData"
        ref="searchmodule"
      ></DataSearch>
      <el-table
        ref="multipleTable"
        :data="tableData7"
        height="62vh"
        border
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          style="width:10%;">
        </el-table-column>
        <el-table-column
          label="模板类型"
          align="center"
          prop="ETYPE"
          width="160"
        >
        </el-table-column>
        <el-table-column
          label="模板名称"
          prop="ENAME"
          align="center"
          width="400"
        >
        </el-table-column>
        <el-table-column

          label="模板描述"
          align="center"
          prop="EDES">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="330"
          >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="small">修改模板信息</el-button>
            <el-button  @click="temPlateEdit(scope.row)" type="primary" size="small">编辑模板内容</el-button>
            <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--模板*修改新增模态框-->
    </div>
    <!--模板*修改新增模态框-->
    <pagepagination
      :pageDataSizes=pagingData.pagesizes
      :pageDataSize=pagingData.pagesize
      :PageDatanum=pagingData.pagingTotal
      :pageShowStatus=pagingData.pagingShow
      @change="PageAction"
      @currentDataPage="PageAction"
      @ChangeSize="PageChangeSize"
    ></pagepagination>
    <el-dialog title="模板编辑列表" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="mubanform" ref="mubanform">
        <el-row :gutter="10">

          <el-col :span="24">
            <el-form-item label="模板名称">
              <el-input v-model="mubanform.ENAME" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板类型">
              <el-input v-model="mubanform.ETYPE" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板描述">
              <el-input type="textarea" v-model="mubanform.EDES" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="pass">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateuseinfo('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

  import $ from 'jquery'
  import Pagepagination from "@/components/pagepagination/index";
  import DataSearch from '@/components/DataSearch/index'

  export default {

    components: {
      DataSearch,
      Pagepagination},
    name: "Template",
    computed: {
      tableData7() {
        return this.$store.state.Flup.mubanTemplate
      }
    },
    data() {
      return {
        multipleSelection: [],
        stringmessage: '',//控制弹出消息内容
        stringmethod: 'success',//控制消息类型 success warning
        UpdateORInsertStatus: false,//控制更新模块为更新还是新增  默认更新
        dialogTableVisible: false,//编辑模态框状态
        dialogFormVisible: false,//模态框
        sendurl: '',
        mubanform: {
          ORDROWID: '', //唯一标识
          ECODE: '', //模板 Code
          ENAME: '', // 模板名称
          ETYPE: '', // 模板类型
          EDES: '',//模板描述
          ECREATER: '', //创建人
          CREATETIME: '', //创建时间
          MADULEID: '',
        },
        pagingData: {
          pagingTotal: 1, //总条数
          pagingShow: true, //展示与否
          pagesize: 20, //初始页面大小
          pagesizes: [3, 20, 50, 100, 150],  //分页 每页大小
          currentpage: 1 ,//去往第几页
          pagenum:1
        },
        moduleinfo:{
          modulename:'mubanTemplate',
          moduleurl:'/sfmanage/template',
          Searchtips:'试试 模板描述？模板名。。。',
          initStatus:true,// 表示是否需要初始化数据
          typesinfo:[
            {
              SearchName:'模板类型',
              Searchprop:'etype',
              typeMethod:'button',
              SelectTypes: [

              ],
            },
            {
              SearchName:'模板1',
              Searchprop:'edes',
              typeMethod:'button',
              SelectTypes: [

              ],
            }
          ]
        }
      }
    },
    methods: {

      removeselection() {
        this.$refs.multipleTable.clearSelection();
      },
      //实时获取选中列
      handleSelectionChange(val) {

        if (val.length != 0) {
          console.log('table', val)
          this.mubanform = val[0]
          this.multipleSelection = val;
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
      //编辑方法
      handleEdit(row) {

        this.UpdateORInsertStatus = false
        this.dialogFormVisible = true
        this.mubanform = row
      },
      //更新方法
      updateuseinfo(formName) {
        var _this = this
        let ajaxtype = 'post'
        if (this.UpdateORInsertStatus === false) {
          this.sendurl = this.$store.state.urlobjects.TemplateUpdate
          this.iscurrent = true
          ajaxtype = 'put'
        } else {
          this.sendurl = this.$store.state.urlobjects.TemplateAdd
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
            ECODE: this.mubanform.ECODE, //
            ENAME: this.mubanform.ENAME,
            ETYPE: this.mubanform.ETYPE, //
            EDES: this.mubanform.EDES, //
            ECREATER: this.$store.state.user.ordrowid,
            MADULEID: this.mubanform.MADULEID,
            _xsrf: this.$store.state.Token,
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {
            if (e != '[{"status":"400"}]') {
              if (_this.UpdateORInsertStatus == true) {
                _this.stringmessage = '新增成功'
                _this.stringmethod = 'success'
                _this.messagebox()
              } else {
                _this.stringmessage = '修改成功'
                _this.stringmethod = 'success'
                _this.messagebox()
              }
              _this.initTemplateData()
              _this.UpdateORInsertStatus = false
              // console.log(this.form)
            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
      },
      //添加方法
      addtemPlate() {
          this.mubanform.ECODE = '',//模板 ID
            this.mubanform.ENAME = '', //模板名称
            this.mubanform.ETYPE = '', //模板类型
            this.mubanform.EDES = '', //模板描述
            this.mubanform.ECREATER = '',//创建人
            this.mubanform.CREATETIME = '', //创建时间
            this.mubanform.MADULEID = '',
            this.UpdateORInsertStatus = true,
            this.dialogFormVisible = true
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
          url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.TemplateDel + '/' + row.ORDROWID,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: _this.$store.state.Token,
            ordrowid: row.ORDROWID,
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
            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
      },
      //模板编辑
      temPlateEdit(row) {
        var that = this
        //debugger
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

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
                console.log('answer', e)
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
          })//获得当前答案列表
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
                console.log('question', e)
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
                loading.close()
              } else {
                that.$router.push({path: '/'})
              }
            }
          })//获得当前问题列表
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
              ORDROWID: row.ORDROWID
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

                  console.log('当前模板数据', templetList)

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
                that.$store.state.Flup.EntityDetail = templetList
                that.$router.push({path: '/sfmanage/flupedit'})
              } else {
                that.$router.push({path: '/'})
              }
            }
          }) //模板数据
          that.$store.state.Flup.panelobject.mubanID = row.ORDROWID
          that.$store.state.Flup.panelobject.mubanTitle = row.ENAME


          loading.close()


      },

      PageAction(val) {
        this.pagingData.pagenum =val
        var that = this
        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.TemplateQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: val,
            pagesize: this.pagingData.pagesize
          }
        }

        this.$SelfUtils.get(DATAoptions).then(function (e) {

          if (e != '[{"status":"400"}]') {

            that.$store.state.Flup.mubanTemplate = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[1]
            that.$store.state.Flup.mubanTemplate = data.slice(1,)

            that.$message('更新数据成功')
            console.log('模板库数据', that.$store.state.Flup.mubanTemplate)
            that.pagingData.pagingTotal = parseInt(data[0].ENAME)
          } else {
            that.$router.push({path: '/'})
          }
        })

      },
      PageChangeSize(val) {
        this.pagingData.pagesize = val
        console.log(val, '改变大小')
      },
      //更新模板列表数据
      initTemplateData(){
        var that = this
        that.$store.state.Flup.panelobject.flupeditstatus = true
        this.$refs.searchmodule.GETDATATYPE()
        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.TemplateQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: 1,
            pagesize: 20
          }
        }

        this.$SelfUtils.get(DATAoptions).then(function (e) {

          if (e != '[{"status":"400"}]') {
            that.$store.state.Flup.mubanTemplate = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[1]
            that.$store.state.Flup.mubanTemplate = data.slice(1,)
            that.$message({
                  showClose: true,
                   message: '更新数据成功',
                   type: 'success'
                 });
            console.log('模板库数据', that.$store.state.Flup.mubanTemplate)
            that.pagingData.pagingTotal = parseInt(data[0].ENAME)
          } else {
            that.$router.push({path: '/'})
          }
        })
      },
    },
    mounted() {
      this.initTemplateData()

    }

  }


</script>

<style scoped>

</style>
