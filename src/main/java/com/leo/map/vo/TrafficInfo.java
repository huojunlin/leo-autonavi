package com.leo.map.vo;

import java.util.List;

public class TrafficInfo {
	private List<TrafficItem> items;
	private String description;
	private String expedite;
	private String congested;
	private String blocked;
	private String name;
	//拥堵情况的描述（state：1非常畅通,2基本畅通,3行驶缓慢,4较为拥堵）
	private String overall;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<TrafficItem> getItems() {
		return items;
	}
	public void setItems(List<TrafficItem> items) {
		this.items = items;
	}

	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getExpedite() {
		return expedite;
	}
	public void setExpedite(String expedite) {
		this.expedite = expedite;
	}
	public String getCongested() {
		return congested;
	}
	public void setCongested(String congested) {
		this.congested = congested;
	}
	public String getBlocked() {
		return blocked;
	}
	public void setBlocked(String blocked) {
		this.blocked = blocked;
	}
	public String getOverall() {
		return overall;
	}
	public void setOverall(String overall) {
		this.overall = overall;
	}
}