package ch.unisg.backend.application.port.in;

import org.springframework.http.ResponseEntity;

import java.net.URL;

public interface AddRepoUseCase {

    ResponseEntity<Void> addRepo(URL repoUrl);

}
