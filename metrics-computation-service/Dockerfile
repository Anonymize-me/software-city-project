FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml /app/
COPY src /app/src/

RUN mvn clean package

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/metrics-computation-service-0.0.1-SNAPSHOT.jar /app/metrics-computation-service-0.0.1-SNAPSHOT.jar
COPY libs/ck-0.7.1-SNAPSHOT-jar-with-dependencies.jar /app/ck-0.7.1-SNAPSHOT-jar-with-dependencies.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "/app/metrics-computation-service-0.0.1-SNAPSHOT.jar"]