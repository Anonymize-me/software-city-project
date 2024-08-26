package ch.unisg.metricscomputationservice.domain.model;

import ch.unisg.metricscomputationservice.domain.service.JobExecutionService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.LinkedList;
import java.util.concurrent.ConcurrentLinkedDeque;

@Getter
@Setter
public class JobQueue {

    private static JobQueue instance = null;

    private ConcurrentLinkedDeque<Job> jobs;

    private JobQueue() {
        jobs = new ConcurrentLinkedDeque<>();
    }

    public static synchronized JobQueue getInstance() {
        if (instance == null) {
            instance = new JobQueue();
        }
        return instance;
    }

    public synchronized void addJob(Job job) {

        jobs.add(job);
        notifyAll();
    }

    public synchronized Job pollJob() {
        return jobs.pollFirst();
    }

    public synchronized boolean isEmpty() {
        return jobs.isEmpty();
    }

}
