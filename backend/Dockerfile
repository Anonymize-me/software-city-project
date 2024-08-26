FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml /app/
COPY src /app/src/

RUN mvn clean package

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/backend-0.0.1-SNAPSHOT.jar"]