package ch.unisg.metricscomputationservice.domain.service;

import ch.unisg.metricscomputationservice.application.port.in.EnqueueRepoUseCase;
import ch.unisg.metricscomputationservice.domain.model.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnqueueRepoService implements EnqueueRepoUseCase {

    private final JobQueueExecutionService jobQueueExecutionService;

    @Override
    public void enqueueRepo(UUID uuid, URL repoUrl, String token) {

        Job job = new Job(uuid, repoUrl, token);

        jobQueueExecutionService.addJob(job);

        job.setStatus(Job.Status.QUEUED);

    }
}
