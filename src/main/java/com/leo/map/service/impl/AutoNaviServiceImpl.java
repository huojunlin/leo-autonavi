package com.leo.map.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.leo.common.cfg.AppConfig;
import com.leo.common.util.Security;
import com.leo.map.service.AutoNaviService;
import com.leo.map.vo.GeoCode;
import com.leo.map.vo.Poi;
import com.leo.map.vo.PoiSearchResult;
import com.leo.map.vo.PositionDesc;
import com.leo.map.vo.ReGeoCodeCross;
import com.leo.map.vo.ReGeoCodePoi;
import com.leo.map.vo.ReGeoCodeResult;
import com.leo.map.vo.ReGeoCodeRoad;
import com.leo.map.vo.Road;
import com.leo.map.vo.RoadInter;
import com.leo.map.vo.TrafficInfo;
import com.leo.map.vo.TrafficItem;

@Service
public class AutoNaviServiceImpl implements AutoNaviService {

	public static Logger log = LoggerFactory.getLogger(AutoNaviServiceImpl.class);

	private String getAutonaviChannel() {
		return AppConfig.getParameter("autonavi.channel");
	}

	private String getAutonaviKey() {
		return AppConfig.getParameter("autonavi.key");
	}

	private String getPoiSearchUrl() {
		return AppConfig.getParameter("autonavi.backendurl")
				+ "/ws/mapapi/poi/search";
	}

	private String getGeocodeUrl() {
		return AppConfig.getParameter("autonavi.backendurl")
				+ "/ws/mapapi/geo/code";
	}

	private String getReverseGeocodeUrl() {
		return AppConfig.getParameter("autonavi.backendurl")
				+ "/ws/mapapi/geo/reversecode";
	}

	private String getSuggestionTipsUrl() {
		return AppConfig.getParameter("autonavi.backendurl")
				+ "/ws/mapapi/suggestion/tips";
	}

	private String getSearchLinesUrl() {
		return AppConfig.getParameter("autonavi.backendurl")
				+ "/ws/mapapi/trafficinfo/search_lines";
	}
	
	/**
	 * 根据高德poi搜索接口返回的xml字符串，转换成分页列表
	 * 
	 * @author nian 20120905
	 * @param xmlStr
	 *            高德poi搜索接口返回的xml字符串
	 * @param pagesize
	 *            每页返回记录个数
	 * @param pagenum
	 *            从0开始 当前页码
	 * @return 返回分页列表
	 */
	@SuppressWarnings("unchecked")
	private PoiSearchResult getPoiSearchList(String xmlStr, int pagenum,
			int pagesize) {
		PoiSearchResult result = new PoiSearchResult();
		try {
			// 将xml文档转换为Document的对象
			Document document = DocumentHelper.parseText(xmlStr);
			// 获取根元素
			Element root = document.getRootElement();
			// <result><!-- true / false, 是否请求成功 --></result>
			if ("true".equalsIgnoreCase(root.elementTextTrim("result"))) {
				// 如果有poi_list元素，得到poi_list元素,并遍历为list
				if (root.element("poi_list") != null) {
					List<Element> poiEltList = root.element("poi_list")
							.elements("poi");
					if (poiEltList != null) {
						for (Element elt : poiEltList) {
							Poi poi = new Poi();
							poi.setId(elt.elementTextTrim("id"));
							//poi.setName(elt.elementTextTrim("name"));
							//poi.setAddress(elt.elementTextTrim("address"));
							poi.setName(elt.elementTextTrim("name").replaceAll("[\']", "＇").replaceAll("[\"]", "＂"));
							poi.setAddress(elt.elementTextTrim("address").replaceAll("[\']", "＇").replaceAll("[\"]", "＂"));							
							poi.setTel(elt.elementTextTrim("tel"));
							poi.setAreacode(elt.elementTextTrim("areacode"));
							poi.setAdcode(elt.elementTextTrim("adcode"));
							poi.setLongitude(elt.elementTextTrim("longitude"));
							poi.setLatitude(elt.elementTextTrim("latitude"));
							poi.setType(elt.elementTextTrim("type"));
							poi.setTypecode(elt.elementTextTrim("typecode"));
							poi.setProvincename(elt
									.elementTextTrim("provincename"));
							poi.setProvincecode(elt
									.elementTextTrim("provincecode"));
							poi.setCityname(elt.elementTextTrim("cityname"));
							poi.setCitycode(elt.elementTextTrim("citycode"));
							poi.setDistrictname(elt
									.elementTextTrim("districtname"));
							poi.setDistrictcode(elt
									.elementTextTrim("districtcode"));
							poi.setDistance(elt.elementTextTrim("distance"));

							result.getPoiList().add(poi);
						}
					}
				}
				// 得到road_list元素,并遍历为list
				if (root.element("road_list") != null) {
					List<Element> roadEltList = root.element("road_list")
							.elements("road");
					if (roadEltList != null) {
						for (Element elt : roadEltList) {
							Road road = new Road();
							road.setId(elt.elementTextTrim("id"));
							road.setName(elt.elementTextTrim("name"));
							road.setCitycode(elt.elementTextTrim("citycode"));
							road.setWidth(elt.elementTextTrim("width"));
							road.setLevel(elt.elementTextTrim("level"));

							result.getRoadList().add(road);
						}
					}
				}
				// 得到roadinter_list元素,并遍历为list
				if (root.element("roadinter_list") != null) {
					List<Element> roadinterEltList = root.element(
							"roadinter_list").elements("roadinter");
					for (Element elt : roadinterEltList) {
						RoadInter roadInter = new RoadInter();
						roadInter.setId(elt.elementTextTrim("id"));
						roadInter.setName(elt.elementTextTrim("name"));
						roadInter.setCitycode(elt.elementTextTrim("citycode"));
						roadInter
								.setLongitude(elt.elementTextTrim("longitude"));
						roadInter.setLatitude(elt.elementTextTrim("latitude"));

						result.getRoadInterList().add(roadInter);
					}
				}
				// 构建分页对象

				result.setTotal(Integer.valueOf(root.elementTextTrim("total")));
				result.setNumber(result.getPoiList().size()
						+ result.getRoadList().size()
						+ result.getRoadInterList().size());
				result.setTotalpage((result.getTotal() - 1) / pagesize + 1);
			} else {
				log.error("getPoiSearchList error:{message:"
						+ root.elementTextTrim("message") + "}");
			}
		} catch (Exception e) {
			log.error("getPoiSearchList error:" + e);
		}
		return result;
	}

