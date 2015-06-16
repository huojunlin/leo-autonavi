var mapObj;
var lon = "";
var lat = "";
var name = "";
var address = "";
var tel = "";
var marker;
function mapInit(lon,lat) {
    $("#mapDiv").width(document.documentElement.clientWidth);
    $("#mapDiv").height(document.documentElement.clientHeight);

	var opt = {
		level : 15,// 初始地图视野级别
		center : new MMap.LngLat(lon, lat),// 设置地图中心点
		doubleClickZoom : true,// 双击放大地图
		scrollwheel : true// 鼠标滚轮缩放地图
	};
	mapObj = new MMap.Map("mapDiv", opt);
	mapObj.plugin([ "MMap.ToolBar", "MMap.OverView", "MMap.Scale", 'MMap.MouseTool' ],
		function() {
			toolbar = new MMap.ToolBar();
			toolbar.autoPosition = false; // 加载工具条
			mapObj.addControl(toolbar);
			overview = new MMap.OverView(); // 加载鹰眼
			mapObj.addControl(overview);
			scale = new MMap.Scale(); // 加载比例尺
			mapObj.addControl(scale);
			mouseTool = new MMap.MouseTool(mapObj);// 鼠标工具
	});
	if(lon != "" && lat != "") {
		addMarker(lon,lat);
	}
}

function addMarker(lon,lat) { 
	marker = new MMap.Marker({                    
		id:"m_id", //marker id                    
		position:new MMap.LngLat(lon,lat), //位置  
		icon:"autonavi/images/car.gif",//图片 
		offset:new MMap.Pixel(-16,-18), //基点为图片左上角，设置相对基点的图片位置偏移量，向左向下为负 
		draggable:false, //可拖动  
		visible:true,//可见 
		zIndex:1//设置点叠加顺序，在加载多个点有效果，详见设置点叠加顺序示例 
	}); 
	
	mapObj.addOverlays(marker);
	mapObj.bind(marker,"click",function(e){
		openInfoWindow();
	});
	openInfoWindow();
} 

function openInfoWindow(){
	var content = "";
	var infor = new MMap.InfoWindow({
		content: content,
		isCustom : true,
		autoMove : true,
		size : new MMap.Size(250, 150),
		offset : new MMap.Pixel(-135,-195),
	});
	var url = 'autoNaviAction!getDesc.do';
	var pars = {
		longitude : lon,
		latitude : lat
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		success : function(_data, textStatus) {
			eval(_data);
			if(typeof data != "undefined"){
				address = data.desc;
			} else {
				address = "查询位置描述错误！";
			}
			infor.setContent("<div width=\"250px\" height=\"150px\" style=\"box-shadow: 2px 8px 14px 0 #828E9A;border:1px solid gray;background:white\">" +
			"<table id=\"pagetab\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"width:248px;height:148px;\">" +
			"<thead><tr><td style=\"height:auto;vertical-align: top;height:30%;margin: 5px\">" +
			"<div class=\"iw_poi_title\"  style=\"float: right;padding: 7px;height: 16px;line-height: 16px;\">" +
			"<span class=\"btn_close\" id=\"close\" title=\"关闭气泡\">" + 
			"<img src=\"autonavi/images/remove.png\" onclick=\"javascript:mapObj.clearInfoWindow();\"/></span></div>" +
			"<div class=\"iw_poi_title\"><span id=\"poiname\" style=\"font-weight: bold\">车辆位置</span></div>" + 
			"<div id=\"addressInfo\" style=\"margin: 5px\"><span>位置描述：</span><span id=\"address\">" + address + "</span><br/></div></td></tr></thead></table></div>" + 
			"<img src=\"autonavi/images/iw_tail.png\" style=\"z-index: 1;position:relative;left:130px;\"/>");
			infor.open(mapObj,marker.getPosition());	
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("目的地设置错误，请联系管理员");
		}
	});
}

//地图窗口大小自适应
$(window).resize(function(){
	if(mapObj) {
		$('#mapDiv').width(document.documentElement.clientWidth);
	    $('#mapDiv').height(document.documentElement.clientHeight);	    
	}
});

//从url中获取参数
function getParams() {
	var params = {classNames: []};
	var sParam = '';
	if (window.location.search.substr(0, 1) == '?') {
		sParam = window.location.search.substr(1);
		var pairs = sParam.match(/^\??(.*)$/)[1].split('&');
		for(var i=0;i<pairs.length;i++) {
			var pair  = pairs[i].split('=');
			var value = pair[1] ? decodeURIComponent(pair[1]) : undefined;
			params[decodeURIComponent(pair[0])] = value;            
		}
	}
    return params;
}

$(document).ready(function() {
	//从url中获取参数
	var params = getParams();
	if(params["longitude"] != undefined && params["longitude"] != "") {
		lon = params["longitude"];
	}
	if(params["latitude"] != undefined && params["latitude"] != "") {
		lat = params["latitude"];
	}
	if(params["name"] != undefined && params["name"] != "") {
		name = params["name"];
	}
	if(params["address"] != undefined && params["address"] != "") {
		address = params["address"];
	}
	if(params["tel"] != undefined && params["tel"] != "") {
		tel = params["tel"];
	}
	mapInit(lon,lat);
});
