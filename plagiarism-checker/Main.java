package plagiarism;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

    private static final int    K_GRAM = 5;
    private static final int    WINDOW = 4;
    private static final double ID_THRESHOLD = 0.40;
    private static final double LOG_THRESHOLD = 0.30;

    public static void main(String[] args) throws IOException {
        if (args.length != 2) {
            System.err.println("""
                Usage: java plagiarism.Main <file1> <file2>
                       (defaults: k=5, window=4, idThr=0.40, logThr=0.30)
                """);
            System.exit(1);
        }

        String code1 = Files.readString(Path.of(args[0]));
        String code2 = Files.readString(Path.of(args[1]));

        double idSim  = TokenUtils.identifierSimilarity(code1, code2);
        double logSim = LogicFingerprint.logicSimilarity(code1, code2, K_GRAM, WINDOW);
        double avgSim = (idSim + logSim) / 2.0;
        boolean plag  = (idSim >= ID_THRESHOLD) && (logSim >= LOG_THRESHOLD);

        System.out.printf("Identifier similarity: %.2f%% (threshold %.0f%%)%n",
                idSim * 100.0, ID_THRESHOLD * 100.0);
        System.out.printf("Logic similarity:      %.2f%% (threshold %.0f%%)%n",
                logSim * 100.0, LOG_THRESHOLD * 100.0);
        System.out.printf("Overall average:       %.2f%%%n", avgSim * 100.0);
        System.out.println(plag ? "Plagiarism detected." : "No plagiarism suspected.");
    }
}
