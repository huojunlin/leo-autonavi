/*
 * 交叉路口信息
 * 用于逆地理编码结果类ReverseCode.java
 * cross_list中的元素
 */
package com.leo.map.vo;

public class ReGeoCodeCross {
	// ID
	private String crossid;
	// 级别
	private String level;
	// 名字
	private String name;
	// 方位
	private String direction;
	// 距离
	private String distance;
	// 权重
	private String weight;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;
	// 宽度
	private String width;

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

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getCrossid() {
		return crossid;
	}

	public void setCrossid(String crossid) {
		this.crossid = crossid;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{crossid:" + crossid + ",");
		sb.append("level:" + level + ",");
		sb.append("name:" + name + ",");
		sb.append("direction:" + direction + ",");
		sb.append("distance:" + distance + ",");
		sb.append("weight:" + weight + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + ",");
		sb.append("width:" + width + "}");
		return sb.toString();
	}
}
