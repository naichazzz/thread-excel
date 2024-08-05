package com.hantao.controller;

import cn.hutool.core.lang.UUID;
import com.hantao.mapper.CatMapper;
import com.hantao.vo.Cat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 9:33
 * @description：
 */
@RestController
public class CatController {
    @Autowired
    CatMapper catMapper;

    /**
     * 获取关于我页面信息
     *
     * @return
     */

    @GetMapping("/about")
    public List<Cat> about() {
        List<Cat> list = catMapper.getList(1,2);
        System.out.println(list.toString());
        return list;
    }

    @GetMapping("/add")
    public String add() {

        for (int i = 0; i < 2; i++){
            Cat cat = new Cat();
            UUID uuid = UUID.randomUUID();
            cat.setA("A");
            cat.setB("B");
            cat.setC("C");
            cat.setName(uuid.toString());
            cat.setPrice(String.valueOf(i));
            catMapper.addCat(cat);
        }
        return "success";
    }
}
