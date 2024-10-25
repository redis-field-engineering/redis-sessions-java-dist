package org.example.testsessions;


import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@ConditionalOnProperty(name="spring.session.store-type", havingValue = "redis")
@EnableRedisHttpSession
@Configuration
public class SpringDataRedisConfig {
}
