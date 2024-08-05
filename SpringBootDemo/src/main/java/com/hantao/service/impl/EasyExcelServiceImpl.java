package com.hantao.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.hantao.mapper.CatMapper;
import com.hantao.service.EasyExcelService;
import com.hantao.util.ThreadUtil;
import com.hantao.vo.Cat;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 11:11
 * @description：
 */
@Service
public class EasyExcelServiceImpl implements EasyExcelService {

    @Autowired
    private CatMapper catMapper;
    @Autowired
    private ThreadUtil threadUtil;



    public String writeSheet(Sheet sheet,int idmin,int idmax){
        List<Cat> list = catMapper.getList(idmin, idmax);
        for (int i=0;i<list.size();i++) {
            Cat cat = list.get(i);
           /*因为sheet对象不支持线程安全，如果不上锁。就会导致线程异常java.util.ConcurrentModificationException
           * 当一个线程正在遍历集合时，如果另一个线程修改了集合的结构（例如添加、删除或替换元素），
           * 那么遍历线程会抛出 ConcurrentModificationException。这是为了防止在遍历过程中出现不可预测的行为。*/
                //3、创建行Row 需要让idmin+i 因为如果idmin是从10000开始就是10000行的
                Row row = sheet.createRow(i);

                //4、创建单元格Cell
                //可以指定单元格的类型，支持的类型有下面7种： _NONE(-1),NUMERIC(0),STRING(1), 公式 FORMULA(2),BLANK(3), 布尔BOOLEAN(4),ERROR(5);
                Cell cell0 = row.createCell(0, CellType.STRING);
                //5、填充数据
                cell0.setCellValue(cat.getCatId());
                Cell cell1 = row.createCell(1, CellType.STRING);
                cell1.setCellValue(cat.getName());
                Cell cell2 = row.createCell(2, CellType.STRING);
                cell2.setCellValue(cat.getPrice());
            }
        return "success";
    }

    @Override
    public void writeExcel() throws IOException {
        String fileName = "D:\\easyExcel\\test.xlsx";
        Instant start = Instant.now(); // 记录开始时间
        //1、创建工作簿
        Workbook workbook = new XSSFWorkbook();
        //2、创建Sheet
        Sheet sheet1 = workbook.createSheet("sheet1");
        Sheet sheet2 = workbook.createSheet("sheet2");
        Sheet sheet3 = workbook.createSheet("sheet3");
        Sheet sheet4 = workbook.createSheet("sheet4");
        Sheet sheet5 = workbook.createSheet("sheet5");
        Sheet sheet6 = workbook.createSheet("sheet6");
        Sheet sheet7 = workbook.createSheet("sheet7");
        Sheet sheet8 = workbook.createSheet("sheet8");
        Sheet sheet9 = workbook.createSheet("sheet9");

        //创建线程池
        ExecutorService executor = threadUtil.getExecutorService();

        CompletableFuture<String> future1 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet1, 1, 10000), executor);
        CompletableFuture<String> future2 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet2, 10000, 20000), executor);
        CompletableFuture<String> future3 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet3, 20000, 30000), executor);
        CompletableFuture<String> future4 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet4, 30000, 40000), executor);
        CompletableFuture<String> future5 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet5, 40000, 50000), executor);
        CompletableFuture<String> future6 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet6, 50000, 60000), executor);
        CompletableFuture<String> future7 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet7, 60000, 70000), executor);
        CompletableFuture<String> future8 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet8, 70000, 80000), executor);
        CompletableFuture<String> future9 = CompletableFuture.
                supplyAsync(() -> writeSheet(sheet9, 80000, 90000), executor);

        CompletableFuture<Void> allOf = CompletableFuture.
                allOf(future1, future2,future3,future4,future5,future6,future7,future8,future9);
        try {
            allOf.get();
        }  catch (Exception e) {
            e.printStackTrace();
        }
        //创建文件输出流
        OutputStream os = new FileOutputStream(fileName);
        //将文件放入流
        workbook.write(os);
        //刷新流
        os.flush();
        os.close();
        workbook.close();

        Instant end = Instant.now(); // 记录结束时间
        long duration = Duration.between(start, end).toMillis(); // 计算持续时间，单位为毫秒
        System.out.println("花费时间: " + duration + " 毫秒");
    }



    public static CellStyle getCellStyle(Workbook workbook){
        //创建样式：
        CellStyle cellStyle = workbook.createCellStyle();
        //1）左右垂直居中
        //左右居中
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        // 设置垂直居中
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        //2）字体加粗、颜色
        Font font = workbook.createFont();
        //字体颜色为红色
        font.setColor(IndexedColors.RED.getIndex());
        //字体加粗
        font.setBold(true);
        //倾斜、下划线
        //设置倾斜
//        font.setItalic(boolean italic);
        //设置下划线
//        font.setUnderline(byte underline);

        cellStyle.setFont(font);

        /**
         * 设置单元格的数据类型
         */
        // 设置单元格样式 - 数字格式
//        CellStyle numberCellStyle = workbook.createCellStyle();
//        numberCellStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
//        //指定单元格
//        Row row = sheet.createRow(0);
//        Cell cell = row.createCell(0);
//        cell.setCellStyle(numberCellStyle);

        /**
         * 日期格式
         */
        // 设置单元格样式 - 日期格式
//        CellStyle dateCellStyle = workbook.createCellStyle();
//        dateCellStyle.setDataFormat(workbook.createDataFormat().getFormat("yyyy-MM-dd"));
//        //指定单元格
//        Row row = sheet.createRow(0);
//        Cell cell = row.createCell(0);
//        cell.setCellStyle(dateCellStyle);
        return cellStyle;
    }

}