	/**
	 * 根据ID查询POI信息
	 * 
	 * @author nian 20120905
	 * @param id
	 *            POI ID
	 * @return 搜索结果分页对象
	 */
	public PoiSearchResult getPoiByID(String id) {
		log.debug("getPoiByID Start:{id:" + id + "}");
		PoiSearchResult result = null;
		StringBuffer urlStr = new StringBuffer(getPoiSearchUrl());
		StringBuffer paramStr = new StringBuffer("");

		paramStr.append("query_type=IDQ");
		paramStr.append("&id=" + id);
		paramStr.append("&data_type=POI+ROAD+ROADINTER");
		paramStr.append("&output=xml");
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&sign=" + getSign(id));

		try {
			// 发送post请求，并返回xml
			String resultxml = post(urlStr.toString(), paramStr.toString());
			result = getPoiSearchList(resultxml, 0, 1);
		} catch (Exception e) {
			log.error("getPoiByID error:" + e);
		}
		log.debug("getPoiByID End");
		return result;
	}

	/**
	 * 根据关键字查询POI，其中，keywords和category必须有一个
	 * 
	 * @author nian 20120905
	 * @param city
	 *            城市，可以是010、北京、110000,缺省为全国: total
	 * @param keywords
	 *            关键字, 多个关键字采用分隔符 |表示或, 空格表示与, 双引号表示不可分割.
	 * @param category
	 *            poi分类 多个分类采用分隔符 | 表示或
	 * @param pagesize
	 *            每页返回记录个数
	 * @param pagenum
	 *            当前页码 从0开始
	 * @param data_type
	 *            数据类型, POI、ROAD、ROADINTER, 可单个赋值, 也可使用 + 任意组合
	 * @return 搜索结果分页对象
	 */
	public PoiSearchResult getPoiByKeyword(String city, String keywords,
			String category, String language, int pagenum, int pagesize, String data_type) {
		log.debug("getPoiByKeyword Start:{city:" + city + ",keywords:"
				+ keywords + ",category:" + category + ",language:" + language  + ",pagenum:" + pagenum
				+ ",pagesize:" + pagesize + ",data_type:" + data_type + "}");
		PoiSearchResult result = null;
		StringBuffer urlStr = new StringBuffer(getPoiSearchUrl());
		StringBuffer paramStr = new StringBuffer("");
		if (data_type == null || data_type.length() == 0) {
			// 数据类型默认为POI,防止为输入时无返回记录问题
			data_type = "POI";
		}
		paramStr.append("query_type=TQUERY");
		paramStr.append("&data_type=" + data_type);
		paramStr.append("&city=" + city);
		paramStr.append("&keywords=" + keywords);
		paramStr.append("&category=" + category);
		paramStr.append("&data_type=" + data_type);
		paramStr.append("&pagesize=" + pagesize);
		paramStr.append("&pagenum=" + (pagenum + 1));
		paramStr.append("&output=xml");
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&qii=false");
		paramStr.append("&language=" + language);
		paramStr.append("&sign=" + getSign(keywords, category));

		try {
			// 发送post请求，并返回xml
			String resultxml = post(urlStr.toString(), paramStr.toString());
			result = getPoiSearchList(resultxml, pagenum, pagesize);
		} catch (Exception e) {
			log.error("getPoiByKeyword ERROR:" + e);
		}
		log.debug("getPoiByKeyword End");
		return result;
	}

