package ch.unisg.backend.adapter.in.web;

import ch.unisg.backend.adapter.in.type.JobDto;

import ch.unisg.backend.application.port.in.ReceiveJobCommand;
import ch.unisg.backend.application.port.in.ReceiveJobStatusUpdateCommand;
import ch.unisg.backend.application.port.in.ReceiveJobUseCase;
import ch.unisg.backend.domain.MetricsDataRow;
import ch.unisg.backend.domain.Repo;
import ch.unisg.backend.domain.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.net.URL;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReceiveJobController {

    private final ReceiveJobUseCase receiveJobUseCase;

    @PostMapping("/receive-job")
    public void receiveJob(@RequestBody JobDto jobDto) {

        UUID uuid = jobDto.getUuid();
        URL repoUrl = jobDto.getRepoUrl();
        List<MetricsDataRow> metricsData = jobDto.getMetricsData();

        ReceiveJobCommand command = new ReceiveJobCommand(uuid, repoUrl, metricsData);

        receiveJobUseCase.receiveJob(command);
    }

    @PostMapping("/receive-job-status-update")
    public void receiveJobStatusUpdate(@RequestBody JobDto jobDto) {

        UUID uuid = jobDto.getUuid();
        Status status = jobDto.getStatus();

        ReceiveJobStatusUpdateCommand command = new ReceiveJobStatusUpdateCommand(uuid, status);

        receiveJobUseCase.receiveJobStatusUpdate(command);
    }
}
