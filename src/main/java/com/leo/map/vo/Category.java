package com.leo.map.vo;

public class Category {
	// 中文分类名称
	private String keytype;
	// 英文分类名称
	private String keytype_en;
	// 类型
	private String type;

	public String getKeytype() {
		return keytype;
	}

	public void setKeytype(String keytype) {
		this.keytype = keytype;
	}

	public String getKeytype_en() {
		return keytype_en;
	}

	public void setKeytype_en(String keytype_en) {
		this.keytype_en = keytype_en;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{keytype:" + keytype + ",");
		sb.append("keytype_en:" + keytype_en + ",");
		sb.append("type:" + type + "}");
		return sb.toString();
	}
}
