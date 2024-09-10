package ch.unisg.metricscomputationservice.domain.service;

import ch.unisg.metricscomputationservice.application.port.out.SendJobPort;
import ch.unisg.metricscomputationservice.application.port.out.SendJobStatusUpdatePort;
import ch.unisg.metricscomputationservice.domain.model.Job;
import ch.unisg.metricscomputationservice.domain.model.MetricsDataRow;
import lombok.RequiredArgsConstructor;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.revwalk.RevCommit;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobExecutionService {

    private final SendJobPort sendJobPort;

    private final SendJobStatusUpdatePort sendJobStatusUpdatePort;

    public void executeJob(Job job) {

        job.setStatus(Job.Status.RUNNING);

        sendJobStatusUpdatePort.sendJobStatusUpdate(job);

        URL repoUrl = job.getRepoUrl();
        File repositoryDir = null;

        try {
            repositoryDir = File.createTempFile("repository", "");
            if (!repositoryDir.delete() || !repositoryDir.mkdir()) {
                throw new IOException("Could not create temporary directory.");
            }
            try (Git git = Git.cloneRepository()
                    .setURI(repoUrl.toString())
                    .setDirectory(repositoryDir)
                    .call()) {
                System.out.println("Repository cloned to " + repositoryDir.getAbsolutePath());
            }

            try (Git git = Git.open(repositoryDir)) {
                Iterable<RevCommit> commitsIterable = git.log().call();
                List<RevCommit> commits = new ArrayList<>();
                commitsIterable.forEach(commits::add);
                Collections.reverse(commits);

                int commitCount = 1;
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

                for (RevCommit commit : commits) {
                    git.checkout().setName(commit.getName()).call();

                    int commitTime = commit.getCommitTime();
                    Date commitDate = new Date((long) commitTime * 1000);
                    String formattedDate = dateFormat.format(commitDate);

                    Process process = getProcess(repositoryDir);
                    process.waitFor();

                    File commitMetricsFile = new File(repositoryDir, "class.csv");
                    List<MetricsDataRow> metricsDataRows = new ArrayList<>();
                    if (commitMetricsFile.exists()) {
                        List<String> lines = Files.readAllLines(commitMetricsFile.toPath());
                        lines.remove(0);
                        for (String line : lines) {
                            MetricsDataRow dataRow = parseCsvLine(repoUrl.toString(), line);
                            dataRow.setTimestamp(formattedDate);
                            dataRow.setCommitNumber(commitCount);
                            dataRow.setCommitHash(commit.getName());
                            metricsDataRows.add(dataRow);
                        }
                    }

                    Map<String, List<MetricsDataRow>> groupedByFile = metricsDataRows.stream()
                            .collect(Collectors.groupingBy(MetricsDataRow::getFile));

                    for (Map.Entry<String, List<MetricsDataRow>> entry : groupedByFile.entrySet()) {
                        MetricsDataRow consolidatedRow = new MetricsDataRow(repoUrl.toString(),
                                entry.getKey(), formattedDate,
                                entry.getValue());
                        job.addMetricsDataRow(consolidatedRow);
                    }

                    System.out.println("Commit " + commitCount + " of total " + commits.size() + " analyzed.");

                    commitCount++;
                }

                sendJobPort.sendJob(job);

            }
        } catch (GitAPIException | IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (repositoryDir != null && repositoryDir.exists()) {
                deleteDirectory(repositoryDir);
            }
        }
    }

    private MetricsDataRow parseCsvLine(String repoUrl, String line) {
        String[] fields = line.split(",");
        return new MetricsDataRow(repoUrl, fields);
    }

    @NotNull
    private static Process getProcess(File repositoryDir) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "java",
                "-jar",
                "/app/ck-0.7.1-SNAPSHOT-jar-with-dependencies.jar",
                repositoryDir.getAbsolutePath(), // Path to the repository
                "false", // JARs not used
                "0", // Max number of files per partition
                "false", // Metrics also for variable/field - level?
                repositoryDir.getAbsolutePath() + "/" // Output file
        );
        processBuilder.redirectErrorStream(true);

        return processBuilder.start();
    }

    private void deleteDirectory(File directory) {
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    file.delete();
                }
            }
        }
        directory.delete();
    }
}
