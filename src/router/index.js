import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/chat/Chat'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    }, {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/chat',
          name: '消息',
          component: Chat,
          hidden: true,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        },
        {
          path:'/patmanage/cFlup',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/PATMANAGE/Create-user-Flup'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          }
        },
        {
          path:'/sfmanage/flupEdit',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFMANAGE/editorTemplate/index'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          }
        },
        {
          path:'/patmanage/followinfo',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          children :[{
            path:'/patmanage/followinfo/flupedit',
            meta: {
              keepAlive: false,
              requireAuth: true,
            },
            component:resolve => require(['@/page/Flup/SFMANAGE/FlupEdit'],resolve)
          }],
          components:{
            tablebtn:resolve => require(['@/page/Flup/PATMANAGE/followinfo'],resolve),
            tablemain:resolve => require(['@/page/Flup/PATMANAGE/Medicalinfo'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          }
        },
        {
          path:'/sfmanage/template',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFMANAGE/Template'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          }
        },
        {
          path:'/autoflup/autoflup',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/AutoFlup'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          }
        },
        {
          path:'/sftask/statistical/:visittype',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },

          children :[{
            path:'/sftask/statistical/flupedit',
            meta: {
              keepAlive: false,
              requireAuth: true,
            },
            component:resolve => require(['@/page/Flup/SFMANAGE/FlupEdit'],resolve)
          }],
          components:{
            tablemain:resolve => require(['@/page/Flup/SFTASK/Statistical'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          },
        },
        {
          path:'/sfmanage/followrules',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFMANAGE/Followrules'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          },
        },
        {
          path:'/sfmanage/message',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFMANAGE/Message'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          },
        },
        {
          path:'/sfresult/analysis',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFRESULT/ANALYSIS'],resolve),
            tablemainPage: resolve => require(['@/components/pagepagination'],resolve),
          },
        },
        {
          path:'/sfresult/sfcount',
          meta: {
            keepAlive: false,
            requireAuth: true,
          },
          components:{
            tablemain:resolve => require(['@/page/Flup/SFRESULT/SFCOUNT'],resolve),
          },
        }
      ],

    }
  ]
})