	/**
	 * 基于某一点(经纬度坐标)周边查询
	 * 
	 * @author nian 20120905]
	 * @param keywords
	 *            关键字, 多个关键字采用分隔符 |表示或, 空格表示与, 双引号表示不可分割.
	 * @param longitude
	 *            经度
	 * @param latitude
	 *            纬度
	 * @param sort_rule
	 *            排序规则, 0: 混合（缺省） 1: 距离 2: 名称 3: 长度 4: 饱和度
	 * @param range
	 *            范围, 单位米, 有效取值[0, 50000], 超出有效范围自动取值3000米
	 * @param pagesize
	 *            每页返回记录个数
	 * @param pagenum
	 *            当前页码 从0开始
	 * @param data_type
	 *            数据类型, POI、ROAD、ROADINTER, 可单个赋值, 也可使用 + 任意组合
	 * @return 搜索结果分页对象
	 */
	public PoiSearchResult getPoiByLonlat(String city, String keywords,
			String category, String longitude, String latitude, int range, String language, 
			int pagenum, int pagesize, String data_type, String sort_rule) {
		log.debug("getPoiByLonlat Start:{city:" + city + ",keywords:"
				+ keywords + ",category:" + category + ",longitude:"
				+ longitude + ",latitude:" + latitude + ",range:" + range + ",language:" + language
				+ ",pagenum:" + pagenum + ",pagesize:" + pagesize
				+ ",data_type:" + data_type + ",sort_rule:" + sort_rule + "}");
		PoiSearchResult result = null;
		StringBuffer urlStr = new StringBuffer(getPoiSearchUrl());
		StringBuffer paramStr = new StringBuffer("");
		if (data_type == null || data_type.length() == 0) {
			// 数据类型默认为POI,防止为输入时无返回记录问题
			data_type = "POI";
		}
		paramStr.append("query_type=RQBXY");
		paramStr.append("&data_type=" + data_type);
		paramStr.append("&city=" + city);
		paramStr.append("&keywords=" + keywords);
		paramStr.append("&category=" + category);
		paramStr.append("&longitude=" + longitude);
		paramStr.append("&latitude=" + latitude);
		paramStr.append("&sort_rule=" + sort_rule);
		paramStr.append("&range=" + range);
		paramStr.append("&pagesize=" + pagesize);
		paramStr.append("&pagenum=" + (pagenum + 1));
		paramStr.append("&output=xml");
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&qii=false");
		paramStr.append("&language=" + language);
		paramStr.append("&sign="
				+ getSign(longitude, latitude, keywords, category));
		try {
			// 发送post请求，并返回xml
			String resultxml = post(urlStr.toString(), paramStr.toString());
			result = getPoiSearchList(resultxml, pagenum, pagesize);
		} catch (Exception e) {
			log.error("getPoiByLonlat error:" + e);
		}
		log.debug("getPoiByLonlat End");
		return result;
	}

