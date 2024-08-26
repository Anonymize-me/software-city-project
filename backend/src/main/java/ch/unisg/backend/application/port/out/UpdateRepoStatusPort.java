package ch.unisg.backend.application.port.out;

import ch.unisg.backend.domain.Repo;

import java.net.URL;
import java.util.UUID;

public interface UpdateRepoStatusPort {

    void updateRepoStatus(UUID uuid, Repo.Status status);

}
