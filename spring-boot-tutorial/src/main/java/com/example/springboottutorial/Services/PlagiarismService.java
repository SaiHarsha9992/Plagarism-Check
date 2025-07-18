package com.example.springboottutorial.Services;

import com.example.springboottutorial.Model.CodeSubmission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.springboottutorial.Repository.CodeRepository;
import com.example.springboottutorial.utils.TokenUtils;
import com.example.springboottutorial.utils.LogicFingerprint;

import java.util.*;

@Service
public class PlagiarismService {

    private static final int K_GRAM = 5;
    private static final int WINDOW = 4;
    private static final double ID_THRESHOLD = 0.40;
    private static final double LOG_THRESHOLD = 0.30;

    @Autowired
    private CodeRepository codeRepo;

    public List<Map<String, Object>> checkAllPlagiarism() {
        List<CodeSubmission> codes = codeRepo.findAll();
        System.out.println(codes);
        Map<String, Map<String, Object>> emailMap = new HashMap<>();

        for (int i = 0; i < codes.size(); i++) {
            for (int j = i + 1; j < codes.size(); j++) {

                if (!Objects.equals(codes.get(i).getCodeId(), codes.get(j).getCodeId())) continue;

                double idSim = TokenUtils.identifierSimilarity(codes.get(i).getCode(), codes.get(j).getCode());
                double logSim = LogicFingerprint.logicSimilarity(codes.get(i).getCode(), codes.get(j).getCode(), K_GRAM, WINDOW);
                boolean isPlag = idSim >= ID_THRESHOLD && logSim >= LOG_THRESHOLD;

                if (isPlag) {
                    emailMap.putIfAbsent(codes.get(i).getEmail(), new HashMap<>(Map.of(
                            "codeId", codes.get(i).getCodeId(),
                            "name", codes.get(i).getName(),
                            "email", codes.get(i).getEmail(),
                            "plagiarisedWith", new ArrayList<>()
                    )));

                    emailMap.putIfAbsent(codes.get(j).getEmail(), new HashMap<>(Map.of(
                            "codeId", codes.get(j).getCodeId(),
                            "name", codes.get(j).getName(),
                            "email", codes.get(j).getEmail(),
                            "plagiarisedWith", new ArrayList<>()
                    )));

                    List<Map<String, String>> list1 = (List<Map<String, String>>) emailMap.get(codes.get(i).getEmail()).get("plagiarisedWith");
                    List<Map<String, String>> list2 = (List<Map<String, String>>) emailMap.get(codes.get(j).getEmail()).get("plagiarisedWith");

                    list1.add(Map.of(
                            "codeId", codes.get(j).getCodeId(),
                            "name", codes.get(j).getName(),
                            "email", codes.get(j).getEmail()
                    ));

                    list2.add(Map.of(
                            "codeId", codes.get(i).getCodeId(),
                            "name", codes.get(i).getName(),
                            "email", codes.get(i).getEmail()
                    ));
                }
            }
        }

        return new ArrayList<>(emailMap.values());
    }
}