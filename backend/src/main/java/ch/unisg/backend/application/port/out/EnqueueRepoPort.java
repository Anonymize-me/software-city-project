package ch.unisg.backend.application.port.out;

import java.net.URL;
import java.util.UUID;

public interface EnqueueRepoPort {

    void enqueueRepo(UUID uuid, URL repoUrl);

}
