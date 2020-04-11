Load balancing(LB)，主要用于分配负载，以达到最优化资源使用、最大化吞吐率、最小化响应时间、同时避免过载的目的。

现实生活中最常见的例子就是多条队伍排队，后来的人会比较一下各条队伍，选择达到目的地相对较快的队伍。（`消费者负载均衡`）

可以使用硬件(F5)、软件(HAProxy)等实现，本文使用能够无缝整合Eureka的`Ribbon`。

首先描述一下项目的基础：

我们需要有一个Eureka Server用以服务注册；至少三个Eureka Client注册到同一个Eureka Server，其中一个消费者，两个生产者。

## 生产者配置

两个生产者应保证项目内容一致（instance-id及端口号等配置不同）

```yaml
server:
  port: 8001

spring:
   application:
      name: micro-client
eureka:
  client:
    fetch-registry: true # 是否去注册中心获取其他注册模块信息
    service-url:
      defaultZone: http://eurekaserver01.com:7001/eureka,http://eurekaserver02.com:7002/eureka,http://eurekaserver03.com:7003/eureka  # 注册中心地址
  instance:
    instance-id: micro-client:8001 # 本服务实例信息
    prefer-ip-address: true # 将服务IP注册到注册中心
```

暴露接口：

```java
@RestController
@RequestMapping(value = "/api/index")
public class IndexController {
	@Value("${eureka.instance.instance-id}")
	private String ipAdress;
	@Value("${server.port}")
	private String port;
	@GetMapping(value = "/getMsg")
	public String getMsg() {
		return "Hello," + ipAdress + ":" + port;
	}

}
```

## 消费者配置

### 添加Ribbon依赖

```xml
<!-- Ribbon -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

*Eureka中已内置了Ribbon依赖，因此，可省略。*

### 添加代码配置

```java
@EnableEurekaClient
@SpringBootApplication
public class EurekaClientApplication {
	@LoadBalanced // 负载均衡
	@Bean(value = "restTemplate")
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	public static void main(String[] args) {
		SpringApplication.run(EurekaClientApplication.class, args);
	}
}
```

### 远程调用

```java
@RestController
@RequestMapping(value = "/api/consumer")
public class IndexController {
	@Autowired
	private RestTemplate restTemplate;
	public String getMsg() {
		return restTemplate.getForObject("http://MICRO-CLIENT/api/index/getMsg", String.class);
	}
}
```

远程调用中使用了生产者的application name（MICRO-CLIENT），不断刷新消费者的接口访问即可查看远程轮询调用

Ribbon原理：

1. Ribbon根据所在的注册中心选择一个负载较少的Eureka服务器
2. 定期从Eureka服务器更新，过滤服务实例列表
3. 根据指定的负载均衡策略（默认轮询），从可用服务实例中选择一个较优的
4. 使用Rest客户端进行服务调用

[源码访问](https://github.com/xiaozheng243/SpringCloud/tree/77c014)