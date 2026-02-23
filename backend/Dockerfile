# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create directory for SQLite database if needed
RUN mkdir -p /app/db

# Expose the port
EXPOSE 8000

# Run the application
CMD ["python", "app.py"]