package ch.unisg.backend.domain;

import lombok.Getter;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
public class RepoList {

    private static RepoList instance = null;

    private final List<Repo> repos;

    private RepoList() {
        repos = new ArrayList<>();
    }

    public static RepoList getInstance() {
        if (instance == null) {
            instance = new RepoList();
        }
        return instance;
    }

    public Repo getRepoByUUID(UUID uuid) {
        return repos.stream()
                .filter(repo -> repo.getUuid().equals(uuid))
                .findFirst()
                .orElse(null);
    }

    public void addRepo(Repo repo) {
        repos.add(repo);
    }

}