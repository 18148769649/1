<template>
  <div style="text-align: center;height:70vh;overflow: scroll;overflow-x: hidden">
    <div v-for="(item,Dataindex) in QuestionnaireData" style="text-align: left;" @click="DivClick" :key="Dataindex">
      <span style="height: 30px">第{{item.id}}题:{{item.label}}</span>
      <el-row :gutter="10" >
        <el-checkbox-group
          v-model="checkedCities1[item.id]"
        >
          <el-col :span="24" v-for="(city,index) in item.children" :key="index"
                  style="margin:5px 20px" >

            <el-checkbox  :label="city.label"
                          :value="city.ordrowid"
            >
              {{index +1}}
              <span
                v-show="city.type != '备注'  || mubanstatus == false"
                style="color: #1f150b;font-size: 18px"
               >
                {{city.label}}
              </span>
              <span>
                选择人数： {{city.nums}}
              </span>
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 4}"
                v-model="beizhuitem[item.id]" size="mini" style="width: 400px"
                v-show="city.type == '备注' && mubanstatus == true">
              </el-input>
              <br>
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
  </div>


</template>

<script>
    export default {
        name: "questionnaire",
        data:function () {
            return {
              checkedCities1:[],
              beizhuitem:[],
              mubanstatus:false
            }
        },
        props:{
          data:Array,
        },
        mounted(){
          this.checkedCities1=[]
          for(let i = 0;i<this.data.length;i++){

            this.checkedCities1[i]=[]
          }

        },

        computed:{
          QuestionnaireData(){


             return this.data
          }
        },
        methods:{
            DivClick(){
              this.$emit('DivClick',this.QuestionnaireData)
            }
        }
    }
</script>

<style scoped>

</style>
