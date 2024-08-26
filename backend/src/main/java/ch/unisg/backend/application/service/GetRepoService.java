package ch.unisg.backend.application.service;

import ch.unisg.backend.application.port.in.GetRepoUseCase;
import ch.unisg.backend.application.port.out.EnqueueRepoPort;
import ch.unisg.backend.application.port.out.GetRepoPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetRepoService implements GetRepoUseCase {

    private final GetRepoPort getAllReposPort;

    private final EnqueueRepoPort enqueueRepoPort;

    RepoList repoList = RepoList.getInstance();

    @Override
    public List<Repo> getAllRepos() {

        List<Repo> repos = repoList.getRepos();

        if (repos.isEmpty()) {
            try {
                List<Repo> reposFromDB = getAllReposPort.getAllRepos();
                for (Repo repo : reposFromDB) {
                    repoList.addRepo(repo);
                    if (repo.getMetrics().isEmpty()) {
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
        return repoList.getRepoByUUID(uuid);
    }

}
