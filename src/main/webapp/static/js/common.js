//从json时间格式转化日期字符串
function getDateStr(jsondate) {
	var dateStr = "";
	if(jsondate != null && jsondate != "") {
		try {
			var date = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			dateStr = date.getFullYear() + "-" + month + "-" + day ;
		} catch(e) {
			
		}
	}
	return dateStr;
}

//从json时间格式转化日期时间字符串
function getDateTimeStr(jsondate) {
	var dateTimeStr = "";
	if(jsondate != null && jsondate != "") {
		try {
			var date = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
			var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
			dateTimeStr = date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
		} catch(e) {
			
		}
	}
	return dateTimeStr;
}

//处理文字信息在页面上显示
function getPrintStr(str) {
    if(str == null || str == "null" || typeof(str) == "undefined") {
        return "";
    } else if(typeof(str) == "string") {
		str = str.replace(/\"/g,"”");
		str = str.replace(/\'/g,"‘");
		str = str.replace(/\</g,"&lt;");
		str = str.replace(/\>/g,"&gt;");
		str = str.replace(/\n/g,"<br>");
        return str;
    } else {
    	return str;
    }
}

//处理文字上的信息，防止返回js中出现异常符号
function getFormatStr(str) {
    if(str == null || str == "null" || typeof(str) == "undefined" || str == "undefined" ) {
    	return "";
    }
    return str;
}

//按显示长度截取字符串
function cutString(str, len) {
	if(str == null)return "";
	//length属性读出来的汉字长度为1
	if(str.length*2 <= len){
		return str;
	}
	var cut = false;
	var strlen = 0;
	var result = str;
	var s = "";
	for(var i = 0;i < str.length; i++) {
		s = s + str.charAt(i);
		if(str.charCodeAt(i) > 128) {
			strlen = strlen + 2;
			if(strlen >= len){
				result = s.substring(0,s.length-1) + "...";
				cut = true;
				break;
			}
		}else {
			strlen = strlen + 1;
			if(strlen >= len){
				result = s.substring(0,s.length-2) + "...";
				cut = true;
				break;
			}
		}
	}
	if(cut){
		result = "<span title=\"" + str + "\">"+result+"</span>";
	}
	return result;
}
//按显示长度截取字符串
function cutStr(str, len) {
	if(str == null)return "";
	//length属性读出来的汉字长度为1
	if(str.length*2 <= len){
		return str;
	}
	var strlen = 0;
	var result = str;
	var s = "";
	for(var i = 0;i < str.length; i++) {
		s = s + str.charAt(i);
		if(str.charCodeAt(i) > 128) {
			strlen = strlen + 2;
			if(strlen >= len){
				result = s.substring(0,s.length-1) + "...";
				break;
			}
		}else {
			strlen = strlen + 1;
			if(strlen >= len){
				result = s.substring(0,s.length-2) + "...";
				break;
			}
		}
	}
	return result;
}

//方向
function getDirectionDesc(direction) {
	var directionDesc = "";
	if (direction <= 15 || direction >= 345) {
		directionDesc = "北";
	} else if (direction > 15 && direction < 75) {
		directionDesc = "东北";
	} else if (direction >= 75 && direction <= 105) {
		directionDesc = "东";
	} else if (direction > 105 && direction < 165) {
		directionDesc = "东南";
	} else if (direction >= 165 && direction <= 195) {
		directionDesc = "南";
	} else if (direction > 195 && direction < 255) {
		directionDesc = "西南";
	} else if (direction >= 255 && direction <= 285) {
		directionDesc = "西";
	} else if (direction > 285 && direction < 345) {
		directionDesc = "西北";
	}
	return directionDesc;
}

//扩展Date的format方法   
Date.prototype.format = function (format) {  
    var o = {  
        "M+": this.getMonth() + 1,  
        "d+": this.getDate(),  
        "h+": this.getHours(),  
        "m+": this.getMinutes(),  
        "s+": this.getSeconds(),  
        "q+": Math.floor((this.getMonth() + 3) / 3),  
        "S": this.getMilliseconds()  
    }  
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    }  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}  

function getFormatDate(date, pattern) {  
    if (date == undefined) {  
        date = new Date();  
    }  
    if (pattern == undefined) {  
        pattern = "yyyy-MM-dd hh:mm:ss";  
    }  
    return date.format(pattern);  
}

function getSmpFormatDate(date, isFull) {  
	var pattern = "";  
	if (isFull == true || isFull == undefined) {  
	    pattern = "yyyy-MM-dd hh:mm:ss";  
	} else {  
	    pattern = "yyyy-MM-dd";  
    }  
    return getFormatDate(date, pattern);  
}  

function getSmpFormatDateByLong(l, isFull) {  
    return getSmpFormatDate(new Date(l), isFull);  
} 

// 获取项目根路径
function getRootPath() {
    // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
}

//判断日期，时间大小  
function compareTime(date) {
	if (date.length > 0) {  
	    var startDateTemp = date.split(" ");  
	    var arrStartDate = startDateTemp[0].split("-");  
	    var arrStartTime = startDateTemp[1].split(":");  
		var startDate = new Date(arrStartDate[0], arrStartDate[1] - 1, arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);  
		var endDate = new Date();  
		startDate.setDate(startDate.getDate() + 1);
		if (startDate >= endDate) {  
			return true;  
		} else {  
		    return false;  
		}
	} else {  
	    return false;  
  }  
} 

//验证服务日期是否是当前日
function isToDay(datetime) {
	var reg = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{2}):(\d{2})(?::\d{1,2})?$/;
	var standard = new Date();
	var times = datetime.match(reg);
	var year = times[1];
	var month = times[2];
	var day = times[3];

	if (month.substring(0, 1) == "0") {
		month = month.substring(1, month.length);
	}
	if (day.substring(0, 1) == "0") {
		day = day.substring(1, day.length);
	}
	return (parseInt(year) == parseInt(standard.getFullYear()))
			&& (parseInt(month) == parseInt(standard.getMonth() + 1))
			&& (parseInt(day) == parseInt(standard.getDate()));
}

//打开新窗口
function open_win(url,name,width,height,scroll) {
	var Left_size = (screen.width) ? (screen.width-width)/2 : 0;
	var Top_size = (screen.height) ? (screen.height-height)/2 : 0;
	window.open(url,name,'width=' + width + ',height=' + height + ',left=' + Left_size + ',top=' + Top_size + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scroll + ',resizable=yes' );
}
