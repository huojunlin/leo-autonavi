//添加或修改basetask任务
function addOrModifyBaseTask() {
	if ($("#content").val() == "") {
		alert("请输入描述内容！");
		return;
	}
	var url = "../basetask/addOrModify.do";
	var pars = {
		workNumber : workNumber,
		content : $("#content").val(),
		finished : $("#finished").val(),
		taskTypeId : $("#taskTypeId").val(),
		subTaskTypeId : $("#subTaskTypeId").val()
	};
	$.post(url, pars, function(data) {
		if(data && data.error && data.error != "") {
			alert(error);
		} else {
			alert("保存任务成功！");
			window.close();
		}
	});
}

//查询任务类别
function getTaskType(taskTypeId,subTaskTypeId) {	
	var url = "../basetask/getTaskTypeList.do";
	var pars = {
		parentId : 0,	
		isHidden : 0
	};
	$.post(url, pars, function(data) {
		if(data && data.data) {
			for (var i = 0; i < data.data.length; i++) {
				$("#taskTypeId").append("<option value='" + data.data[i].id + "'>" + data.data[i].typeName + "</option>");
			}
			if(taskTypeId != "" && taskTypeId != "0") {
				$("#taskTypeId").val(taskTypeId);
			}			
			getSubTaskType($("#taskTypeId").val(),subTaskTypeId);
		}
	});
}


//获取任务子类型
function getSubTaskType(taskTypeId,subTaskTypeId) {
	var url = "../basetask/getTaskTypeList.do";
	var pars = {
		parentId : taskTypeId,
		isHidden : 0
	};
	$.post(url, pars, function(data) {
		if(data && data.data) {
			for (var i = 0; i < data.data.length; i++) {
				$("#subTaskTypeId").append("<option value='" + data.data[i].id + "'>" + data.data[i].typeName + "</option>");
			}			
		}
		if(subTaskTypeId != "" && subTaskTypeId != "0") {
			$("#subTaskTypeId").val(subTaskTypeId);
		}
	});
}


function taskTypeChange(){
	setTimeout(function(){
		// 待subTaskType赋值完毕，自动设置content内容
		if($("#subTaskTypeId option:selected").html() != null){
			// 没有任务内容，设置任务内容为  taskType - subTaskType
			if(typeof content == "undefined" || content == ""){
				var taskType = $("#taskTypeId option:selected").html();
				var subTaskType = $("#subTaskTypeId option:selected").html();
				$("#content").html(taskType + " - " + subTaskType);
			}
		} else {
			taskTypeChange();
		}
	},20);
}

$(document).ready(function() {
	$("#finished").val(finished);
	getTaskType(taskTypeId,subTaskTypeId);
	$("#taskTypeId").change(function() {
		$("#subTaskTypeId").html("");
		getSubTaskType($("#taskTypeId").val(),"");
		taskTypeChange();
	});
	$("#subTaskTypeId").change(function(){
		taskTypeChange();
	});
	taskTypeChange();
});