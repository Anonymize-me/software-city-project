package ch.unisg.backend.adapter.in.web;

import ch.unisg.backend.application.port.in.GetRepoUseCase;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.application.service.GetRepoService;
import ch.unisg.backend.domain.RepoWithoutMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/repo")
public class GetRepoController {

    private final GetRepoUseCase getRepoUseCase;

    @GetMapping("/all")
    public List<RepoWithoutMetrics> getRepoAll() {
        return new ArrayList<>(getRepoUseCase.getAllReposWithoutMetrics());
    }

    @GetMapping("/metrics")
    public Repo getRepoMetrics(@RequestParam UUID uuid) {
        return getRepoUseCase.getRepoByUUID(uuid);
    }
}
