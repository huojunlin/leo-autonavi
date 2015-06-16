package com.leo.map.vo;

public class PositionDesc {
	// 省
	private String province;
	// 市
	private String city;
	// 区
	private String district;
	// 位置描述
	private String desc;
	// adCode
	private String adCode;

	public String getAdCode() {
		return adCode;
	}

	public void setAdCode(String adCode) {
		this.adCode = adCode;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{province:" + province + ",");
		sb.append("city:" + city + ",");
		sb.append("district:" + district + ",");
		sb.append("desc:" + desc + "}");
		return sb.toString();
	}
}
