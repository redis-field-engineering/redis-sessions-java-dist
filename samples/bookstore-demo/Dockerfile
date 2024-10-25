FROM openjdk:23-slim-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y maven
COPY ./target/test-sessions-0.0.1-SNAPSHOT.jar .

WORKDIR /app

CMD ["java", "-jar", "test-sessions-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=docker"]