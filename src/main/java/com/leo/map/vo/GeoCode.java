package com.leo.map.vo;

public class GeoCode {
	// 级别
	private String level;
	// 国家
	private String country;
	// 省/直辖市
	private String region;
	// 市
	private String cityname;
	// 区
	private String district;
	// 被格式化的地址
	private String formattedaddress;
	// 经度
	private String longitude;
	// 纬度
	private String latitude;

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getCityname() {
		return cityname;
	}

	public void setCityname(String cityname) {
		this.cityname = cityname;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getFormattedaddress() {
		return formattedaddress;
	}

	public void setFormattedaddress(String formattedaddress) {
		this.formattedaddress = formattedaddress;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{level:" + level + ",");
		sb.append("country:" + country + ",");
		sb.append("region:" + region + ",");
		sb.append("cityname:" + cityname + ",");
		sb.append("district:" + district + ",");
		sb.append("formattedaddress:" + formattedaddress + ",");
		sb.append("longitude:" + longitude + ",");
		sb.append("latitude:" + latitude + "}");
		return sb.toString();
	}
}
