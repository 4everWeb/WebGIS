package com.all4land.istd.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	
	private static Logger logger = LoggerFactory.getLogger(HomeController.class);

	@RequestMapping("main")
	public String home(Model model) {
		
        return "/main/Sample";
	}
	@RequestMapping("popup")
	public String openPop(Model model) {
		
		return "/popup/jusoPopup";
	}
}
