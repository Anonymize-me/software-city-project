package ch.unisg.backend.application.port.out;

import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoWithoutMetrics;

import java.util.List;
import java.util.UUID;

public interface GetRepoPort {

    List<RepoWithoutMetrics> getAllReposWithoutMetrics();

    Repo getRepoByUUID(UUID uuid);

}
