import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}
export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("/config/sysmenu").then(resp=> {
    if (resp && resp.status == 200) {

      var fmtRoutes = formatRoutes(resp.data);
      console.log(resp.data,'元数据')
      console.log(fmtRoutes,'路由信息')
      router.addRoutes(fmtRoutes[0]);
      store.commit('initMenu', fmtRoutes[1]);
      store.dispatch('connect');
    }
  })
}


export const formatRoutes = function(routes){
  let tempRoutes=[] //放置最终数据
  let tempRoutes2=[] //放置最终数据
  let tempRoutes3=[] //存放随访对象组件名 即二级菜单名
  let Routes3=[]  //随访一级对象内容
  let routeindex=0 //当条数据应位于随访何处
  let tempdata={} // 表示routers随访一级对象
  let tempobject={}
  let fmRouter=[]
  for(let j in routes){
    if(routes[j].children[0].children.length == 0){

      tempRoutes2.push(formatRoutes1([routes[j]])[0])
      tempRoutes=tempRoutes.concat([routes[j]])

    } else{

      tempdata = JSON.parse(JSON.stringify(routes[j]))
      tempdata.children=[]
      tempdata=convertobject(tempdata)
      for(let i in routes[j].children){
        routeindex=tempRoutes3.indexOf(routes[j].children[i].component) //获得当条对应在routes3 中的位置
        if(routeindex == '-1'){
          // tempdata = JSON.parse(JSON.stringify(routes[i].children[i]))
          // tempdata.children=[]
          tempRoutes3.push(routes[j].children[i].component)
          routeindex=tempRoutes3.indexOf(routes[j].children[i].component)
          tempobject = JSON.parse(JSON.stringify(routes[j].children[i]))
          tempobject=convertobject(tempobject)
          tempobject.children[0]=convertobject(tempobject.children[0])

          Routes3[routeindex] = tempobject

        } else{
          tempobject =JSON.parse(JSON.stringify(routes[j].children[i].children[0]))
          tempobject =convertobject(tempobject)
          Routes3[routeindex].children.push(tempobject)
        }
      }
    tempdata.children=Routes3
    tempRoutes=tempRoutes.concat([tempdata])
    }
  }
  fmRouter[0] = tempRoutes2
  fmRouter[1] = tempRoutes
  return fmRouter
}

export const convertobject=function(data){
  let {
    path,
    component,
    name,
    meta,
    iconCls,
    children
  } = data;

  let fmRouter = {
    path: path,
    component(resolve){
      if (component.startsWith("Home")) {
        require(['../components/' + component + '.vue'], resolve)
      } else if (component.startsWith("Emp")) {
        require(['../components/emp/' + component + '.vue'], resolve)
      }
       else if (component.startsWith("Sys")) {
        require(['../components/system/' + component + '.vue'], resolve)
      } else if (component.startsWith("Sfmanage")){
         if (component.slice(8,) != ''){
          require(['@/page/Flup/SFMANAGE/' + component.slice(8,)], resolve)
         } else{
           require(['../components/Home.vue'], resolve)
         }
      } else if (component.startsWith("Sfresult")){
         if (component.slice(8,) != '') {
          require(['@/page/Flup/SFRESULT/' + component.slice(8,) ], resolve)
         }else{
           require(['../components/Home.vue'], resolve)
         }
      } else if (component.startsWith("Patmanage")){
         if (component.slice(9,) != '') {
          require(['@/page/Flup/PATMANAGE/' + component.slice(9,)], resolve)
         }else{
           require(['../components/Home.vue'], resolve)
         }
        } else if (component.startsWith("Sftask")){
         if (component.slice(6,) != '') {
          require(['@/page/Flup/SFTASK/' + component.slice(6,) ], resolve)
         }else{
           require(['../components/Home.vue'], resolve)
         }
      }
    },
    name: name,
    iconCls: iconCls,
    meta: meta,
    children: children
  };

  console.log(component,'router对象')
  return fmRouter
}


export const formatRoutes1 = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes1(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Emp")) {
          require(['../components/emp/' + component + '.vue'], resolve)
        }  else if (component.startsWith("Sys")) {
          require(['../components/system/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sfmanage")){
          require(['@/page/Flup/SFMANAGE/' + component.slice(8,)], resolve)
        } else if (component.startsWith("Sfresult")){
          require(['@/page/Flup/SFRESULT/' + component.slice(8,)], resolve)
        } else if (component.startsWith("Patmanage")){
          require(['@/page/Flup/PATMANAGE/' + component.slice(9,)], resolve)
        } else if (component.startsWith("Sftask")){
          require(['@/page/Flup/SFTASK/' + component.slice(6,)], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    };
    if(fmRouter.path != '/home' && fmRouter){
      fmRoutes.push(fmRouter);
    } else{
      fmRoutes.push(fmRouter);
    }

  })

  return fmRoutes;
}
