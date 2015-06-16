<%@ page contentType="text/html;charset=utf-8" language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>查看地图</title>
<style>
    body{font-size: 12px;margin: 0}
</style>
<link rel="stylesheet" href="autonavi/css/style_tip.css" type="text/css" />
<script type="text/javascript" src="js/jquery-1.7.2.js"></script>
<script language="javascript" src="<%=com.leo.common.cfg.AppConfig.getParameter("autonavi.mapjsurl")%>"></script>
<script type="text/javascript" src="js/mapsingle.js"></script>
<script type="text/javascript">

</script>
</head>
<body>
<div id="mapDiv" style="position:relative;margin-right:0px;"></div>
</body>
</html>