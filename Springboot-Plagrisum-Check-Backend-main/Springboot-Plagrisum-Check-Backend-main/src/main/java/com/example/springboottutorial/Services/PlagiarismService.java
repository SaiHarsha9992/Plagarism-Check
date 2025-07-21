package com.example.springboottutorial.Services;

import com.example.springboottutorial.Model.CodeSubmission;
import com.example.springboottutorial.Model.Submission;
import com.example.springboottutorial.Repository.CodeRepository;
import com.example.springboottutorial.utils.LogicFingerprint;
import com.example.springboottutorial.utils.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

class DisjointSetUnion {
    private final int[] parent;
    private final int[] rank;

    DisjointSetUnion(int size) {
        parent = new int[size];
        rank   = new int[size];
        for (int i = 0; i < size; i++) {
            parent[i] = i;
            rank[i]   = 0;
        }
    }
    int findParent(int u) {
        if (u == parent[u]) return u;
        return parent[u] = findParent(parent[u]);
    }
    void unionByRank(int u, int v) {
        int pu = findParent(u), pv = findParent(v);
        if (pu == pv) return;
        if (rank[pu] > rank[pv])       parent[pv] = pu;
        else if (rank[pv] > rank[pu])  parent[pu] = pv;
        else { parent[pu] = pv; rank[pv]++; }
    }
}

@Service
public class PlagiarismService {

    private static final int    K_GRAM       = 5;
    private static final int    WINDOW       = 4;
    private static final double ID_THRESHOLD = 0.40;
    private static final double LOG_THRESHOLD = 0.30;

    @Autowired
    private CodeRepository codeRepo;

    public List<Map<String, Object>> checkAllPlagiarism() {

        List<SubmissionData> flat = new ArrayList<>();
        for (CodeSubmission cs : codeRepo.findAll()) {
            if (cs.getSubmissions() == null) continue;
            for (Submission s : cs.getSubmissions()) {
                if (s.getCode() == null || s.getCode().trim().isEmpty()) continue;
                flat.add(new SubmissionData(
                        (s.getCodeId() == null ? UUID.randomUUID().toString() : s.getCodeId()),
                        cs.getName(),
                        cs.getEmail(),
                        s.getCode()
                ));
            }
        }

        int n = flat.size();
        DisjointSetUnion dsu = new DisjointSetUnion(n);

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                double idSim  = TokenUtils.identifierSimilarity(flat.get(i).code, flat.get(j).code);
                double logSim = LogicFingerprint.logicSimilarity(flat.get(i).code, flat.get(j).code,
                        K_GRAM, WINDOW);
                if (idSim >= ID_THRESHOLD && logSim >= LOG_THRESHOLD) {
                    dsu.unionByRank(i, j);
                }
            }
        }

        Map<Integer, List<Integer>> clusters = new HashMap<>();
        for (int i = 0; i < n; i++) {
            clusters.computeIfAbsent(dsu.findParent(i), k -> new ArrayList<>()).add(i);
        }

        Map<String, ResultRow> results = new LinkedHashMap<>();

        for (int i = 0; i < n; i++) {
            SubmissionData cur = flat.get(i);
            results.computeIfAbsent(cur.email, k ->
                    new ResultRow(cur.codeId, cur.name, cur.email));

            for (int idx : clusters.get(dsu.findParent(i))) {
                if (idx == i) continue;
                SubmissionData other = flat.get(idx);
                results.get(cur.email)
                        .plagiarisedWith
                        .add(Map.of("codeId", other.codeId,
                                "name",   other.name,
                                "email",  other.email));
            }
        }

        List<Map<String, Object>> out = new ArrayList<>();
        for (ResultRow r : results.values()) out.add(r.toMap());
        return out;
    }


    private static class SubmissionData {
        final String codeId, name, email, code;
        SubmissionData(String codeId, String name, String email, String code) {
            this.codeId = codeId; this.name = name; this.email = email; this.code = code;
        }
    }

    private static class ResultRow {
        final String codeId, name, email;
        final List<Map<String, String>> plagiarisedWith = new ArrayList<>();
        ResultRow(String codeId, String name, String email) {
            this.codeId = codeId; this.name = name; this.email = email;
        }
        Map<String, Object> toMap() {
            return Map.of("codeId", codeId,
                    "name",   name,
                    "email",  email,
                    "plagiarisedWith", plagiarisedWith);
        }
    }
}
