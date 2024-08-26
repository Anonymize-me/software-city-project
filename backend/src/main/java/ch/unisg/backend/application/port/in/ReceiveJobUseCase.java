package ch.unisg.backend.application.port.in;

public interface ReceiveJobUseCase {

    void receiveJob(ReceiveJobCommand command);

    void receiveJobStatusUpdate(ReceiveJobStatusUpdateCommand command);
}
