package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.Status;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.UUID;

@Component
public class RepoMapper {

    Repo toDomainObject(RepoMongoDocument repoMongoDocument) {

        URL repoUrl;

        try {
            repoUrl = new URL(repoMongoDocument.getRepoUrl());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL");
        }

        return new Repo(
                UUID.fromString(repoMongoDocument.getUuid()),
                Status.valueOf(repoMongoDocument.getStatus()),
                repoUrl,
                repoMongoDocument.getMetrics()
        );
    }

    RepoMongoDocument toMongoDocument(Repo repo) {
        return new RepoMongoDocument(
                repo.getUuid().toString(),
                repo.getStatus().toString(),
                repo.getRepoUrl().toString(),
                repo.getMetrics()
        );
    }
}