	// 矩形范围内搜索
	public PoiSearchResult getPoiByRectangle(String geoobj, String keywords,
			String category, int pagenum, int pagesize, String data_type,
			String sort_rule) {
		log.debug("getPoiByRectangle Start:{geoobj:" + geoobj + ",keywords:"
				+ keywords + ",category:" + category + ",pagenum:" + pagenum
				+ ",pagesize:" + pagesize + ",data_type:" + data_type
				+ ",sort_rule:" + sort_rule + "}");
		PoiSearchResult result = null;
		StringBuffer urlStr = new StringBuffer(getPoiSearchUrl());
		StringBuffer paramStr = new StringBuffer("");
		if (data_type == null || data_type.length() == 0) {
			// 数据类型默认为POI,防止为输入时无返回记录问题
			data_type = "POI";
		}
		paramStr.append("query_type=SPQ");
		paramStr.append("&data_type=" + data_type);
		String tGeoobj = geoobj;
		if (!"".equals(geoobj)) {
			try {
				geoobj = URLEncoder.encode(geoobj, "UTF-8");
			} catch (Exception e) {
				log.error("getPoiByRectangle URLEncoder.encode error:" + e);
			}
		}
		paramStr.append("&geoobj=" + geoobj);
		paramStr.append("&keywords=" + keywords);
		paramStr.append("&category=" + category);
		paramStr.append("&sort_rule=" + sort_rule);
		paramStr.append("&pagesize=" + pagesize);
		paramStr.append("&pagenum=" + (pagenum + 1));
		paramStr.append("&output=xml");
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&sign=" + getSign(keywords, category, tGeoobj));
		try {
			// 发送post请求，并返回xml
			String resultxml = post(urlStr.toString(), paramStr.toString());
			result = getPoiSearchList(resultxml, pagenum, pagesize);
		} catch (Exception e) {
			log.error("getPoiByRectangle error:" + e);
		}
		log.debug("getPoiByRectangle End");
		return result;
	}

	/**
	 * 根据地址，查询地理编码
	 * 
	 * @author nian 120906
	 * @param address
	 *            地址 不允许缺省
	 * @param adcode
	 *            城市adcode，用于过滤地理编码结果集。adcode可以输入如"11"，"1100"，"110000"等格式
	 * @param adcode_beginwith
	 *            当adcode有值时，此参数有效。用于匹配adcode的方式，True：被比较值以adcode开始；False：
	 *            被比较值与adcode完全相等
	 * @param onerow
	 *            返回地理编码方式，True：只返回最适合的一条；False:返回所有匹配的记录集
	 * @return 地理编码结果List
	 */
	@SuppressWarnings("unchecked")
	public List<GeoCode> getGeoCode(String address, String adcode,
			boolean adcode_beginwith, boolean onerow) {
		log.debug("getGeoCode Start:{address:" + address + ",adcode:" + adcode
				+ ",adcode_beginwith:" + adcode_beginwith + ",onerow:" + onerow
				+ "}");
		List<GeoCode> result = new ArrayList<GeoCode>();

		StringBuffer urlStr = new StringBuffer(getGeocodeUrl());
		StringBuffer paramStr = new StringBuffer("");
		paramStr.append("address=" + address);
		paramStr.append("&adcode=" + adcode);
		paramStr.append("&adcode_beginwith=" + adcode_beginwith);
		paramStr.append("&onerow=" + onerow);
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&output=xml");
		paramStr.append("&sign=" + getSign(address));

		try {
			// 发送post请求，并返回xml
			String xml = post(urlStr.toString(), paramStr.toString());
			// 将xml文档转换为Document的对象
			Document document = DocumentHelper.parseText(xml);
			// 获取根元素
			Element root = document.getRootElement();
			// <result><!-- true / false, 是否请求成功 --></result>
			if ("true".equalsIgnoreCase(root.elementTextTrim("result"))) {
				List<Element> geocodeEltList = root.elements("geocode");
				if (geocodeEltList != null) {
					for (Element elt : geocodeEltList) {
						GeoCode geoCode = new GeoCode();
						geoCode.setLevel(elt.elementTextTrim("level"));
						geoCode.setCountry(elt.elementTextTrim("country"));
						geoCode.setRegion(elt.elementTextTrim("region"));
						geoCode.setCityname(elt.elementTextTrim("cityname"));
						geoCode.setDistrict(elt.elementTextTrim("district"));
						geoCode.setFormattedaddress(elt
								.elementTextTrim("formattedaddress"));
						geoCode.setLongitude(elt.elementTextTrim("longitude"));
						geoCode.setLatitude(elt.elementTextTrim("latitude"));
						result.add(geoCode);
					}
				}
			} else {
				log.error("getGeoCode error:{message:"
						+ root.elementTextTrim("message") + "}");
			}
		} catch (Exception e) {
			log.error("getGeoCode error:" + e);
		}
		log.debug("getGeoCode End");
		return result;
	}

