package com.hantao.controller;

import com.hantao.service.EasyExcelService;
import com.hantao.vo.Cat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 11:07
 * @description：
 */
@RestController
public class EasyExcelController {

    @Autowired
    private EasyExcelService easyExcelService;

    @GetMapping("/write")
    public String write() throws IOException {
        easyExcelService.writeExcel();
        return "write";
    }
}
