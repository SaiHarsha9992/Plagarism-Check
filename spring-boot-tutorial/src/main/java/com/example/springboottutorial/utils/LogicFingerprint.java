package com.example.springboottutorial.utils;


import java.util.*;
import java.util.zip.CRC32;

public final class LogicFingerprint {

    private static final long BASE = 1_000_003L;
    private static final long MOD = (1L << 61) - 1;

    public static double logicSimilarity(String c1, String c2, int k, int window) {
        List<String> norm1 = TokenUtils.normaliseTokens(c1);
        List<String> norm2 = TokenUtils.normaliseTokens(c2);

        if (norm1.size() < 200 || norm2.size() < 200) {
            window = 1;
        }

        Set<Long> fp1 = winnow(kgramHashes(norm1, k), window);
        Set<Long> fp2 = winnow(kgramHashes(norm2, k), window);

        return jaccard(fp1, fp2);
    }

    private static List<Long> kgramHashes(List<String> tokens, int k) {
        List<Long> out = new ArrayList<>();
        if (tokens.size() < k) return out;

        long power = modPow(BASE, k - 1, MOD);
        long hash = 0;
        List<Long> vals = new ArrayList<>();
        for (String t : tokens)
            vals.add((long) (crc32(t) & 0xffffffffL));

        for (int i = 0; i < k; i++)
            hash = modAdd(modMul(hash, BASE, MOD), vals.get(i), MOD);
        out.add(hash);

        for (int i = k; i < vals.size(); i++) {
            hash = modSub(hash, modMul(vals.get(i - k), power, MOD), MOD);
            hash = modAdd(modMul(hash, BASE, MOD), vals.get(i), MOD);
            out.add(hash);
        }
        return out;
    }

    private static Set<Long> winnow(List<Long> hashes, int window) {
        if (window >= hashes.size()) return new HashSet<>(hashes);
        Set<Long> fp = new HashSet<>();
        long minVal = Long.MAX_VALUE;
        int minPos = -1;
        for (int i = 0; i <= hashes.size() - window; i++) {
            if (minPos < i) {
                minVal = Long.MAX_VALUE;
                for (int j = 0; j < window; j++) {
                    long v = hashes.get(i + j);
                    if (v < minVal) {
                        minVal = v;
                        minPos = i + j;
                    }
                }
                fp.add(minVal);
            } else {
                long newVal = hashes.get(i + window - 1);
                if (newVal <= minVal) {
                    minVal = newVal;
                    minPos = i + window - 1;
                    fp.add(minVal);
                }
            }
        }
        return fp;
    }

    private static int crc32(String s) {
        CRC32 crc = new CRC32();
        crc.update(s.getBytes());
        return (int) crc.getValue();
    }

    private static long modAdd(long a, long b, long m) {
        long res = a + b;
        if (res >= m) res -= m;
        return res;
    }

    private static long modSub(long a, long b, long m) {
        long res = a - b;
        if (res < 0) res += m;
        return res;
    }

    private static long modMul(long a, long b, long m) {
        return (a * b) % m;
    }

    private static long modPow(long base, int exp, long m) {
        long res = 1;
        long b = base % m;
        while (exp > 0) {
            if ((exp & 1) == 1) res = modMul(res, b, m);
            b = modMul(b, b, m);
            exp >>= 1;
        }
        return res;
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

