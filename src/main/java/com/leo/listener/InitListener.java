package com.leo.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpServlet;

import com.leo.common.cfg.AppConfig;

public class InitListener extends HttpServlet implements ServletContextListener {

	private static final long serialVersionUID = 5479417785518643058L;

	public void contextDestroyed(ServletContextEvent arg0) {
	}

	public void contextInitialized(ServletContextEvent arg0) {
		AppConfig.configure(arg0.getServletContext().getRealPath("/")+"/WEB-INF/appconfig.xml");
	}

}
