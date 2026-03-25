# Backend image
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY backend/pom.xml backend/
COPY backend/src backend/src
RUN apt-get update && apt-get install -y maven
RUN mvn -f backend/pom.xml -DskipTests clean package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/backend/target/nexoria-api-0.1.0.jar ./nexoria-api.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/nexoria-api.jar"]
