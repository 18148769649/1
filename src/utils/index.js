import  $ from  'jquery'
let commonutils = {
  pickerOptions2: {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  },//时间选择器快捷选项
  TestParam:'测试参数调用成功' //函数调用是否成功
}
// -------------测试调用----------------------------------
commonutils.TestFunction=function () {
  console.log("测试函数调用成功");
} ; // 测试函数调用是否成功


//--------------ajax--------------------------------------
commonutils.post = function (options) {
  options.method = 'POST'
  options.url =  options.url
  return Request(options)
};
commonutils.get = function (options) {
  options.method = 'GET'
  options.url =  options.url
  return Request(options)
};
commonutils.put = function (options) {
  options.method = 'PUT'
  options.url = options.url
  return Request(options)
};
commonutils.del = function (options) {
  options.method = 'DELETE'
  options.url =  options.url
  return Request(options)
};
const Request = function (options) {

  let newDef = $.Deferred()
  /**
   * @url：请求的接口地址
   * @method: 请求方式（GET/POST/PUT/DELETE）
   * @param: 请求参数{key:val} (id:'11',name:'name')
   * @headers: 请求的headers{key:val} (token:aabbccdd)
   * @useCache: 缓存（针对GET方式）
   * @skipValidation：跳过验证
   */
  let url = options.url
  let method = options.method
  let param = options.data || true
  let useCache = options.cache || true
  let skipValidation = options.skipValidation || true
  if (method !== "GET") {
    param = (typeof param === "string") ? param : JSON.stringify(param)
  }

  $.ajax({
    url: url,
    type: method.toUpperCase(),
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    headers: {
      //     // 跨域请求 这个配置不能少
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      'Accept': 'application/json'
    },
    data: param,
    cache: !!useCache,
    success: function (data) {
      if (skipValidation) {
        newDef.resolve(data)
      } else if (handleApiResponseStatus(url, data)) {
        newDef.resolve(data)
      }
    },
    error: function (request, textStatus) {
      handleHttpResponseStatus(url, request.status)
    }
  });
  /**
   * 处理接口响应状态
   */
  function handleApiResponseStatus(url, data){
    console.info('handle Api Response Status Error')
    if (!data || (!data.codeText)) {
      console.error(url, data)
      return false
    }

    if (data.codeText == "RESULT_LOGIN_EXPIRED") {
      console.info('哎呦喂！登陆超时')
      return false
    } else if (data.codeText == "RESULT_NEED_ADVANCE_AUTH") {
      console.info('哎呦喂！登陆超时,重新登陆')
    } else if (data.codeText == "RESULT_NEED_BINDPHONE") {

      return true
    } else if (data.codeText == "FORBIDDEN") {
      console.info('哎呦喂！权限验证失败')
      return false
    }

    return true
  }

  /**
   * 处理HTTP相应状态
   */
  function handleHttpResponseStatus(url, status) {
    //console.info('handle Http Response Status Error：' + status)
    let statu = Number(status)
    if (statu == 404) {
      console.info('我找不到页面,请联系网络管理员')
    } else if (statu >= 500) {
      console.info('服务器异常,请联系系统管理员')
    } else {
      console.info('网络出现异常,请联系网络管理员')
    }
  }

  return newDef.promise()

}



//--------------------时间格式化--------------------------
commonutils.formatDateTime=function(inputTime) {
  var date = inputTime;
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
} ; //格式化时间


// --------------直接转换elementtimepicker时间为数组
commonutils.formatPickerTime=function (val) {
  let tempdata = [
  ]
  tempdata[0] = this.formatDateTime(val[0])
  tempdata[1] = this.formatDateTime(val[1])
  return tempdata
}

// ----------------------获得时间相差天数 周数-------------------------
commonutils.GetTDOA =function (val,method) {
  let s1=val[0]
  let s2=val[1]
  s1=new Date(s1)
  s2=new Date(s2)
  let TDOA=0
   if (method == 'week'){
    TDOA=parseInt((s2.getTime()-s1.getTime())/(1000*60*60*24*7))
  } else if (method == 'year'){
    TDOA=parseInt((s2.getTime()-s1.getTime())/(1000*60*60*24*365))
  } else  if (method == undefined){
    TDOA=parseInt((s2.getTime()-s1.getTime())/(1000*60*60*24))
  }


  return TDOA
}

