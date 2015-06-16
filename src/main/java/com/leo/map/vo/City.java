package com.leo.map.vo;

public class City {
	// 城市代码 电话区号
	private String citycode;
	// 行政编码 区划
	private String adcode;
	// 中文名称
	private String name_zh;
	// 英文名称
	private String name_en;
	// 拼音名称
	private String pinyin;
	// 简拼
	private String shortpy;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;

	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getAdcode() {
		return adcode;
	}

	public void setAdcode(String adcode) {
		this.adcode = adcode;
	}

	public String getName_zh() {
		return name_zh;
	}

	public void setName_zh(String name_zh) {
		this.name_zh = name_zh;
	}

	public String getName_en() {
		return name_en;
	}

	public void setName_en(String name_en) {
		this.name_en = name_en;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getShortpy() {
		return shortpy;
	}

	public void setShortpy(String shortpy) {
		this.shortpy = shortpy;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{citycode:" + citycode + ",");
		sb.append("adcode:" + adcode + ",");
		sb.append("name_zh:" + name_zh + ",");
		sb.append("name_en:" + name_en + ",");
		sb.append("pinyin:" + pinyin + ",");
		sb.append("shortpy:" + shortpy + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + "}");
		return sb.toString();
	}
}
