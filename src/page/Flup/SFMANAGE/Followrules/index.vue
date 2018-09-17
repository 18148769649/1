<template>
  <div>
    <div style="height: 80vh">
      <DataSearch
        :moduleinfo="moduleinfo"
        :pagingData="pagingData"
        @refresh="initTemplateData"
        @add="addRule"
        @Search="ToggleStatus"
        ref="searchmodule"
      ></DataSearch>
      <el-table
        ref="multipleTableRule"
        :data="this.$store.state.Flup.Followrules"
        v-if="tablestatus"
        border
        height="62vh"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          style="width:10%;">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="规则ID">
                    <span>{{ props.row.RoleItemID }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="问题ID">
                    <span>{{ props.row.EntityID }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="规则类型">
                    <span>{{ props.row.RoleType }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="规则描述">
                    <span>{{ props.row.Roledes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="规则执行时间">
                    <span>{{ props.row.RoleValues }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="创建人">
                    <span>{{ props.row.CREATER }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="创建时间">
                    <span>{{ props.row.CTIME }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="规则描述"
          prop="Roledes"
          align="center">
        </el-table-column>
        <el-table-column
          label="规则执行时间"
          align="center"
          prop="RoleValues">
        </el-table-column>
        <el-table-column
          label="创建人"
          align="center"
          prop="CREATER">
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="CTIME">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button-group>

              <el-button size="small" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            </el-button-group>
            <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagepagination
      :pageDataSizes=pagingData.pagesizes
      :pageDataSize=pagingData.pagesize
      :PageDatanum=pagingData.pagingTotal
      :pageShowStatus=pagingData.pagingShow
      @ChangeSize="PageChangeSize"
      @change="PageAction"
      @currentDataPage="PageAction"
    ></pagepagination>
    <!--模板*修改新增模态框-->

    <el-dialog title="模板编辑列表" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="mubanform" ref="mubanform">
        <el-row :gutter="10">
          <!--<el-col :span="8">-->
          <!--<el-form-item label="创建人" >-->
          <!--<el-input v-model="mubanform.CREATER" auto-complete="off" clearable></el-input>-->
          <!--</el-form-item>-->
          <!--</el-col>-->

          <el-col :span="24">
            <el-form-item label="规则描述">
              <el-input v-model="mubanform.Roledes" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规则类型">
              <el-input v-model="mubanform.RoleType" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规则循环时间">
              <el-input type="number" v-model="mubanform.RoleValues" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板选择" :span="24">

              <el-select v-model="mubanform.EntityID" placeholder="请选择" :span="24">
                <el-option
                  v-for="(item,index) in tableDataN"
                  :key="index"
                  :label="item.ENAME"
                  :value="item.ORDROWID">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <!--<el-col :span="8">-->
          <!--<el-form-item label="创建时间" >-->
          <!--<el-date-picker-->
          <!--v-model="mubanform.CTIME"-->
          <!--type="date"-->
          <!--placeholder="选择日期" clearable>-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="24" style="text-align: right">
            <el-form-item prop="pass">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateRule('form')">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>


  </div>
</template>

<script>
  import Pagepagination from "@/components/pagepagination/index";
  import $ from 'jquery'
  import DataSearch from '@/components/DataSearch/index'
  import {mapState} from 'vuex'


  export default {
    name: "Followrules",
    components: {
      Pagepagination,
      DataSearch
    },
    whatch: {},
    computed: {
      tableDataN() {
        return this.mubanTemplate
      },
      ...mapState({
        mubanTemplate: state => state.Flup.mubanTemplate,
      })
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
          RoleItemID: '', //规则ID
          EntityID: '', //问题ID
          RoleType: '', // 规则类型
          Roledes: '', // 规则描述
          RoleValues: '',//规则内容
          CREATER: '', //创建人
          CTIME: '', //创建时间
        },
        loading: true,
        pagingData: {
          pagingTotal: 100, //总条数
          pagingShow: true, //展示与否
          pagesize: 20, //初始页面大小
          pagesizes: [2, 20, 50, 100, 150],  //分页 每页大小
          currentpage: 1,//去往第几页
          pagenum: 1
        },
        tablestatus: true,
        moduleinfo: {
          modulename: 'Followrules',
          moduleurl: '/sfmanage/followrules',
          initStatus: true,// 表示是否需要初始化数据
          Searchtips: '试试 信息规则？模板。。。',
          typesinfo: [{
            SearchName: '规则类型',
            Searchprop: 'RoleType',
            typeMethod: 'button',
            SelectTypes: []
          }]
        }
      }
    },
    mounted() {

      this.initTemplateData()
    },
    methods: {
      ToggleStatus(data) {
        console.log('emit切换', this.$store.state.Flup.Followrules)
        this.tablestatus = false
        this.tablestatus = true
      },
      initTemplateData() {
        this.GetTemplateList()
        this.$refs.searchmodule.GETDATATYPE()
        this.hidePanel5()

      },
      GetTemplateList() {
        var that = this

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
            console.log('模板库数据', that.$store.state.Flup.mubanTemplate)
          } else {
            that.$router.push({path: '/'})
          }
        })
      },
      hidePanel5() {

        var that = this

        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.RoleItemQuery,
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
            that.$store.state.Flup.Followrules = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[1]
            that.$store.state.Flup.Followrules = data.slice(1,)
            that.pagingData.pagingTotal = parseInt(data[0].ename)
            console.log('随访规则', that.$store.state.Flup.Followrules)
            that.tablestatus = true
            that.$message({
              showClose: true,
              message: '更新数据成功',
              type: 'success'
            })

          } else {

            that.$router.push({path: '/'})
          }
        })

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
            return this.deleterule(that, row)
          }
        ).catch(() => {
          this.stringmessage = '已经取消删除'
          this.stringmethod = 'info'
          this.messagebox()


        })
      },
      // 删除方法
      deleterule(that, row) {
        var _this = that

        $.ajax({
          type: 'DELETE',
          url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.RoleruleDel + '/' + row.RoleItemID,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: _this.$store.state.Token,
            RoleItemID: row.RoleItemID,

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

            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
      },
      //编辑方法
      handleEdit(row) {

        this.UpdateORInsertStatus = false
        this.dialogFormVisible = true
        this.mubanform = row
      },
      //添加方法
      addRule() {
        if (this.multipleSelection == 0) {
          this.mubanform.RoleItemID = '',//规则ID
            this.mubanform.EntityID = '', //问题ID
            this.mubanform.RoleType = '', //规则类型
            this.mubanform.Roledes = '', //规则描述
            this.mubanform.RoleValues = '',//规则内容
            this.mubanform.CREATER = '', //创建人
            this.mubanform.CTIME = '',//创建时间
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
      //更新方法
      updateRule() {
        var _this = this
        let ajaxtype = 'post'
        if (this.UpdateORInsertStatus === false) {
          this.sendurl = this.$store.state.urlobjects.RoleItemUpdate
          this.iscurrent = true
          ajaxtype = 'put'
        } else {
          this.sendurl = this.$store.state.urlobjects.RoleruleAdd
        }
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
            RoleItemID: this.mubanform.RoleItemID,//必填 修改根据次ID
            EntityID: this.mubanform.EntityID, //
            RoleType: 'single',
            Roledes: this.mubanform.Roledes, //
            RoleValues: this.mubanform.RoleValues, //
            CREATER: this.$store.state.user.ordrowid,
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
              _this.UpdateORInsertStatus = false
              // console.log(this.form)
            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
      },


      //切换页码
      PageAction(val) {
        this.pagingData.pagenum = val
        this.hidePanel5()
        console.log(val, '分页码数')
      },
      //切换页面大小
      PageChangeSize(val) {
        this.pagingData.pagesize = val
        console.log(val, '改变大小')
      },

    }
  }
</script>

<style scoped>

</style>
