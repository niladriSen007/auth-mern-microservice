# Docker Setup for Auth Service

This project includes a comprehensive Docker Compose setup for development, testing, and production environments.

## 🚀 Quick Start

### Development Environment
```bash
# Start development environment with all services
make setup-dev

# Or manually
docker-compose --profile development up --build
```

### Production Environment
```bash
# Start production environment
make setup-prod

# Or manually
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile production up --build
```

## 📋 Available Services

| Service | Development Port | Production Port | Description |
|---------|------------------|-----------------|-------------|
| Auth Service | 5501 | 443 (HTTPS) | Main Node.js application |

## 🔧 Environment Profiles

### Development (`--profile development`)
- Hot reload enabled
- Debug mode
- Admin UIs included
- Exposed database ports
- Source code mounted as volumes

### Production (`--profile production`)
- Optimized builds
- SSL/TLS encryption
- Load balancer
- Resource limits
- Health checks
- Internal networking only

### Testing (`--profile test`)
- Test runner container
- Test database
- Isolated environment

### Database Only (`--profile database`)
- MongoDB and Redis only
- Useful for local development

## 🛠️ Available Commands

Use the Makefile for easy management:

```bash
# Show all available commands
make help

# Development
make dev              # Start dev environment
make dev-detached     # Start dev in background
make dev-logs         # Show dev logs
make dev-down         # Stop dev environment

# Production
make prod             # Start prod environment
make prod-detached    # Start prod in background
make prod-logs        # Show prod logs
make prod-down        # Stop prod environment

# Testing
make test             # Run tests
make test-watch       # Run tests in watch mode

# Database
make db-only          # Start only databases
make db-ui            # Start with admin UIs
make db-backup        # Backup MongoDB
make db-restore       # Restore MongoDB

# Utilities
make build            # Build all images
make rebuild          # Rebuild from scratch
make logs             # Show all logs
make shell            # Access dev container
make clean            # Remove containers
make clean-all        # Remove everything
make ssl-certs        # Generate SSL certificates
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Application
PORT=5501
NODE_ENV=development
LOGGER_LEVEL=info

# Database (Production)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DATABASE=auth_service_db

# Redis (Production)
REDIS_PASSWORD=your_redis_password

# Application Database User
MONGO_APP_USERNAME=app_user
MONGO_APP_PASSWORD=your_app_password
```

## 🏗️ Architecture

### Development Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │────│    MongoDB      │
│   (Dev Mode)    │    │   (Port 27017)  │
│  (Port 5501)    │    └─────────────────┘
└─────────────────┘              │
        │                        │
        │              ┌─────────────────┐
        └──────────────│     Redis       │
                       │   (Port 6379)   │
                       └─────────────────┘
```

### Production Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Nginx      │────│   Auth Service  │────│    MongoDB      │
│  Load Balancer  │    │   (Prod Mode)   │    │   (Internal)    │
│  (Port 80/443)  │    │   (Internal)    │    └─────────────────┘
└─────────────────┘    └─────────────────┘              │
                              │                         │
                              │               ┌─────────────────┐
                              └───────────────│     Redis       │
                                              │   (Internal)    │
                                              └─────────────────┘
```

## 📁 Docker Files Structure

```
docker/
├── dev/
│   └── Dockerfile              # Development Dockerfile
├── prod/
│   └── Dockerfile              # Production Dockerfile (multi-stage)
├── mongodb/
│   └── init/
│       └── init-db.js          # MongoDB initialization script
└── nginx/
    ├── nginx.conf              # Nginx configuration
    └── ssl/
        └── generate-certs.sh   # SSL certificate generator
```

## 🔒 Security Features

### Development
- Basic authentication for admin UIs
- Default passwords (change in production!)
- Open ports for debugging

### Production
- SSL/TLS encryption
- Rate limiting
- Security headers
- Non-root containers
- Internal networking
- Resource limits
- Health checks

## 📊 Monitoring & Logging

### Health Checks
- Application health endpoint: `/api/ping`
- Container health checks included
- Nginx health endpoint: `/health`

### Logging
- Application logs: `./logs/`
- Nginx logs: `./logs/nginx/`
- Structured JSON logging
- Log rotation included

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :5501
   ```

2. **Permission issues**
   ```bash
   # Fix permissions for logs directory
   sudo chown -R $USER:$USER logs/
   ```

3. **SSL certificate issues**
   ```bash
   # Regenerate certificates
   make ssl-certs
   ```

4. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs auth-service-dev
   ```

### Database Connection Issues

1. **MongoDB connection refused**
   ```bash
   # Check if MongoDB is running
   docker-compose ps mongodb
   
   # Check MongoDB logs
   docker-compose logs mongodb
   ```

2. **Redis connection issues**
   ```bash
   # Test Redis connection
   docker-compose exec redis redis-cli ping
   ```

## 🔄 Development Workflow

1. **Start development environment**
   ```bash
   make setup-dev
   ```

2. **Make code changes** (hot reload enabled)

3. **Run tests**
   ```bash
   make test
   ```

4. **Check logs**
   ```bash
   make logs-app
   ```

5. **Access database UIs**
   - MongoDB Express: http://localhost:8081
   - Redis Commander: http://localhost:8082

## 🚀 Deployment

### Production Deployment Checklist

- [ ] Update environment variables in `.env`
- [ ] Generate SSL certificates or use real ones
- [ ] Review nginx configuration
- [ ] Set resource limits
- [ ] Configure monitoring
- [ ] Set up log aggregation
- [ ] Configure backups

### Deploy to Production
```bash
# Build and start production environment
make prod-detached

# Check status
make health

# Monitor logs
make prod-logs
```

## 📝 Notes

- MongoDB data persists in Docker volumes
- Redis data persists in production mode
- SSL certificates are self-signed for development
- Use real SSL certificates for production
- Admin UI services are not included in production profile