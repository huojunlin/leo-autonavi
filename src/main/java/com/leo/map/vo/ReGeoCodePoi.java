/*
 * POI信息
 * 用于逆地理编码结果类ReverseCode.java
 * poi_list中的元素
 */
package com.leo.map.vo;

public class ReGeoCodePoi {
	// poi id
	private String poiid;
	// POI名称
	private String name;
	// 地址
	private String address;
	// 电话
	private String tel;
	// 距离
	private String distance;
	// 方位
	private String direction;
	// 权重
	private String weight;
	// 类型
	private String type;
	// 类型代码
	private String typecode;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;

	public String getDistance() {
		return distance;
	}

	public void setDistance(String distance) {
		this.distance = distance;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWeight() {
		return weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}

	public String getTypecode() {
		return typecode;
	}

	public void setTypecode(String typecode) {
		this.typecode = typecode;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPoiid() {
		return poiid;
	}

	public void setPoiid(String poiid) {
		this.poiid = poiid;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{poiid:" + poiid + ",");
		sb.append("name:" + name + ",");
		sb.append("address:" + address + ",");
		sb.append("tel:" + tel + ",");
		sb.append("distance:" + distance + ",");
		sb.append("direction:" + direction + ",");
		sb.append("weight:" + weight + ",");
		sb.append("type:" + type + ",");
		sb.append("typecode:" + typecode + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + "}");
		return sb.toString();
	}
}
