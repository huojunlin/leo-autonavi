package com.leo.map.service;

import java.util.List;

import com.leo.map.vo.PoiSearchResult;
import com.leo.map.vo.PositionDesc;
import com.leo.map.vo.TrafficInfo;

public interface AutoNaviService {

	public abstract PoiSearchResult getPoiByKeyword(String city,
			String keywords, String category, String language, int pagenum, int pagesize,
			String data_type);

	public abstract PoiSearchResult getPoiByLonlat(String city,
			String keywords, String category, String longitude,
			String latitude, int range, String language, int pagenum, int pagesize,
			String data_type, String sort_rule);

	public abstract PoiSearchResult getPoiByRectangle(String geoobj,
			String keywords, String category, int pagenum, int pagesize,
			String data_type, String sort_rule);

	public abstract PositionDesc getDescByLonlat(String longitude,
			String latitude, String language);

	public abstract List<String> getSuggestionTip(String city, String words);

	public abstract List<TrafficInfo> getTrafficinfoSearchLines(String city,
			int i, String key, int j);
}