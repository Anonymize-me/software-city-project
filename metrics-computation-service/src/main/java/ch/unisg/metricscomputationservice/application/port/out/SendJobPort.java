package ch.unisg.metricscomputationservice.application.port.out;

import ch.unisg.metricscomputationservice.domain.model.Job;

public interface SendJobPort {

    void sendJob(Job job);

}