// -----------------------遍历时间--------------------------------------
const UtilsformatDate=function (val){

  var s='';
  s+=val.getFullYear()+'-'; // 获取年份。
  if(val.getMonth() >= 10){
    s+=(val.getMonth()+1)+"-";
  } else {
    s+= '0'+(val.getMonth()+1)+"-";
  }
          // 获取月份。
  if(val.getDate() >= 10){
    s+= val.getDate();
  }else {
    s+= '0'+(val.getDate());
  }
  return(s);                          // 返回日期。
};

//按日查询
commonutils.getDayAll=function(inputTime){
  var dateAllArr = new Array();
  var ab = inputTime[0].slice(0,10).split("-");
  var ae = inputTime[1].slice(0,10).split("-");
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
  var unixDb=db.getTime();
  var unixDe=de.getTime();
  for(var k=unixDb;k<=unixDe;){
    dateAllArr.push(UtilsformatDate(new Date(parseInt(k))).toString());
    k=k+24*60*60*1000;
  }
  return dateAllArr;
}

//按周查询
commonutils.getWeekAll=function(inputTime){
  var dateAllArr = new Array();
  var ab = inputTime[0].slice(0,10).split("-");
  var ae = inputTime[1].slice(0,10).split("-");
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
  var unixDb=db.getTime();
  var unixDe=de.getTime();
  for(var k=unixDb;k<=unixDe;){
    dateAllArr.push(UtilsformatDate(new Date(parseInt(k))).toString());
    k=k+7*24*60*60*1000;
  }
  return dateAllArr;
}

commonutils.getMonthAll=function(inputTime) {
  var d1 = inputTime[0];
  var d2 = inputTime[1];
  var dateArry = new Array();
  var s1 = d1.slice(0,10).split("-");
  var s2 = d2.slice(0,10).split("-");
  var mCount = 0;
  if (parseInt(s1[0]) < parseInt(s2[0])) {
    mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1])+1;
  } else {
    mCount = parseInt(s2[1]) - parseInt(s1[1])+1;
  }
  if (mCount > 0) {
    var startM = parseInt(s1[1]);
    var startY = parseInt(s1[0]);
    for (var i = 0; i < mCount; i++) {
      if (startM < 12) {
        dateArry[i] = startY + "-" + (startM>9 ? startM : "0" + startM);
        startM += 1;
      } else {
        dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
        startM = 1;
        startY += 1;
      }
    }
  }
  return dateArry;
}

commonutils.getYearAll=function(inputTime) {
  var d1 = inputTime[0];
  var d2 = inputTime[1];
  var dateArry = new Array();
  var s1 = d1.slice(0,10).split("-");
  var s2 = d2.slice(0,10).split("-");
  var mYearCount = parseInt(s2[0]) - parseInt(s1[0])+1;
  var startY = parseInt(s1[0]);
  for (var i = 0; i < mYearCount;i++) {
    dateArry[i] = startY;
    startY += 1;
  }
  return dateArry;
}

// ---------------------- 颜色-------------------------------------


//生成16位颜色代码


commonutils.getColor=function(){
  //定义字符串变量colorValue存放可以构成十六进制颜色值的值
  var colorValue="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
  //以","为分隔符，将colorValue字符串分割为字符数组["0","1",...,"f"]
  var colorArray = colorValue.split(",");
  var color="#";//定义一个存放十六进制颜色值的字符串变量，先将#存放进去
  //使用for循环语句生成剩余的六位十六进制值
  for(var i=0;i<6;i++){
    //colorArray[Math.floor(Math.random()*16)]随机取出
    // 由16个元素组成的colorArray的某一个值，然后将其加在color中，
    //字符串相加后，得出的仍是字符串
    color+=colorArray[Math.floor(Math.random()*16)];
  }
  return color;
}
// options.url = vue.SERVER_NAME + vue.API_PREFIX + options.url



//----------------------el-table 过滤器----------------------------

//返回状态
commonutils.statusfilter=function( row, column,d) {
  if (d == true) {
    return '启用'
  } else  {
    return '不启用'
  }

}


export default commonutils
