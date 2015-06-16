var workNumber = "";
var mouseTool = null;
var cenpoi = null; // 周边查询中心点
var carpoi = null; // 车辆当前位置点
var mappois = new Array();
var markers = new Array();
var searchRectangleMode = false;
var destinationPois = new Array();//目的地、途经点
var destinationWindow;
var circle = null;
var inforWindow = null;
var carWindow = null;
var centerWindow = null;
var isNear = false; // 是否周边查询
var isClicked = 11; // POI点击次数，默认为每页显示次数+1
//查询结果显示提示
var tipLoading = "<table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"2\" height=\"100%\"><tr><td bgcolor=\"F2F3F8\"><div align=\"center\"><image src=\"images/loading.gif\"><font color=\"#0000FF\">查询中...</font></div></td></tr></table>";
var tipFail = "<table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"2\" height=\"100%\"><tr><td bgcolor=\"F2F3F8\"><div align=\"center\"><font color=\"#0000FF\">查询出错!</font></div></td></tr></table>";
var tipNoResult = "<table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"2\" height=\"100%\"><tr><td bgcolor=\"F2F3F8\"><div align=\"center\"><font color=\"#0000FF\">无搜索结果!</font></div></td></tr></table>";

//初始化地图
function mapInit() {
	initPoiCategory("type");

	if (searchCity != "") {
		$("#city").val(searchCity);
		searchCityByAdcode();
	}
	if (searchType != "") {
		$("#type").val(searchType);
	}
	$("#key").val(searchKey);

    $("#mapDiv").width(document.documentElement.clientWidth-310);
    $("#mapDiv").height(document.documentElement.clientHeight-36);

	var opt = {
		level : 13,// 初始地图视野级别
		doubleClickZoom : true,// 双击放大地图
		scrollwheel : true// 鼠标滚轮缩放地图
	};
	mapObj = new MMap.Map("mapDiv", opt);
	mapObj.plugin([ "MMap.ToolBar", "MMap.OverView", "MMap.Scale", 'MMap.MouseTool' ],
			function() {
				toolbar = new MMap.ToolBar();
				toolbar.autoPosition = false; // 加载工具条
				mapObj.	addControl(toolbar);
				overview = new MMap.OverView(); // 加载鹰眼
				mapObj.addControl(overview);
				scale = new MMap.Scale(); // 加载比例尺
				mapObj.addControl(scale);
				mouseTool = new MMap.MouseTool(mapObj);// 鼠标工具
			});

	var city = $("#city").val();
	var key = $("#key").val();
	var type = $("#type").val();
	var longitude = $("#longitude").val();
	var latitude = $("#latitude").val();
	var language = "zh";
	if(key != "" || type != "") {
		searchPoiList(city, key, type, language, 0, 10);	
	} 
    if(longitude != "" && latitude != ""){
    	var openFlag = $("#openFlag").val();
		carpoi = {id:"m_car",name:"当前位置",address:"",tel:"",areacode:"",adcode:"",city:"",longitude:longitude,latitude:latitude,type:"",typecode:"",provincename:"",provincecode:"",cityname:"",citycode:"",districtname:"",districtcode:"",image:"images/car.gif"};
		mapReady();
		if(openFlag == 'true') {
			setTimeout(function(){
				carWindow.open(mapObj,carMar.getPosition());	
			}, 2000);
		}
	}
}

//在地图上显示POI点
function mapReady() {
	mapObj.clearInfoWindow();
	mapObj.clearOverlays();
	if(arguments.length == 4 && arguments[0] == "near") {
		// 显示直径范围
		var longitude = arguments[1];
		var latitude = arguments[2];
		var range = arguments[3];
		//构造圆对象 
        circle = new MMap.Circle({  
            id:"circle", //id 
            center:new MMap.LngLat(longitude,latitude),// 圆心 
            radius:range, //半径 
            strokeColor: "#F33", //线颜色 
            strokeOpacity: 1, //线透明度 
            strokeWeight: 3, //线粗细度 
            fillColor: "#ee2200", //填充颜色 
            fillOpacity: 0.35 //填充透明度 
        });  

        mapObj.addOverlays(circle); 
	} 
	if(circle != null) {
		mapObj.addOverlays(circle); 
	}
	mapobjShowPois(mappois);
}

// 重置覆盖物（poi）
function resetOverlays(){
	// 恢复列表原始样式
	isClicked = 11;
	$("[id^=container_]").css("background-color", "#fff");
	$("[id^=container_]").css("border", "1px solid #fff");
	$("[id^=sendPoi_]").css("background", "#F7F8F9");
	$("[id^=sendPoi_]").css("color", "#A4A4A4");
	if(markers != null && markers.length > 0) {
		for(var i = 0; i < markers.length; i++) {
			$("#rst_" + i).css("background-position", (-24 - 22 * i) + "px -39px");
		}
	}
	mapReady();
}

