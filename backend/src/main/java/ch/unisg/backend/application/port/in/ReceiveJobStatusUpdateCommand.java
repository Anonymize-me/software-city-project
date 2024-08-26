package ch.unisg.backend.application.port.in;

import ch.unisg.backend.domain.Repo;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReceiveJobStatusUpdateCommand {

    private UUID uuid;
    private Repo.Status status;

    public ReceiveJobStatusUpdateCommand(UUID uuid, Repo.Status status) {
        this.uuid = uuid;
        this.status = status;
    }
}
