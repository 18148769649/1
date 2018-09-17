import  'jquery'
import './reconnecting-websocket.min'

const ws_ip='127.0.0.1';
const ws_port='2015';
let calltel={}
var ws;
var msg_model = function () {
    return{
      Type : -1,
      Data : ""
    }

}

//连接服务器
calltel.connect=function(m) {``
    console.log(1)
  ws = new WebSocket("ws://" + ws_ip + ":" + ws_port);
    console.log(2)
  ws.onopen = function () {

      calltel.Log("连接成功");
    calltel.sendWs(m);
    };
  ws.onclose = function (evt) {
      calltel.Log("连接断开，断线重连");

        setTimeout("reconnect()", 2000);
    };
  ws.onerror = function (evt) {
      calltel.Log("连接服务器失败");
    };

    console.log(3)

    calltel.ws_event(ws);
    console.log(4)

}

//断线重连
calltel.reconnect=function(ws) {

  ws = new ReconnectingWebSocket("ws://" + ws_ip + ":" + ws_port);

    calltel.ws_event(ws);
}

//设置事件
calltel.ws_event=function(ws) {
    ws.onmessage = function (evt) {
        var obj = eval("(" + evt.data + ")");
        switch (obj.Type) {
            case 5:   //收到来电
                /*
                    {
                        "Phone": "87543351",
                        "LocalPhone": "5",
                        "CallType": "callin",
                        "StartTime": "2015-12-08T13:53:49.4692358+08:00",
                        "EndTime": "0001-01-01T00:00:00",
                        "FilePath": null,
                        "EventEndTime": "2015-12-08T13:53:49.4692358+08:00",
                        "Len": 0,
                        "Direction": 0,
                        "StrStartTime": "2015-12-08 13:53:49",
                        "StrEndTime": "0001-01-01 00:00:00",
                        "StrEventEndTime": "2015-12-08 13:53:49"
                    }
                */

                var line = eval("(" + obj.Data + ")");

              calltel.Log("来电号码：" + line.LocalPhone + " _ " + line.Phone);

                break;

            case 6:     //未接来电
                var line = eval("(" + obj.Data + ")");

              calltel.Log("未接来电：" + line.LocalPhone + " _ " + line.Phone);
                break;

            case 7:
                break;

            case 8:     //挂机
                var line = eval("(" + obj.Data + ")");

              calltel.Log("挂机：" + line.LocalPhone + "_" + line.FilePath);
                break;

            case 9:     //摘机
                var line = eval("(" + obj.Data + ")");

              calltel.Log("摘机：" + line.LocalPhone);
                break;

            case 12:     //呼出
                var line = eval("(" + obj.Data + ")");

              calltel.Log("呼出：" + line.LocalPhone + " _ " + line.Phone);
                break;

            case 15:    //拨号结果
                var r = eval("(" + obj.Data + ")");

              calltel.Log("呼出：" + r.Line + "_" + r.Msg);
                break;
        }
    };
}


calltel.call=function(tel) {
    var local_phone = "1";          //通道1
    var remote_phone = tel;

    var m = new msg_model();
    m.Type = 1;
    m.Data = "{\"Param1\":\"" + local_phone + "\",\"Param2\":\"" + remote_phone + "\"}";


    calltel.connect(m)
}

calltel.sendWs=function(obj) {
    console.log(5,ws,obj,calltel.MsgToJson(obj))

    ws.send(calltel.MsgToJson(obj));

    console.log(6)
}

calltel.Log=function(msg) {
    console.log(msg);
    //$("body").append(msg + "</br>");
}

calltel.MsgToJson=function(obj) {
    return "{'Type':'" + obj.Type + "','Data':'" + obj.Data + "'}";
}

export default calltel
