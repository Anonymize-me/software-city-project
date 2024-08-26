package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.AddRepoUseCase;
import ch.unisg.backend.application.port.out.AddRepoPort;
import ch.unisg.backend.application.port.out.EnqueueRepoPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
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
    public ResponseEntity<Void> addRepo(URL repoUrl) {

        Repo repo = new Repo(repoUrl);

        RepoList.getInstance().addRepo(repo);
        addRepoPort.addRepo(repo);

        enqueueRepoPort.enqueueRepo(repo.getUuid(), repoUrl);

        return ResponseEntity.ok().build();

    }
}
