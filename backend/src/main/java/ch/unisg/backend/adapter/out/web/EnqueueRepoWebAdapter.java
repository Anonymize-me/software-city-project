package ch.unisg.backend.adapter.out.web;

import ch.unisg.backend.adapter.out.type.EnqueueRepoDto;
import ch.unisg.backend.application.port.in.UpdateRepoStatusUseCase;
import ch.unisg.backend.application.port.out.EnqueueRepoPort;
import ch.unisg.backend.domain.Status;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EnqueueRepoWebAdapter implements EnqueueRepoPort {

    private final UpdateRepoStatusUseCase updateRepoStatusUseCase;

    private String server = "http://metrics-computation-service:8085";

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public void enqueueRepo(UUID uuid, URL repoUrl, String token) {

        String json = null;
        try {
            json = objectMapper.writeValueAsString(new EnqueueRepoDto(uuid, repoUrl, token));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(server + "/api/enqueue"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                updateRepoStatusUseCase.updateRepoStatus(uuid, Status.QUEUED);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
