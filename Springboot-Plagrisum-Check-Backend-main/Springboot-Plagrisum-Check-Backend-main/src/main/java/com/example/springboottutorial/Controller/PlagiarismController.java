package com.example.springboottutorial.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.springboottutorial.Services.PlagiarismService;

import java.util.List;
import java.util.Map;

@RestController    
@RequestMapping("/api/plagiarism")
public class PlagiarismController {

//    @Autowired
    private final PlagiarismService service;

    public PlagiarismController(PlagiarismService service) {
        this.service = service;
    }

    @GetMapping("/check-all")
    public List<Map<String, Object>> checkAll() {
        return service.checkAllPlagiarism();
    }
}
