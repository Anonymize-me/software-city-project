package ch.unisg.backend.adapter.out.persistence;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepoWithoutMetricsRepository extends MongoRepository<RepoWithoutMetricsMongoDocument,
        String> {

    @Override
    @Query(value = "{}", fields = "{ 'uuid' : 1, 'status' : 1, 'repoUrl' : 1 }")
    @NotNull
    List<RepoWithoutMetricsMongoDocument> findAll();

}
