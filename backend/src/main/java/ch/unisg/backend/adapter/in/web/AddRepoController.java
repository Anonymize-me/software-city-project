package ch.unisg.backend.adapter.in.web;

import ch.unisg.backend.application.port.in.AddRepoUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/repo/add")
public class AddRepoController {

    private final AddRepoUseCase addRepoUseCase;

    @GetMapping
    public ResponseEntity<Void> addRepo(@RequestParam URL repoUrl, @RequestParam String token) {

        return addRepoUseCase.addRepo(repoUrl, token);

    }
}
