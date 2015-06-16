package com.leo.map.vo;

public class Poi {
	// poi id
	private String id;
	// POI名称
	private String name;
	// 地址
	private String address;
	// 电话
	private String tel;
	// 区号
	private String areacode;
	// 行政编码 区划
	private String adcode;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;
	// 类型
	private String type;
	// 类型代码
	private String typecode;
	// 省名称
	private String provincename;
	// 省编码
	private String provincecode;
	// 城市名称
	private String cityname;
	// 城市编码
	private String citycode;
	// 地区名称
	private String districtname;
	// 地区编码
	private String districtcode;
	// 距离
	String distance;

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getAreacode() {
		return areacode;
	}

	public void setAreacode(String areacode) {
		this.areacode = areacode;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getCityname() {
		return cityname;
	}

	public void setCityname(String cityname) {
		this.cityname = cityname;
	}

	public String getProvincecode() {
		return provincecode;
	}

	public void setProvincecode(String provincecode) {
		this.provincecode = provincecode;
	}

	public String getDistrictcode() {
		return districtcode;
	}

	public void setDistrictcode(String districtcode) {
		this.districtcode = districtcode;
	}

	public String getAdcode() {
		return adcode;
	}

	public void setAdcode(String adcode) {
		this.adcode = adcode;
	}

	public String getDistrictname() {
		return districtname;
	}

	public void setDistrictname(String districtname) {
		this.districtname = districtname;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTypecode() {
		return typecode;
	}

	public void setTypecode(String typecode) {
		this.typecode = typecode;
	}

	public String getProvincename() {
		return provincename;
	}

	public void setProvincename(String provincename) {
		this.provincename = provincename;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDistance() {
		return distance;
	}

	public void setDistance(String distance) {
		this.distance = distance;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{id:" + id + ",");
		sb.append("name:" + name + ",");
		sb.append("address:" + address + ",");
		sb.append("tel:" + tel + ",");
		sb.append("areacode:" + areacode + ",");
		sb.append("adcode:" + adcode + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + ",");
		sb.append("type:" + type + ",");
		sb.append("typecode:" + typecode + ",");
		sb.append("provincename:" + provincename + ",");
		sb.append("provincecode:" + provincecode + ",");
		sb.append("cityname:" + cityname + ",");
		sb.append("citycode:" + citycode + ",");
		sb.append("districtname:" + districtname + ",");
		sb.append("districtcode:" + districtcode + ",");
		sb.append("distance:" + distance + "}");
		return sb.toString();
	}
}
