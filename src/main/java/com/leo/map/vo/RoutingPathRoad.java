package com.leo.map.vo;

public class RoutingPathRoad {
	// 名称
	private String name;
	// 描述
	private String text;
	// 距离
	private String length;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getLength() {
		return length;
	}

	public void setLength(String length) {
		this.length = length;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{name:" + name + ",");
		sb.append("text:" + text + ",");
		sb.append("length:" + length + "}");
		return sb.toString();
	}
}
