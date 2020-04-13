[TOC]

Hystrix实现了对restTemplate与Feigin的支持。

Hystrix功能：

1. 调用熔断

对于Hystrix的支持，只需要针对消费者(调用方)修改即可。

## 添加依赖

在消费者中添加Hystrix的依赖：
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```



## 添加注解

在启动类添加`@EnableCircuitBreaker`，然后配置RestTemplate以备远程调用。

```java
@EnableEurekaClient
@SpringBootApplication
@EnableCircuitBreaker
public class EurekaConsumerApplication1 {

    @LoadBalanced
    @Bean(value = "restTemplate")
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerApplication1.class, args);
    }
}
```

## 添加程端调用

```java
@RestController
@RequestMapping(value = "/api/consumer")
public class IndexController {

    @Autowired
    private RestTemplate restTemplate;

    @HystrixCommand(fallbackMethod = "getMsgFallBack")
    @GetMapping(value = "/getRemoteMsg")
    public String remoteIndexController() {
        return restTemplate.getForObject("http://MICRO-PRODUCER/api/index/getMsg", String.class);
    }

    public String getMsgFallBack() {
        return "本消息来自于降级方法！";
    }

}
```

其中，` @HystrixCommand`用以指定熔断时的降级方法。降级方法的参数列表及返回值类型应与原方法一致。

生产者（服务提供者）代码省略，最简单的测试方法是关闭服务提供者，查看消费者的远程调用是否返回降级方法的内容。

[查看源码，涉及服务为eureka-consumer1->eureka-server0->eureka-producer0](https://gitee.com/xiaozheng243/SpringCloud/tree/hystrix/spring-cloud-parent)



## 添加类中的统一降级方法

为应对多个方法需要触发熔断机制，可以提供统一降级方法。其代码如下：

```java
@RestController
@RequestMapping(value = "/api/consumer")
@DefaultProperties(defaultFallback = "defaultFallBack")
public class IndexController {

    @Autowired
    private RestTemplate restTemplate;

    @HystrixCommand //(fallbackMethod = "getMsgFallBack")
    @GetMapping(value = "/getRemoteMsg")
    public String remoteIndexController() {
        return restTemplate.getForObject("http://MICRO-PRODUCER/api/index/getMsg", String.class);
    }
    
    public String getMsgFallBack() {
        return "本消息来自于降级方法！";
    }
    
    public String defaultFallBack(){
        return "本消息来自于统一降级方法";
    }
}
```

修改内容：

1. 添加统一的降级方法，该方法返回值应该与所有原方法一致，并保证参数列表为空
2. 移除方法指定的降级方法
3. 给类添加统一的降级方法

