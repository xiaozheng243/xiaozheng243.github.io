[TOC]

# Feigin的服务发现

Feigin主要集中在消费者，因此配置主要针对消费者项目

## 添加依赖

在消费者中添加Feign的依赖：
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
    <version>1.4.7.RELEASE</version>
</dependency>
```



## 添加注解

在启动类添加`@EnableFeignClients`，然后配置RestTemplate以备远程调用。

```java
@EnableEurekaClient
@EnableFeignClients
@SpringBootApplication
public class EurekaConsumerApplication0 {
    // 按照网上教程，此处的resttemplate可以移除，但我尝试后失败了
    @LoadBalanced // 负载均衡
    @Bean(value = "restTemplate")
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerApplication0.class, args);
    }
}

```

## 添加接口对接远程端

```java
@FeignClient("micro-producer") // 生产者的application.name属性
public interface ClientIndexService {

	@GetMapping(value = "/api/index/getMsg") // 生产者接口相对路径
	public String getMsg();
}
```

消费者定义的接口应当与生产者的接口名称、URL、参数列表、返回值类型、请求方式相同。

## 远程调用

在消费者的Controller调用远程接口

```java
@RestController
@RequestMapping(value = "/api/consumer")
public class IndexController {

	@Autowired
	private ClientIndexService remoteService;

	@GetMapping(value = "/getRemoteMsg")
	public String remoteIndexController() {
		return remoteService.getMsg();
	}
}
```

# 负载均衡

Feign内置了Ribbon因此负载均衡使用方式与ribbon相同且默认算法都为轮询。