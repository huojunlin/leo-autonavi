
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

function tabChange(num) {
    $("#pagetab").find("tbody").hide();
    $("#pagetab").find("tbody").eq(num).show();
}

function search() {
    var atype = "";
	if($("#atype").val() != "") {
        atype = $("#atype").val();
    }
    if($("#akey").val() == "" && atype == "") {
        alert("请输入查询关键字，或分类");
        return;
    }
    if(poi &&  poi.latitude && poi.longitude &&  poi.latitude != "" && poi.longitude != "") {
        parent.cenpoi = poi;
        parent.cenpoi.image = "images/aroundCenter.png";
        parent.hideResult(0);
        var language = parent.getLanguage();
        parent.searchNearPoiList(poi.adcode,poi.longitude, poi.latitude,$("#akey").val(),atype,$("#range").val(),language,0,10);   
    } else {
        alert("无POI信息，无法查询周边");
    }    
}

function getDesc(longitude, latitude, language) {
    var url = 'getDesc.do';
    var pars = {longitude:longitude,latitude:latitude,language:language};
    $.ajax({
        url: url,
        type: "post",
        data: pars,
        beforeSend: function(XMLHttpRequest){
            XMLHttpRequest.setRequestHeader("RequestType", "ajax");
        },
        success: function(data, textStatus){
            try {
            	eval(data);
                if(data && data.desc && data.desc != "") {
                    $("#description").html(cutStr(data.desc, 100));
                    $("#description").attr("title", data.desc);
                    if((typeof(poi.provincename) == "undefined" || poi.provincename == "") && data.province != "") {
                    	poi.provincename = data.province;
                    }
                    if((typeof(poi.cityname) == "undefined" || poi.cityname == "") && data.city != "") {
                    	poi.cityname = data.city;
                    }
                    if((typeof(poi.districtname) == "undefined" || poi.districtname == "") && data.district != "") {
                    	poi.districtname = data.district;
                    }
                    
                    if($("#city",window.parent.document).val() == "" && data.adCode && data.adCode != "") {
                    	var adCode = data.adCode;
                    	if(adCode.length == 6) {
                    		if(adCode.substring(0,2) == "11" || adCode.substring(0,2) == "12" || adCode.substring(0,2) == "31" || adCode.substring(0,2) == "50") {
                    			adCode = adCode.substring(0,2) + "0000";
                    		} else {
                    			adCode = adCode.substring(0,4) + "00";
                    		}
                    	}
                    	$("#city",window.parent.document).val(adCode);
                    }
                }
            } catch(e) {
                
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            
        },
        complete: function(XMLHttpRequest, textStatus){
            
        }
    });
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
//自动补全
function autoComplete(input) {
	var city = parent.searchCity;
	var id = input.id;
	var caches={};
	$("#" + id).autocomplete({
		source: function(request, response) {
			var key=$.trim(request.term);    
	           if(key != "" && city != "") {
	               if (key in caches) {
	                   response(caches[key]);
	                   return;
	               }
	               $.ajax({                  
	                   type:"post",
	                   url: "getSuggestion.do",
	                   dataType:"json",
	                   data:{key:key, city:city, rn:2} ,
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

$(document).ready(function() {
    initPoiCategory("atype");
       
    $("#poiname").text(cutStr(poi.name, 40));
    $("#poiname").attr("title", poi.name);
    $("#address").html(cutString(poi.address,50));
    $("#address").attr("title", poi.address);
    $("#phone").text(poi.tel);
    if(poi.tel != "") {
        $("#copy").show();
    }
    if(poi.latitude && poi.latitude != "" && poi.longitude && poi.longitude != "") {
    	var language = parent.getLanguage();
        getDesc(poi.longitude, poi.latitude, language);
    }
});