	/**
	 * 逆地理编码
	 * 
	 * @author nian 120906
	 * @param longitude
	 *            经度
	 * @param latitude
	 *            纬度
	 * @return 查询结果
	 */
	@SuppressWarnings("unchecked")
	public ReGeoCodeResult getReverseGeoCode(String longitude, String latitude, String language) {
		log.debug("getReverseGeoCode Start:{longitude:" + longitude
				+ ",latitude:" + latitude + ",language:" + language + "}");
		StringBuffer urlStr = new StringBuffer(getReverseGeocodeUrl());
		StringBuffer paramStr = new StringBuffer("");
		paramStr.append("longitude=" + longitude);
		paramStr.append("&latitude=" + latitude);
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&output=xml");
		paramStr.append("&language=" + language);
		paramStr.append("&sign=" + getSign(longitude, latitude));

		ReGeoCodeResult result = new ReGeoCodeResult();
		try {
			// 发送post请求，并返回xml
			String xml = post(urlStr.toString(), paramStr.toString());
			// 将xml文档转换为Document的对象
			Document document = DocumentHelper.parseText(xml);
			// 获取根元素
			Element root = document.getRootElement();
			// <result><!-- true / false, 是否请求成功 --></result>
			if ("true".equalsIgnoreCase(root.elementTextTrim("result"))) {
				result.setCountry(root.elementTextTrim("country"));
				result.setProvince(root.elementTextTrim("province"));
				result.setProvinceadcode(root.elementTextTrim("provinceadcode"));
				result.setCity(root.elementTextTrim("city"));
				result.setCityadcode(root.elementTextTrim("cityadcode"));
				result.setDistrict(root.elementTextTrim("district"));
				result.setDistrictadcode(root.elementTextTrim("districtadcode"));
				result.setAdcode(root.elementTextTrim("adcode"));
				result.setCitycode(root.elementTextTrim("citycode"));
				result.setTel(root.elementTextTrim("tel"));
				result.setDesc(root.elementTextTrim("desc"));
				result.setPos(root.elementTextTrim("pos"));

				// 如果有poi_list元素，得到poi_list元素,并遍历为list
				if (root.element("poi_list") != null) {
					List<Element> poiEltList = root.element("poi_list")
							.elements("poi");
					if (poiEltList != null) {
						for (Element elt : poiEltList) {
							ReGeoCodePoi rcp = new ReGeoCodePoi();
							rcp.setPoiid(elt.elementTextTrim("poiid"));
							rcp.setName(elt.elementTextTrim("name"));
							rcp.setAddress(elt.elementTextTrim("address"));
							rcp.setTel(elt.elementTextTrim("tel"));
							rcp.setDistance(elt.elementTextTrim("distance"));
							rcp.setDirection(elt.elementTextTrim("direction"));
							rcp.setWeight(elt.elementTextTrim("weight"));
							rcp.setType(elt.elementTextTrim("type"));
							rcp.setTypecode(elt.elementTextTrim("typecode"));
							rcp.setLongitude(elt.elementTextTrim("longitude"));
							rcp.setLatitude(elt.elementTextTrim("latitude"));

							result.getPoiList().add(rcp);
						}
					}
				}
				// 得到road_list元素,并遍历为list
				if (root.element("road_list") != null) {
					List<Element> roadEltList = root.element("road_list")
							.elements("road");
					if (roadEltList != null) {
						for (Element elt : roadEltList) {
							ReGeoCodeRoad rcr = new ReGeoCodeRoad();
							rcr.setRoadid(elt.elementTextTrim("roadid"));
							rcr.setLevel(elt.elementTextTrim("level"));
							rcr.setName(elt.elementTextTrim("name"));
							rcr.setDirection(elt.elementTextTrim("direction"));
							rcr.setDistance(elt.elementTextTrim("distance"));
							rcr.setWidth(elt.elementTextTrim("width"));
							rcr.setLongitude(elt.elementTextTrim("longitude"));
							rcr.setLatitude(elt.elementTextTrim("latitude"));
							result.getRoadList().add(rcr);
						}
					}
				}
				// 得到cross_list元素,并遍历为list
				if (root.element("cross_list") != null) {
					List<Element> crossEltList = root.element("cross_list")
							.elements("cross");
					for (Element elt : crossEltList) {
						ReGeoCodeCross rcc = new ReGeoCodeCross();
						rcc.setCrossid(elt.elementTextTrim("crossid"));
						rcc.setLevel(elt.elementTextTrim("level"));
						rcc.setName(elt.elementTextTrim("name"));
						rcc.setDirection(elt.elementTextTrim("direction"));
						rcc.setDistance(elt.elementTextTrim("distance"));
						rcc.setWeight(elt.elementTextTrim("weight"));
						rcc.setLongitude(elt.elementTextTrim("longitude"));
						rcc.setLatitude(elt.elementTextTrim("latitude"));
						rcc.setWidth(elt.elementTextTrim("width"));
						result.getCrossList().add(rcc);
					}
				}
			} else {
				log.error("getReverseGeoCode error:{message:"
						+ root.elementTextTrim("message") + "}");
			}
		} catch (Exception e) {
			log.error("getReverseGeoCode error:" + e);
		}
		log.debug("getReverseGeoCode End");
		return result;
	}

