package com.example.springboottutorial.Repository;

import com.example.springboottutorial.Model.CodeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeRepository extends MongoRepository<CodeSubmission, String> {
}
