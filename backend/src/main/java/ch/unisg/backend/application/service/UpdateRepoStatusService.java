package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.UpdateRepoStatusUseCase;
import ch.unisg.backend.application.port.out.UpdateRepoStatusPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import ch.unisg.backend.domain.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateRepoStatusService implements UpdateRepoStatusUseCase {

    private final UpdateRepoStatusPort updateRepoStatusPort;

@Override
    public void updateRepoStatus(UUID uuid, Status status) {
        RepoWithoutMetrics repoWithoutMetrics = RepoList.getInstance().getRepoByUUID(uuid);
        repoWithoutMetrics.setStatus(status);
        updateRepoStatusPort.updateRepoStatus(uuid, status);
    }

}
