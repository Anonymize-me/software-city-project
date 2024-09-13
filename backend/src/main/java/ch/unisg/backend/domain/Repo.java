package ch.unisg.backend.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class Repo {

    @Id
    private UUID uuid;
    private Status status;
    private URL repoUrl;
    private String token;
    private List<MetricsDataRow> metrics;

    public Repo(URL repoUrl, String token) {
        this.uuid = UUID.randomUUID();
        this.status = Status.REGISTERED;
        this.repoUrl = repoUrl;
        this.token = token;
        this.metrics = new ArrayList<>();
    }

    public Repo(UUID uuid, Status status, URL repoUrl, String token, List<MetricsDataRow> metrics) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.token = token;
        this.metrics = metrics;
    }

    public Repo(UUID uuid, Status status, URL repoUrl, String token) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.token = token;
        this.metrics = new ArrayList<>();
    }

}
