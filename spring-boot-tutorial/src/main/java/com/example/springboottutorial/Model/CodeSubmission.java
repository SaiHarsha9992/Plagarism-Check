package com.example.springboottutorial.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "submissions")
public class CodeSubmission {
    @Id
    private String codeId;
    private String name;
    private String email;
    private String code;
    private String language;
    private LocalDateTime timestamp;

    // Getters
    public String getCodeId() {
        return codeId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getCode() {
        return code;
    }

    public String getLanguage() {
        return language;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setters
    public void setCodeId(String codeId) {
        this.codeId = codeId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
