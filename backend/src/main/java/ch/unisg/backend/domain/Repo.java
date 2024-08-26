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

    public enum Status {
        REGISTERED, QUEUED, FAILED, RUNNING, DONE
    }

    @Id
    private UUID uuid;
    private Status status;
    private URL repoUrl;
    private List<MetricsDataRow> metrics;

    public Repo(URL repoUrl) {
        this.uuid = UUID.randomUUID();
        this.status = Status.REGISTERED;
        this.repoUrl = repoUrl;
        this.metrics = new ArrayList<>();
    }

    public Repo(UUID uuid, Status status, URL repoUrl, List<MetricsDataRow> metrics) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.metrics = metrics;
    }

}
