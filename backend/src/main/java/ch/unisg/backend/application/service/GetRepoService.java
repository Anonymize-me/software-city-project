package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.GetRepoUseCase;
import ch.unisg.backend.application.port.out.EnqueueRepoPort;
import ch.unisg.backend.application.port.out.GetRepoPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetRepoService implements GetRepoUseCase {

    private final GetRepoPort getReposPort;

    private final EnqueueRepoPort enqueueRepoPort;

    RepoList repoList = RepoList.getInstance();

    @Override
    public List<RepoWithoutMetrics> getAllReposWithoutMetrics() {

        List<RepoWithoutMetrics> repos = repoList.getRepos();

        if (repos.isEmpty()) {
            try {
                List<RepoWithoutMetrics> reposFromDB = getReposPort.getAllReposWithoutMetrics();
                for (RepoWithoutMetrics repo : reposFromDB) {
                    repoList.addRepo(repo);
                    if (!repo.getStatus().toString().equals("DONE")) {
                        enqueueRepoPort.enqueueRepo(repo.getUuid(), repo.getRepoUrl());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return repos;

    }

    @Override
    public Repo getRepoByUUID(UUID uuid) {
        return getReposPort.getRepoByUUID(uuid);
    }

}
