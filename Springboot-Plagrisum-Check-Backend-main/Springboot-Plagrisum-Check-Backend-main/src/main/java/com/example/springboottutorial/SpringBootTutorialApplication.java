package com.example.springboottutorial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class SpringBootTutorialApplication {

    public static void main(String[] args) {

//        ApplicationContext context = SpringApplication.run(SpringBootTutorialApplication.class, args);
//        Dev d = context.getBean(Dev.class);
//        d.Build();
        SpringApplication.run(SpringBootTutorialApplication.class, args);
    }

}
