# SpringCloud 之Eureka server

[TOC]

Eureka Server主要作为服务注册中心使用。

搭建过程：

## 添加Eureka Server依赖

```xml
<!--父依赖-->
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.2.6.RELEASE</version>
  <relativePath/> <!-- lookup parent from repository -->
</parent>

<!--Eureka Server-->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```


## 配置文件修改

```yaml
server:
  port: 7001 # 端口号
eureka:
  instance:
    hostname: localhost # 服务地址
  client:
    register-with-eureka: false #是否向注册中心注册
    fetch-registry: false # 是否去用户中心获取其他已注册服务信息
```

## 启动类添加注解

```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(EurekaServerApplication.class, args);
	}
}
```




启动服务后，访问http://localhost:7001/即可访问Eureka监控页面

# Eureka Client



## 引入依赖

```xml
<!--父依赖-->
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.2.6.RELEASE</version>
  <relativePath/> <!-- lookup parent from repository -->
</parent>
<!--Eureka Client-->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

## 配置文件修改

```yaml
server:
  port: 8081

eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka  # 注册中心地址
  instance:
    instance-id: micro-client:8081 # 本服务实例信息
    prefer-ip-address: true
```

## 启动类添加注解

```java
@EnableEurekaClient
@SpringBootApplication
public class EurekaClientApplication {
	public static void main(String[] args) {
		SpringApplication.run(EurekaClientApplication.class, args);
	}
}
```

