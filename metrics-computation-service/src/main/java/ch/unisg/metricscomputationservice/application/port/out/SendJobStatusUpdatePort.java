package ch.unisg.metricscomputationservice.application.port.out;

import ch.unisg.metricscomputationservice.domain.model.Job;

public interface SendJobStatusUpdatePort {

    void sendJobStatusUpdate(Job job);

}
