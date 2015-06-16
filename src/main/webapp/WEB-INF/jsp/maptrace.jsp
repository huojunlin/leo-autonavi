<%@ page contentType="text/html;charset=utf-8" language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>地图监控</title>
	<style>
	    body{font-size: 12px;margin: 0}
	    .map_tools {background:none repeat scroll 0 0 #FFFFFF;border-bottom:1px solid #CAD2DD;box-shadow:1px 2px 3px 0 #828E9A;height:36px;position:relative;z-index: 202;}
		.map_tools div {float:left; margin-top:7px; padding:4px 6px;font-size:13px; }
	</style>
	<link href="css/public.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="js/jquery-1.7.2.js"></script>
	<script language="javascript" src="<%=com.leo.common.cfg.AppConfig.getParameter("autonavi.mapjsurl")%>"></script>
	<script type="text/javascript" src="js/maptrace.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript">

	</script>
</head>
<body>
<div id="mapTools" class="map_tools">
	<div>当前追踪车辆：<span id="traceTask"></span></div>
	<div style="float:right;margin-right:10px;">位置信息：<span id="tracePoint"></span></div>
</div>
<div id="mapDiv" style="position:relative;margin-right:0px;"></div>
</body>
</html>