package ch.unisg.backend.application.port.in;

import ch.unisg.backend.domain.MetricsDataRow;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ReceiveJobCommand {

    private UUID uuid;
    private URL repoUrl;
    private String token;
    private List<MetricsDataRow> metricsData;

    public ReceiveJobCommand(UUID uuid, URL repoUrl, String token, List<MetricsDataRow> metricsData) {
        this.uuid = uuid;
        this.repoUrl = repoUrl;
        this.token = token;
        this.metricsData = metricsData;
    }
}
