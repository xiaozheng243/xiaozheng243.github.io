---
prev: ./SpringBoot学习笔记二：整合Swagger-UI

---

# SpringBoot学习笔记三：添加Mybatis

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

Mysbatis需要以数据库驱动作为前提，因此，此处添加了Mysql驱动。

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

## 2.添加配置文件

在`resource`资源文件夹中创建`mapper`文件夹用以存放Mybatis对应的XML配置文件。

在mapper文件夹创建名为`UserMapper.xml`的文件，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="online.yuluo.demo1.mapper.UserMapper">
    <select id="queryUsers"
            resultType="online.yuluo.demo1.domain.User">
        SELECT * from user
    </select>
</mapper>
```

简析：

1. 工作空间`namespace`字段的值对应`第三步`中dao接口的相对路径；
2. 查询操作的ID名称对应接口中的方法名称；
3. 返回值类字段型`resultType`对应接口返回值类型对象的相对路径。

## 3.添加Dao接口

在启动类所在路径添加`Dao`或`Mapper`包用以存放Mybatis接口。在该包中创建`UserMapper.java`接口，代码如下：

```java
package online.yuluo.demo1.mapper;
@Repository
public interface UserMapper  {
//    @Select("select * from user")
    List<User> queryUsers(User user);
}
```

简析：

1. `@Repository`是`@Component`的子注解，能使该接口注册为Bean；
2. Mybatis也提供了注解来应对一些CURD操作，因此，`@Select`注解可以取代`第二步`的XML配置操作，二选一即可。这里建议简单的操作可通过注解形式完成，复杂的操作还是使用XML配置来完成。

## 4.添加项目全局配置

在项目配置文件`application.properties`或`application.yml`中添加数据库连接信息及Mybatis映射信息：

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useSSL=false&characterEncoding=utf8 # 数据库URL
    username: root # 数据库用户名
    password: ***** # 数据库密码
    driver-class-name: com.mysql.jdbc.Driver
    
mybatis:
  mapper-locations: classpath:mapper/*.xml #Mybatis的XML配置文件地址
  type-aliases-package: online.yuluo.demo1.domain #实体对象地址
```

**注意** ：

1. MySQL6.0的连接驱动名称为`com.mysql.cj.jdbc.Driver`
2. URL设置东八区：&serverTimezone=Shanghai

## 5.添加Mapper扫描

在项目启动文件中添加Mapper扫描注解帮助系统发现mapper文件：

```java
@SpringBootApplication
@MapperScan("online.yuluo.demo1.mapper")
public class Demo1Application {
	public static void main(String[] args) {
		SpringApplication.run(Demo1Application.class, args);
	}
}
```

