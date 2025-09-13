# --- Stage 1: Build the application ---
# We use a full JDK and Maven image to build our application JAR file.
# Using a specific version ensures our build is reproducible.
FROM maven:3.8.5-openjdk-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project definition file first. This is a Docker caching optimization.
# If pom.xml doesn't change, Docker will reuse the downloaded dependencies layer.
COPY pom.xml .

# Download all the project dependencies
RUN mvn dependency:go-offline

# Copy the rest of our source code into the container
COPY src ./src

# Build the application, creating the executable JAR file. We skip tests here too.
RUN mvn clean install -DskipTests


# --- Stage 2: Create the final, small production image ---
# We use a much smaller image that only contains the Java Runtime Environment (JRE),
# not the full JDK or Maven, making it more secure and efficient.
FROM eclipse-temurin:17-jre-focal

# Set the working directory
WORKDIR /app

# Copy ONLY the executable JAR file from the 'builder' stage into our final image
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080, which is the default port for Spring Boot applications
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]