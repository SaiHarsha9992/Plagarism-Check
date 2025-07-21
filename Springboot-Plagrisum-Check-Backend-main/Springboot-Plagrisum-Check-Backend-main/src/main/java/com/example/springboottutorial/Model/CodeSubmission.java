package com.example.springboottutorial.Model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "submissions")
public class CodeSubmission {

    @Id
    private String id;
    private String codeId;
    private String name;
    private String email;
    private List<Submission> submissions;
    private LocalDateTime timestamp;


}
