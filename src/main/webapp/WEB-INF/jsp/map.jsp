<%@ page contentType="text/html;charset=utf-8" language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page isELIgnored="false" %> 
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8"/>
	<title>高德地图</title>
	<style>
	    body{font-size: 12px;margin: 0}
	    table{line-height:150%}
	</style>

	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<link rel="stylesheet" href="../js/jquery-ui.min.css" type="text/css" />
	<link rel="stylesheet" href="js/citypicker.css" type="text/css" />
	<script type="text/javascript" src="../js/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="../js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/cities.js"></script>
	<script type="text/javascript" src="js/poicategory.js"></script>
	<script type="text/javascript" src="js/citypicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script language="javascript" src="<%=com.leo.common.cfg.AppConfig.getParameter("autonavi.mapjsurl")%>"></script>
	<script type="text/javascript">
		var searchCity = "${city}";
		var searchType = "${type}";
		var searchKey = "${key}";
	</script>
	<script type="text/javascript" src="js/autonavimap.js"></script>
</head>
<body bgcolor="#FFFFFF" text="#000000" style="overflow:hidden;">
	<input type="hidden" id="longitude" name="longitude" value="${longitude}" />
	<input type="hidden" id="latitude" name="latitude" value="${latitude}" />
	<input type="hidden" id="direction" name="direction" value="${direction}" />
	<input type="hidden" id="positioningTime" name="positioningTime" value="${positioningTime}" />
	<input type="hidden" id="openFlag" name="openFlag" value="${openFlag}" />
	<input type="hidden" id="range" name="range" />
	<div id="markTip" style="display:none;">
		<div style="position: relative; background-color: rgb(255, 255, 255); border: 1px solid rgb(85, 85, 84); padding: 3px 8px 3px 7px; font-size: 12px; white-space: nowrap; background-position: initial initial; background-repeat: initial initial;">
			<div>点击左键标记位置，右击退出</div>
		</div>
	</div>
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td style="border: #999 1px solid;" valign="top">
				<div id="map_container_tools">
					<div id="map_tool" class="floatr">
						<div onclick="mapRule();">
							<span class="icon_range_finding"></span><span class="floatl" style="margin-left: 3px;">测距</span>
						</div>
						<div onclick="mapMark();">
							<span class="icon_marker"></span><span class="floatl">标点</span>
						</div>
						<div onclick="removeAllOverlays();">
							<span class="icon_traffictile"></span><span class="floatl">清空</span>
						</div>
					</div>
				</div>
				<div id="expandMap" class="expand_map" style="top: 180px;">
					<div class="expand_map_arrow"></div>
				</div>
				<div id="mapDiv" style="position: relative; margin-right: 0px;"></div>
			</td>
			<td width="10px">
				<img id="hideResultImg" src="images/s_hideResult2.gif" width="8" height="66" border="0" alt="点击伸缩地图" onclick="hideResult()" style="cursor: pointer" />
			</td>
			<td width="300px" valign="top" id="right" style="display: block;">
				<table width="100%" border="0" cellspacing="0" cellpadding="2">
					<tr>
						<td>
							<input type="hidden" id="city" name="city"/>
							城市:<input type="text" class="input_txt" id="citya" name="citya" onfocus="CityPicker(this, {tabWidth : 270, callback : cityPickerCallBack});" style="width: 85px; height: 14px; text-align: left;" value="${citya }"/>
							<input type="text" id="poiCategorySpell" name="poiCategorySpell" style="width: 25px" onkeyup="searchPoiCategoryBySpell('poiCategorySpell','type');" onkeydown="if(event.keyCode==13)searchPoi();" /> 
							<select id="type" name="type" style="width: 90px;"></select> 
							<span class="commonbtn" onclick="javascript:hiatusPoi();" style="float:right; color: red; height: 17px; margin-right: 5px">缺失</span>
						</td>
					</tr>
					<tr>
						<td>
							<input type="text" id="key" name="key" style="width: 130px;" onfocus="autoComplete(this);" onkeydown="if(event.keyCode==13)searchPoi();" /> 
							<span class="btn_bg" onclick="javascript:searchPoi();">搜索</span> 
							<input type="radio" name="autoNaviLanguage" value="zh" style="algin: right;" checked="checked" />中文 
							<input type="radio" name="autoNaviLanguage" value="en" style="algin: right;" />English
						</td>
					</tr>
					<tr>
						<td>
							经度：<strong style="width: 70px; font-weight: normal;  display: inline-block; color: red;margin-bottom: -4px;" id="d_longitude">${longitude}</strong> 
							纬度：<strong style="width: 70px; font-weight: normal;  display: inline-block; color: red;margin-bottom: -4px;" id="d_latitude">${latitude}</strong> 
							方向：<strong style="width: 30px; font-weight: normal;  display: inline-block; color: red;margin-bottom: -4px;" id="d_direction">${direction}</strong><br /> 
							定位时间：<strong class="c1" style="width: 130px; font-weight: normal;  display: inline-block; color: red;margin-bottom: -4px;" id="d_positioningTime">${positioningTime}</strong> 
							<input name="updateBtn" type="button" class="commonbtn" style="float:right;display: inline-block;" value="获取位置" onclick="getUserLocation();" />
							<input name="mapBtn" type="button" class="commonbtn" style="float:right;" value="地图" onclick="showMap();" />
						</td>
					</tr>
				</table>
				<table width="100%" height="73%" border="0" cellpadding="0" cellspacing="1" bgcolor="90846E">
					<tr style="background-color:rgb(220, 228, 232);" align="center">
						<td height="24" id="tabBar" onclick="resetOverlays()">导航库</td>
					</tr>
					<tr bgcolor="#FFFFFF">
						<td height="100%" valign="top" >
							<div id="resultPoi" style="height: 100%; position: relative;"></div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
