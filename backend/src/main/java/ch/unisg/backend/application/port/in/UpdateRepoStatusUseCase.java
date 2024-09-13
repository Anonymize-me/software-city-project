package ch.unisg.backend.application.port.in;

import ch.unisg.backend.domain.Status;

import java.util.UUID;

public interface UpdateRepoStatusUseCase {

    void updateRepoStatus(UUID uuid, Status status);
}
