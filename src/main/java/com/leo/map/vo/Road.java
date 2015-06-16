/*
 * 道路信息
 * 用于POI相关搜索结果类SearchPageBean.java
 * roadList里的元素
 */
package com.leo.map.vo;

public class Road {
	// road id
	private String id;
	// 名称
	private String name;
	// 城市代码 电话区号
	private String citycode;
	// 宽度
	private String width;
	// 级别
	private String level;

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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
		sb.append("width:" + width + ",");
		sb.append("level:" + level + "}");
		return sb.toString();
	}
}
