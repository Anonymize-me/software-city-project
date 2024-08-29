package ch.unisg.backend.domain;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
public class RepoList {

    private static RepoList instance = null;

    private final List<RepoWithoutMetrics> repos;

    private RepoList() {
        repos = new ArrayList<>();
    }

    public static RepoList getInstance() {
        if (instance == null) {
            instance = new RepoList();
        }
        return instance;
    }

    public RepoWithoutMetrics getRepoByUUID(UUID uuid) {
        return repos.stream()
                .filter(repo -> repo.getUuid().equals(uuid))
                .findFirst()
                .orElse(null);
    }

    public void addRepo(RepoWithoutMetrics repo) {
        repos.add(repo);
    }

}