package ch.unisg.backend.adapter.out.persistence;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "repos")
public class RepoWithoutMetricsMongoDocument {

    @Id
    public String uuid;
    public String status;
    public String repoUrl;
    public String token;

    public RepoWithoutMetricsMongoDocument(String uuid, String status, String repoUrl, String token) {
        this.uuid = uuid;
        this.status = status;
        this.repoUrl = repoUrl;
        this.token = token;
    }

}
