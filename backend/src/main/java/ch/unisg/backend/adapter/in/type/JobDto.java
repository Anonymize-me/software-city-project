package ch.unisg.backend.adapter.in.type;

import ch.unisg.backend.domain.MetricsDataRow;
import ch.unisg.backend.domain.Status;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class JobDto {

    private UUID uuid;
    private URL repoUrl;
    private Status status;
    private String token;
    private List<MetricsDataRow> metricsData;

}
