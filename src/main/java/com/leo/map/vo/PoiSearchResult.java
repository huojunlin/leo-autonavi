/*
 *POI相关搜索结果类（分页）
 *包括：poi结果列表、道路结果列表、交叉路口结果列表、分页信息 
 */

package com.leo.map.vo;

import java.util.ArrayList;
import java.util.List;

public class PoiSearchResult {
	private List<Poi> poiList = new ArrayList<Poi>();
	private List<Road> roadList = new ArrayList<Road>();
	private List<RoadInter> roadInterList = new ArrayList<RoadInter>();

	private int number;
	private int total;
	private int totalpage;

	public List<Poi> getPoiList() {
		return poiList;
	}

	public void setPoiList(List<Poi> poiList) {
		this.poiList = poiList;
	}

	public List<Road> getRoadList() {
		return roadList;
	}

	public void setRoadList(List<Road> roadList) {
		this.roadList = roadList;
	}

	public List<RoadInter> getRoadInterList() {
		return roadInterList;
	}

	public void setRoadInterList(List<RoadInter> roadInterList) {
		this.roadInterList = roadInterList;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getTotalpage() {
		return totalpage;
	}

	public void setTotalpage(int totalpage) {
		this.totalpage = totalpage;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("{number:" + number + ",");
		sb.append("total:" + total + ",");
		sb.append("totalpage:" + totalpage + ",");
		sb.append("poiList:[");
		if (poiList != null) {
			for (int i = 0; i < poiList.size(); i++) {
				sb.append("" + poiList.get(i) + "");
				if (i < (poiList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("],");
		sb.append("roadList:[");
		if (roadList != null) {
			for (int i = 0; i < roadList.size(); i++) {
				sb.append("" + roadList.get(i) + "");
				if (i < (roadList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("]},");
		sb.append("roadInterList:[");
		if (roadInterList != null) {
			for (int i = 0; i < roadInterList.size(); i++) {
				sb.append("" + roadInterList.get(i) + "");
				if (i < (roadInterList.size() - 1)) {
					sb.append(",");
				}
			}
		}
		sb.append("]}");
		return sb.toString();
	}
}
