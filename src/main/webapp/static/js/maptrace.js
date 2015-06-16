var mapObj;
var tid = "";
var requestId = "";

function mapInit() {
    $("#mapDiv").width(document.documentElement.clientWidth);
    $("#mapDiv").height(document.documentElement.clientHeight - 40);

	var opt = {
		level : 15,// 初始地图视野级别
		//center : new MMap.LngLat(lon, lat),// 设置地图中心点
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
	if(tid != "") {
		getSvlTask(tid);
		getSvlReportList(tid,0,100);
	} else {
		$("#traceTask").html("<span style='margin-right:5px;color:#a8191d;font-weight:bold;'>无追踪任务信息</span>");
		$("#tracePoint").html("<span style='margin-right:5px;color:#a8191d;font-weight:bold;'>无位置信息</span>");
	}
}

//弹出气泡显示
function showBubble(marker) {
	mapObj.clearInfoWindow();
	var m = new Array();
	m.push(marker);
	marker.inforWindow.open(mapObj, marker.getPosition());
}

function trace(lineArr,markers) {
	//清除地图标记
	mapObj.clearMap();
	if(lineArr.length == 1) {
		//只有一个点的情况下，只标注汽车图标
		marker = new MMap.Marker({ 		  
	        id:"car", 	        
	        position:lineArr[0], 
	        icon:"autonavi/images/car.png", 
	        offset:{x:-26,y:-13} 
	    }); 
		// 在地图上标注汽车图标，起始位置
		mapObj.addOverlays(marker);
		mapObj.panTo(marker.getPosition());
	} else if(lineArr.length > 1) {
		//地图轨迹线路点	
		var polyline = new MMap.Polyline({ 		  
	        id:"polyline01", 
	        path:lineArr,//线经纬度数组 
	        editable:false,//是否可编辑 
	        strokeColor:"#AD4EDC",//线颜色 
	        strokeOpacity:0.8,//线透明度 
	        strokeWeight:6,//线宽 
	        strokeStyle:"solid",//线样式 
	        strokeDasharray:[10,5]//补充线样式 
	    });
		//地图加入轨迹线路
		mapObj.addOverlays(polyline);
		//为每个点绑定click事件
		for(var n=0; n< markers.length; n++) {
			bind(markers[n]);
		}
		//地图加入位置点
		mapObj.addOverlays(markers);
		mapObj.setFitView(markers);
		//汽车图标
		marker = new MMap.Marker({ 		  
	        id:"car", 	        
	        position:lineArr[0], 
	        icon:"autonavi/images/car.png", 
	        offset:{x:-26,y:-13},
	        zIndex : 999
	    }); 
		// 在地图上标注汽车图标，起始位置
		mapObj.addOverlays(marker);
		//按线路移动点
		var speed = 60;//移动速度
		var f = null;//处理函数
		mapObj.bind(marker,"moving",function(e){ 		  
	        /*var lnglat = marker.getPosition();         
	        var bounds = mapObj.getBounds(); 
	        if(lnglat.lng <= bounds.southwest.lng || lnglat.lng>=bounds.northeast.lng || lnglat.lat<=bounds.southwest.lat || lnglat.lat>=bounds.northeast.lat){ 
	            mapObj.panTo(lnglat);
	        }*/
	    });
		marker.moveAlong(lineArr,speed,f,true);
	}
}

//为每个POI点绑定点击事件
function bind(marker) {
	mapObj.bind(marker, "click", function(e) {
		mapObj.clearInfoWindow();
		marker.inforWindow.open(mapObj, marker.getPosition());
	});
}

//根据任务id查询任务
function getSvlTask(tid) {
	var url = "svlAction!getSvlTask.do";
	var pars = {
		tid: tid
	};
	$.post(url, pars, function(data) {
		eval(data);
		var divResult = "";
		if(data) {
			divResult += "";
			divResult += "<span>车牌号：</span><span style='margin-right:5px;color:#a8191d;font-weight:bold;'>" + data.baseTaskVo.userInfoVo.vehicleList[0].carNum + "</span>";
			divResult += "<span>车架号：</span><span style='margin-right:5px;color:#a8191d;font-weight:bold;'>" + data.baseTaskVo.userInfoVo.vehicleList[0].vin + "</span>";
			
			$("#traceTask").html(divResult);
		} else {
			divResult = "<span style='margin-right:5px;color:#a8191d;font-weight:bold;'>查询追踪任务失败</span>";
			$("#traceTask").html(divResult);
		}
	});
}

//查询report记录，分页
function getSvlReportList(tid, currentpage, countperpage) {
	var url = "svlAction!getSvlReportList.do";
	var pars = {
		tid: tid,
		needPositionDesc: false,
        currentpage: currentpage,
        countperpage : countperpage
	};
	$.post(url, pars, function(data) {
		eval(data);
		var divResult = "";
		if (!result.datas || result.datas.length == 0) {
			divResult = "<span style='margin-right:5px;color:#a8191d;font-weight:bold;'>无位置信息</span>";
			$("#tracePoint").html(divResult);
		} else {
			var pageControl = "";			
			pageControl += "<span class=\"fenye1 mr10\" style=\"line-height:10px\">共查出<strong>" + result.total + "</strong>条位置信息<span class=\"mr10\">&nbsp;</span>" +(Number(currentpage)+1) + "/" + (Number(result.totalpage)) + "<span class=\"mr10\">&nbsp;</span>";
			if(currentpage > 0) {							
				pageControl += "<a href=\"javascript:getSvlReportList('" + tid + "',0," + countperpage + ")\">首页</a>    ";
			} else {
				pageControl += "首页&nbsp;&nbsp;";
			}
			if(result.totalpage > 0 && currentpage > 0) {
				pageControl += "<a href=\"javascript:getSvlReportList('" + tid + "'," + (Number(currentpage)-1)+ "," + countperpage + ")\">上一页</a>    ";
			} else {
				pageControl += "上一页&nbsp;&nbsp;";
			}
			if(result.totalpage > 0 && currentpage < (result.totalpage -1)) {
				pageControl += "<a href=\"javascript:getSvlReportList('" + tid + "'," + (Number(currentpage)+1) + "," + countperpage + ")\">下一页</a>    ";
			} else {
				pageControl += "下一页&nbsp;&nbsp;";
			}
			if(result.totalpage > 0 && currentpage < (result.totalpage -1)) {
				pageControl += "<a href=\"javascript:getSvlReportList('" + tid + "'," + (result.totalpage-1) + "," + countperpage + ")\">末页</a>";
			} else {
				pageControl += "末页";
			}
			pageControl += "&nbsp;&nbsp;&nbsp;";
			pageControl += "<select name=dl onchange=\"getSvlReportList('" + tid + "'," + "this.options[this.options.selectedIndex].value," + countperpage + ")\">";
			for(var i=0;i<result.totalpage;i++){
				if(i==currentpage){
					pageControl += "<option value="+i+" selected>"+(i+1)+"页</option>";
				} else {
					pageControl += "<option value="+i+">"+(i+1)+"页</option>";
				}
			}
			pageControl += "</select>";
			pageControl += "</span>";
			pageControl += "</p>";

			divResult += pageControl;
			$("#tracePoint").html(divResult);
			
			var lineArr = new Array(); //线经纬度数组
			var markers = new Array(); //地图位置点数据
			var n = 1;
			for(var i = result.datas.length -1;i >= 0;i--) {
				var icon = "autonavi/images/smp_icon_flag.gif";
				var zIndex = n;
				if(i == (result.datas.length -1)) {
					//第一个点为起点
					icon = "autonavi/images/trans_icons_start.png";
					zIndex = 100;
				} else if(i == 0) {
					//最后一个点
					icon = "autonavi/images/trans_icons_end.png";
					zIndex = 100;
				}
				n ++;
				var lngLat = new MMap.LngLat(result.datas[i].lon,result.datas[i].lat);
				if(i > 0 && lineArr.length > 0 && lineArr[lineArr.length-1].lng == lngLat.lng && lineArr[lineArr.length-1].lat == lngLat.lat) {
					// i>0表示最后一个点需要加入
					//比较这个点是否和之前的点一样，如果一样，不添加
					continue;
				} else {
					lineArr.push(lngLat);
				}
				//地图标注点
				var marker = new MMap.Marker({
					id : n,
					position : new MMap.LngLat(result.datas[i].lon,result.datas[i].lat),						
					icon : icon,
					offset : new MMap.Pixel(-10,-20),
					draggable : false, 
					visible : true,
					zIndex : zIndex
				});
				//每个点的弹出窗口
				var tipContent = "<p>追踪时间：" + result.datas[i].timestamp + "</p>";
				tipContent += "<p>速度：" + result.datas[i].speed + "</p>";
				tipContent += "<p>方向：" + getDirectionDesc(result.datas[i].direction) + "</p>";
				tipContent += "<p>车辆状态：";
				if(result.datas[i].lgnition == 1) {
					tipContent += "点火";
				} else if(result.datas[i].lgnition == 2) {
					tipContent += "熄火";
				} else {
					tipContent += "未知";
				}
				tipContent += "</p>";
				var inforWindow = new MMap.InfoWindow({
					content : tipContent,
					autoMove : true,
					offset : new MMap.Pixel(-110,-82)
				});
				marker.inforWindow = inforWindow;					
				markers.push(marker);
				//每个点绑定click事件
				mapObj.bind(marker, "click", function(e) {
					showBubble(marker);
				});
			}
			if(lineArr.length > 1) {
				//最少两个点，需要看最后一个点和前一个点坐标是否一样，如果一样的话，需要删除前一个点
				if(lineArr[lineArr.length -1].lng == lineArr[lineArr.length -2].lng && lineArr[lineArr.length -1].lat == lineArr[lineArr.length -2].lat) {
					markers[lineArr.length -2] = markers[lineArr.length -1];
					markers.pop();
					lineArr.pop();
				}
			}
			trace(lineArr,markers);
		}
	});
}

//地图窗口大小自适应
$(window).resize(function(){
	if(mapObj) {
		$('#mapDiv').width(document.documentElement.clientWidth);
	    $('#mapDiv').height(document.documentElement.clientHeight - 40);	    
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
	if(params["tid"] != undefined && params["tid"] != "") {
		tid = params["tid"];
	}
	if(params["requestId"] != undefined && params["requestId"] != "") {
		requestId = params["requestId"];
	}
	mapInit();
});
