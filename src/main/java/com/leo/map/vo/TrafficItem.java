package com.leo.map.vo;

import java.util.List;

public class TrafficItem {
	//路名
	private String road;
	//描述
	private String direction;
	//交通状态（0未知，1畅通，2缓行，3拥堵）
	private String status;
	//平均时速
	private String speed;
	//经度
	private List<String> longitude;
	//纬度
	private List<String> latitude;
	public String getRoad() {
		return road;
	}
	public void setRoad(String road) {
		this.road = road;
	}
	public String getDirection() {
		return direction;
	}
	public void setDirection(String direction) {
		this.direction = direction;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSpeed() {
		return speed;
	}
	public void setSpeed(String speed) {
		this.speed = speed;
	}
	public List<String> getLongitude() {
		return longitude;
	}
	public void setLongitude(List<String> longitude) {
		this.longitude = longitude;
	}
	public List<String> getLatitude() {
		return latitude;
	}
	public void setLatitude(List<String> latitude) {
		this.latitude = latitude;
	}
}