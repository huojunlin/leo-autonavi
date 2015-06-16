function goMap() {
	var city = $("#city").val();
	var key = $("#key").val();
	var type = $("#type").val();
	var citya = $("#citya").val();
	if(city == "") {
		alert("请选择城市");
		$("#citya").focus();
		return false;
	}
	if(key == "" && type == "") {
		alert("请输入搜索关键字或分类");
		$("#key").focus();
		return false;
	}
	if(key != "") {
		key = key.replace(/(^\s*)|(\s*$)/g, "");
	}
	//parent.mid2Frame.hideFrame();
	window.location.href = "map.html?longitude=" + longitude + "&latitude=" + latitude + "&direction=" + direction + "&positioningTime=" + positioningTime + "&city=" + city + "&key=" + key + "&type=" + type + "&citya=" + encodeURIComponent(encodeURIComponent(citya));
}

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

// 关键字自动补全
function autoComplete(input) {
	var city = $('#city').find("option:selected").attr("citycode");
	var id = input.id;
	var caches = {};
	$("#" + id).autocomplete({
		source: function(request, response) {
			var key = $.trim(request.term);    
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
	                	   caches[key] = data;                     
	                	   response(data);         
	                   }
	               });
	           }
		}
	});
}

function getWhitherHistory(currentpage, countperpage) {
	$("#whitherList").html("");
	var url = "../destination/getDestinationHistory.do";
	var vins = parent.topLeftFrame.getVins();
	var vs = "";
	if(vins.length > 0) {
		for(var i = 0; i < vins.length; i++) {
			vs += vins[i].innerHTML + ",";
		}
	}
	var pars = {
		vin: vs.substring(0, vs.length - 1),
        currentpage: currentpage,
        countperpage : countperpage
	};
	$.post(url, pars, function(data) {
		if(data) {
			if(data.error && data.error != "") {
				//无用户资料，什么都不显示
				return;
			}
			var divResult = "";
			if (!data.result.datas || data.result.datas.length == 0) {
				divResult += "<p class=\"title03 mt10\"><span class=\"fenye1 mr10 mt5\"></span><b>历史目的地记录</b></p>";
				divResult += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">";
				divResult += "<tr>";
				divResult += "<th style=\"width:40px\">序号</th>";
				divResult += "<th style=\"width:130px\">发送时间</th>";
				divResult += "<th style=\"width:60px\">类型</th>";
				divResult += "<th>市</th>";
				divResult += "<th>区</th>";
				divResult += "<th>目的地名称</th>";
				divResult += "<th>地 址</th>";
				divResult += "<th>电 话</th>";
				divResult += "<th style=\"width:130px\">操作</th>";
				divResult += "</tr>";
				divResult += "<tr>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "<td>&nbsp;</td>";
				divResult += "</tr>";
				divResult += "</table>";
	
				$("#whitherList").html(divResult);
			} else {
				var pageControl = "";
				pageControl += "<p class=\"title03 mt10\">";
				pageControl += "<span class=\"fenye1 mr10 mt5\">共查出<strong>" + data.result.total + "</strong>条信息<span class=\"mr10\">&nbsp;</span>" +(Number(currentpage)+1) + "/" + (Number(data.result.totalpage)) + "<span class=\"mr10\">&nbsp;</span>";
				if(currentpage > 0) {							
					pageControl += "<a href=\"javascript:getWhitherHistory(0," + countperpage + ")\">首页</a>    ";
				} else {
					pageControl += "首页&nbsp;&nbsp;";
				}
				if(data.result.totalpage > 0 && currentpage > 0) {
					pageControl += "<a href=\"javascript:getWhitherHistory(" + (Number(currentpage)-1)+ "," + countperpage + ")\">上一页</a>    ";
				} else {
					pageControl += "上一页&nbsp;&nbsp;";
				}
				if(data.result.totalpage > 0 && currentpage < (data.result.totalpage -1)) {
					pageControl += "<a href=\"javascript:getWhitherHistory(" + (Number(currentpage)+1) + "," + countperpage + ")\">下一页</a>    ";
				} else {
					pageControl += "下一页&nbsp;&nbsp;";
				}
				if(data.result.totalpage > 0 && currentpage < (data.result.totalpage -1)) {
					pageControl += "<a href=\"javascript:getWhitherHistory(" + (data.result.totalpage-1) + "," + countperpage + ")\">末页</a>";
				} else {
					pageControl += "末页";
				}
				pageControl += "&nbsp;&nbsp;&nbsp;";
				pageControl += "<select name=dl onchange=\"getWhitherHistory(" + "this.options[this.options.selectedIndex].value," + countperpage + ")\">";
				for(var i = 0; i < data.result.totalpage; i++){
					if(i==currentpage){
						pageControl += "<option value=" + i + " selected>" + (i + 1) + "页</option>";
					} else {
						pageControl += "<option value=" + i + ">"+(i + 1) + "页</option>";
					}
				}
				pageControl += "</select>";
				pageControl += "</span>";
				pageControl += "<b>历史目的地记录</b></p>";
				//if(result.totalpage > 1) {
					divResult += pageControl;
				//}
				divResult += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">";
				divResult += "<tr>";
				divResult += "<th style=\"width:40px\">序号</th>";
				divResult += "<th style=\"width:130px\">发送时间</th>";
				divResult += "<th style=\"width:60px\">类型</th>";
				divResult += "<th>市</th>";
				divResult += "<th>区</th>";
				divResult += "<th>目的地名称</th>";
				divResult += "<th>地 址</th>";
				divResult += "<th>电 话</th>";
				divResult += "<th style=\"width:130px\">操作</th>";
				divResult += "</tr>";
				for(var i = 0; i < data.result.datas.length; i++) {
					var pois = data.result.datas[i].pois;
					var addTime = data.result.datas[i].addTime;
					divResult += "<tr id=\"list" + i + "\"><td rowspan=\"" + pois.length + "\">" + (i+1) + "</td>";
					divResult += "<td rowspan=\"" + pois.length + "\">" + addTime + "</td>";
					for(var j = 0 ; j < pois.length ; j++){
						var whither = pois[j];
						if(j != 0){
							divResult += "<tr>";
						}
						divResult += "<td>" + (whither.poitype == 1 ?
								"<span style=\"color:red\">目的地</span>":
								"<span style=\"color:green\">途经点</span>") + "</td>";
						divResult += "<td>" + whither.city + "&nbsp;</td>";
						divResult += "<td>" + whither.district + "&nbsp;</td>";
						
						divResult += "<td title=\"" + whither.name + "\">" + cutStr(whither.name, 20) + "</td>";
						divResult += "<td title=\"" + whither.street + "\">" + cutStr(whither.street, 20) + "&nbsp;</td>";
						divResult += "<td title=\"" + whither.phone + "\">" + cutStr(whither.phone, 20) + "&nbsp;</td>";
						/*divResult += "<td><a href=\"javascript:sendWhither('" + whither.province + "','" + whither.city + "','" + whither.district + "','" + whither.pname + "','" + whither.lon + "','" + whither.lat + "','" + whither.address + "','" + whither.telephone + "',0)\">设为途经点</a>&nbsp;&nbsp;";*/
						divResult += "<td><a href=\"javascript:sendWhither('','" + whither.city + "','" + whither.district + "','" + whither.name + "','" + whither.longitude + "','" + whither.latitude + "','" + whither.street + whither.streetNo + "','" + whither.phone + "',1)\">设为目的地</a></td></tr>";
					}
				}
				divResult += "</table>";
				
				$("#whitherList").html(divResult);
				$("tr[id^=list]").hover(function(){
					$(this).css("background","#ACD9F1");
				});
				$("tr[id^=list]").mouseout(function(){
					$(this).css("background","#FFFFFF");
				});
			}
		}
	});	
}

