<template>
  <div>
    <div style="height: 80vh">

      <DataSearch
        ref="searchmodule"
        @refresh="initTemplateData"
        @add="addMessage"
        :moduleinfo="moduleinfo"
        :pagingData="pagingData"
      ></DataSearch>
      <el-table
        ref="Messagetable"
        :data="tableDataM"
        style="width:100%;"
        height="62vh"
        v-show="tablestatus"
        border
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          style="width:10%;">
        </el-table-column>
        <el-table-column
          label="短信类型"
          prop="TYPE"
          align="center">
        </el-table-column>
        <el-table-column
          label="短信内容"
          prop="MESSAGE"
          align="center">
        </el-table-column>
        <el-table-column
          label="创建人"
          align="center"
          prop="CREATER">
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="CREATETIME">
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
            <el-button size="small" icon="el-icon-delete"  type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="短信编辑列表" :visible.sync="dialogFormVisible" width="40%">
       <el-row style="text-align: left">
        <el-row  style="margin-bottom: 10px"    :gutter="10">
          <el-col  :span="6">
            <el-button type="primary">短信类型</el-button>
          </el-col>
          <el-col :span="16">
              <el-select v-model="mubanform.TYPE"   filterable
                         allow-create  placeholder="请选择或者输入创建" >
                <el-option
                v-for="(type,index) in moduleinfo.typesinfo[0].SelectTypes"
                :index="index"
                :key="type.key"
                :value="type.label"
                :label="type.label"

                >
                 <!--{{type.label}}-->
                </el-option>
              </el-select>
          </el-col>
        </el-row>
         <el-row  style="margin-bottom: 10px"    :gutter="10">
           <el-col  :span="6">
             <el-button type="primary">所属科室</el-button>
           </el-col>
           <el-col :span="16">
             <el-select v-model="mubanform.DEPARTMENTS"   filterable
                        allow-create  placeholder="请选择或者输入创建" >
               <el-option
                 v-for="(type,index) in moduleinfo.typesinfo[1].SelectTypes"
                 :index="index"
                 :key="type.key"
                 :value="type.label"
                 :label="type.label"
               >
                 <!--{{type.label}}-->
               </el-option>
             </el-select>
           </el-col>
         </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button type="primary" style="margin-bottom: 10px">短信内容</el-button>
          </el-col>
            <el-col style="height: 10vh">
              <p>预览:{{ messageContent}}</p>
            </el-col>
             <el-col :span="24">
               <!--<div ref="textaction" contenteditable="true" V-show="false"  v-model="mubanform.MESSAGE" style="height: 30vh;background: #e6efe9;font-size: 22px;color: #de4646;" v-on:input ="setinput">-->
               <!--</div>-->
               <vue-html5-editor :content="content" :height="300" :z-index= "10000" refs="messageeditor"  @change="updateData"></vue-html5-editor>
             </el-col>
          <textarea v-model="mubanform.MESSAGE"
                    rows="5vh"
                    cols="80vh"
                    auto-complete="off"
                    clearable
                    v-on:focus="test1()"
                    type="text"
                    :autosize="{ minRows: 3, maxRows: 8}"
                    v-show="false"
          >
                 </textarea>
          </el-row>
        <el-col :span="24" style="text-align: right">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateMessage('form')">确 定</el-button>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>

  import Pagepagination from "@/components/pagepagination/index";
  import $ from 'jquery'
  import DataSearch from '@/components/DataSearch/index'
  export default {
    name: "Message",
    components: {
      Pagepagination,
      DataSearch
    },
    computed: {
      tableDataM() {

        return this.$store.state.Flup.Message
      },
      messageContent :{
        get(){

          let enddata=JSON.parse(JSON.stringify( this.mubanform.MESSAGE))
          let regdata=[]
          let matchdata=enddata.match(/{#.*?}/g)
          for(let i in  matchdata ){
              for(let j in this.normaloption){
                if(this.normaloption[j].key ==  matchdata[i].replace(/{#|}/g,'') ){
                  regdata=RegExp(matchdata[i],'g')

                  enddata=enddata.replace(regdata.exec(enddata)[0],''+this.normaloption[j].value+'').replace(/<[^>]+>/g,"");
                }
              }
          }
          return enddata
        },

      }
    },
    data() {
      return {
        multipleSelection: [],
        value: '',
        stringmessage: '',//控制弹出消息内容
        stringmethod: 'success',//控制消息类型 success warning
        UpdateORInsertStatus: false,//控制更新模块为更新还是新增  默认更新
        dialogTableVisible: false,//编辑模态框状态
        dialogFormVisible: false,//模态框
        sendurl: '',
        mubanform: {
          ORDROWID: '',
          MESSAGE: '', //消息内容
          CREATER: '', //创建人
          CREATETIME: '', //创建时间
          TYPE:[],
          DEPARTMENTS:[]
        }, //模板框数据
        mubanformMessageCopy:'',
        loading: true,
        pagingData: {
          pagingTotal: 1, //总条数
          pagingShow: true, //展示与否
          pagesize: 20, //初始页面大小
          pagesizes: [3, 20, 50, 100, 150],  //分页 每页大小
          currentpage: 1,//去往第几页
          pagenum: 1

        },
        tablestatus: true,
        moduleinfo:{
          modulename:'Message',
          moduleurl:'/sfmanage/message',
          initStatus:true,// 表示是否需要初始化数据
          Searchtips:'试试 信息名？。。。',
          typesinfo:[
            {
              SearchName:'消息类型',
              Searchprop:'TYPE',
              typeMethod:'button',
              SelectTypes: [

              ],
            },
            {
              SearchName:'所属科室',
              Searchprop:'DEPARTMENTS',
              typeMethod:'button',
              SelectTypes: [

              ],
            }
          ]
        },
        normaloption:[
          {
            key:'PATID',
            label:'患者名',
            value:'XXX'
          },{
            key:'address',
            label:'患者地址',
            value:'XX省XX市区'
          },{
            key:'tel',
            label:'患者电话',
            value:'1XXXXXXXXXXXX'
          },
          {
            key:'PATAGE',
            label:'患者年龄',
            value:'XX'
          }
        ],
        content:'',
        editorOption: {
          modules: {
            toolbar: [
              [],        // toggled buttons
            ]
          }
        }
      }
    },
    methods: {
      getMessage() {
        var that = this
        $.ajax({
          type: 'get',
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MessageQuery,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: this.pagingData.pagenum,
            pagesize: this.pagingData.pagesize
          },
          headers: {
            //     // 跨域请求 这个配置不能少
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Accept': 'application/json'
          },
          success: function (e) {
            console.log(e,'信息获取')
            if (e != '[{"status":"400"}]') {
              that.$store.state.Flup.Message = []
              //console.log('QuestionDetail',eval('('+e+')'))
              that.tablestatus = false
              var data = e
              that.$store.state.Flup.Message = data.slice(1,)
              that.tablestatus = true
              console.log('MessageXXXX', that.$store.state.Flup.Message)
            } else {
              that.$router.push({path: '/'})
            }
          }
        })
      },
      initTemplateData(){
        var that = this
        that.tablestatus = false
        this.$refs.searchmodule.GETDATATYPE()
        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MessageQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: this.pagingData.pagenum,
            pagesize: this.pagingData.pagesize
          }
        }

        this.$SelfUtils.get(DATAoptions).then(function (e) {

          if (e != '[{"status":"400"}]') {

            console.log(e)
            that.$store.state.Flup.Message = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.Message = data.slice(1,)
            console.log('Message-mounted', that.$store.state.Flup.Message)
            that.pagingData.pagingTotal = parseInt(data[0].CREATER)
            that.tablestatus = true
            that.$message({
              showClose: true,
              message: '更新数据成功',
              type: 'success'
            });
          } else {
            that.$router.push({path: '/'})
          }
        })
      },

      addMessage() {
        // if (this.multipleSelection == 0) {
        console.log('aaaaa')
        this.mubanform.Message = '', //短信
          this.mubanform.CREATER = '', //创建人
          this.mubanform.CREATETIME = '',//创建时间
          this.UpdateORInsertStatus = true,
          this.dialogFormVisible = true

        // } else {
        //   this.multipleSelection = 0
        //   this.$message({
        //     showClose: true,
        //     message: '请勿在有勾选的情况下新增',
        //     type: 'error'
        //   });
        //
        // }

      },
      handleEdit(row) {
        console.log('message  ',row)
        this.UpdateORInsertStatus = false
        this.dialogFormVisible = true
        this.mubanform = row
      },//编辑方法
      updateMessage() {
        var _this = this
        let ajaxtype='POST'
        if (this.UpdateORInsertStatus === false) {
          this.sendurl = this.$store.state.urlobjects.MessageUpdate
          this.iscurrent = true
          ajaxtype='PUT'
        } else {
          this.sendurl = this.$store.state.urlobjects.MessageAdd
        }
        this.dialogFormVisible = false

        if(1==1) {
          $.ajax({
            type: ajaxtype,
            url: this.$store.state.urlobjects.FlupBaseUrl + this.sendurl,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              MESSAGE: this.mubanform.MESSAGE, //
              CREATER: this.$store.state.user.ordrowid,
              TYPE: this.mubanform.TYPE,
              ORDROWID: this.mubanform.ORDROWID,
              DEPARTMENTS:this.mubanform.DEPARTMENTS,
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
                _this.getMessage()
                _this.UpdateORInsertStatus = false
                _this.initTemplateData()
                // console.log(this.form)
              } else {
                _this.$router.push({path: '/'})
              }
            }
          })
        }
      },//更新&删除方法

      handleDelete(row) {
        // console.log(index, row);
        var that = this
        this.$msgbox('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            return this.deletemessage(that,row)
          }
        ).catch(() => {
          this.stringmessage = '已经取消删除'
          this.stringmethod = 'info'
          this.messagebox()


        })
      },//删除方法
      deletemessage(that,row) {
        var _this = that

        $.ajax({
          type: 'DELETE',
          url: _this.$store.state.urlobjects.FlupBaseUrl + _this.$store.state.urlobjects.MessageDel+'/'+row.ORDROWID,
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            _xsrf: _this.$store.state.Token,
            ORDROWID: row.ORDROWID,
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
              _this.getMessage()
            } else {
              _this.$router.push({path: '/'})
            }
          }
        })
      }, // 删除方法

      messagebox() {

        this.$message({
          showClose: true,
          message: this.stringmessage,
          type: this.stringmethod
        })
      }, //消息盒子


      //工具类
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
      },   //实时获取选中列
      handleSelectionChange(val) {
        //console.log('table', val)

        this.mubanform = val[0]
        this.multipleSelection = val;
      },  //添加方法

      updateData(content,B,C){
        this.mubanform.MESSAGE=content
        //console.log(content,B,C,'AAAAA')
      },

     // 分页组件
      PageAction(val) {
        var that = this

        var DATAoptions = {
          url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.MessageQuery,
          method: 'get',
          data: {
            _xsrf: this.$store.state.Token,
            pagenum: val,
            pagesize: this.pagingData.pagesize
          }
        }
        this.$SelfUtils.get(DATAoptions).then(function (e) {

          if (e != '[{"status":"400"}]') {
            that.tablestatus = false
            that.$store.state.Flup.Message = []
            //console.log('QuestionDetail',eval('('+e+')'))
            var data = e
            that.$store.state.Flup.patinfo = data[0]
            that.$store.state.Flup.Message = data
            console.log('MessageXXXX', that.$store.state.Flup.Message)

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

    },
    mounted() {
      this.initTemplateData()
    }
  }
</script>

<style scoped>

</style>
