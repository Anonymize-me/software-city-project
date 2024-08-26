package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.domain.Repo;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Repository
public interface RepoRepository extends MongoRepository<RepoMongoDocument, String> {

    RepoMongoDocument findByUuid(String uuid);

}