//在地图上显示一组点和中心点
function mapobjShowPois(pois) {
	if(cenpoi != null && carpoi != null && cenpoi.longitude == carpoi.longitude && cenpoi.latitude == carpoi.latitude) {
		cenpoi = null;
	}
	if (cenpoi != null) {
		centerMar = new MMap.Marker({ 					 
			   id:"m_center", //marker id
			   cursor : "cursor:pointer",
			   position:new MMap.LngLat(cenpoi.longitude,cenpoi.latitude), //位置 
			   icon:cenpoi.image,//图片
			   offset:new MMap.Pixel(-16,-18), //基点为图片左上角，设置相对基点的图片位置偏移量，向左向下为负
			   draggable:false, //可拖动 
			   visible:true,//可见
			   zIndex:1//设置点叠加顺序，在加载多个点有效果，详见设置点叠加顺序示例
		}); 
		mapObj.addOverlays(centerMar);
		centerWindow = new MMap.InfoWindow({
			id:"m_center",
			isCustom : true,
			content : getTipContent(cenpoi),
			autoMove : true,
			offset : new MMap.Pixel(-140,-280)
		});
		centerMar.inforWindow = centerWindow;
		mapObj.bind(centerMar,"click",function(e){
			centerWindow.open(mapObj,centerMar.getPosition());	
		});
	} 
	if(carpoi != null) {
		carMar = new MMap.Marker({ 					 
			   id:"m_car", //marker id
			   cursor : "cursor:pointer",
			   position: new MMap.LngLat(carpoi.longitude,carpoi.latitude), //位置 
			   icon: carpoi.image,//图片
			   offset : new MMap.Pixel(-16,-18), //基点为图片左上角，设置相对基点的图片位置偏移量，向左向下为负
			   draggable : false, //可拖动 
			   visible : true,//可见
			   zIndex : 1//设置点叠加顺序，在加载多个点有效果，详见设置点叠加顺序示例
		}); 
		mapObj.addOverlays(carMar);
		carWindow = new MMap.InfoWindow({
			id : "m_car",
			isCustom : true,
			content : getTipContent(carpoi),
			autoMove : true,
			offset : new MMap.Pixel(-135,-288)
		});
		carMar.inforWindow = carWindow;
		mapObj.bind(carMar, "click", function(e){
			carWindow.open(mapObj, carMar.getPosition());	
		});
	}
	//将所有的点都在地图上显示出来
	showMarkers(pois, cenpoi, carpoi);
}

//地址描述信息
function getTipContent(poi) {
	pv = "{id:'" + poi.id + "',name:'" + poi.name + "',address:'" + poi.address + "',tel:'" + poi.tel + "',areacode:'" + poi.areacode + "',adcode:'" + poi.adcode + "',longitude:'" + poi.longitude + "',latitude:'" + poi.latitude + "',type:'" + poi.type + "',typecode:'" + poi.typecode + "',provincename:'" + poi.provincename + "',provincecode:'" + poi.provincecode + "',cityname:'" + poi.cityname + "',citycode:'" + poi.citycode + "',districtname:'" + poi.districtname + "',districtcode:'" + poi.districtcode + "'}";
	var tipUrl = "tip.html?pv=" + encodeURIComponent(encodeURIComponent(pv));
	var tipContent = "<iframe width=\"384px\" height=\"240px\" frameborder=\"0\" scrolling=\"no\" src=\""
			+ tipUrl + "\" style=\"box-shadow: 2px 8px 14px 0 #828E9A;\"></iframe><img src=\"images/iw_tail.png\" style=\"z-index: 1;position:relative;left:130px;\"/>";
	return tipContent;
}

//将所有的点都在地图上显示出来
function showMarkers(pois, cenpoi, carpoi) {
	markers = new Array();
	for ( var i = 0; i < pois.length; i++) {
		
		var opt ={}; 
		opt.image = "images/poi.png"; 
		opt.size = new MMap.Size(20, 26); 
		opt.imageOffset = new MMap.Pixel(-24 - (22 * i), -39); 
		icon = new MMap.Icon(opt);//构造自定义MMap.Icon对象
		
		markers[i] = new MMap.Marker({
			id : pois[i].id, // marker id
			cursor : "cursor:pointer",
			position : new MMap.LngLat(pois[i].longitude, pois[i].latitude), // 位置
			icon : new MMap.Icon(opt),//构造自定义MMap.Icon对象
			draggable : false, //可拖动 
			visible : true,//可见
			offset : new MMap.Pixel(-11 ,-26), //基点为图片左上角，设置相对基点的图片位置偏移量，向左向下为负
			zIndex : i	//设置点叠加顺序，在加载多个点有效果，详见设置点叠加顺序示例
		});
		inforWindow = new MMap.InfoWindow({
			id:pois[i].id,
			isCustom : true,
			content : getTipContent(pois[i]),
			autoMove : true,
			offset : new MMap.Pixel(-130,-296)
		});
		markers[i].inforWindow = inforWindow;
		//为每个POI点绑定点击事件
		bind(markers[i]);
	}
	mapObj.addOverlays(markers, false);
	if(markers.length > 0) {
		mapObj.setFitView(markers);
		if(cenpoi == null && carpoi == null && markers.length == 1) {
			// 地图显示级别显示成最大，弹出窗口
			showBubble(markers[0]);
		}
	} else {
		if (cenpoi != null) {
			mapObj.setCenter(new MMap.LngLat(cenpoi.longitude, cenpoi.latitude));//设置地图的中心点
		}
		if(carpoi != null) {
			mapObj.setCenter(new MMap.LngLat(carpoi.longitude, carpoi.latitude));//设置地图的中心点
		}
	}
	if(circle != null) {
		mapObj.setFitView([circle]); 
	}
}

