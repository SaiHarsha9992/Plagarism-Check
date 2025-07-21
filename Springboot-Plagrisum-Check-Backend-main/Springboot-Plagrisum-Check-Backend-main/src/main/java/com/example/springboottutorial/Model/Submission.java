package com.example.springboottutorial.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Submission {
    private String questionId;
    private String title;
    private String code;
    private String language;
    private int plagiarism;
    private String codeId;
}
