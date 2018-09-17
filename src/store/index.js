import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'
import Flup from '../page/Flup/module'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      userface: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      roles: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).roles,
      ordrowid: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).ordrowid,
    },
    routes: [],
    msgList: [],
    isDotMap: new Map(),
    currentFriend: {},
    stomp: Stomp.over(new SockJS("/ws/endpointChat")),
    nfDot: false,


    urlobjects: {

      FlupBaseUrl:'',


      getlist:'/sfmanage/questionnaire/query',
      QuestionnaireUpdate:'/sfmanage/questionnaire/update',


      AnswerQuery:'/sfmanage/flupedit/answer/query',
      AnswerAdd:'/sfmanage/flupedit/answer/add',
      AnswerUpdate:'/sfmanage/flupedit/answer/update',
      AnswerDel:'/sfmanage/flupedit/answer/del',


      QuestionQuery:'/sfmanage/flupedit/question/query',
      QuestionAdd:'/sfmanage/flupedit/question/add',
      QuestionUpdate:'/sfmanage/flupedit/question/update',
      QuestionDel:'/sfmanage/flupedit/question/del',

      TemplateQuery:'/sfmanage/template/query',
      TemplateAdd:'/sfmanage/template/add',
      TemplateUpdate:'/sfmanage/template/update',
      TemplateDel:'/sfmanage/template/del',

      RoleQuery:'/sfmanage/followrules/role/base/RoleQuery',
      RoleAdd:'/sfmanage/followrules/role/base/RoleAdd',
      RoleUpdate:'/sfmanage/followrules/role/base/RoleUpdate',
      ROLEDel:'/sfmanage/followrules/role/base/RoleDel',
      AutoRoleQuery:'/AutoRoleQuery',



      RoleItemQuery:'/sfmanage/followrules/query',
      RoleItemAdd:'/sfmanage/followrules/add',
      RoleItemUpdate:'/sfmanage/followrules/update',
      RoleItemDel:'/sfmanage/followrules/del',
      DORole:'/sfmanage/followrules/role/base/DORole',
      roleWork:'/sfmanage/followrules/role/base/roleWork',
      roleResultDetail:'/sfmanage/followrules/role/base/roleResultDetail',


      RoleruleAdd:'/sfmanage/followrules/roleRuleAdd',
      RoleruleDel:'/sfmanage/followrules/roleRuleDel',

      OutpatientQuery:'/patmanage/followinfo/outpatient/query',
      OutpatientAdd:'/patmanage/followinfo/outpatient/add',
      OutpatientUpdate:'/patmanage/followinfo/outpatient/update',
      OutpatientDel:'/patmanage/followinfo/outpatient/del',
      MedicalCheck:'/patmanage/followinfo/outpatient/medicalCheck',


      PlanQuery:'/patmanage/plan/query',
      PlanAdd:'/patmanage/plan/add',
      PlanUpdate:'/patmanage/plan/update',
      PlanDel:'/patmanage/plan/del',
      PlanAddRole:'/patmanage/plan/addRole',
      PlanItemDel:'/patmanage/plan/ItemDel',

      MainQuery:'/sfmanage/main/query',
      MainAdd:'/sfmanage/main/add',


      Visiting:'/SFTASK/statistical/query/',


      MessageQuery:'/sfmanage/message/query',
      MessageAdd:'/sfmanage/message/add',
      MessageUpdate:'/sfmanage/message/update',
      MessageDel:'/sfmanage/message/del',

      ResultQuery:'/sfresult/ResultQuery',
      ResultAdd:'/sfresult/ResultAdd',
      ResultUpdate:'/sfresult/ResultUpdate',
      ResultDel:'/sfresult/ResultDel',


    },
    title: '',
    Token:'',
    ROUTEINFO:'',
  },
  mutations: {
    initMenu(state, menus){
      state.routes = menus;
    },
    login(state, user){
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state){
      window.localStorage.removeItem('user');
      state.routes = [];
    },
    toggleNFDot(state, newValue){
      state.nfDot = newValue;
    },
    updateMsgList(state, newMsgList){
      state.msgList = newMsgList;
    },
    updateCurrentFriend(state, newFriend){
      state.currentFriend = newFriend;
    },
    addValue2DotMap(state, key){
      state.isDotMap.set(key, "您有未读消息")
    },
    removeValueDotMap(state, key){
      state.isDotMap.delete(key);
    }
  },
  actions: {
    connect(context){
      context.state.stomp = Stomp.over(new SockJS("/ws/endpointChat"));
      context.state.stomp.connect({}, frame=> {
        context.state.stomp.subscribe("/user/queue/chat", message=> {
          var msg = JSON.parse(message.body);
          var oldMsg = window.localStorage.getItem(context.state.user.username + "#" + msg.from);
          if (oldMsg == null) {
            oldMsg = [];
            oldMsg.push(msg);
            window.localStorage.setItem(context.state.user.username + "#" + msg.from, JSON.stringify(oldMsg))
          } else {
            var oldMsgJson = JSON.parse(oldMsg);
            oldMsgJson.push(msg);
            window.localStorage.setItem(context.state.user.username + "#" + msg.from, JSON.stringify(oldMsgJson))
          }
          if (msg.from != context.state.currentFriend.username) {
            context.commit("addValue2DotMap", "isDot#" + context.state.user.username + "#" + msg.from);
          }
          //更新msgList
          var oldMsg2 = window.localStorage.getItem(context.state.user.username + "#" + context.state.currentFriend.username);
          if (oldMsg2 == null) {
            context.commit('updateMsgList', []);
          } else {
            context.commit('updateMsgList', JSON.parse(oldMsg2));
          }
        });
        context.state.stomp.subscribe("/topic/nf", message=> {
          context.commit('toggleNFDot', true);
        });
      }, failedMsg=> {

      });
    }
  },
  modules:{
    Flup
  }
});
