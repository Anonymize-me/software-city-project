package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.ReceiveJobCommand;
import ch.unisg.backend.application.port.in.ReceiveJobStatusUpdateCommand;
import ch.unisg.backend.application.port.in.ReceiveJobUseCase;
import ch.unisg.backend.application.port.out.SaveRepoMetricsPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import ch.unisg.backend.domain.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiveJobService implements ReceiveJobUseCase {

    private final SaveRepoMetricsPort saveRepoMetricsPort;

    private final UpdateRepoStatusService updateRepoStatusService;

    private static final RepoList repoList = RepoList.getInstance();

    @Override
    public void receiveJob(ReceiveJobCommand command) {

        RepoWithoutMetrics repoWithoutMetrics = repoList.getRepoByUUID(command.getUuid());
        repoWithoutMetrics.setStatus(Status.DONE);

        Repo repo = new Repo(command.getUuid(),
                repoWithoutMetrics.getStatus(),
                repoWithoutMetrics.getRepoUrl(),
                command.getMetricsData());

        saveRepoMetricsPort.saveRepo(repo);

    }

    @Override
    public void receiveJobStatusUpdate(ReceiveJobStatusUpdateCommand command) {

        RepoWithoutMetrics repoWithoutMetrics = repoList.getRepoByUUID(command.getUuid());
        repoWithoutMetrics.setStatus(command.getStatus());

        Repo repo = new Repo(command.getUuid(),
                repoWithoutMetrics.getStatus(),
                repoWithoutMetrics.getRepoUrl());

        updateRepoStatusService.updateRepoStatus(repo.getUuid(), repo.getStatus());
    }
}
