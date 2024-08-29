package ch.unisg.backend.application.port.out;

import ch.unisg.backend.domain.Status;

import java.util.UUID;

public interface UpdateRepoStatusPort {

    void updateRepoStatus(UUID uuid, Status status);

}
