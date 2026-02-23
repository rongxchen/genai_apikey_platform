# Docker Setup for Generative AI API Key Platform

This project includes Docker configuration for both development and production environments.

## Quick Start

### Development Environment

1. **Start both frontend and backend in development mode:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Production Environment

1. **Start in production mode:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Access the application:**
   - Application: http://localhost (port 80)
   - Backend API: http://localhost:8000

## Available Commands

### Build specific services
```bash
# Build only backend
docker-compose build backend

# Build only frontend  
docker-compose build frontend
```

### Individual service management
```bash
# Start only backend
docker-compose up backend

# Start only frontend (requires backend to be running)
docker-compose up frontend
```

### View service statuses
```bash
docker-compose ps
```

### Access service containers
```bash
# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh
```

## Docker Files Structure

- `backend/Dockerfile` - Development backend image
- `frontend/Dockerfile` - Development frontend image  
- `frontend/Dockerfile.prod` - Production frontend image with Nginx
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment

## Environment Configuration

### Development Mode Features
- **Hot reload** - Code changes automatically trigger rebuilds
- **Volume mounting** - Local code changes reflected immediately
- **Source maps** - Better debugging experience

### Production Mode Features  
- **Optimized builds** - Minified and compressed assets
- **Nginx serving** - Static file serving with caching
- **API proxy** - Frontend routes `/api/*` requests to backend
- **Single entry point** - Application accessible on port 80

## Database

The backend uses SQLite database with persistent storage via Docker volumes:
- Volume: `backend_db`
- Mount point: `/app/db` in backend container

## Troubleshooting

### Port conflicts
If ports 8000 or 8080 are in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3000:8000"  # Use port 3000 instead of 8000
```

### Permission issues
If encountering permission issues, ensure your user has Docker access:
```bash
sudo usermod -aG docker $USER
```

### Clean rebuild
To force a complete rebuild:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### View container logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```