# Patient Management Service

A Spring Boot application for managing patient records. This service provides a REST API to create, retrieve, update, and delete patient information. It uses an in-memory H2 database for data storage.

## Prerequisites

- **Java 17** or higher
- **Maven** (optional, wrapper included)

## getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd patient-management
```

### 2. Run the application

#### Backend
The application is located in the `patient-service` directory. You can run it using the Maven wrapper.

```bash
cd patient-service
./mvnw spring-boot:run
```

The application will start on **port 4000**.

#### Frontend
The UI is located in the `patient-ui` directory.

```bash
cd patient-ui
npm install
npm run dev
```

Access the UI at [http://localhost:5173](http://localhost:5173).

## API Documentation

### Swagger UI
Interactive API documentation is available at:
[http://localhost:4000/swagger-ui/index.html](http://localhost:4000/swagger-ui/index.html)

### H2 Database Console
Access the in-memory database console at:
[http://localhost:4000/h2-console](http://localhost:4000/h2-console)

**Credentials:**
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **User Name:** `admin_viewer`
- **Password:** `password`

### HTTP Client Requests
Example HTTP requests are provided in the `api-requests` directory (located in the project root). You can use these with the IntelliJ HTTP Client or similar tools.

## Testing

To run the unit and integration tests:

```bash
cd patient-service
./mvnw test
```

## Project Structure

- `patient-service/`: Main Spring Boot application.
- `api-requests/`: Example HTTP requests for testing the API.
