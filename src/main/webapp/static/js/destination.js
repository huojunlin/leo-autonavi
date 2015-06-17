var workNumber = "";
function sendWhither(){
	var whither_count = 0;//目的地数量
	var waypoint_count = 0;//途经点数量
	for(var i = 0 ; i < _resultList.length ; i++){
		if(_resultList[i].poiType == 1){
			whither_count++;
		} else { 
			waypoint_count++;
		}
	}
	if(whither_count < 1){
		alert("至少设置一个目的地");
		return;
	}
	if(whither_count > 1 && waypoint_count > 0){
		alert("设置多个目的地时不能设置途经点");
		return;
	}
	if(whither_count = 1 && waypoint_count > 0 && _resultList[_resultList.length-1].poiType != 1){
		alert("目的地必须在最后");
		return;
	}
	
	var url = 'sendWhither.do';
	var pars = {
		workNumber : workNumber
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			if(data) {
				if(data.error != ""){
					alert(data.error);
				} else {
					var serviceContent = "";
					for(var i = 0 ; i < data.resultList.length ; i++ ){
						serviceContent += "将" + data.resultList[i].pname;
						serviceContent += "设为" + (data.resultList[i].poiType == 0 ? "途经点" : "目的地");
						serviceContent += "，";
					}
					serviceContent += "成功";
					window.opener.parent[4].setServiceContent(serviceContent);
					alert("发送成功");
					window.close();
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("目的地设置错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}

function showList(poiList){
	var listStr = "";
	if(poiList.length == 0){
		listStr += "<tr><td colspan=\"5\" style=\"background:#ffffff\">没有目的地信息</td>";
	}
	for(var i = 0 ; i < poiList.length ; i++){
		listStr += "<tr><td>" + (i+1) + "</td>";
		listStr += "<td title=\"" + poiList[i].province + "-" + poiList[i].city + "\">" + poiList[i].city + "</td>";
		listStr += "<td style=\"text-align:left;\" title=\"" + poiList[i].address + "\">" + poiList[i].pname + "</td>";
		listStr += "<td><span style=\"color:red\" title=\"点击设置为途经点\">目的地</span></td>";
/*		listStr += "<td>" + (poiList[i].poiType==1?
				"<a href=\"javascript:setPoiType(" + i + ", 0)\"><span style=\"color:red\" title=\"点击设置为途经点\">目的地</span></a>":
				"<a href=\"javascript:setPoiType(" + i + ", 1)\"><span style=\"color:green\" title=\"点击设置为目的地\">途经点</span></a>") + "</td>";*/
		/*listStr += "<td><img class=\"button\" src=\"../autonavi/images/tsp_cc_px01.gif\" title=\"移至首位\" onclick=\"javascript:up_top(" + i + ");\"/>&nbsp;";
		listStr += "<img class=\"button\" src=\"../autonavi/images/tsp_cc_px02.gif\" title=\"上移一位\" onclick=\"javascript:up(" + i + ");\"/>&nbsp;";
		listStr += "<img class=\"button\" src=\"../autonavi/images/tsp_cc_px03.gif\" title=\"下移一位\" onclick=\"javascript:down(" + i + ");\"/>&nbsp;";
		listStr += "<img class=\"button\" src=\"../autonavi/images/tsp_cc_px04.gif\" title=\"移至末位\" onclick=\"javascript:down_bottom(" + i + ");\"/>&nbsp;&nbsp;";*/
		listStr += "<td><a href=\"javascript:deletePoi(" + i + ");\">删除</a></td></tr>";
	}
	$("#resultList").html(listStr);
}


function down(i){
	changePoiList(i, 2);
}

function down_bottom(i){
	changePoiList(i, 3);
}

function up(i){
	changePoiList(i, 1);
}

function up_top(i){
	changePoiList(i, 0);
}

// 改变目的地顺序，action:0设置为第一个，1向上移动，2向下移动，3设置为最后一个
function changePoiList(i, action){
	var url = 'changePoiList.do';
	var pars = {rn : i, action : action};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			if(data) {
				if(data.error != ""){
					alert(data.error);
				} else {
					try{
						_resultList = data.resultList;
						showList(data.resultList);
					} catch(e) {
						alert("操作目的地异常");
					}
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("操作目的地错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}

// 获取目的地列表
function getPoi(){
	var url = 'getPoi.do';
	var pars = {};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			if(data) {
				try{
					_resultList = data.resultList;
					showList(data.resultList);
				} catch(e) {
					alert("获取目的地异常");
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("获取目的地错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}

function deletePoi(i){
	var url = 'deletePoi.do';
	var pars = {rn : i};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			if(data) {
				if(data.error != ""){
					alert(data.error);
				} else {
					try{
						_resultList = data.resultList;
						showList(data.resultList);
					} catch(e) {
						alert("删除目的地异常");
					}
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("删除目的地错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}


//设置目的地类别，poiType，0目的地，1途经点
function setPoiType(i, poiType){
	var url = 'setPoiType.do';
	var pars = {rn : i, poiType : poiType};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			if(data) {
				if(data.error != ""){
					alert(data.error);
				} else {
					try{
						_resultList = data.resultList;
						showList(data.resultList);
					} catch(e) {
						alert("修改目的地类型异常");
					}
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("修改目的地类型错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}


function isEmpty(str){
	return (str==null || typeof str=="undefined" || str=="" || str =="null" || str=="undefined");
}

$(document).ready(function(){
	//try {workNumber = opener.parent.getAgentID();} catch(e) {}
	getPoi();
	$("#sendPoi").bind("click", function(){
		sendWhither();
	});
}); 
