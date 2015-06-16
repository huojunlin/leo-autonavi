/*	
 * 交叉路口信息
 * 用于POI相关搜索结果类SearchPageBean.java
 * roadInterList里的元素
 */

package com.leo.map.vo;

public class RoadInter {
	// 交叉路口id，两个id之间使用-分割
	private String id;
	// 名称，两条路之间使用 - 分割
	private String name;
	// 城市代码 电话区号
	private String citycode;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{id:" + id + ",");
		sb.append("name:" + name + ",");
		sb.append("citycode:" + citycode + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + "}");
		return sb.toString();
	}
}
