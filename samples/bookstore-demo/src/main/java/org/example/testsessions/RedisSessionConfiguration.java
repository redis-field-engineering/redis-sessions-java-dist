package org.example.testsessions;


import com.redis.sessions.indexing.RedisIndexConfiguration;
import com.redis.sessions.spring.config.annotation.web.http.EnableRedisSessionMetrics;
import com.redis.sessions.spring.config.annotation.web.http.EnableRedisSessions;
import com.redis.sessions.indexing.IndexedField;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@ConditionalOnProperty(name="spring.session.store-type", havingValue = "redisSessions")
@EnableRedisSessions
@EnableRedisSessionMetrics
@Configuration
public class RedisSessionConfiguration {
    @Bean
    public RedisIndexConfiguration redisIndexConfiguration(){
        System.out.println("starting with redis index configuration");
        return RedisIndexConfiguration.builder()
                .withField(IndexedField.tag(Constants.BOOKS_IN_CART_KEY).separator('|').build())
                .withField(IndexedField.tag(Constants.USER_NAME_KEY).build())
                .withField(IndexedField.numeric(Constants.CART_TOTAL_KEY).build())
                .withField(IndexedField.numeric(Constants.CREATED_AT_KEY).build()).build();
    }
}
