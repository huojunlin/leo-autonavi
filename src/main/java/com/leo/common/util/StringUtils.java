package com.leo.common.util;

import java.util.Hashtable;

public class StringUtils {
	public static final boolean isEmpty(String value) {
		boolean result = false;
		if (value == null || value.trim().length() == 0
				|| value.equalsIgnoreCase("null")) {
			result = true;
		}
		return result;
	}

	public static Hashtable<String, String> toQueryParams(String queryString) {
		Hashtable<String, String> ht = new Hashtable<String, String>();
		if (queryString != null) {
			String[] params = queryString.split("&");
			for (int i = 0; i < params.length; i++) {
				String[] pairs = params[i].split("=");
				if (pairs.length > 1) {
					ht.put(pairs[0], pairs[1]);
				}
			}
		}
		return ht;
	}

	public static String getDirection(float angle) {
		String direction = "";
		if (angle <= 15 || angle >= 345) {
			direction = "北";
		} else if (angle > 15 && angle < 75) {
			direction = "东北";
		} else if (angle >= 75 && angle <= 105) {
			direction = "东";
		} else if (angle > 105 && angle < 165) {
			direction = "东南";
		} else if (angle >= 165 && angle <= 195) {
			direction = "南";
		} else if (angle > 195 && angle < 255) {
			direction = "西南";
		} else if (angle >= 255 && angle <= 285) {
			direction = "西";
		} else if (angle > 285 && angle < 345) {
			direction = "西北";
		}
		return direction;
	}

}
