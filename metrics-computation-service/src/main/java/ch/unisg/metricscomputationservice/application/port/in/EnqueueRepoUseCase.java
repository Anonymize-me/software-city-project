package ch.unisg.metricscomputationservice.application.port.in;

import java.net.URL;
import java.util.UUID;

public interface EnqueueRepoUseCase {

    void enqueueRepo(UUID uuid, URL command, String token);

}
