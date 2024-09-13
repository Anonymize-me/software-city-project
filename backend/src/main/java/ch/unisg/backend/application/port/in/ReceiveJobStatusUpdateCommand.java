package ch.unisg.backend.application.port.in;

import ch.unisg.backend.domain.Status;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReceiveJobStatusUpdateCommand {

    private UUID uuid;
    private Status status;
    private String token;

    public ReceiveJobStatusUpdateCommand(UUID uuid, Status status, String token) {
        this.uuid = uuid;
        this.status = status;
        this.token = token;
    }
}
