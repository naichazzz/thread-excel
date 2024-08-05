package com.hantao.util;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author ：hantao
 * @date ：Created in 2024/7/25 17:16
 * @description：
 */
@Component
public class ThreadUtil {
    /**
     * 线程池的具体配置如下：
     * - corePoolSize和maximumPoolSize都设置为20，意味着线程池将维持20个线程来处理任务，
     *   在需要时不会增加更多的线程。
     * - keepAliveTime设置为3600秒，表示如果线程池中的线程在3600秒内没有新的任务可处理，
     *   它们将被终止并从线程池中移除。
     * - workQueue使用了一个容量为2000的ArrayBlockingQueue，这意味着同时等待执行的任务数量不能超过2000。
     *   如果有超过2000个任务试图提交到线程池，提交任务的线程将被阻塞，直到队列中有空间可用。
     */
    @Bean(value = "executorService")
    public ExecutorService getExecutorService() {
       return new ThreadPoolExecutor(20,20,3600,
               TimeUnit.SECONDS, new ArrayBlockingQueue<>(2000));
    }
}
