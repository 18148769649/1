<template>
  <div >
    <el-container>
      <page-aside></page-aside>
      <el-container >
        <el-aside >
        </el-aside>
        <el-header style="padding: 0px;margin: 0px;height: 5vh ">
          <login-head></login-head>
        </el-header>
        <el-main style="padding-left: 0px;padding-top: 0px;margin-left: 0px;background-color: #fffefe">
          <router-view class="view one"></router-view>
          <router-view class="viewtable1" name="tablebtn" > </router-view>

          <router-view class="viewtable2" name="tablemain"  ></router-view>
          <!--<main-content></main-content>-->


            <router-view class="viewtable3" name="tablemainPage"  ></router-view>




        </el-main>


        <!--<el-footer  >-->
          <!--&lt;!&ndash;<page-footer></page-footer>&ndash;&gt;-->
        <!--</el-footer>-->
      </el-container>
    </el-container>
  </div>

</template>

<script>
  import LoginHead from '@/components/loginhead'
  import PageAside from '@/components/pageAside'
  // import PageFooter from '@/components/pagefooter'



  export default {
    name: "Flup",
    components: {

      LoginHead,
      // PageFooter,
      PageAside,


    },
    watch:{
      "$route" (){

        this.$store.state.ROUTEINFO = this.$route.params.visittype
        console.log('route',this.$store.state.ROUTEINFO)
      }
    }
  }
</script>

<style scoped>

</style>
