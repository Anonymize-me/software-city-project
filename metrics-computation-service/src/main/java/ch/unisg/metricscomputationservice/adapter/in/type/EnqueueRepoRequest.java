package ch.unisg.metricscomputationservice.adapter.in.type;

import lombok.Getter;

import java.net.URL;
import java.util.UUID;

@Getter
final public class EnqueueRepoRequest {

    public static final String MEDIA_TYPE = "application/json";

    private UUID uuid;
    private URL repoUrl;
    private String token;

}