	/**
	 * 逆地理编码 通过经纬度查询位置描述 返回类型为json
	 * 
	 * @param strlonlat
	 *            经纬度信息
	 * @return 位置描述
	 */
	public PositionDesc getDescByLonlat(String longitude, String latitude, String language) {
		log.debug("getDescByLonlat Start:{longitude:" + longitude
				+ ",latitude:" + latitude + ",language:" + language + "}");
		PositionDesc result = null;
		try {
			ReGeoCodeResult reCodeResult = getReverseGeoCode(longitude,
					latitude, language);
			if (reCodeResult != null && reCodeResult.getCity() != null) {
				result = new PositionDesc();
				// 省市区信息
				result.setProvince(reCodeResult.getProvince());
				result.setCity(reCodeResult.getCity());
				result.setDistrict(reCodeResult.getDistrict());
				result.setAdCode(reCodeResult.getAdcode());

				String desc = "";
				if (reCodeResult.getCity().equals(reCodeResult.getProvince())) {
					desc += reCodeResult.getCity();
				} else {
					desc += reCodeResult.getProvince() + "-"
							+ reCodeResult.getCity();
				}
				if (reCodeResult.getDistrict() != null) {
					desc += "-" + reCodeResult.getDistrict();
				}
				desc += "\n";
				// POI信息，最多取2个点
				if (reCodeResult.getPoiList() != null
						&& reCodeResult.getPoiList().size() > 0) {
					for (int i = 0; i < reCodeResult.getPoiList().size(); i++) {
						desc += reCodeResult.getPoiList().get(i).getName();
						if (!"".equals(getDirection(reCodeResult.getPoiList()
								.get(i).getDirection()))) {
							if("zh".equals(language)) {
								desc += getDirection(reCodeResult.getPoiList()
										.get(i).getDirection())
										+ "侧"
										+ reCodeResult.getPoiList().get(i)
										.getDistance() + "米";
							} else if("en".equals(language)) {
								desc += " the " + reCodeResult.getPoiList()
										.get(i).getDirection()
										+ " side of " + reCodeResult.getPoiList().get(i)
										.getDistance() + " meters";
							}
						}
						desc += ",";
						if (i >= 1)
							break;
					}
				}
				// 道路信息，最多取2条道路
				if (reCodeResult.getRoadList() != null
						&& reCodeResult.getRoadList().size() > 0) {
					for (int i = 0; i < reCodeResult.getRoadList().size(); i++) {
						desc += reCodeResult.getRoadList().get(i).getName();
						if (!"".equals(getDirection(reCodeResult.getRoadList()
								.get(i).getDirection()))) {
							if("zh".equals(language)) {
								desc += getDirection(reCodeResult.getPoiList()
										.get(i).getDirection())
										+ "侧"
										+ reCodeResult.getPoiList().get(i)
										.getDistance() + "米";
							} else if("en".equals(language)) {
								desc += " the " + reCodeResult.getPoiList()
										.get(i).getDirection()
										+ " side of " + reCodeResult.getPoiList().get(i)
										.getDistance() + " meters";
							}
						}
						desc += ",";
						if (i >= 1)
							break;
					}
				}
				if (desc.lastIndexOf(",") == (desc.length() - 1)) {
					desc = desc.substring(0, desc.length() - 1);
				}
				result.setDesc(desc);
			}
		} catch (Exception e) {
			log.error("getDescByLonlat error:", e);
		}
		log.debug("getDescByLonlat End");
		return result;
	}

