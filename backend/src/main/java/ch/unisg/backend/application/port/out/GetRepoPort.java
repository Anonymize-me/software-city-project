package ch.unisg.backend.application.port.out;

import ch.unisg.backend.domain.Repo;

import java.util.List;

public interface GetRepoPort {

    List<Repo> getAllRepos();

}
