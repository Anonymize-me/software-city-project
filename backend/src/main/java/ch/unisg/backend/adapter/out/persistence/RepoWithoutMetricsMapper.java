package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.domain.RepoWithoutMetrics;
import ch.unisg.backend.domain.Status;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.UUID;

@Component
public class RepoWithoutMetricsMapper {

    RepoWithoutMetrics toDomainObject(RepoWithoutMetricsMongoDocument repoWithoutMetricsMongoDocument) {

        URL repoUrl;

        try {
            repoUrl = new URL(repoWithoutMetricsMongoDocument.getRepoUrl());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL");
        }

        return new RepoWithoutMetrics(
                UUID.fromString(repoWithoutMetricsMongoDocument.getUuid()),
                Status.valueOf(repoWithoutMetricsMongoDocument.getStatus()),
                repoUrl,
                repoWithoutMetricsMongoDocument.getToken()
        );
    }

    RepoWithoutMetricsMongoDocument toMongoDocument(RepoWithoutMetrics repo) {
        return new RepoWithoutMetricsMongoDocument(
                repo.getUuid().toString(),
                repo.getStatus().toString(),
                repo.getRepoUrl().toString(),
                repo.getToken()
        );
    }
}
