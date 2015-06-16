package com.leo.map.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.leo.common.util.StringUtils;
import com.leo.map.service.AutoNaviService;
import com.leo.map.vo.PoiSearchResult;
import com.leo.map.vo.PositionDesc;
import com.leo.map.vo.TrafficInfo;

@Controller
@RequestMapping("/autonavi/*")
public class AutoNaviController {
	private static final Logger log = LoggerFactory
			.getLogger(AutoNaviController.class);

	@Autowired
	private AutoNaviService autoNaviService;

	// 进入地图导航页面
	@RequestMapping(value = "navigation.html")
	public String goNavigation(HttpServletRequest req, HttpServletResponse res, ModelMap model) {
		log.info("goNavigation Start");
		log.info("goNavigation End");
		return "/navigation";
	}

	// 进入地图页面
	@RequestMapping(value = "map.html")
	public String goMap(String city, String type, String key, String longitude, String latitude, String direction, String positioningTime, boolean openFlag, String citya,  
			HttpServletRequest req, HttpServletResponse res, ModelMap model) {
		log.info("goMap Start");
		model.addAttribute("city", city);
		model.addAttribute("type", type);
		model.addAttribute("key", key);
		model.addAttribute("longitude", longitude);
		model.addAttribute("latitude", latitude);
		try {
			if(!StringUtils.isEmpty(direction)) {
				model.addAttribute("direction", URLDecoder.decode(direction, "utf-8"));
			}
			if(!StringUtils.isEmpty(citya)) {
				model.addAttribute("citya", URLDecoder.decode(citya, "utf-8"));
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		model.addAttribute("positioningTime", positioningTime);
		model.addAttribute("openFlag", openFlag);
		log.info("goMap End");
		return "/map";
	}

	// 进入地图独立页面，只显示车辆位置
	@RequestMapping(value = "mapsingle.html")
	public String goMapSingle() {
		log.info("goMapSingle Start");
		log.info("goMapSingle End");
		return "/mapsingle";
	}

	// 进入地图监控页面，显示车辆轨迹
	@RequestMapping(value = "maptrace.html")
	public String goMapTrace() {
		log.info("goMapTrace Start");
		log.info("goMapTrace End");
		return "/maptrace";
	}

	// 进入地图气泡页面
	@RequestMapping(value = "tip.html")
	public String goTip(String pv, HttpServletRequest req,
			HttpServletResponse res, ModelMap model) {
		try {
			if(!StringUtils.isEmpty(pv)) {
				model.put("pv", URLDecoder.decode(pv, "utf-8"));
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return "/maptip";
	}

	// 获取POI查询结果
	@RequestMapping("/getPoiList.do")
	public @ResponseBody
	PoiSearchResult getPoiList(String city, String key, String type, String language,
			int currentpage, int countperpage, HttpServletRequest req,
			HttpServletResponse res, ModelMap model) {
		return autoNaviService.getPoiByKeyword(city, key, type, language, currentpage,
				countperpage, "POI");
	}

	// 获取周边查询结果
	@RequestMapping("/getNearPoiList.do")
	public @ResponseBody
	PoiSearchResult getNearPoiList(String city, String akey, String atype,
			String longitude, String latitude, int range, String language, int currentpage,
			int countperpage, HttpServletRequest req, HttpServletResponse res,
			ModelMap model) {
		return autoNaviService.getPoiByLonlat(city, akey, atype, longitude,
				latitude, range, language, currentpage, countperpage, "POI", "1");
	}

	// 获取视野内查询结果
	@RequestMapping("/getRectanglePoiList.do")
	public @ResponseBody
	PoiSearchResult getRectanglePoiList(String geoobj, String key, String type,
			int currentpage, int countperpage, HttpServletRequest req,
			HttpServletResponse res, ModelMap model) {
		return autoNaviService.getPoiByRectangle(geoobj, key, type,
				currentpage, countperpage, "POI", "1");
	}

	// 获取位置描述
	@RequestMapping("/getDesc.do")
	public @ResponseBody
	PositionDesc getDesc(String longitude, String latitude, String language, 
			HttpServletRequest req, HttpServletResponse res, ModelMap model) {
		return autoNaviService.getDescByLonlat(longitude, latitude, language);
	}

	// 获取提示内容
	@RequestMapping("/getSuggestion.do")
	public void getSuggestion(String city, String key, int rn,
			HttpServletRequest req, HttpServletResponse res, ModelMap model) {
		StringBuffer sb = new StringBuffer("[");
		List<String> result = autoNaviService.getSuggestionTip(city, key);
		if (result != null && result.size() > 0) {
			if (result.size() >= rn) {
				for (int i = 0; i < rn; i++) {
					sb.append("\"" + result.get(i) + "\",");
				}
			} else {
				for (int i = 0; i < result.size(); i++) {
					sb.append("\"" + result.get(i) + "\",");
				}
			}
		}
		String s = sb.toString();
		if (s.lastIndexOf(",") > -1) {
			s = s.substring(0, s.lastIndexOf(",")) + "]";
		}
		try {
			res.setCharacterEncoding("utf-8");
			res.getWriter().print(s);
		} catch (Exception e) {
			log.error("getSuggestion error:" + e);
		}
	}

	// 搜索道路交通信息列表
	@RequestMapping("/getSearchLinesList.do")
	public @ResponseBody
	List<TrafficInfo> getSearchLinesList(String city, String key) {
		return autoNaviService.getTrafficinfoSearchLines(city, 0, key, 1);
	}
}
