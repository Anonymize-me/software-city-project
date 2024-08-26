package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.application.port.out.AddRepoPort;
import ch.unisg.backend.application.port.out.GetRepoPort;
import ch.unisg.backend.application.port.out.SaveRepoMetricsPort;
import ch.unisg.backend.application.port.out.UpdateRepoStatusPort;
import ch.unisg.backend.domain.Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RepoPersistenceAdapter implements GetRepoPort, AddRepoPort, UpdateRepoStatusPort,
        SaveRepoMetricsPort {

    private final RepoRepository repoRepository;

    private final RepoMapper repoMapper;

    @Override
    public List<Repo> getAllRepos() {
        List<Repo> repos = new ArrayList<>();
        List<RepoMongoDocument> repoMongoDocuments = repoRepository.findAll();
        for (RepoMongoDocument repoMongoDocument : repoMongoDocuments) {
            repos.add(repoMapper.toDomainObject(repoMongoDocument));
        }
        return repos;
    }

    @Override
    public void addRepo(Repo repo) {
        RepoMongoDocument repoMongoDocument = repoMapper.toMongoDocument(repo);
        repoRepository.save(repoMongoDocument);
    }

    @Override
    public void updateRepoStatus(UUID uuid, Repo.Status status) {
        RepoMongoDocument repoMongoDocument = repoRepository.findByUuid(uuid.toString());
        repoMongoDocument.setStatus(status.toString());
        repoRepository.save(repoMongoDocument);
    }

    @Override
    @Transactional
    public void saveRepo(Repo repo) {
        RepoMongoDocument repoMongoDocument = repoRepository.findByUuid(repo.getUuid().toString());
        repoMongoDocument.setMetrics(repo.getMetrics());
        repoMongoDocument.setStatus(repo.getStatus().toString());
        repoRepository.save(repoMongoDocument);
    }


}