//为每个POI点绑定事件
function bind(marker) {
	// 绑定点击事件
	mapObj.bind(marker, "click", function(e) {
		showBubble(marker);
		// 右侧列表样式控制
		var zindex = marker.zIndex;
		marker.icon.imageOffset = new MMap.Pixel(-24 - (22 * zindex), -3);
		$("#container_" + zindex).css("background-color", "#f8fbfd");
		$("#container_" + zindex).css("border", "1px solid #cedeec");
		$("#sendPoi_" + zindex).css("background", "#2898F7");
		$("#sendPoi_" + zindex).css("color", "#fff");
		$("#rst_" + zindex).css("background-position", (-24 - 22 * zindex) + "px -3px");
	});
	// 绑定鼠标移入事件
	mapObj.bind(marker, "mouseover", function(e) {
		// 右侧列表样式控制
		var zindex = marker.zIndex;
		marker.icon.imageOffset = new MMap.Pixel(-24 - (22 * zindex), -3);
		$("#container_" + zindex).css("background-color", "#f8fbfd");
		$("#container_" + zindex).css("border", "1px solid #cedeec");
		$("#sendPoi_" + zindex).css("background", "#2898F7");
		$("#sendPoi_" + zindex).css("color", "#fff");
		$("#rst_" + zindex).css("background-position", (-24 - 22 * zindex) + "px -3px");
	});
	// 绑定鼠标移出事件
	mapObj.bind(marker, "mouseout", function(e) {
		// 右侧列表样式控制
		var zindex = marker.zIndex;
		marker.icon.imageOffset = new MMap.Pixel(-24 - (22 * zindex), -39);
		$("#container_" + zindex).css("background-color", "#fff");
		$("#container_" + zindex).css("border", "1px solid #fff");
		$("#sendPoi_" + zindex).css("background", "#F7F8F9");
		$("#sendPoi_" + zindex).css("color", "#A4A4A4");
		$("#rst_" + zindex).css("background-position", (-24 - 22 * zindex) + "px -39px");
	});
}

//显示某条POI结果弹出内容
function mapobjCenterPoi($this, poiLength, id, index) {
	// 数据栏样式控制
	isClicked = index;
	// 1.选中的POI区域加背景及边框
	$("[id^=container_]").css("background-color", "#fff");
	$("[id^=container_]").css("border", "1px solid #fff");
	
	$this.css("background-color", "#f8fbfd");
	$this.css("border", "1px solid #cedeec");
	// 添加至发送列表按钮显示成蓝底白字
	$("[id^=sendPoi_]").css("background", "#F7F8F9");
	$("[id^=sendPoi_]").css("color", "#A4A4A4");
	$("#sendPoi_" + index).css("background", "#2898F7");
	$("#sendPoi_" + index).css("color", "#fff");
	// 数字标识变为蓝色
	for(var i = 0; i < poiLength; i++) {
		$("#rst_" + i).css("background-position", (-24 - 22 * i) + "px -39px");
	}
	$("#rst_" + index).css("background-position", (-24 - 22 * index) + "px -3px");
	var marker = mapObj.getOverlays(id);
	if(typeof(marker) != "undefined" && marker != null && typeof(marker.id) != "undefined") {
		// 地图中的数字标识变为蓝色
		marker.icon.imageOffset = new MMap.Pixel(-24 - (22 * index), -3);
		showBubble(marker);
	} else {
		mapObj.setZoomAndCenter(18,new MMap.LngLat(mappois[i].longitude,mappois[i].latitude));//同时设置地图的中心点及缩放级别
		var markers = new Array();
		var marker = new MMap.Marker({
			id : mappois[i].id, // marker id
			cursor : "cursor:pointer",
			position : new MMap.LngLat(mappois[i].longitude, mappois[i].latitude), // 位置
			icon : mapobjImages[i],// 图片
			offset : new MMap.Pixel(-16,-18), // 基点为图片左上角，设置相对基点的图片位置偏移量，向左向下为负
			draggable : false, //可拖动 
			visible : true,//可见
			zIndex : i	//设置点叠加顺序，在加载多个点有效果，详见设置点叠加顺序示例
		});
		inforWindow = new MMap.InfoWindow({
			id: mappois[i].id,
			isCustom : true,
			content : getTipContent(mappois[i]),
			autoMove : true,
			offset : new MMap.Pixel(-140,-268)
		});
		marker.inforWindow = inforWindow;
		//为每个POI点绑定点击事件
		markers.push(marker);
		bind(marker);
		
		mapObj.clearOverlays();
		mapObj.addOverlays(markers, false);
		showBubble(marker);
		
	}
}