//设置目的地,poiType，0目的地，1途经点
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
			eval(data);
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

//城市选择控件回调函数
function cityPickerCallBack(params){
	$("#city").val(params.adcode);
}

//打开新窗口
function open_win(url,name,width,height,scroll) {
	var Left_size = (screen.width) ? (screen.width-width)/2 : 0;
	var Top_size = (screen.height) ? (screen.height-height)/2 : 0;
	var open_win=window.open(url,name,'width=' + width + ',height=' + height + ',left=' + Left_size + ',top=' + Top_size + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scroll + ',resizable=yes' );
	return open_win;
}

$(document).ready(function() {
	/*var adCode = "";
	try {adCode = parent.topLeftFrame.getAdcode();} catch(e) {}
	if(adCode == "") {
		try {adCode = parent.topLeftFrame.getCity();} catch(e) {}
	}
	if(adCode != "") {
		if(adCode.length == 6) {
    		if(adCode.substring(0,2) == "11" || adCode.substring(0,2) == "12" || adCode.substring(0,2) == "31" || adCode.substring(0,2) == "50") {
    			adCode = adCode.substring(0,2) + "0000";
    		} else {
    			adCode = adCode.substring(0,4) + "00";
    		}
    	}
	}*/
    //initCity(adCode);
    initPoiCategory("type");
    getWhitherHistory(0, 10);
});
