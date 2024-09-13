package ch.unisg.metricscomputationservice.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class Job {

    public enum Status {
        REGISTERED, QUEUED, FAILED, RUNNING, DONE
    }

    private UUID uuid;
    private URL repoUrl;
    private String token;
    private Status status;
    private List<MetricsDataRow> metricsData;

    public Job(UUID uuid, URL repoUrl, String token) {
        this.uuid = uuid;
        this.repoUrl = repoUrl;
        this.token = token;
        this.status = Status.REGISTERED;
        this.metricsData = new ArrayList<>();
    }

    public void addMetricsDataRow(MetricsDataRow metricsDataRow) {
        metricsData.add(metricsDataRow);
    }

}
