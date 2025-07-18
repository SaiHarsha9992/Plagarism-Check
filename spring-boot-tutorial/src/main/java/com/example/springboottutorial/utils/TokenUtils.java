package com.example.springboottutorial.utils;

import java.util.*;
import java.util.regex.*;

public final class TokenUtils {

    private static final Pattern COMMENT_PAT = Pattern.compile(
            "//.*?$|#.*?$|/\\*.*?\\*/|'''(?:.|\n)*?'''|\"\"\"(?:.|\n)*?\"\"\"",
            Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern IMPORT_PAT = Pattern.compile(
            "^\\s*(import|using|#include).*?$|^\\s*from\\s+\\w+\\s+import.*?$",
            Pattern.MULTILINE);
    private static final Pattern PRINT_PAT = Pattern.compile(
            "^\\s*print\\(.*?$|^\\s*console\\.log\\(.*?$",
            Pattern.MULTILINE);
    private static final Pattern TOKEN_PAT = Pattern.compile("\\w+");

    private static final Set<String> CORE_KEYWORDS = Set.of(
            "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "return",
            "true", "false", "null", "void", "class", "struct", "public", "private", "protected",
            "static", "final", "const", "new", "try", "catch", "finally", "throw", "throws",
            "def", "lambda", "function", "var", "let", "import", "package", "module"
    );

    public static double identifierSimilarity(String c1, String c2) {
        Set<String> ids1 = extractIdentifiers(c1);
        Set<String> ids2 = extractIdentifiers(c2);
        return jaccard(ids1, ids2);
    }

    public static List<String> normaliseTokens(String code) {
        List<String> out = new ArrayList<>();
        for (String t : tokenize(clean(code))) {
            if (!CORE_KEYWORDS.contains(t) && Character.isLetter(t.charAt(0)))
                out.add("id");
            else
                out.add(t);
        }
        return out;
    }

    private static Set<String> extractIdentifiers(String code) {
        List<String> tokens = tokenize(clean(code));
        Set<String> ids = new HashSet<>();
        for (String t : tokens) {
            if (!CORE_KEYWORDS.contains(t) && !t.chars().allMatch(Character::isDigit)) {
                ids.add(t);
            }
        }
        return ids;
    }

    private static List<String> tokenize(String code) {
        Matcher m = TOKEN_PAT.matcher(code.toLowerCase());
        List<String> list = new ArrayList<>();
        while (m.find()) list.add(m.group());
        return list;
    }

    private static String clean(String code) {
        code = COMMENT_PAT.matcher(code).replaceAll("");
        code = IMPORT_PAT.matcher(code).replaceAll("");
        code = PRINT_PAT.matcher(code).replaceAll("");
        return code;
    }

    private static double jaccard(Set<?> a, Set<?> b) {
        if (a.isEmpty() && b.isEmpty()) return 1.0;
        Set<?> tmp = new HashSet<>(a);
        tmp.retainAll(b);
        int intersection = tmp.size();
        int union = a.size() + b.size() - intersection;
        return (double) intersection / union;
    }
}