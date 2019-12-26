
import store from '../store.js';
import {messageErr} from '@/plugins/statusCode.js'
var websock = null;
var global_callback = null;
 
 
function initWebSocket(){ //初始化weosocket
    //ws地址
    var wsuri = "ws://172.172.172.99:8080/websocket";
    websock = new WebSocket(wsuri);
    websock.onmessage = function(e){
        websocketonmessage(e);
    } 
    websock.onclose = function(e){
        websocketclose(e);
    }
    websock.onopen = function () {
        websocketOpen();
	}
    
    //连接发生错误的回调方法
	websock.onerror = function () {
        console.log("WebSocket连接发生错误");
	}
}
 
// 实际调用的方法
function sendSock(agentData,callback){
    if(callback){
        global_callback = callback
    }  
    let data
    if(agentData.FAction === 'Login'){
        data = agentData
    }else{
        data = Object.assign({
            FTokenID:sessionStorage.getItem('FToken'),
            ProjectID:sessionStorage.getItem('projectID')||58,
            FVersion:'1.0.0'
        },agentData)
    }
    console.log(JSON.stringify(data));
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websocketsend(data)
    }else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(data,callback);
        }, 1000);
    }else {
        // 若未开启 ，则等待1s后重新调用
        initWebSocket();
        setTimeout(function () {
            sendSock(data,callback);
        }, 1000);
    }
}
 
//数据接收
function websocketonmessage(e){ 
    let data = JSON.parse(e.data)
    if(data.Result !=200){
        messageErr(data.Result,data.Message)
    }
    global_callback(data);
}
 
//数据发送
function websocketsend(agentData){
    websock.send(JSON.stringify(agentData));
}
function closeSocket(){
    websock.close()
}
//关闭
function websocketclose(e){  
    console.log("connection closed (" + e.code + ")");
}
function websocketOpen(e){
	console.log("连接成功");
}
initWebSocket()
export{sendSock,closeSocket,initWebSocket,websock}