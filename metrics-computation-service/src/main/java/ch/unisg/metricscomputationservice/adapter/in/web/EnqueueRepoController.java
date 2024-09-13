package ch.unisg.metricscomputationservice.adapter.in.web;

import ch.unisg.metricscomputationservice.adapter.in.type.EnqueueRepoRequest;
import ch.unisg.metricscomputationservice.application.port.in.EnqueueRepoUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class EnqueueRepoController {

    private final EnqueueRepoUseCase enqueueRepoUseCase;

    @PostMapping("/enqueue")
    public ResponseEntity<Void> enqueueRepo(@RequestBody EnqueueRepoRequest request) {

        enqueueRepoUseCase.enqueueRepo(request.getUuid(), request.getRepoUrl());

        return ResponseEntity.ok().build();
    }

}
