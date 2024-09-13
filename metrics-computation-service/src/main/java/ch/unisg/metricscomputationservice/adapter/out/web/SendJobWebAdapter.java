package ch.unisg.metricscomputationservice.adapter.out.web;

import ch.unisg.metricscomputationservice.application.port.out.SendJobPort;
import ch.unisg.metricscomputationservice.application.port.out.SendJobStatusUpdatePort;
import ch.unisg.metricscomputationservice.domain.model.Job;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class SendJobWebAdapter implements SendJobStatusUpdatePort, SendJobPort {

    private static final String server = "http://backend:8080";

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void sendJob(Job job) {
        try {
            String jobJson = objectMapper.writeValueAsString(job);

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(server + "/api/receive-job"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jobJson))
                    .build();

            client.send(request, HttpResponse.BodyHandlers.ofString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendJobStatusUpdate(Job job) {

        try {
            String jobJson = objectMapper.writeValueAsString(job);

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(server + "/api/receive-job-status-update"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jobJson))
                    .build();

            client.send(request, HttpResponse.BodyHandlers.ofString());

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
