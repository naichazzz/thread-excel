package com.hantao.mapper;

import com.hantao.vo.Cat;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 9:34
 * @description：
 */
@Mapper
@Repository
public interface CatMapper {
    List<Cat> getList(int idmin,int idmax);
    void addCat(Cat cat);
}
