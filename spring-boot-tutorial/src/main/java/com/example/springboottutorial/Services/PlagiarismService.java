package com.example.springboottutorial.Services;

import com.example.springboottutorial.Model.CodeSubmission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.springboottutorial.Repository.CodeRepository;
import com.example.springboottutorial.utils.TokenUtils;
import com.example.springboottutorial.utils.LogicFingerprint;

import java.util.*;

class DisjointSetUnion {
    private int[] parent;
    private int[] rank;

    public DisjointSetUnion(int size) {
        parent = new int[size + 1];
        rank = new int[size + 1];
        for (int i = 0; i <= size; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }

    public int findParent(int u) {
        if (u == parent[u]) return u;
        return parent[u] = findParent(parent[u]);
    }

    public void unionByRank(int u, int v) {
        int pu = findParent(u);
        int pv = findParent(v);
        if (pu == pv) return;
    
        if (rank[pu] > rank[pv]) {
            parent[pv] = pu;
        } else if (rank[pv] > rank[pu]) {
            parent[pu] = pv;
        } else {
            parent[pu] = pv;
            rank[pv]++;
        }
    }
}


@Service
public class PlagiarismService {

    private static final int K_GRAM = 5;
    private static final int WINDOW = 4;
    private static final double ID_THRESHOLD = 0.40;
    private static final double LOG_THRESHOLD = 0.30;

    @Autowired
    private CodeRepository codeRepo;
    private ArrayList<ArrayList<Integer>> adjacencyList;
    private boolean[] visited;

    private void dfs(int parent, ArrayList<Integer> connectedComponents, boolean[] visited) {
        if (visited[parent]) return;
        visited[parent] = true;
        connectedComponents.add(parent);
        for (int child : adjacencyList.get(parent)) {
            if (!visited[child]) {
                dfs(child, connectedComponents, visited);
            }
        }
    }

    
    public List<Map<String, Object>> checkAllPlagiarism() {
        List<CodeSubmission> codes = codeRepo.findAll();
        System.out.println(codes);
        adjacencyList = new ArrayList<>();
        for (int i = 0; i < numberOfSubmissions; i++) {
            adjacencyList.add(new ArrayList<>());
        }

        visited = new boolean[numberOfSubmissions + 1];
        DisjointSetUnion DSU = new DisjointSetUnion(numberOfSubmissions);


        for (int i = 0; i < codes.size(); i++) {
            if(visited[i]) continue;
            for (int j = i + 1; j < codes.size(); j++) {

                double idSim = TokenUtils.identifierSimilarity(codes.get(i).getCode(), codes.get(j).getCode());
                double logSim = LogicFingerprint.logicSimilarity(codes.get(i).getCode(), codes.get(j).getCode(), K_GRAM, WINDOW);
                boolean isPlag = idSim >= ID_THRESHOLD && logSim >= LOG_THRESHOLD;
                double avgSim = (idSim + logSim) / 2.0;

                if (isPlag) {
                    DSU.unionByRank(i, j);
                    adjacencyList.get(i).add(j);
                    adjacencyList.get(j).add(i);
                    visited[j] = true;
                }
            }
        }

        ArrayList<ArrayList<Integer>> AllComponents = new ArrayList<>();
        for(int i = 0; i < numberOfSubmissions; i++){
            AllComponents.add(new ArrayList<>());
        }
        Arrays.fill(visited, false);

        for (int i = 0; i < numberOfSubmissions; i++) {
            int parent = DSU.findParent(i);
            if (AllComponents.get(parent).isEmpty()) {
                ArrayList<Integer> connectedComponents = new ArrayList<>();
                dfs(parent, connectedComponents, visited);
                AllComponents.set(parent, connectedComponents);
                AllComponents.set(i,connectedComponents);
            }
            else{
                AllComponents.set(i,AllComponents.get(parent));
            }
        }


        Map<String, Map<String, Object>> emailMap = new HashMap<>();

        for(int i = 0; i < AllComponents.size(); i++){
            emailMap.putIfAbsent(codes.get(i).getEmail(), new HashMap<>(Map.of(
                "codeId", codes.get(i).getCodeId(),
                "name", codes.get(i).getName(),
                "email", codes.get(i).getEmail(),
                "plagiarisedWith", new ArrayList<>()
            )));
            List<Map<String, String>> list1 = (List<Map<String, String>>) emailMap.get(codes.get(i).getEmail()).get("plagiarisedWith");
            for(int idx : AllComponents.get(i)){
                list1.add(Map.of(
                    "codeId",codes.get(idx).getCodeId(),
                    "name",codes.get(idx).getName(),
                    "email",codes.get(idx).getEmail()
                ));
            }
        }

        // All process completed 


        //just printing for the validation while testing
        for (Map<String, Object> entry : emailMap.values()) {
            System.out.println("Name: " + entry.get("name"));
            System.out.println("Email: " + entry.get("email"));
            System.out.println("Code ID: " + entry.get("codeId"));
            System.out.println("Plagiarised With:");

            List<Map<String, String>> list = (List<Map<String, String>>) entry.get("plagiarisedWith");

            boolean hasOthers = false;
            for (Map<String, String> inner : list) {
                // Skip printing self
                if (!inner.get("email").equals(entry.get("email"))) {
                    hasOthers = true;
                    System.out.println(" - Name: " + inner.get("name")
                            + ", Email: " + inner.get("email")
                            + ", Code ID: " + inner.get("codeId"));
                }
            }

            if (!hasOthers) {
                System.out.println(" - None");
            }

            System.out.println(); 
        }
        return new ArrayList<>(emailMap.values());
    }
}