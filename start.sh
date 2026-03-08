#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Guardian - Setup Script                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker Desktop first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Backend .env created${NC}"
else
    echo -e "${GREEN}✓ Backend .env already exists${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}Creating frontend/.env from .env.example...${NC}"
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env already exists${NC}"
fi

echo ""
echo -e "${BLUE}Starting services with Docker Compose...${NC}"
echo ""

# Start Docker Compose
docker-compose up -d

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Setup Complete! 🎉                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📱 Frontend:      ${BLUE}http://localhost:3000${NC}"
echo -e "🚀 Backend API:   ${BLUE}http://localhost:8000${NC}"
echo -e "📚 API Docs:      ${BLUE}http://localhost:8000/docs${NC}"
echo -e "🗄️  Database:     ${BLUE}localhost:5432${NC}"
echo ""
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop:      ${YELLOW}docker-compose down${NC}"
echo ""