//弹出气泡显示
function showBubble(marker) {
	mapObj.clearInfoWindow();
	var m = new Array();
	m.push(marker);
	mapObj.setZoom(18);
	mapObj.setFitView(m);
	//向下移动地图150像素，使气泡处于屏幕中央，以在视野内搜索时避开搜索条件框
	mapObj.panBy(0, 150);
	marker.inforWindow.open(mapObj, marker.getPosition());
}

//关闭鼠标插件
function closeMouseTool(){
	mapObj.setDefaultCursor("default");
	mouseTool.close();
}

//地图测距
function mapRule() {
	mouseTool.rule();
	mapObj.setDefaultCursor("cursor:crosshair");
	mapObj.bind(mapObj,"dblclick",function(e){//绑定双击事件地图测距结束
		setTimeout(function(){
			closeMouseTool();
		},500); 
	});
}

//地图标点
function mapMark(){
	closeMouseTool();
	mapObj.setDefaultCursor("images/lan_red.cur");//设置鼠标形状
	mapObj.bind(mapObj,"click",function(e){mapMarkClick(e);});//绑定单击事件
	mapObj.bind(mapObj,"rightclick",function(e){mapMarkEnd();});//绑定右键事件进行标点结束处理
	mapObj.bind(mapObj,"mousemove",function(e){mapMarkMousemove(e);});//绑定鼠标移动事件显示提示消息
	mapObj.bind(mapObj,"mouseout",function(e){mapMarkMouseout();});//绑定鼠标移出后事件取消提示内容
}

//地图标点处理
function mapMarkClick(e){
	var zoom = mapObj.getZoom();
	var pixel = mapObj.lnglatToPixel(e.lnglat, zoom);
	pixel = new MMap.Pixel(pixel.x+11, pixel.y+30);
	var lnglat= mapObj.pixelToLngLat(pixel, zoom);
	var id = "myPosition_" + Math.random();
	var custMarker = new MMap.Marker({
		   id:id,
		   icon:"images/lan_red.png",//复杂图标 
		   position:lnglat, //位置
		   offset:new MMap.Pixel(-4,-28), //相对于基点的偏移量 
		   draggable:false, //可拖动 
		   cursor : "cursor:pointer",
		   zIndex:1000,//点的叠加顺序 
		   visible:true//可见 
	});
	var poi = {
			id: id,
			name: "自定义标点",
			longitude: custMarker.getPosition().lng,
			latitude: custMarker.getPosition().lat,
			address:'',
			tel:'',
			areacode:'',
			adcode:'',
			type:'',
			typecode:'',
			provincename:'',
			provincecode:'',
			cityname:'',
			citycode:'',
			districtname:'',
			districtcode:''
	};
	var tipContent = getTipContent(poi);
	mapObj.addOverlays(custMarker);
	mapObj.setDefaultCursor("default");
	inforWindow = new MMap.InfoWindow({
		id:id,
		isCustom : true,
		content : tipContent,
		autoMove : true,
		offset : new MMap.Pixel(-125,-295)
	});
	custMarker.inforWindow = inforWindow;
	
	bind(custMarker);
	showBubble(custMarker);
	
	mapMarkEnd();
}

//地图标点结束处理
function mapMarkEnd() {
	mapObj.setDefaultCursor("default");
	$("#markTip").css("display","none"); 
	mapObj.unbind(mapObj,"click",function(e){mapMarkClick(e);});
	mapObj.unbind(mapObj,"rightclick",function(e){mapMarkEnd();});
	mapObj.unbind(mapObj,"mousemove",function(e){mapMarkMousemove(e);});
	mapObj.unbind(mapObj,"mouseout",function(e){mapMarkMouseout();});
}

//地图标点鼠标移动
function mapMarkMousemove(e) {
	$("#markTip").css("display","block"); 
	$("#markTip").css("position","absolute"); 
	$("#markTip").css("left",(e.pixel.x+30) + "px"); 
	$("#markTip").css("top",(e.pixel.y+40) + "px");
	$("#markTip").css("z-index","99999");
}

//地图标点鼠标移出
function mapMarkMouseout() {
	$("#markTip").css("display","none");
}

//删除一个标点
function destroyMarker(markerId){
	mapObj.clearInfoWindow();
	mapObj.removeOverlays(markerId);
}

//点击搜索按钮搜索POI
function searchPoi() {
	var city = $("#city").val();
	var key = $("#key").val();
	var type = $("#type").val();
	var language = $('input[name="autoNaviLanguage"]:checked').val();
	if(city == "") {
		alert("请选择城市");
		return false;
	}
	if(key == "" && type == "") {
		alert("请输入搜索关键字或分类");
		return false;
	}
    searchPoiList(city,key,type, language, 0,10);
}

