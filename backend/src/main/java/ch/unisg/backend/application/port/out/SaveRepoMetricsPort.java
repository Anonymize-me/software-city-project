package ch.unisg.backend.application.port.out;

import ch.unisg.backend.domain.Repo;

public interface SaveRepoMetricsPort {

    void saveRepo(Repo repo);

}
