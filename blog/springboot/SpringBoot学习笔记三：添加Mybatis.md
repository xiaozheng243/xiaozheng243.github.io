---
prev: ./SpringBoot学习笔记二：整合Swagger-UI

---

# SpringBoot学习笔记三：添加Mybatis

[TOC]

> Mybatis是一个支持定制化SQL、存储过程及高级映射的持久化框架。 -- Mybatis官方

**开始之前：**

首先安装Mysql数据库，创建数据库并建表user如下，同时自行创建对应的VO：

```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `avatar_id` bigint DEFAULT NULL COMMENT '头像',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '邮箱',
  `enabled` bigint DEFAULT NULL COMMENT '状态：1启用、0禁用',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '密码',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户名',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '手机号码',
  `create_time` datetime DEFAULT NULL COMMENT '创建日期',
  `last_password_reset_time` datetime DEFAULT NULL COMMENT '最后修改密码的日期',
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UK_kpubos9gc2cvtkb0thktkbkes` (`email`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  KEY `FKpq2dhypk2qgt68nauh2by22jb` (`avatar_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='系统用户';

SET FOREIGN_KEY_CHECKS = 1;

```



## 1.添加依赖

Mysbatis需要以数据库驱动作为前提，因此，此处同时添加了Mysql驱动。

```xml
 <!--mysql-->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <scope>runtime</scope>
</dependency>

<!--mybatis-->
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>1.3.2</version>
</dependency>
```


## 2.添加Dao接口

在启动类所在路径添加`dao`或`mapper`包用以存放Dao操作的接口。在该包中创建`UserMapper.java`接口，代码如下：

```java
package online.yuluo.demo.mapper;
@Repository
public interface UserMapper  {
//    @Select("select * from user")
    List<User> queryUsers(User user);
}
```

简析：

1. `@Repository`是`@Component`的子注解，能使该接口注册为Bean；
2. Mybatis也提供了注解来应对一些CURD操作，因此，`@Select`注解可以取代`第三步`的XML配置操作，二选一即可。这里建议简单的操作可通过注解形式完成，复杂的操作还是使用XML配置来完成。

## 3.添加配置文件

在`resource`资源文件夹中创建`mapper`文件夹用以存放Mybatis对应的XML配置文件。

在mapper文件夹创建名为`UserMapper.xml`的文件，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="online.yuluo.demo.mapper.UserMapper">
    <select id="queryUsers"
            resultType="online.yuluo.demo.domain.User">
        SELECT * from user
    </select>
</mapper>
```

简析：

1. 工作空间`namespace`字段的值对应`第二步`中dao接口的相对路径；
2. 查询操作的ID名称对应接口中的方法名称；
3. 返回值类字段型`resultType`对应接口返回值类型对象的相对路径。

## 4.添加项目全局配置

在项目配置文件`application.properties`或`application.yml`中添加数据库连接信息及Mybatis映射信息：

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useSSL=false&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false # 数据库URL
    username: root # 数据库用户名
    password: ***** # 数据库密码
    driver-class-name: com.mysql.jdbc.Driver
    
mybatis:
  mapper-locations: classpath:mapper/*.xml #Mybatis的XML配置文件地址
  type-aliases-package: online.yuluo.demo.domain #实体对象地址
```

**注意** ：

1. MySQL6.0之后的连接驱动名称为`com.mysql.cj.jdbc.Driver`
2. URL设置东八区：serverTimezone=Asia/Shanghai

## 5.添加Mapper扫描

在项目启动文件中添加Mapper扫描注解帮助系统发现mapper文件：

```java
@SpringBootApplication
@MapperScan("online.yuluo.demo.mapper")
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
```


到此，Mybatis配置完成，添加Controller与service对UserMapper.queryUsers进行调用，即可进行简单的测试，详细请查看本文源码[Github](https://github.com/xiaozheng243/SpringBoot/tree/446539)

## 番外篇：添加Mybatis-plus

> [MyBatis-Plus](https://github.com/baomidou/mybatis-plus)（简称 MP）是一个 [MyBatis](http://www.mybatis.org/mybatis-3/) 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。    --Mybatis-Plus文档

### 修改依赖

将Mybatis依赖移除，添加Mybatis-plus的依赖。

```xml
<!--mybatis-->
<!--        <dependency>-->
<!--            <groupId>org.mybatis.spring.boot</groupId>-->
<!--            <artifactId>mybatis-spring-boot-starter</artifactId>-->
<!--            <version>1.3.2</version>-->
<!--        </dependency>-->
<!--mybatis plus-->

<dependency>
  <groupId>com.baomidou</groupId>
  <artifactId>mybatis-plus-boot-starter</artifactId>
  <version>3.3.1.tmp</version>
</dependency>
```



### 修改Mapper

修改UserMapper文件继承Mybatis-plus的BaseMapper类

```java
public interface UserMapper extends BaseMapper<User>{
  
}
```



### 调用方法

```java
@Override
public List<User> getAllUserList(){
  return userMapper.selectList(null);
}
```

selectList方法是Mybatis plus自带的方法，接收一个Wrapper，null表示无条件，将会返回所有数据。

源码访问[Github](https://github.com/xiaozheng243/SpringBoot/tree/f7018a9)

Mybatis plus更多使用方式请查看[官方文档](https://mp.baomidou.com/)。

## 番外篇：添加数据库连接池Druid

### 添加依赖

```xml
<!--druid-->
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid</artifactId>
  <version>1.1.12</version>
</dependency>
```

应当注意Mybatis plus自动依赖了其他连接池，因此使用Druid之前，请移除Mybatis plus，添加Mybatis依赖。

### 添加application.yml配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useSSL=false&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false # 数据库URL
    username: root # 数据库用户名
    password: suiyu123 # 数据库密码
    driver-class-name: com.mysql.cj.jdbc.Driver
    ###################以下为druid增加的配置###########################
    type: com.alibaba.druid.pool.DruidDataSource
    # 初始化连接池个数
    initialSize: 5
    # 最小连接池个数,已过时，配置无用
    minIdle: 2
    # 最大连接池个数
    maxActive: 20
    # 配置获取连接等待超时的时间，单位毫秒，缺省启用公平锁，并发效率会有所下降
    maxWait: 60000
    # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
    timeBetweenEvictionRunsMillis: 60000
    # 配置一个连接在池中最小生存的时间，单位是毫秒
    minEvictableIdleTimeMillis: 300000
    # 用来检测连接是否有效的sql，要求是一个查询语句。
    # 如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会起作用
    validationQuery: SELECT 1 FROM DUAL
    # 建议配置为true，不影响性能，并且保证安全性。
    # 申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。
    testWhileIdle: true
    # 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
    testOnBorrow: false
    # 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
    testOnReturn: false
    # 打开PSCache，并且指定每个连接上PSCache的大小
    poolPreparedStatements: true
    maxPoolPreparedStatementPerConnectionSize: 20
    # 通过别名的方式配置扩展插件，多个英文逗号分隔，常用的插件有：
    # 监控统计用的filter:stat
    # 日志用的filter:log4j 需要添加log4j依赖
    # 防御sql注入的filter:wall
    filters: stat,wall,config,log4j
    # 通过connectProperties属性来打开mergeSql功能；慢SQL记录
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
    # 合并多个DruidDataSource的监控数据
    useGlobalDataSourceStat: true


mybatis:
  mapper-locations: classpath:mapper/*.xml #Mybatis的XML配置文件地址
  type-aliases-package: online.yuluo.demo.domain #实体对象地址

## druid config配置所需变量
druidData:
  allow: 127.0.0.1
  deny: 192.168.1.110
  loginUsername: admin
  loginPassword: admin
  resetEnable: false
```

### 添加Druid 配置信息

在启动类同目录文件下的config文件夹中添加DruidConfig类，将其注册为Bean，代码如下

```java
@Configuration
public class DruidConfig {

    @Value("${druidData.allow}")
    private String allow;

    @Value("${druidData.deny}")
    private String deny;

    @Value("${druidData.loginUsername}")
    private String loginUsername;

    @Value("${druidData.loginPassword}")
    private String loginPassword;

    @Value("${druidData.resetEnable}")
    private String resetEnable;

    /**
     * 主要实现WEB监控的配置处理
     */
    @Bean
    public ServletRegistrationBean druidServlet() throws IOException {
        // 现在要进行druid监控的配置处理操作
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(
                new StatViewServlet(), "/druid/*");
        // 白名单,多个用逗号分割， 如果allow没有配置或者为空，则允许所有访问
        servletRegistrationBean.addInitParameter("allow", allow);
        // 黑名单,多个用逗号分割 (共同存在时，deny优先于allow)
        servletRegistrationBean.addInitParameter("deny", deny);
        // 控制台用户名
        servletRegistrationBean.addInitParameter("loginUsername", loginUsername);
        // 控制台密码
        servletRegistrationBean.addInitParameter("loginPassword", loginPassword);
        // 是否可以重置数据源，禁用HTML页面上的“Reset All”功能
        servletRegistrationBean.addInitParameter("resetEnable", resetEnable);
        return servletRegistrationBean;
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(new WebStatFilter());
        //所有请求进行监控处理
        filterRegistrationBean.addUrlPatterns("/*");
        //添加不需要忽略的格式信息
        filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.css,/druid/*");
        return filterRegistrationBean;
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource druidDataSource() {
        return new DruidDataSource();
    }
}
```

启动项目后，访问[http://localhost:8080/druid/index.html](http://localhost:8080/druid/index.html)即可查看监控页面。

源码访问：[Github](https://github.com/xiaozheng243/SpringBoot/tree/7df3bc)

via https://blog.csdn.net/weixin_43453386/article/details/83582399