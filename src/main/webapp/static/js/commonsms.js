//通用短信发送

function SmsVO(name,value)
{
	this.name = name;
	this.value = value;
}

/**
 * 通用短信发送
 * @param phone
 * @param agentId
 * @param appId
 * @param password
 * @param content
 * @param url 通用短信工具地址
 */
function openCommonSendSms(phone,agentId,appId,password,content,url) {
	var array = new Array();
	array.push(new SmsVO("phone",phone));
	array.push(new SmsVO("agentId",agentId));
	array.push(new SmsVO("appId",appId));
	array.push(new SmsVO("password",password));
	array.push(new SmsVO("content",encodeURIComponent(content)));
	var title = "发送短信";
	//title短信工具显示的浏览器标题
    openPostWindow(url,title,array);
}

/**
 * 创建临时表单：表单对象、表单元素、表单方法
 * @param url
 * @param title
 * @param array
 */
function openPostWindow(url, title, array)  
{  
    var smsInfoForm = addFormElements(array);
    smsInfoForm.id="SmsInfoForm";  
    smsInfoForm.method="post";  
    smsInfoForm.action=url;  
    smsInfoForm.target=title;  
    
    document.body.appendChild(smsInfoForm);    
    openWindow(url, title);
    smsInfoForm.submit();
    document.body.removeChild(smsInfoForm);
}

/**
 * 创建表单元素
 * @param element
 * @param type
 * @param name
 * @param value
 * @returns {___elementObj1}
 */
function createFormElements(element,type,name,value)
{
	var elementObj = document.createElement(element);  
    elementObj.type = type;  
    elementObj.name= name;
    elementObj.value= value;
	return elementObj;
}

/**
 * 创建表单对象，并向表单中添加创建的元素
 * @param array
 * @returns
 */
function addFormElements(array)
{
	var form = document.createElement("form");  
	var element = null;
	for(var i=0;i<array.length;i++)
	{
		element = createFormElements("input","hidden",array[i].name,array[i].value);
		form.appendChild(element);  
	}
	return form;
}

/**
 * 以window.open的方式打开请求页面 其中页面大小宽度距离均可自己定制，修改其中的参数值即可
 * @param title
 */
function openWindow(url, title)  
{  
    window.open(url, title,'width=650,height=540,left=400,top=200,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=auto,resizable=yes');   
}  