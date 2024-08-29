package ch.unisg.backend.adapter.out.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoRepository extends MongoRepository<RepoMongoDocument, String> {

    RepoMongoDocument findByUuid(String uuid);

}