//根据查询条件查询POI列表
function searchPoiList(city, key, type, language, currentpage, countperpage) {
	isNear = false;
	if(key != "") {
    	key = key.replace(/'/g, '＇');
    	key = key.replace(/"/g, '＂');
    	key = key.replace(/&/g, '＆');
    }
	var url = 'getPoiList.do';
	var pars = {
		city : city,
		key : key,
		type : type,
		language : language, 
		currentpage : currentpage,
		countperpage : countperpage
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
			$("#resultPoi").html(tipLoading);
		},
		success : function(data, textStatus) {
			try {
				var divResult = "";
				if (!data.poiList || data.total == 0) {
					$("#resultPoi").html(tipNoResult);
				} else {
					var height = document.documentElement.clientHeight - 120;
                    divResult += "<div style=\"width:100%; height:" + height + "px; overflow-y:auto;overflow-x:hidden;\" id=\"divResultPoi\">";
					//分页
					var pageControl = getPageDiv("searchPoiList", "'" + city + "','" + key + "','" + type + "','" + language + "'", currentpage, countperpage, data.totalpage, data.total);
					divResult += pageControl;
					//数据
					divResult += getListDiv(data.poiList, "searchPoiList");
					if(data.totalpage > 1) {
						divResult += pageControl;
					}
                    divResult += "</div>";
                    
					$("#resultPoi").html(divResult);
					$("[id^='distance_']").hide();
					mappois = data.poiList;
					mapReady();
				}
			} catch (e) {
				$("#resultPoi").html(tipFail);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$("#resultPoi").html(tipFail);
		},
		complete : function(XMLHttpRequest, textStatus) {

		}
	});
}

//周边查询POI
function searchNearPoiList(city, longitude, latitude, akey, atype, range, language, currentpage, countperpage) {
	isNear = true;
	if(akey != "") {
		akey = akey.replace(/'/g, '＇');
		akey = akey.replace(/"/g, '＂');
		akey = akey.replace(/&/g, '＆');
    }
	var url = 'getNearPoiList.do';
	var pars = {
		city : city,
		longitude : longitude,
		latitude : latitude,
		akey : akey,
		atype : atype,
		range : range,
		language : language,
		currentpage : currentpage,
		countperpage : countperpage
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
			$("#resultPoi").html(tipLoading);
		},
		success : function(data, textStatus) {
			try {
				var divResult = "";
				if (!data.poiList || data.total == 0) {
					$("#resultPoi").html(tipNoResult);
				} else {
					var height = document.documentElement.clientHeight - 120;
                    divResult += "<div style=\"width:100%; height:" + height + "px; overflow-y:auto;overflow-x:hidden;\" id=\"divResultPoi\">";
					//分页
					var pageControl = getPageDiv("searchNearPoiList", "'" + city + "','" + longitude + "','" + latitude + "','" + akey + "','" + atype + "','" + range + "','" + language + "'", currentpage, countperpage, data.totalpage, data.total);
					divResult += pageControl;
					//数据
					divResult += getListDiv(data.poiList, "searchNearPoiList");
					
					if(data.totalpage > 1) {
						divResult += pageControl;
					}
                    divResult += "</div>";

					$("#resultPoi").html(divResult);
					mappois = data.poiList;
					mapReady("near", longitude, latitude, range);
				}
			} catch (e) {
				$("#resultPoi").html(tipFail);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$("#resultPoi").html(tipFail);
		},
		complete : function(XMLHttpRequest, textStatus) {

		}
	});
}

function getPageDiv(functionName, params, currentpage, countperpage, totalpage, total){
    var pageControl = "<table width=\"95%\"  border=\"0\" cellpadding=\"2\" cellspacing=\"0\">";
    pageControl += "<tr>";
    pageControl += "<td style=\"font-color:A4A4A4;\">" + total + "个结果</td>";
	if(totalpage > 1) {
		pageControl += "<td align=\"right\">";
		if(total > 0 && currentpage > 0) {
			pageControl += "<a href=\"javascript:" + functionName + "(" + params + "," + (Number(currentpage)-1) + "," + countperpage + ")\" style=\"color:#336688;\">上</a> ";
		} else {
			pageControl += "上 ";
		}
		var start = 0;
		var end = currentpage + 3;
		if(currentpage > 2) start = currentpage - 2;
		if(end < 5) end = 5;
		if(end > totalpage) end = totalpage;        
		for(var i=start;i<end;i++) {
			if(i == currentpage) {
				pageControl += (i+1) + " ";
			} else {
				pageControl += "<a href=\"javascript:" + functionName + "(" + params + "," + i + "," + countperpage + ")\" style=\"color:#336688;\">" + (i+1) + "</a> ";
			}
		}
		if(total > 0 && currentpage < (totalpage -1)) {
			pageControl += "<a href=\"javascript:" + functionName + "(" + params + "," +(Number(currentpage)+1) + "," + countperpage + ")\" style=\"color:#336688;\">下</a> ";
		} else {
			pageControl += "下 ";
		}
		pageControl += "</td>";
	}
    pageControl += "</tr>";
    pageControl += "</table>";
    return pageControl;
}

function getListDiv(poiList, from){
	var divResult = '';
	if(poiList && poiList.length > 0 && poiList[0].citycode != $("#city").val()) {
		var currCity = $("#citya").val();
		divResult += '<p style="text-align:center;">在<font style="color:#2898F7;">' + currCity + '</font>查询无结果，已切换到<font style="color:#2898F7;">' + poiList[0].cityname + '</font></p>';
	}
	
	divResult += '<div style="position: relative; width: 100%;">';
		divResult += '<div class="resultCon" style="display: block;">';
			divResult += '<div class="rstOne">';
			for(var i = 0; i < poiList.length; i++) {
				var pca = poiList[i].provincename;
				if(poiList[i].cityname != "" && poiList[i].provincename != poiList[i].cityname) {
					pca += "-" + poiList[i].cityname;
				}
				if (poiList[i].districtname != "") {
					pca += "-" + poiList[i].districtname;
				}
				if(poiList[i].address != "") {
					pca += "," + poiList[i].address;
				}
				
				divResult += '<div id="container_' + i + '" class="container" onmouseover="javascript:containerOver($(this), ' + i + ', ' + poiList.length + ');" onmouseout="javascript:containerOut($(this), ' + i + ', ' + poiList.length + ');" onclick="javascript:mapobjCenterPoi($(this), ' + poiList.length + ', \'' + poiList[i].id + '\', ' + i + ');">';
					divResult += '<div class="nIco">';
						divResult += '<img id="rst_' + i + '" class="rst' + (i + 1) + '" src="images/trans.png" style="background-image: url(\'images/poi.png\');" />';
					divResult += '</div>';
					divResult += '<div class="info">';
						divResult += '<div class="title">';
							divResult += '<span>' + poiList[i].name + '</span>';
						divResult += '</div>';
						divResult += '<div class="clear"></div>';
						divResult += '<div class="phone apfloat apleft">电话：</div>';
						if(poiList[i].tel == null || poiList[i].tel == '') {
							divResult += '<div class="phone apfloat apright">&nbsp;</div>';
						} else {
							divResult += '<div class="phone apfloat apright">' + poiList[i].tel + '</div>';
						}
						divResult += '<div class="address apfloat apleft">地址：</div>';
						divResult += '<div class="address apfloat apright">' + pca + '</div>';
						divResult += '<div class="address apfloat apleft">分类：</div>';
						divResult += '<div class="address apfloat apright">' + poiList[i].type + '</div>';
						if(from == "searchNearPoiList"){
							divResult += '<div class="address apfloat apleft" style="width:62px;">直线距离：</div>';
							divResult += '<div class="address apfloat apright" style="width:100px;">' + poiList[i].distance + '米</div>';
						}
						divResult += '<div id="sendPoi_' + i + '" class="send_poi_btn" onclick="sendWhither(\'' + poiList[i].provincename + '\',\'' + poiList[i].cityname + '\',\'' + poiList[i].districtname + '\',\'' + poiList[i].name + '\',\'' + poiList[i].longitude + '\',\'' + poiList[i].latitude + '\',\'' + pca + '\',\'' + poiList[i].tel + '\',1)">添加至发送列表</div>';
						divResult += '<div class="clear"></div>';
					divResult += '</div>';
				divResult += '</div>';
			}
				
			divResult += '</div>';
		divResult += '</div>';
	divResult += '</div>';
	
	return divResult;
}

function containerOver($this, index, poiLength) {
	$this.css("background-color", "#f8fbfd");
	$this.css("border", "1px solid #cedeec");
	
	$("#sendPoi_" + index).css("background", "#2898F7");
	$("#sendPoi_" + index).css("color", "#fff");
	
	$("#rst_" + index).css("background-position", (-24 - 22 * index) + "px -3px");
	if(markers != null && markers[index] != null) {
		markers[index].icon.imageOffset = new MMap.Pixel(-24 - (22 * index), -3);
		mapObj.addOverlays(markers, false);
		for(var i = 0; i < markers.length; i++) {
			bind(markers[i]);
		}
	}
}

function containerOut($this, index, poiLength) {
	if(index != isClicked) {
		$this.css("background-color", "#fff");
		$this.css("border", "1px solid #fff");
		
		$("#sendPoi_" + index).css("background", "#F7F8F9");
		$("#sendPoi_" + index).css("color", "#A4A4A4");
		
		$("#rst_" + index).css("background-position", (-24 - 22 * index) + "px -39px");
		// 地图中的数字标识变为蓝色
		if(markers != null && markers[index] != null) {
			markers[index].icon.imageOffset = new MMap.Pixel(-24 - (22 * index), -39);
			mapObj.addOverlays(markers, false);
			for(var i = 0; i < markers.length; i++) {
				bind(markers[i]);
			}
		}
	}
}

//缺失poi登记
function hiatusPoi(city, key){
	var city = $("#city").val();
	var key = $("#key").val();
	if(city == "") {
		alert("请选择城市");
		return false;
	}
	if(key == ""){
		alert("请输入关键字");
		$("#key").focus();
		return false;
	}
	var url = '../yesway/hiatusPoi.do';
	var pars = {
		sTspcode : city,
		sPOIName : key,
		sCustomerName : "奔驰",
		sJobNumber : workNumber	
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			try {
				if(data == true){
					alert("缺失POI登记成功！");
				} else {
					alert("缺失POI登记错误，请联系系统管理员");
				}
			} catch (e) {
				alert("缺失POI登记异常");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("缺失POI登记异常！");
		},
		complete : function(XMLHttpRequest, textStatus) {

		}
	});
}

//隐藏右侧结果
function hideResult() {
    var isshow = arguments[0];
    if(isshow == 0) {
        $('#right').show();
		$('#hideResultImg').attr("src","images/s_hideResult2.gif");
        mapobjResize(document.documentElement.clientWidth-310, document.documentElement.clientHeight-36);
        return;
    }
	if($('#right').css("display") == "block" || isshow == 1){
        $('#right').hide();
		$('#hideResultImg').attr("src","images/s_hideResult.gif");
        mapobjResize(document.documentElement.clientWidth-12, document.documentElement.clientHeight-36);
    }else{
		$('#right').show();
		$('#hideResultImg').attr("src","images/s_hideResult2.gif");
        mapobjResize(document.documentElement.clientWidth-310, document.documentElement.clientHeight-36);
	}
}

//改变地图大小
function mapobjResize(width, height) {
    $('#mapDiv').width(width);
    $('#mapDiv').height(height);
}

//地图窗口大小自适应
$(window).resize(function(){
	if(mapObj) {
    	if($('#right').css("display") == "none") {
	    	mapobjResize(document.documentElement.clientWidth-12, document.documentElement.clientHeight-36);
    	} else {
        	mapobjResize(document.documentElement.clientWidth-310, document.documentElement.clientHeight-36);
    	}
	}
	if($("#divResultPoi")) {
		$("#divResultPoi").height(document.documentElement.clientHeight-120);
	}
});

//根据选择城市自动改变地图显示
function changemap(adcode, longitude, latitude) {
    if(adcode != "" && longitude != "" && latitude != "") {
    	//清除弹出窗口
    	mapObj.clearInfoWindow();
		mapObj.setCenter(new MMap.LngLat(longitude, latitude));//设置地图的中心点
    }
}

//初始化POI分类列表
function initPoiCategory(poiCategoryId) {
    var poiCategory = document.getElementById(poiCategoryId);
    opt = document.createElement("option");
    opt.text = "选择分类";
    opt.value = "";
	opt.name = "qb";
	poiCategory.add(opt);

    for(var i=0;i<poiCategoryList.length;i++) {
        opt = document.createElement("option");
        opt.text = poiCategoryList[i].name;
        opt.value = poiCategoryList[i].value;
        opt.name = poiCategoryList[i].spell;
        poiCategory.add(opt);
    }
}

//根据adcode查询城市
function searchCityByAdcode() {
	var adcode = $("#city").val();
	if(adcode != "") {
		for(var i = 0; i < mapCityList.length; i++) {
			if (mapCityList[i].adcode == adcode) {
				var name = mapCityList[i].name;
				name = name.replace(/ /g, '');
		        name = name.replace(/│/g, '');
		        name = name.replace(/├/g, '');
		        $("#citya").val(name);
			}
		}
	}
}

//根据简拼查询poi分类
function searchPoiCategoryBySpell(poiCategorySpellId,poiCategoryId) {
    var poiCategory = document.getElementById(poiCategoryId);
    var spell = document.getElementById(poiCategorySpellId).value;
    if(spell != "") {
        for(var i=0;i<poiCategory.options.length; i++) {
            if(poiCategory.options[i].name.toUpperCase().indexOf(spell.toUpperCase()) == 0) {
            	poiCategory.selectedIndex = i;
                break;
            }
        }
    } else {
    	poiCategory.selectedIndex = 0;
	}
}

//poi自动补全
function autoComplete(input) {
	var city = $('#city').find("option:selected").attr("citycode");
	var id = input.id;
	var caches={};
	$("#" + id).autocomplete({
		source: function(request, response) {
			var key=$.trim(request.term);    
	           if(key != "" && city != "") {
	               if (key in caches) {
	                   response(caches[key]);
	                   return;
	               }
	               $.ajax({                  
	                   type:"post",
	                   url: "getSuggestion.do",
	                   dataType:"json",
	                   data:{key:key, city:city, rn:10} ,
	                   cache:true,
	                   success: function(data){  
	           				eval(data);          
							caches[key] = data;                     
							response(data);         
	                   }
	               });
	           }
		}
	});
}

//设置目的地,poiType，1目的地，0途经
function sendWhither(province, city, district, poiName,longitude, latitude, address, telephone, poiType) {
	var url = '../destination/addPoi.do';
	var pars = {
		poiName : poiName,
		longitude : longitude,
		latitude : latitude,
		telephone : telephone,
		address : address,
		poiType : poiType,
		province : province,
		city : city,
		district : district
	};
	$.ajax({
		url : url,
		type : "post",
		data : pars,
		beforeSend : function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("RequestType", "ajax");
		},
		success : function(data, textStatus) {
			try{
				destinationWindow = open_win("../destination/goDestination.do",'设置目的地',550,314,'auto');
				destinationWindow.focus();
			} catch(e) {
				alert("设置目的地异常");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("设置目的地错误，请联系管理员");
		},
		complete : function(XMLHttpRequest, textStatus) {
		}
	});
}

//打开新窗口
function open_win(url,name,width,height,scroll) {
	var Left_size = (screen.width) ? (screen.width-width)/2 : 0;
	var Top_size = (screen.height) ? (screen.height-height)/2 : 0;
	var open_win=window.open(url,name,'width=' + width + ',height=' + height + ',left=' + Left_size + ',top=' + Top_size + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scroll + ',resizable=yes' );
	return open_win;
}

//根据城市代码设置右侧搜索条件里的城市
function setSearchForm(adcode){
	var provinceCode = adcode.substring(0, 2)+"0000";//从adcode获取城市代码
	var cityCode = adcode.substring(0, 4)+"00";//从adcode获取城市代码
	if($("#city").val() == "" && $("#type").val() == "" && $("#key").val() == ""){
		$("#city option[value='" + provinceCode + "']").attr("selected", "true");
		$("#city option[value='" + cityCode + "']").attr("selected", "true");
	} 
}

// 删除覆盖物, 保留车辆当前位置点
function removeAllOverlays(){ 
	if(mapObj) {
		var marker = mapObj.getOverlays('m_car');
		mapObj.clearOverlays();
		mapObj.addOverlays([marker]);
		showBubble(marker);
		circle = null;
	}
}

// 显示当前位置
function showMap() {
	var longitude = $("#longitude").val();
	var latitude = $("#latitude").val();
	if(longitude != "" && latitude != ""){
		carpoi = {id:"m_car",name:"当前位置",address:"",tel:"",areacode:"",adcode:"",city:"",longitude:longitude,latitude:latitude,type:"",typecode:"",provincename:"",provincecode:"",cityname:"",citycode:"",districtname:"",districtcode:"",image:"images/car.gif"};
		mapReady();
		setTimeout(function(){
			infor.open(mapObj,carMar.getPosition());	
		}, 2000);
	} else {
		alert("当前无位置信息");
	}
}

// 根据vin获取位置信息
function getUserLocation() {
	/*var vin = parent.topLeftFrame.getVin();
	if(vin != "") {
		var url = '../user/getLocationInfoByVin.do';
		var pars = {vin : vin};
		$.post(url, pars, function(data) {
			if(data.error != "") {
				alert(data.error);    		
			} else {
				$("#longitude").val(data.locationInfo.position.longitude);
				$("#latitude").val(data.locationInfo.position.latitude);
				$("#direction").val(getDirectionDesc(data.locationInfo.positionHeading));
				$("#positioningTime").val(getSmpFormatDateByLong(data.locationInfo.time, true));
				$("#d_longitude").html(data.locationInfo.position.longitude);
				$("#d_latitude").html(data.locationInfo.position.latitude);
				$("#d_direction").html(getDirectionDesc(data.locationInfo.positionHeading));
				$("#d_positioningTime").html(getSmpFormatDateByLong(data.locationInfo.time, true));
			}
		});
	}*/
	var vins = parent.topLeftFrame.getVins();
	
	for(var i = 0; i < vins.length; i++) {
		//alert(vins[i].innerHTML);
	}
	if(vins.length > 0) {
		var url = '../user/getLocationInfoByVin.do';
		var pars = {vin : vins[0].innerHTML};
		$.post(url, pars, function(data) {
			if(data.error != "") {
				alert(data.error);    		
			} else {
				$("#longitude").val(data.locationInfo.position.longitude);
				$("#latitude").val(data.locationInfo.position.latitude);
				$("#direction").val(getDirectionDesc(data.locationInfo.positionHeading));
				$("#positioningTime").val(getSmpFormatDateByLong(data.locationInfo.time, true));
				$("#d_longitude").html(data.locationInfo.position.longitude);
				$("#d_latitude").html(data.locationInfo.position.latitude);
				$("#d_direction").html(getDirectionDesc(data.locationInfo.positionHeading));
				$("#d_positioningTime").html(getSmpFormatDateByLong(data.locationInfo.time, true));
			}
		});
	}
}

// 获取当前位置

//获取当前时间
function getCurrentTime() {
	var date = new Date(); 
	var hour = date.getHours();       //获取当前小时数(0-23)
	var minute = date.getMinutes();     //获取当前分钟数(0-59)
	return hour + ":" + minute;
}

function getLanguage() {
	return $('input[name="autoNaviLanguage"]:checked').val();
}

//城市选择控件回调函数
function cityPickerCallBack(params){
	$("#city").val(params.adcode);
	changemap(params.adcode, params.longitude, params.latitude);
}

$(document).ready(function() {
	workNumber = parent.getWorkNumber();
	mapInit();
	$('input[name="autoNaviLanguage"]').change(function() {
		isClicked = 11;
		searchPoi();
	});
	getUserLocation();
});
