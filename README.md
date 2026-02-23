# Generative AI API Key Platform

A full-stack application with FastAPI backend and Vue.js frontend for managing AI API keys and chat functionality.

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning the repository)

### Starting the Application

1. **Clone and navigate to the project:**
   ```bash
   git clone https://github.com/rongxchen/genai_apikey_platform.git
   cd genai_apikey_platform
   ```

2. **Start both backend and frontend:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - **Frontend (Web App):** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **API Documentation:** http://localhost:8000/docs

### Essential Docker Commands

```bash
# Start services in detached mode
docker-compose up -d

# Start services with logs visible
docker-compose up

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# Check service status
docker-compose ps

# Rebuild and start (after code changes)
docker-compose up -d --build
```

### Production Deployment

For production environment with optimized builds:

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Access production app at http://localhost (port 80)
```

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop services and remove volumes (caution: deletes database)
docker-compose down -v
```

## Project Structure

```
├── backend/          # FastAPI Python backend
├── frontend/         # Vue.3 TypeScript frontend
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
└── DOCKER_README.md            # Detailed Docker instructions
```

## Development

The Docker setup includes:
- **Hot reload** for both backend and frontend during development
- **Persistent database** storage via Docker volumes
- **Network isolation** between services
- **CORS configuration** for frontend-backend communication

## Troubleshooting

**Port conflicts:**
If ports 3000 or 8000 are in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:8080"  # Change frontend port to 3001
  - "8001:8000"  # Change backend port to 8001
```

**Docker daemon not running:**
```bash
# On macOS, start Docker Desktop
open -a Docker

# Wait for Docker to start, then run commands
docker --version
```

For detailed instructions and advanced configuration, see [DOCKER_README.md](DOCKER_README.md).