	/**
	 * 输入提示
	 * 
	 * @author nian 20120914
	 * @param city
	 *            城市
	 * @param words
	 *            关键字
	 * @return 输入提示列表
	 */
	@SuppressWarnings("unchecked")
	public List<String> getSuggestionTip(String city, String words) {
		log.debug("getSuggestionTip Start:{city:" + city + ",words:" + words
				+ "}");
		List<String> result = new ArrayList<String>();

		StringBuffer urlStr = new StringBuffer(getSuggestionTipsUrl());
		StringBuffer paramStr = new StringBuffer("");
		paramStr.append("city=" + city);
		paramStr.append("&words=" + words);
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&output=xml");
		paramStr.append("&sign=" + getSign(city, words));

		try {
			// 发送post请求，并返回xml
			String xmlStr = post(urlStr.toString(), paramStr.toString());
			// 解析xml
			Document document = DocumentHelper.parseText(xmlStr);
			// 获取根元素
			Element root = document.getRootElement();
			if ("true".equalsIgnoreCase(root.elementTextTrim("result"))) {
				// 如果有poi_list元素，得到poi_list元素,并遍历为list
				if (root.element("tip_list") != null) {
					List<Element> tipsEltList = root.element("tip_list")
							.elements("tip");
					if (tipsEltList != null) {
						for (Element elt : tipsEltList) {
							result.add(elt.getTextTrim());
						}
					}
				}
			} else {
				log.error("getSuggestionTip error:{message:"
						+ root.elementTextTrim("message") + "}");
			}
		} catch (Exception e) {
			log.error("getSuggestionTip error:" + e);
		}
		log.debug("getSuggestionTip End");
		return result;
	}

	/**
	 * 根据参数计算签名
	 * 
	 * @author nian 120906
	 * @param params
	 *            按照高德文档中的规定按顺序传入参与签名的指定参数
	 * @return 返回计算好的签名
	 */
	private String getSign(String... params) {
		String param = "";
		String sign = "";
		for (int i = 0; i < params.length; i++)
			param += params[i];
		try {
			sign = Security.encrypt(param + "@" + getAutonaviKey(), "MD5")
					.toUpperCase();
		} catch (NoSuchAlgorithmException e) {
			log.error("getSign error:" + e);
		}
		return sign;
	}

	private String getDirection(String direcEn) {
		String direction = "";

		if ("East".equalsIgnoreCase(direcEn)) {
			direction = "西";
		} else if ("South".equalsIgnoreCase(direcEn)) {
			direction = "北";
		} else if ("West".equalsIgnoreCase(direcEn)) {
			direction = "东";
		} else if ("North".equalsIgnoreCase(direcEn)) {
			direction = "南";
		} else if ("SouthEast".equalsIgnoreCase(direcEn)) {
			direction = "西北";
		} else if ("NorthEast".equalsIgnoreCase(direcEn)) {
			direction = "西南";
		} else if ("SouthWest".equalsIgnoreCase(direcEn)) {
			direction = "东北";
		} else if ("NorthWest".equalsIgnoreCase(direcEn)) {
			direction = "东南";
		}

		return direction;
	}

	/**
	 * 通过post方式访问高德接口
	 * 
	 * @author nian 20120905
	 * @param _url
	 *            接口地址
	 * @param param
	 *            传入的参数字符串
	 * @return 接口返回查询结果json或xml格式
	 * @throws IOException
	 */
	private String post(String _url, String param) throws IOException {
		URL url = new URL(_url);
		// log.debug("post url: " + _url);
		// log.debug("post param: " + param);
		URLConnection conn = url.openConnection();
		conn.setDoOutput(true);
		conn.setDoInput(true);
		OutputStreamWriter writer = new OutputStreamWriter(
				conn.getOutputStream(), "utf-8");
		writer.write(param);
		writer.flush();
		writer.close();
		InputStreamReader reder = new InputStreamReader(conn.getInputStream(),
				"utf-8");
		BufferedReader breader = new BufferedReader(reder);
		String content = "";
		String result = "";
		while ((content = breader.readLine()) != null) {
			result += content;
		}
		// log.debug(result);
		return result;
	}

