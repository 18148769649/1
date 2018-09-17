<template>
  <div v-show="pageshow" class="pagepaginationclass" style="height: 5vh">
    <el-pagination
      @current-change="changepage"
      @size-change="ChangeSize"
      background
      :current-page="CurrentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="PageSizes"
      :page-size="PageSize"
      :total="pageTotals"

    >
    </el-pagination>
  </div>

</template>

<script>
  import $ from 'jquery'

  export default {
    name: "pagepagination",
    props:[
      'PageDatanum',
      'pageShowStatus',
      'pageDataSize',
      'pageDataSizes',
      'currentDataPage'
    ],


    data() {
      return {
        stringmethod: 'success',
        type: 'query',
        url: '',//页码url
        stime: '',
        etime: '',
        inputdata: '',
        searchtype: '',
      }
    },
    methods: {
      changepage(val) {
          this.$emit('change',val)
      },  //控制分页具体采用哪个函数
      ChangeSize(val){
          this.$emit('ChangeSize',val)
      }
    },
    computed: {
      pageTotals: function () {
          return this.PageDatanum
      },
      pageshow: function () {
          return this.pageShowStatus
      },
      CurrentPage:function () {
         return this.currentDataPage
      },
      PageSizes:function () {
        return  this.pageDataSizes
      },
      PageSize:function () {
        return this.pageDataSize
      }
    }
  }
</script>

<style scoped>
  .pagepaginationclass {
    height: 4vh;
    padding-left: 5vh;

    /*margin-top: 25px;*/
    /*margin-bottom: 25px;*/
    width: calc(100vh - 200px);
    /*text-align: left;*/
    /*flex: 0 0 100%;*/
  }

</style>
