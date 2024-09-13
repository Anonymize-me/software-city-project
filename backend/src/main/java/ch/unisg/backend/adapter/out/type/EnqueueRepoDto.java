package ch.unisg.backend.adapter.out.type;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.net.URL;
import java.util.UUID;

@Data
@AllArgsConstructor
public class EnqueueRepoDto {

    private UUID uuid;
    private URL repoUrl;
    private String token;

}
