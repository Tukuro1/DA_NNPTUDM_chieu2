package com.example.DA_QLBH.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Chào mừng đến với hệ thống quản lý bán hàng!");
        return "index"; // Trả về file templates/index.html
    }
}