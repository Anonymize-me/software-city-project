package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.ReceiveJobCommand;
import ch.unisg.backend.application.port.in.ReceiveJobStatusUpdateCommand;
import ch.unisg.backend.application.port.in.ReceiveJobUseCase;
import ch.unisg.backend.application.port.out.SaveRepoMetricsPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiveJobService implements ReceiveJobUseCase {

    private final SaveRepoMetricsPort saveRepoMetricsPort;

    private static final RepoList repoList = RepoList.getInstance();

    @Override
    public void receiveJob(ReceiveJobCommand command) {

        Repo repo = repoList.getRepoByUUID(command.getUuid());
        repo.setMetrics(command.getMetricsData());
        repo.setStatus(Repo.Status.DONE);

        saveRepoMetricsPort.saveRepo(repo);

    }

    @Override
    public void receiveJobStatusUpdate(ReceiveJobStatusUpdateCommand command) {

        Repo repo = repoList.getRepoByUUID(command.getUuid());
        repo.setStatus(command.getStatus());

        saveRepoMetricsPort.saveRepo(repo);
    }
}
