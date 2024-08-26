package ch.unisg.metricscomputationservice.domain.service;

import ch.unisg.metricscomputationservice.domain.model.Job;
import ch.unisg.metricscomputationservice.domain.model.JobQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class JobQueueExecutionService {

    private final JobQueue jobQueue = JobQueue.getInstance();

    private final JobExecutionService jobExecutionService;

    private final Object lock = new Object();

    public JobQueueExecutionService(JobExecutionService jobExecutionService) {
        this.jobExecutionService = jobExecutionService;
        startWorker();
    }

    private void startWorker() {
        Thread workerThread = new Thread(() -> {
            while (true) {
                synchronized (lock) {
                    while (jobQueue.isEmpty()) {
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            return;
                        }
                    }
                }
                runQueue();
            }
        });
        workerThread.setDaemon(true);
        workerThread.start();
    }

    public void runQueue() {
        while (!jobQueue.getJobs().isEmpty()) {
            Job job = jobQueue.pollJob();
            jobExecutionService.executeJob(job);
        }
    }

    public void addJob(Job job) {
        synchronized (lock) {
            jobQueue.addJob(job);
            lock.notifyAll();
        }
    }

}
