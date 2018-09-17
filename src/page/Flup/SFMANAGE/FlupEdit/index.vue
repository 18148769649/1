<template>
    <div style="display: flex;justify-content: space-between;">
      <div style="flex: 0 0 50%;border: black 1px solid;overflow:auto;">
      <div style="text-align: center">
        <h2 ><span v-show="dclickstatus==false" v-on:dblclick="dclickstatus=true" >
          {{sftitle}}
        </span></h2>
        <el-input v-model="sftitle" v-show="dclickstatus==true" @blur="dclickstatus=false"></el-input>
      </div>


      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"

      >
      </el-input>

      <el-tree
        class="filter-tree"
        id="qtree"
        :data="data2"
        :props="defaultProps"
        :expand-on-click-node=false
        :default-expand-all=true
        :filter-node-method="filterNode"
        @node-click="node1"
        ref="tree2"
        style="height: 1080px;"
        show-checkbox
      >
      </el-tree>
    </div >
      <div style="flex: 0 0 50%">


      <div style="flex: 0 0 100%;height: 8%;background: #52aede;color: #ffffff">

        <span>当前问题:</span><h2 v-if="dclickstatusQuestion==false" v-on:dblclick="dclickstatusQuestion=true">{{ sfQuestion }}</h2>
        <el-input v-model="sfQuestion" v-if="dclickstatusQuestion==true" @blur="dclickstatusQuestion=false"></el-input>
      </div>
      <div style="display: flex;text-align: center;flex-wrap:wrap;height: 90vh" >
        <div style="flex: 0 0 100%;background: #e4e7ed;height: 2vh;width: 100%;line-height: 60px">
          <el-button-group>
            <el-button  @click="AnswerAction('add')" type="primary" icon="el-icon-arrow-left">添加已有{{thislable}}</el-button>
            <el-button @click="AnswerAction('remove')" type="primary">移除已有{{ thislable}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
          <el-button @click="SaveMuBan" type="success" icon="el-icon-check">保存随访模板</el-button>
        </div>
        <div style="overflow:auto;flex: 0 0 48%;background: #fffefe;height: 80vh;width: 50%;">
          <div style="height: 40px;background: #ffffff">
            <el-switch
              v-model="QtoAStatus2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="答案编辑"
              inactive-text="问题编辑"
              @change="ToggleQtoA"
            >
            </el-switch>
            &nbsp;&nbsp;
            <el-button type="primary" @click="dialogVisible=true"  v-show="readStatus" >添加</el-button>

          </div>
          <el-table
            ref="multipleTable"
            :data="data3"
            tooltip-effect="dark"

            @selection-change="SelectedChange">
            <el-table-column
              type="selection"
              width="60">
            </el-table-column>
            <el-table-column
              :label="'已选择'+thislable+'库'"
              >
              <template slot-scope="scope">{{ scope.row.label }}</template>
            </el-table-column>

          </el-table>
        </div>
        <div style="overflow:auto;flex: 0 0 47%;background: #e6f1fe;height: 80vh;width: 50%;border-left: black 1px solid">
          <el-input
            style="background: #e6f1fe"
            class="inline-input"
            placeholder="请输入搜索内容"
            v-model="SearchAllAnswer"
          ></el-input>
          <el-table
            ref="ALLTable"
            :data="AllAnswerDataTemp"
            tooltip-effect="dark"
            :highlight-current-row=true
            :show-overflow-tooltip=true
            @selection-change="SelectionsChange">
            <el-table-column
              type="selection"
              width="60">
            </el-table-column>
            <el-table-column
              :label="'所有'+thislable+'库'"
              prop="label"
              >

            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope"  >
                <el-button-group  v-show="readStatus"  >
                  <el-button
                    size="mini"
                    @click="editanswer(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteanswer(scope.$index, scope.row)">删除</el-button>
                </el-button-group>

              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

      <el-dialog
        :title="thistype+thislable"
        :visible.sync="dialogVisible"
        width="30%"
        center
       >
        <div style="text-align: center">



          <el-input
            style="background: #e6f1fe"
            class="inline-input"
            :placeholder="'请输入'+thislable+'内容'"
            v-model="newanswer.data"
          >
            <template slot="prepend">名称:</template>
          </el-input>

          <el-input
            type="textarea"
            :rows="2"
            :placeholder="'请输入'+thislable+'描述，请勿超过250字'"
            v-model="newanswer.textarea">

          </el-input>
          <div v-show="QtoAStatus2 == true">
            <el-radio v-model="newanswer.radio" label="1">选择题</el-radio>
            <el-radio v-model="newanswer.radio" label="2">备注</el-radio>
          </div>

        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAnswer">确 定</el-button>
  </span>
      </el-dialog>

    </div>
</template>

<script>

  import $ from 'jquery'

    export default {

      name: "FlupEdit",
      mounted(){
        this.sftitle=this.$store.state.Flup.panelobject.mubanTitle

        this.AllAnswerDataTemp=this.AllAnswerData
        this.sfQuestion=this.data2[0].label
        this.$notify.info({
          title: '使用须知',
          message: '1、需添加完所有的答案和问题后点击保存随访模板进行保存',
          duration: 2000
        });
        if(this.readStatus != true){
          this.$notify.info({
            title: '修改前注意',
            message: '您可以先在本弹框内小幅度修改下次随访用模板，也可直接在本弹框上方处直接选择下次模板',
            offset: 100,
            duration: 3000
          });
        }

      },

      watch: {
        filterText(val) {
          this.$refs.tree2.filter(val);
        },
        SearchSelectAnswer(a){
          console.log('select',a,b)
        },
        SearchAllAnswer(a){
          console.log('aaaa',a)
          if(a != ''){
            var _data=[]

            for(var i in this.AllAnswerData){
              if (this.AllAnswerData[i].label.indexOf(a) != -1){
                _data.push(this.AllAnswerData[i])
              }
            }
            console.log(_data,'当前data')
            this.AllAnswerDataTemp=_data
          }else{
            this.AllAnswerDataTemp=this.AllAnswerData
          }
        }//当输入框数据发生变化则会运行

      },

      methods: {
        ToggleQtoA(A) {
          //console.log(A)
          if (this.QtoAStatus2 == true){
            this.thislable = '答案'
          } else {
            this.thislable = '问题'
          }
          this.AllAnswerDataTemp=this.AllAnswerData
        },
        messagebox(){

          this.$message({
            showClose: true,
            message: this.stringmessage,
            type: this.stringmethod
          })
        }, //消息盒子方法
        AnswerAction(action) {
          if (action == 'add') {
            console.log('添加答案', this.Selections)


            if(this.QtoAStatus2 == true){


              for (var item in this.Selections) {
                function checkAvailability(arr, val) {
                  return arr.some(function (arrVal) {
                    return val === arrVal.label;
                  });
                } //判断是否重复

                if (this.data2[this.treeindex].children == undefined){
                  this.$store.state.Flup.EntityDetail[this.treeindex].children = []
                }
                if (checkAvailability(this.data2[this.treeindex].children, this.Selections[item].label) != true) {
                  this.$store.state.Flup.EntityDetail[this.treeindex].children.push({
                    id: this.$store.state.Flup.EntityDetail[this.treeindex].children.length+1,
                    orderid:this.Selections[item].orderid,
                    label: this.Selections[item].label
                  })
                }

              }

            }
            else

            {
              for (var item in this.Selections) {
                function checkAvailability(arr, val) {
                  return arr.some(function (arrVal) {
                    return val === arrVal.label;
                  });
                } //判断是否重复

                if (checkAvailability(this.data2, this.Selections[item].label) != true) {
                  this.$store.state.Flup.EntityDetail.push({
                    id:  this.$store.state.Flup.EntityDetail.length+1,
                    orderid:this.Selections[item].orderid,
                    label: this.Selections[item].label,
                    children:[],
                    ATYPE:""
                  })
                }

              }


            }


          } else if (action == 'remove') {
            var that = this

            console.log('移除答案', this.Selected, this.treeindex)
            if(this.QtoAStatus2 == true){
            var tempdata = this.data2[this.treeindex].children
            for (var item in this.Selected) {

              tempdata = tempdata.filter(
                function (s) {
                  if (s.label == that.Selected[item].label) {
                    return false
                  } else {
                    return s;
                  }
                }
              )
              console.log('aaaaa', tempdata)

            }

              this.$store.state.Flup.EntityDetail[this.treeindex].children = tempdata
          } else {
              var tempdata = this.data2
              for (var item in this.Selected) {

                tempdata = tempdata.filter(
                  function (s) {
                    if (s.label == that.Selected[item].label) {
                      return false
                    } else {
                      return s;
                    }
                  }
                )
                console.log('aaaaa', tempdata)

              }

              this.$store.state.Flup.EntityDetail=tempdata
            }
          }
        },  //动作方法
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        node1(a) {
          console.log('bbbb', a,this.data2)

          if (Number.isInteger(a.id)) {

            this.treeindex = a.id-1
            this.sfQuestion = this.data2[a.id-1].label
          }

        },//切换当前选择节点
        SelectionsChange(val) {
          console.log('现有答案切换', val)
          this.Selections = val
        },
        SelectedChange(val) {
          console.log('选择答案切换', val)
          this.Selected = val
        },
        deleteanswer(index, row) {
          console.log('delete for answer', index)
          this.$msgbox('此操作将永久删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            () => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              return this.deleteansweraa(row)
            }
          ).catch(() => {
            this.stringmessage = '已经取消删除'
            this.stringmethod='info'
            this.messagebox()


          })
        }, // 删除方法
//-----------------------------------------------------
        editanswer(index, row) {
          var that=this
          this.thistype = '编辑'
          this.addOrUpdate = false
          console.log(row,'发送内容数据')
          if (this.QtoAStatus2 == true){
            var SendUrl = this.$store.state.urlobjects.AnswerQuery
          }else {
            var SendUrl = this.$store.state.urlobjects.QuestionQuery
          }
          this.newanswer.orderid = row.orderid
          $.ajax({
            type: 'post',
            url: this.$store.state.urlobjects.FlupBaseUrl + SendUrl,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data:{
              _xsrf:this.$store.state.Token,
              ordrowid:row.orderid
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success:function (e) {
              if (e != '[{"status":"400"}]'){
                var data= e
                var muTaiData = {}


                if (that.QtoAStatus2 == true){
                      for (var i in data){
                        if (data[i].ECREATER != null){
                          muTaiData = data[i]
                        }
                      }
                      that.newanswer.data = muTaiData.ITEMNAME
                      that.newanswer.textarea = muTaiData.itemdes
                      if (muTaiData.ITEMTYPE == '单选'){
                        that.newanswer.radio = '1'
                      } else {
                        that.newanswer.radio = '2'
                      }
                } else {

                    muTaiData=data[0]
                    that.newanswer.data = muTaiData.QNAME
                    that.newanswer.textarea = muTaiData.Qexplain
                  }
                  that.dialogVisible =true
                  console.log('查询单个问题|答案结果:',eval('('+e+')'))
                  // that.$message({
                  //   message: '添加成功',
                  //   type: 'success'
                  // });
            }}})

        },//编辑方法
        // 下方为 handledelete 所需调用的二次确认方法
        deleteansweraa(row) {
          var that =this
          if (this.QtoAStatus2 == true){
            var sendurl = this.$store.state.urlobjects.AnswerDel
          } else {
            var sendurl = this.$store.state.urlobjects.QuestionDel
          }
          $.ajax({
            type: 'DELETE',
            url: this.$store.state.urlobjects.FlupBaseUrl + sendurl+'/'+row.orderid,
            async: true,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data:{
              _xsrf:this.$store.state.Token,
              ordrowid: row.orderid,
            },
            headers: {
              //     // 跨域请求 这个配置不能少
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              'Accept': 'application/json'
            },
            success:function (e) {
              if (e != '[{"status":"400"}]'){
                var data = e
                if (that.QtoAStatus2 == true){
                      that.$store.state.Flup.ItemDetail =[]
                      var ItemDetail =that.$store.state.Flup.ItemDetail
                      console.log('更新答案',e)


                      for (var i in data){
                        if(data[i].ECREATER != null){
                          ItemDetail.push({


                            id: data[i].ORDROWID,
                            label: data[i].ITEMNAME,
                            orderid:data[i].ORDROWID,

                          })
                        }
                      }
                      that.$store.state.Flup.ItemDetail=ItemDetail
                } else {
                      that.$store.state.Flup.QuestionDetail =[]
                      var ItemDetail =that.$store.state.Flup.QuestionDetail
                      console.log('更新问题',eval('('+e+')'))

                      var index=0
                      for (var i in data){


                          ItemDetail.push({


                            id: index,
                            label: data[i].QNAME,
                            orderid:data[i].ORDROWID,

                          })
                          index=index+1

                      }
                      that.$store.state.Flup.QuestionDetail=ItemDetail
                }
                that.AllAnswerDataTemp =that.AllAnswerData
                that.stringmessage='删除成功'
                that.stringmethod='warning'
                that.messagebox()

              } else {
                that.$router.push({path:'/'})
              }
            }
          })
        },
        addAnswer(){
          var that=this
          console.log(this.newanswer,'当前模态框数据')
          if(this.newanswer.radio == 1){
            var AnswerType = '单选'
          }else  if (this.newanswer.radio == 2){
            var AnswerType = '备注'
          }


          if(this.addOrUpdate == true){
            this.thistype = '新增'
            if(this.QtoAStatus2 == true){
              var SendUrl =this.$store.state.urlobjects.AnswerAdd
            }else {
              var SendUrl =this.$store.state.urlobjects.QuestionAdd
            }
            $.ajax({
              type: 'post',
              url: this.$store.state.urlobjects.FlupBaseUrl + SendUrl,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data:{
                _xsrf:this.$store.state.Token,
                item:this.newanswer.data,
                itemType:AnswerType,
                itemDetail:this.newanswer.textarea,
                Ecreater:this.$store.state.user.ordrowid
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success:function (e) {
                if (e != '[{"status":"400"}]'){
                  var data = e
                  console.log('添加结果:',data)
                  if (that.QtoAStatus2 == true){
                    that.$store.state.Flup.ItemDetail =[]
                    var ItemDetail =that.$store.state.Flup.ItemDetail

                    for (var i in data){
                      if(data[i].ECREATER != null){
                        ItemDetail.push({
                          id: data[i].ORDROWID,
                          label: data[i].ITEMNAME,
                          orderid:data[i].ORDROWID,

                        })
                      }
                    }
                    that.$store.state.Flup.ItemDetail=ItemDetail
                  } else {
                    that.$store.state.Flup.QuestionDetail =[]
                    var ItemDetail =that.$store.state.Flup.QuestionDetail
                    var index=0
                    for (var i in data){

                      ItemDetail.push({
                        id: index,
                        label: data[i].QNAME,
                        orderid:data[i].ORDROWID,

                      })
                      index=index+1

                    }
                    that.$store.state.Flup.QuestionDetail=ItemDetail
                  }
                  that.newanswer={
                    data:'',
                    datacode:'',
                    textarea:'',
                    radio:'1',//当前答案类型选择 1 选择题 2 填空题
                    orderid:''
                  }
                  that.dialogVisible = false
                  that.AllAnswerDataTemp =that.AllAnswerData
                  that.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                }}})
          }
          else
          {
            if(this.QtoAStatus2 == true){
              var SendUrl =this.$store.state.urlobjects.AnswerUpdate
            }else {
              var SendUrl =this.$store.state.urlobjects.QuestionUpdate
            }
            $.ajax({
              type: 'PUT',
              url: this.$store.state.urlobjects.FlupBaseUrl + SendUrl,
              async: true,
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                _xsrf: this.$store.state.Token,
                ITEMNAME: this.newanswer.data,
                ITEMDES: this.newanswer.textarea,
                ordrowid:this.newanswer.orderid
              },
              headers: {
                //     // 跨域请求 这个配置不能少
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'Accept': 'application/json'
              },
              success: function (e) {
                if (e != '[{"status":"400"}]') {
                  var data= e
                  console.log('更新结果:', data)
                  if (that.QtoAStatus2 == true){
                    that.$store.state.Flup.ItemDetail =[]
                    var ItemDetail =that.$store.state.Flup.ItemDetail
                    for (var i in data){
                      ItemDetail.push({
                        id: data[i].ORDROWID,
                        label: data[i].ITEMNAME,
                        orderid:data[i].ORDROWID,
                      })
                    }
                    that.$store.state.Flup.ItemDetail=ItemDetail
                  } else {
                    that.$store.state.Flup.QuestionDetail =[]
                    var ItemDetail =that.$store.state.Flup.QuestionDetail
                    var index=0
                    for (var i in data){
                      if(data[i].ecreater != null){
                        ItemDetail.push({
                          id: index,
                          label: data[i].QNAME,
                          orderid:data[i].ORDROWID,
                        })
                        index=index+1
                      }
                    }
                    that.$store.state.Flup.QuestionDetail=ItemDetail
                  }
                  that.$message({
                    message: '更新成功',
                    type: 'success'
                  });
                }
              }
            })
            this.dialogVisible = false
          }




          this.newanswer={
            data:'',
            textarea:'',
            radio:'1',//当前答案类型选择 1 选择题 2 多选
            orderid:''
          }


        }, // 添加新问题或者答案
        SaveMuBan(){
          var datalist=[]
          var that=this
          console.log('当前数据',this.data2)
          for(var i in this.data2){
            if(this.data2[i].children != []){
              for (var j in this.data2[i].children){
                datalist.push({
                  question:this.data2[i].label,
                  questionID:this.data2[i].orderid,
                  answer:this.data2[i].children[j].label,
                  answerID:this.data2[i].children[j].orderid
                })
              }
            }
          }
          console.log(that.$store.state.Flup.panelobject.mubanID)
          if(this.readStatus){
            if (datalist != []){
              $.ajax({
                type: 'put',
                url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.QuestionnaireUpdate,
                async: true,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data:{
                  _xsrf:this.$store.state.Token,
                  TemplateID:that.$store.state.Flup.panelobject.mubanID,
                  QandAData:JSON.stringify(datalist),
                  ecreater: that.$store.state.user.ordrowid

                  // usename: _this.$store.state.server.dictinfo.username
                },
                headers: {
                  //     // 跨域请求 这个配置不能少
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                  'Accept': 'application/json'
                },
                success:function (e) {
                  if (e != '[{"status":"400"}]'){
                    console.log('模板结果:',e)
                    if (e[0].errorcode == 0){
                      that.$message.success('保存成功');
                      that.$router.push({path:'/sfmanage/Template'})
                    } else {
                      that.$message.error(e[0].ordrowid);
                    }
                  }
                }
              })}
          } else {
            if(1==1) {
              $.ajax({
                type: 'put',
                url: this.$store.state.urlobjects.FlupBaseUrl + this.$store.state.urlobjects.ResultUpdate,
                async: true,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  _xsrf: this.$store.state.Token,
                  DetailData: JSON.stringify(datalist),
                  ORDROWID: that.$store.state.Flup.SFNextData.ORDROWID,
                  PICI: that.$store.state.Flup.SFNextData.PICI
                },
                headers: {
                  //     // 跨域请求 这个配置不能少
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                  'Accept': 'application/json'
                },
                success: function (e) {
                  console.log('保存下次模板结果:',e)
                  that.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                }
              })
            }
              console.log('修改detail表数据',datalist ,that.$store.state.Flup.SFNextData)
          }

        }, //保存模板
      },
      data() {
        return {
          filterText: '',
          sftitle:'',
          treeindex:0,
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          filterMethod(query, item) {
            return item.pinyin.indexOf(query) > -1;
          },

          sfQuestion:'',
          QtoAStatus2:true,
          dclickstatus:false,
          dclickstatusQuestion:false,
          dialogVisible:false,
          AllAnswerDataTemp:[],//当前显示的所有答案
          addOrUpdate:true,//表示现在是要添加还是修改
          Selected: [],//当前已选择答案选中项
          Selections: [],//所有答案中选中项
          SearchSelectAnswer:'',//当前选中项搜索
          SearchAllAnswer:'',//当前所有项搜索,
          thislable:'答案', //存储是答案还是问题
          thistype:'新增',
          newanswer:{
            data:'',
            textarea:'',
            radio:'1',//当前答案类型选择 1 选择题 2 多选
            orderid:''
          }  //添加输入框数据
        };
      },
      computed:{
        readStatus(){
          return this.$store.state.Flup.panelobject.flupeditstatus
        },
        data2:function () {


            return this.$store.state.Flup.EntityDetail


        }, //模板数据
        data3 :function () {
          var data = [];

          if (this.data2[this.treeindex].children != undefined) {

            var cities = [];

            if (this.QtoAStatus2 == true) {
              for (var labelname in this.data2[this.treeindex].children) {
                cities.push(this.data2[this.treeindex].children[labelname].label)
              }
              console.log('data3', cities)
              var pinyin = cities
              cities.forEach((city, index) => {
                  data.push({
                    label: city,
                    id: index,
                    pinyin: pinyin[index]
                  });
                }
              );
            } else {
              for (var labelname in this.data2) {
                cities.push(this.data2[labelname].label)
              }
              console.log('data3', cities)
              var pinyin = cities
              cities.forEach((city, index) => {
                data.push({
                  label: city,
                  id: index,
                  pinyin: pinyin[index]
                });
              });


            }
          } else {
            //debugger
            data.push({
              label:'',
              id:1,
              pingyin:''
            })
          }

          return data;
        }, //已选择数据
        // sftitle:function () {
        //
        //   return this.$store.state.Flup.panelobject.mubanTitle
        // }, //模板标题
        AllAnswerData:function () {

          if (this.QtoAStatus2 == true){
            console.log('模板编辑答案数据库', this.$store.state.Flup.ItemDetail)
            return this.$store.state.Flup.ItemDetail
          } else {
            console.log('模板编辑问题数据库', this.$store.state.Flup.QuestionDetail)
            return this.$store.state.Flup.QuestionDetail
          }

        }//当前所有答案数据
      },
    };
</script>

<style>
    #qtree .el-tree-node__content{
      height: 40px !important;

    }
</style>
