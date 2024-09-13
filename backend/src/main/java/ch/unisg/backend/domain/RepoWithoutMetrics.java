package ch.unisg.backend.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.net.URL;
import java.util.UUID;

@Getter
@Setter
public class RepoWithoutMetrics {

    @Id
    private UUID uuid;
    private Status status;
    private URL repoUrl;
    private String token;

    public RepoWithoutMetrics(UUID uuid, Status status, URL repoUrl, String token) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.token = token;
    }

}
