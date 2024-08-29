package ch.unisg.backend.adapter.out.persistence;

import ch.unisg.backend.application.port.out.AddRepoPort;
import ch.unisg.backend.application.port.out.GetRepoPort;
import ch.unisg.backend.application.port.out.SaveRepoMetricsPort;
import ch.unisg.backend.application.port.out.UpdateRepoStatusPort;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import ch.unisg.backend.domain.Status;
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
    private final RepoWithoutMetricsRepository repoWithoutMetricsRepository;

    private final RepoMapper repoMapper;
    private final RepoWithoutMetricsMapper repoWithoutMetricsMapper;

    @Override
    public List<RepoWithoutMetrics> getAllReposWithoutMetrics() {
        List<RepoWithoutMetrics> repos = new ArrayList<>();
        List<RepoWithoutMetricsMongoDocument> repoWithoutMetricsMongoDocuments = repoWithoutMetricsRepository.findAll();
        for (RepoWithoutMetricsMongoDocument repoWithoutMetricsMongoDocument :
                repoWithoutMetricsMongoDocuments) {
            repos.add(repoWithoutMetricsMapper.toDomainObject(repoWithoutMetricsMongoDocument));
        }
        return repos;
    }

    @Override
    public Repo getRepoByUUID(UUID uuid) {
        RepoMongoDocument repoMongoDocument = repoRepository.findByUuid(uuid.toString());
        return repoMapper.toDomainObject(repoMongoDocument);
    }

    @Override
    public void addRepo(Repo repo) {
        RepoMongoDocument repoMongoDocument = repoMapper.toMongoDocument(repo);
        repoRepository.save(repoMongoDocument);
    }

    @Override
    public void updateRepoStatus(UUID uuid, Status status) {
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