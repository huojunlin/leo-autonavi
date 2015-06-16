package com.leo.common.util;

import java.util.Enumeration;

import javax.servlet.http.HttpSession;

public class SessionUtil {

	public static void initSession(HttpSession session) {
		Enumeration<?> em = session.getAttributeNames();
		while (em.hasMoreElements()) {
			String str = em.nextElement().toString();
			if(!"workNumber".equals(str)) {
				session.removeAttribute(str);
			}
		}
	}
}