	/**
	 * 指定线路交通信息
	 * 
	 * @param city
	 *            要查询的城市
	 * @param type
	 *            需要描述的交通状态（祥见高德文档）
	 * @param name
	 *            道路（支持5条以下道路，用逗号分隔）
	 * @param fuzzy
	 *            控制是精确查询还是模糊查询, 1:模糊查询,其它：精确查询
	 * @return
	 */
	public List<TrafficInfo> getTrafficinfoSearchLines(String city, int type,
			String name, int fuzzy) {
		log.debug("getTrafficinfoSearchLines Start:{city:" + city + ",type:"
				+ type + ",name:" + name + ",fuzzy:" + fuzzy + "}");

		List<TrafficInfo> result = new ArrayList<TrafficInfo>();
		StringBuffer urlStr = new StringBuffer(getSearchLinesUrl());
		StringBuffer paramStr = new StringBuffer("");
		paramStr.append("city=" + city);
		paramStr.append("&type=" + type);
		paramStr.append("&name=" + name);
		paramStr.append("&fuzzy=" + fuzzy);
		paramStr.append("&channel=" + getAutonaviChannel());
		paramStr.append("&output=xml");
		paramStr.append("&sign=" + getSign(city, String.valueOf(type), name));
		String xml;
		try {
			// 发送post请求，并返回xml
			xml = post(urlStr.toString(), paramStr.toString());
			// log.info(xml);
			// 将xml文档转换为Document的对象
			Document document = DocumentHelper.parseText(xml);
			// 获取根元素
			Element root = document.getRootElement();
			if ("true".equalsIgnoreCase(root.elementTextTrim("result"))) {
				if (root.element("traffic_list") != null) {
					@SuppressWarnings("unchecked")
					List<Element> trafficinfoEltList = root.element(
							"traffic_list").elements("trafficinfo");
					// 解析trafficInfo
					for (Element elt : trafficinfoEltList) {
						@SuppressWarnings("unchecked")
						List<Element> itemList = elt.element("items").elements(
								"item");
						List<TrafficItem> items = new ArrayList<TrafficItem>();
						String traffincinfoName = "";
						// 解析items
						for (Element itemElt : itemList) {
							TrafficItem item = new TrafficItem();
							traffincinfoName = itemElt.attributeValue("road");
							item.setRoad(traffincinfoName);
							item.setDirection(itemElt
									.attributeValue("direction"));
							item.setSpeed(itemElt.attributeValue("speed"));
							item.setStatus(itemElt.attributeValue("status"));
							// 解析经纬度
							String[] coors = itemElt.element("coors").getText()
									.split(",");
							List<String> longitude = new ArrayList<String>();
							List<String> latitude = new ArrayList<String>();
							for (int i = 0; i < coors.length - 1; i += 2) {
								longitude.add(coors[i]);
								latitude.add(coors[i + 1]);
							}
							item.setLatitude(latitude);
							item.setLongitude(longitude);
							items.add(item);
						}
						// 封装TrafficInfo
						TrafficInfo trafficInfo = new TrafficInfo();
						trafficInfo.setItems(items);
						trafficInfo.setDescription(elt.element("description")
								.getText());
						trafficInfo.setBlocked(elt.element("evaluation")
								.element("blocked").getText());
						trafficInfo.setCongested(elt.element("evaluation")
								.element("congested").getText());
						trafficInfo.setExpedite(elt.element("evaluation")
								.element("expedite").getText());
						trafficInfo.setOverall(elt.element("evaluation")
								.element("overall").attributeValue("state"));
						trafficInfo.setName(traffincinfoName);
						result.add(trafficInfo);
					}
				}
			} else {
				log.error("getTrafficinfoSearchLines failed: "
						+ root.elementTextTrim("message"));
			}
		} catch (Exception e) {
			log.error("getTrafficinfoSearchLines ERROR:" + e);
		}
		return result;
	}

	public static void main(String[] args) {
		try {
			AutoNaviServiceImpl manager = new AutoNaviServiceImpl();
			// 关键字搜索
			System.out.println(manager.getPoiByKeyword("1433", "kfc", "", "en", 0,
					10, ""));
			// 周边搜索
			System.out.println(manager.getPoiByLonlat("", "kfc", "",
					"116.36218", "39.91016", 1000, "en", 0, 10, "POI", ""));
			// 根据ID查询POI信息
			System.out.println(manager.getPoiByID("B000A42391"));
			// 根据地址，查询地理编码
			System.out.println(manager.getGeoCode("西单北大街", "", false, false));
			// 逆地理编码
			/*System.out.println(manager.getReverseGeoCode("116.36218",
					"39.91016"));
			// 获取位置描述
			System.out
					.println(manager.getDescByLonlat("116.36218", "39.91016"));
*/
			// 输入提示
			System.out.println(manager.getSuggestionTip("北京", "西单"));

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
