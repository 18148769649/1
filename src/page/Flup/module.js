const state = {
  userinfo: [

  ],
  EntityDetail:[{
    label:''
  }],//模板详情列表
  followinfo:[] ,// 模板列表
  ItemDetail:[{

  }],
  QuestionDetail:[{

  }],
  PlanList:[{

  }],//计划列表
  PlanSonList:[{

  }],//子规则列表
  EntityList:[{
    ETYPE:'',//随访类型
    ENAME:'',//随访名称
    ECODE:'',//随访代码
    EDES:'',//随访描述
    ORDROWID:'',//随访计划ordrowid
    ECREATER:'',//随访计划创建人ID
    CREATETIME:"",//随访计划最后更新时间
  }],
  panelobject: {
    visittype:'',
    uselistshow :false,//控制角色管理列表展示与否
    editordialog: false,//编辑模态框
    deletedialog: false,//删除模态框
    deletestatus:false,//删除状态
    pagenums:0,//当前页面总数
    datanums:0,//数据总数
    nowpagenum:1,//当前页面数
    pageszie:10,
    mubanTitle:'',//当前模板名
    mubanID:'',
    AutoStatus:false,
    newOrUpdate:false,
    flupeditstatus:true  //表示当前flupedit模板状态 是否允许编辑
  },
  patinfo:{
  }, //存储单个病人信息
  patlist:[{

  }],// 选择的病人列表
  thisPat:[{

  }] ,//当前选中病人
  Medicalinfo:[{

  }] ,//病人病历信息
  MainForRole:[{

  }],//当前随访计划
  mubanTemplate:[{

  }],
  sfData:{

  } ,// 存放 medicalinfo 中模态框数据
  Statistical:[

  ], //存放执行计划数据
  SFNextData:{},//下次随访计划数据
  Message:[

  ]
}

const mutations = {
  ['setuseinfo'] (state, data) {

  },
}

const actions = {

}

export default {
  namespaced: true,
  state,

}
