package ch.unisg.backend.application.port.in;

import ch.unisg.backend.domain.Repo;

import java.net.URL;
import java.util.UUID;

public interface UpdateRepoStatusUseCase {

    void updateRepoStatus(UUID uuid, Repo.Status status);
}
