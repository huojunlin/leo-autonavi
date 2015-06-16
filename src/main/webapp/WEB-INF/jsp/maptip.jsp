<%@ page contentType="text/html;charset=utf-8" language="java"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page isELIgnored="false"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>高德地图</title>
<style>
body {
	font-size: 12px;
	margin: 0
}
.ui-autocomplete{

       z-index: 11111;

}
</style>
<link rel="stylesheet" href="css/style_tip.css" type="text/css" />
<link rel="stylesheet" href="../js/jquery-ui-1.8.14.custom.css" type="text/css" />
<script type="text/javascript" src="../js/jquery-1.7.2.js"></script>
<script type="text/javascript" src="../js/jquery-ui-1.8.14.custom.min.js"></script>
<script type="text/javascript" src="../js/common.js"></script>
<script type="text/javascript" src="../autonavi/js/poicategory.js"></script>
<script type="text/javascript">
	var poi = {};
	eval("poi = ${pv}");

	$(document).ready(function() {
		if (poi.id.indexOf("myPosition_") >= 0) {
			$("#destroy").show();
			$("#addressInfo").html("<br/>");
		}
		//兼容ie
		if(document.all){  
			$("#topborder").css("top","-13px");
	       }else{  
			$("#topborder").css("top","-29px");
	       }  
	});
</script>

<script type="text/javascript" src="../autonavi/js/maptip.js"></script>
</head>
<body>
	<div id="close" title="关闭" onclick="javascript:parent.mapObj.clearInfoWindow();">
		<div class="close_d" style="">
			<img class="close_i" src="images/tools.png" style="" />
		</div>
	</div>
	<div class="title" style="position: absolute; height: 34px; z-index: 16; width: 384px; background-color: rgb(255, 255, 255);">
		<div style="position: relative; height: 33px; z-index: 1; white-space: nowrap; color: rgb(124, 112, 112); font-weight: bold; font-size: 12px; line-height: 33px; margin: 0px 6px; padding-left: 6px; border-bottom-width: 1px; border-bottom-style: dashed; border-bottom-color: rgb(215, 215, 215);">
			<div>
				<div style="float: left;" id="poiname"></div>
			</div>
		</div>
		<div style="position: absolute; right: 34px; top: 0px; z-index: 1000;" onclick="javascript:parent.destroyMarker(poi.id);">
			<div style="float: right;">
				<div style="height: 33px; position: relative; width: 34px;">
					<div id="destroy" style="display:none;text-align:center; overflow: hidden; cursor: pointer; position: relative; width: 34px; height: 33px; float: right;" onmouseover="javascript:$(this).css('background-color', 'rgb(235, 238, 240)');" onmouseout="javascript:$(this).css('background-color', 'rgb(255, 255, 255)');">
						<img src="images/destroy.png" title="删除自定义标点" style="margin-top: 8px;"/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div style="position: absolute; top: 34px; left: 0px; overflow: hidden; height: 207px; width: 384px; visibility: visible; display: block; background-color: rgb(255, 255, 255);">
		<div>
			<div style="position: relative; width: 384px; padding-bottom: 8px;">
				<div style="max-height: 290px; overflow: hidden; padding-top: 2px; margin-top: 6px; position: relative; background-color: rgb(255, 255, 255);">
					<div style="position: relative;">
						<div style="padding: 5px 11px 7px 12px;">
							<div class="base-info" style="height: 80px;">
								<div class="r-baseinfo">
								
									<div class="item" style="line-height: 20px; height: 20px; position: relative; margin-bottom: 5px;">
										<div class="price-item">
											<span>电话：</span>
											<span id="phone"></span>
										</div>
									</div>
									<div class="item" style="margin-bottom: 6px;">
										<span>地址：</span>
										<span id="address"></span>
									</div>
									<div class="item" style="margin-bottom: 6px;">
										<span>方位：</span>
										<span id="description"></span>
									</div>
								</div>
								<div class="clearFloat"></div>
							</div>
							<div class="detail-info" style="height: 16px;">
								<div class="item"
									style="float: left; width: 174px; position: relative;">
									<div
										style="position: absolute; overflow: hidden; width: 16px; height: 16px; left: 0px; top: 0px; z-index: 1;">
									</div>
									<div class="sendpoi" style="float:left; width: 105px; " onclick="parent.sendWhither(poi.provincename, poi.cityname, poi.districtname, poi.name, poi.longitude, poi.latitude, poi.address, poi.tel, 1);">添加至发送列表</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="commonpanel" id="commonpanel" style="width: 382px; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(215, 224, 230);">
					<div style="width: 382px; position: relative;">
						<div style="width: 382px; height: 27px; position: relative; z-index: 15;">
							<div class="sButCon fw" style="border-left-width: 0px; border-bottom-width: 0px;">
								<div class="icon0">
									<div style="position: absolute; overflow: hidden; width: 15px; height: 16px; left: 0px; top: 0px;">
										<img src="images/search.png" width="45" height="36"
											style="width: 45px; height: 36px; position: absolute; left: -29px; top: 0px; z-index: 0; border: 0px;"/>
									</div>
								</div>
								<span>在附近找</span>
							</div>
						</div>
						<div style="height: 41px; position: relative;">
							<div style="width: 382px; height: 28px; position: absolute; z-index: 10; top: 14px; left: 12px;">
								<form>
									<select id="range" name="range" style="width: 60px;;height:26px;">
									<option value="500">0.5公里</option>
									<option value="1000">1公里</option>
									<option value="2000">2公里</option>
									<option value="5000" selected="selected">5公里</option>
									<option value="10000">10公里</option>
									<option value="20000">20公里</option>
							</select>
							<input id="poiSpell" type="text" name="poiSpell"
								style="width: 30px;height:22px;"
								onkeyup="searchPoiCategoryBySpell('poiSpell','atype');" />
							<select id="atype" name="atype" style="width: 100px;height:26px;"></select>
							<input type="text" name="akey" id="akey" onkeydown="if(event.keyCode==13)search();" style="width: 100px; height:22px;" />
							<div class="surebut" style="float:right; width: 45px; margin-right: 15px;" onclick="search();">搜索</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
