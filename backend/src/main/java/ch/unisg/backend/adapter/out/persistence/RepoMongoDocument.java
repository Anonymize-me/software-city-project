package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.domain.MetricsDataRow;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "repos")
public class RepoMongoDocument {

    @Id
    public String uuid;
    public String status;
    public String repoUrl;
    public List<MetricsDataRow> metrics;

    public RepoMongoDocument(String uuid, String status, String repoUrl, List<MetricsDataRow> metrics) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.metrics = metrics;
    }

}
