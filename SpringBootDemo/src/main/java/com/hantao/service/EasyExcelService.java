package com.hantao.service;

import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 11:10
 * @description：
 */

public interface EasyExcelService {
    void writeExcel() throws IOException;
}
