package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.AddRepoUseCase;
import ch.unisg.backend.application.port.out.AddRepoPort;
import ch.unisg.backend.application.port.out.EnqueueRepoPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
@RequiredArgsConstructor
public class AddRepoService implements AddRepoUseCase {

    private final AddRepoPort addRepoPort;
    private final EnqueueRepoPort enqueueRepoPort;

    @Override
    public ResponseEntity<Void> addRepo(URL repoUrl, String token) {

        Repo repo = new Repo(repoUrl, token);
        addRepoPort.addRepo(repo);

        RepoWithoutMetrics repoWithoutMetrics = new RepoWithoutMetrics(repo.getUuid(), repo.getStatus(),
                repo.getRepoUrl(), repo.getToken());
        RepoList.getInstance().addRepo(repoWithoutMetrics);

        enqueueRepoPort.enqueueRepo(repo.getUuid(), repoUrl, token);

        return ResponseEntity.ok().build();

    }
}
