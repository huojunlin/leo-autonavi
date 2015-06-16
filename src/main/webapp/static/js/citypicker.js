(function(window){
	var CityPicker = function(target, params){
		CityPicker.params = params;
		CityPicker.target = target;
		return CityPicker.fn.init();
	};
	
	/*
	 * params.groups 分组规则
	 * params.cityPy 简拼输入框ID
	 * params.callback 选择城市的回调函数
	 */
	CityPicker.fn = {
		init : function(){
			this._divDom;
			this._divDomPY;
			this._target = $(CityPicker.target);
			this._groups = ["ABCDEF","GHIJ","KLMNPQ","RSTUVW","XYZ"];
			this._divId = CityPicker.divId;
			this._listDivId = CityPicker.listDivId;
			this._params = CityPicker.params ? CityPicker.params : {};
			this._groups = this._params.groups ? this.params.groups : this._groups;
			this._cityPy = this._params["cityPy"] ? $("#" + this._params["cityPy"]) : this._target;
			this._callback = this._params["callback"] ? this._params["callback"] : function(){};
			this._tabWidth = this._params["tabWidth"] ? this._params["tabWidth"] : "360";
			for(var i = 0 ; i < this._groups.length ; i++){
				this._groups[i] = this._groups[i].toUpperCase();
			}
			this._divDomPY = $("#" + this._params.targetPyId);
			this.initCity();
			this.initEvent();
			//this._target.click();
			return this;
		},
		
		initEvent : function(){
			// 点击事件回调
			var callbackFn = this._callback;
			var _target = this._target;
			// 选择框中的点击事件
			$("#" + this._divId).find("td a").unbind("click").bind("click", function(){
				$(CityPicker.target).val($(this).html());
				$("body").click();
				// 选择城市回调
				var params = {
						citycode : $(this).attr("citycode"),
						name : $(this).attr("name"),
						longitude : $(this).attr("longitude"),
						latitude : $(this).attr("latitude"),
						adcode : $(this).attr("adcode"),
						target : _target
					};
				callbackFn(params);
			});
			// 全局点击事件，控制显示隐藏选择框
			var _target = this._target;
			// div框点击事件阻止事件传播到document父层，点击div内不会触发隐藏
			$("#" + this._divId).unbind("click").bind("click", function(_event){
				var event = _event || window.event;
				event.stopPropagation();
			});
			$(document).unbind("click").bind("click", function(_event){
				var ev = _event || window.event;
				if($(ev.target).attr("id") != _target.attr("id") && 
						$(ev.target).attr("id") != CityPicker.divId){
					CityPicker.fn.hideDiv();
				} else {
					CityPicker.fn.hideDiv();
					CityPicker.fn.showDiv();
				}
			});
			// 初始化多个target时简拼框会混乱，targetId设置到dom中
			$(this._cityPy).attr("spellTarget", this._target.attr("id"))
				.unbind("keyup").bind("keyup", function(_event){
				var event = _event || window.event;
					// 该判断为了兼容键盘上下选择
					if((event.keyCode >= 65 && event.keyCode <= 90) ||  // 字母
						event.keyCode == 8 || // 退格
						event.keyCode == 46){ // delete
						var targetId = $(this).attr("spellTarget");
						// 如果绑定其他的简拼框，则输入简拼时清空target
						if(targetId != $(this).attr("id")){
							$("#" + targetId).val("");
						}
						CityPicker.fn.initCityList($(this));
						event.stopPropagation();
					}
				});
		},

		/*
		 * #Q001
		 * 绑定简拼输入框当前存在问题：
		 *  传入其他简拼输入框时，无法在初始化（第一次点击target输入框）前根据简拼搜索城市列表，因为简拼输入框事件尚未初始化
		 *  可以在$(),ready(function(){...});方法中调用 target的forcus方法进行初始化
		 *  以使简拼输入框完成初始化
		 */
		
		// 根据拼音筛选城市列表
		initCityList : function($spellElement){
			var spellTargetId = $spellElement.attr("spellTarget");
			var element = $spellElement.val().trim();
			// 为空触发target的点击事件（弹出选择框）
			if(element == ""){
				$("#" + spellTargetId).click();
				return;
			}
			$("body").click();
			// 移除list
			$("#" + this._listDivId).remove();
			
			// 构建新的list
			var ulStr = "<ul id=\"" + this._listDivId + "\" tabindex=\"0\" class=\"cp-autocomplete cp-front cp-menu cp-widget cp-widget-content\"";
			ulStr += "style=\"width:" + $("#" + spellTargetId).width() + "px;max-height:300px;overflow:auto;display:none;padding-left:5px;\">";
			if (mapCityList) {
				for (var key in mapCityList) {
					var city = mapCityList[key];
					var spellFlag = city.spell.indexOf(element.toUpperCase()) == 0;
					var nameFlag = city.name.indexOf(element) == 0;
					var pyFlag = city.pinyin.toUpperCase().indexOf(element.toUpperCase()) == 0;
					if (spellFlag || nameFlag || pyFlag) {
						ulStr += "<li class=\"cp-menu-item\"";
						// 参数写入dom
						for(var paramName in city){
							ulStr += paramName + "=\"" + city[paramName] + "\" ";
						}
						ulStr += ">" + city.name + "</li>";
					}
				}
			}
			ulStr += "</ul>";
			$("body").append(ulStr);
			var $listDiv = $("#" + this._listDivId);
			// 如果无结果
			if($listDiv.find("li").length < 1){
				$listDiv.append("<li class=\"cp-menu-item\"><span style =\"color:#ff0000;\">未找到合适的城市</span></li>");
			} else {
				$listDiv.find("li").eq(0).addClass("selection");
				$listDiv.find("li").eq(0).attr("selected", "selected");
				//$("#" + spellTargetId).val($listDiv.find("li").eq(0).html());
			}
			// 样式及显示
			var top = $($("#" + spellTargetId)).offset().top + 23;
			var left = $($("#" + spellTargetId)).offset().left;  
			$listDiv.css({
				"position": "absolute",
				"top": top + "px",
				"left": left + "px"
			}).show();
			// 点击事件回调
			var callbackFn = this._callback;
			var _target = $("#" + spellTargetId);
			// 选择框中的点击事件
			$listDiv.find("li").unbind("click").bind("click", function(){
				$("#" + spellTargetId).val($(this).html());
				// 选择城市回调
				var params = {
						citycode : $(this).attr("citycode"),
						name : $(this).attr("name"),
						longitude : $(this).attr("longitude"),
						latitude : $(this).attr("latitude"),
						adcode : $(this).attr("adcode"),
						target : _target
					};
				CityPicker.fn.hideDiv();
				callbackFn(params);
			});
			// 键盘事件
			$(document).unbind("keyup").bind("keyup", function(_event){
				var event = _event || window.event;
				// $listDiv.focus();
				// 筛选当前选择项
				var $selection = null;
				$listDiv.find("li").each(function(i, item){
					if($(item).hasClass("selection")){
						$selection = $(item);
						return false;
					}
				});
				// 无选择项返回
				if($selection == null){
					return;
				}
				// 键盘事件处理
				if(event.keyCode == 38){ // up
					if(!$selection.is(":first-child")){
						$listDiv.find("li").removeClass("selection");
						$listDiv.find("li").removeAttr("selected");
						$selection.prev().addClass("selection");
						$selection.prev().attr("selected", "selected");
						//_target.val($selection.prev().html());
					}
				} else if(event.keyCode == 40){ // down
					if(!$selection.is(":last-child")){
						$listDiv.find("li").removeClass("selection");
						$selection.next().addClass("selection");
						$selection.next().attr("selected", "selected");
						//_target.val($selection.next().html());
					}
				} else if(event.keyCode == 13){ // Enter
					event.stopPropagation();
					$selection.click();
				}
			});
		},
		
		initCity : function(){
			if($("#" + this._divId).length>0){return;}
			var _groups = this._groups;
			// 标签table
			// TODO
			var tabTable = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"cp_focus_float_table\">";
			tabTable += "<tr>";
			// 城市table
			var cityListDiv = "<div style=\"width:100%;height:135px;overflow:auto;\">";
			cityListDiv += "<table width=\"95%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"cp_focus_float_table2\">";
			//cityListDiv += "</tr>";
			// 分组城市 
			for(var i = 0; i < _groups.length ; i++){
				tabTable += "<td name=\"cp_tab\" index=\"" + i + "\"";
				if(i == 0){
					tabTable += " class=\"cp_focus_float_table_td\"";
				}
				tabTable += ">" + _groups[i] + "</td>";
				
				cityListDiv += "<tr><td name=\"cp_tab_cont\" index=\"" + i + "\">";
				for(var key in mapCityList){
					var city = mapCityList[key];
				    var flag = city.spell == "" ? false : _groups[i].indexOf(city.spell.substr(0, 1).toUpperCase()) != -1;
				    var list = "";
					// 首字母
					if(flag){
						cityListDiv += "<a href=\"javascript:void(0);\" id=\"" + city.citycode + "\" ";
						// 参数写入dom
			        	for(var paramName in city){
			        		cityListDiv += paramName + "=\"" + city[paramName] + "\" ";
						}
			        	cityListDiv += ">" + city.name + "</a>";
					}
				}
				cityListDiv += "</td></tr>";
			}
			
			// 标签table、城市table 结尾
			tabTable += "</tr></table>";
			cityListDiv += "</table></div>";
	
			var divStr = "<div id=\"" + this._divId + "\" class=\"cp_focus_float\" style=\"width:" + this._tabWidth + "px\">";
			divStr += "<div class=\"cp_focus_float_top\">支持中文/拼音/简拼输入</div>";
			divStr += "<div class=\"cl\"></div>";
			divStr += "<div class=\"cp_focus_float_tab\">";
			divStr += tabTable;
			divStr += cityListDiv;
			divStr += "</div></div>";
			
			$("body").append(divStr);
			
			$("#" + this._divId).find("td[name='cp_tab']").bind("mouseover", function(){
				var index = $(this).attr("index");
				// 标签联动
				$(this).parent().find("td[name='cp_tab']").removeClass("cp_focus_float_table_td");
				$(this).addClass("cp_focus_float_table_td");
				// 城市联动
				$("#" + CityPicker.divId).find("td[name='cp_tab_cont']").addClass("undis")
					.parent().find("td[index='" + index + "']").removeClass("undis");
			});
			
		},

		showDiv : function(){
			var top = this._target.offset().top +
			this._target.outerHeight(true) + 2;
			var left = this._target.offset().left;
			this._target.val("");
			$("#" + this._divId).css({
                "position": "absolute",
                "top": top + "px",
                "left": left + "px"
			}).show();
		},
		
		hideDiv : function(){
			// 移除list
			$("#" + this._listDivId).remove();
			// 隐藏选择div
			$("#" + CityPicker.divId).hide();
			$(document).unbind("keyup");
		},
		
		//获取n位随机id
		getRandomString : function(n) {
			 var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		     var res = "";
		     for(var i = 0; i < n ; i ++) {
		         var id = Math.ceil(Math.random()*35);
		         res += chars[id];
		     }
		     return $("#" + res).length > 0 ? getRandomString(n) : res;
		}
		
	};


	CityPicker.divId = "cityBox_" + CityPicker.fn.getRandomString(6);
	CityPicker.listDivId = "cityList_" + CityPicker.fn.getRandomString(6);
	
	window.CityPicker = CityPicker;
	window.cp = CityPicker;
})(window);