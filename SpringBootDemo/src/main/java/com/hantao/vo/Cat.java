package com.hantao.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 9:34
 * @description：
 */
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Cat {
  @ExcelProperty(value = "猫id")
  private int catId;
  @ExcelProperty(value = "猫价格")
  private String price;
  @ExcelProperty(value = "a")
  private String a;
  @ExcelProperty(value = "b")
  private String b;
  @ExcelProperty(value = "c")
  private String c;
  @ExcelProperty(value = "猫名字")
  private String name;
}
