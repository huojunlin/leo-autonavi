/*
 * 逆地理编码结果类
 * nian 120907
 * 
 */

package com.leo.map.vo;

import java.util.ArrayList;
import java.util.List;

public class ReGeoCodeResult {
	// 中国
	private String country;
	// 省或直辖市名称
	private String province;
	// 省行政区划
	private String provinceadcode;
	// 城市名称
	private String city;
	// 城市行政区划
	private String cityadcode;
	// 区名称
	private String district;
	// 区行政区划
	private String districtadcode;
	// 行政区编号
	private String adcode;
	// 城市编号，010
	private String citycode;
	// 电话区号
	private String tel;
	// 省，市，区：北京市,,朝阳区
	private String desc;
	// 动态位置描述
	private String pos;
	// 兴趣点列表
	private List<ReGeoCodePoi> poiList = new ArrayList<ReGeoCodePoi>();
	// 道路列表
	private List<ReGeoCodeRoad> roadList = new ArrayList<ReGeoCodeRoad>();
	// 交叉路口列表
	private List<ReGeoCodeCross> crossList = new ArrayList<ReGeoCodeCross>();

	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getPos() {
		return pos;
	}

	public void setPos(String pos) {
		this.pos = pos;
	}

	public String getAdcode() {
		return adcode;
	}

	public void setAdcode(String adcode) {
		this.adcode = adcode;
	}

	public List<ReGeoCodePoi> getPoiList() {
		return poiList;
	}

	public void setPoiList(List<ReGeoCodePoi> poiList) {
		this.poiList = poiList;
	}

	public List<ReGeoCodeRoad> getRoadList() {
		return roadList;
	}

	public void setRoadList(List<ReGeoCodeRoad> roadList) {
		this.roadList = roadList;
	}

	public List<ReGeoCodeCross> getCrossList() {
		return crossList;
	}

	public void setCrossList(List<ReGeoCodeCross> crossList) {
		this.crossList = crossList;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getProvinceadcode() {
		return provinceadcode;
	}

	public void setProvinceadcode(String provinceadcode) {
		this.provinceadcode = provinceadcode;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCityadcode() {
		return cityadcode;
	}

	public void setCityadcode(String cityadcode) {
		this.cityadcode = cityadcode;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getDistrictadcode() {
		return districtadcode;
	}

	public void setDistrictadcode(String districtadcode) {
		this.districtadcode = districtadcode;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{country:" + country + ",");
		sb.append("province:" + province + ",");
		sb.append("provinceadcode:" + provinceadcode + ",");
		sb.append("city:" + city + ",");
		sb.append("cityadcode:" + cityadcode + ",");
		sb.append("district:" + district + ",");
		sb.append("districtadcode:" + districtadcode + ",");
		sb.append("adcode:" + adcode + ",");
		sb.append("citycode:" + citycode + ",");
		sb.append("tel:" + tel + ",");
		sb.append("desc:" + desc + ",");
		sb.append("pos:" + pos + ",");
		sb.append("poiList:[");
		if (poiList != null) {
			for (int i = 0; i < poiList.size(); i++) {
				sb.append("" + poiList.get(i) + "");
				if (i < (poiList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("]},");
		sb.append("roadList:[");
		if (roadList != null) {
			for (int i = 0; i < roadList.size(); i++) {
				sb.append("" + roadList.get(i) + "");
				if (i < (roadList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("]},");
		sb.append("crossList:[");
		if (crossList != null) {
			for (int i = 0; i < crossList.size(); i++) {
				sb.append("" + crossList.get(i) + "");
				if (i < (crossList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("]}");
		return sb.toString();
	}
}
