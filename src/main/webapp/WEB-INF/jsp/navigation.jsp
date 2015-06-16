<%@ page contentType="text/html;charset=utf-8" language="java"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>地图页面 | 奔驰坐席系统</title>
<link href="../css/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="js/jquery-ui.min.css" type="text/css" />
<link rel="stylesheet" href="js/citypicker.css" type="text/css" />
<script type="text/javascript" src="js/jquery-1.7.2.js"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script type="text/javascript" src="js/cities.js"></script>
<script type="text/javascript" src="js/poicategory.js"></script>
<script type="text/javascript" src="js/citypicker.js"></script>
<script type="text/javascript" src="js/navigation.js"></script>
<script type="text/javascript">
	var longitude = '${longitude }';
	var latitude = '${latitude }';
	var direction = '${direction}';
	var positioningTime = '${positioningTime}';
</script>
</head>
<body>
	<div class="pad10">
		<p class="h1 mb5">
			<span>目的地查询</span>
		</p>
		<div class="bg_gray mt10 pad10">
			<p>
				<input type="hidden" id="city" name="city" />
				城&nbsp;&nbsp;市&nbsp;<input type="text" class="input_txt" id="citya" name="citya" style="width: 180px; height: 22px; text-align: left;" onfocus="CityPicker(this, {callback : cityPickerCallBack});" />
				<!-- 城&nbsp;&nbsp;市&nbsp;<input type="text" class="input_txt" id="citya" name="citya" onfocus="cityAutoComplete(this);" style="width: 180px; height: 22px; text-align: left;" /> --> 
				<input type="text" class="input_txt" id="poiCategorySpell" name="poiCategorySpell" style="width: 30px; height: 22px; vertical-align: middle; margin-right: 1px;"
					onkeyup="searchPoiCategoryBySpell('poiCategorySpell','type');" />
				<select id="type" name="type" style="width: 120px; height: 24px; vertical-align: middle;"></select>
				<input type="text" class="input_txt" id="key" name="key" onfocus="autoComplete(this);" style="width: 180px; height: 22px; text-align: left;" /> 
				<input type="image" src="images/btn_search_poi.bmp" onclick="goMap();" />
			</p>
			<p class="cl"></p>
		</div>
		<div id="whitherList"></div>
	</div>
</body>
</html>
