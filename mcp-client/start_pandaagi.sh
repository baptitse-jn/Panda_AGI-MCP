#!/bin/bash

# PandaAGI MCP Client Startup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# PID files directory
PIDS_DIR=".processes"
NETLIFY_PID_FILE="$PIDS_DIR/netlify-dev.pid"
FASTAPI_PID_FILE="$PIDS_DIR/fastapi.pid"

# Log files
NETLIFY_LOG="$PIDS_DIR/netlify-dev.log"
FASTAPI_LOG="$PIDS_DIR/fastapi.log"

# Create processes directory if it doesn't exist
mkdir -p "$PIDS_DIR"

echo -e "${PURPLE}🐼 Starting PandaAGI MCP Services${NC}"
echo "=================================="

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to stop existing services
stop_existing_services() {
    echo -e "${YELLOW}🔍 Checking for existing services...${NC}"
    
    if [ -f "$NETLIFY_PID_FILE" ]; then
        local netlify_pid=$(cat "$NETLIFY_PID_FILE")
        if kill -0 "$netlify_pid" 2>/dev/null; then
            echo -e "${YELLOW}⏹️ Stopping existing Netlify dev server (PID: $netlify_pid)${NC}"
            kill "$netlify_pid" 2>/dev/null || true
            sleep 2
        fi
        rm -f "$NETLIFY_PID_FILE"
    fi
    
    if [ -f "$FASTAPI_PID_FILE" ]; then
        local fastapi_pid=$(cat "$FASTAPI_PID_FILE")
        if kill -0 "$fastapi_pid" 2>/dev/null; then
            echo -e "${YELLOW}⏹️ Stopping existing FastAPI server (PID: $fastapi_pid)${NC}"
            kill "$fastapi_pid" 2>/dev/null || true
            sleep 2
        fi
        rm -f "$FASTAPI_PID_FILE"
    fi
}

# Function to start Netlify dev server
start_netlify() {
    echo -e "${BLUE}🌐 Starting Netlify dev server...${NC}"
    
    # Navigate to project root
    cd ..
    
    # Start Netlify dev server in background
    nohup npm run dev > "mcp-client/$NETLIFY_LOG" 2>&1 &
    local netlify_pid=$!
    echo $netlify_pid > "mcp-client/$NETLIFY_PID_FILE"
    
    # Return to mcp-client directory
    cd mcp-client
    
    echo -e "${GREEN}✅ Netlify dev server started (PID: $netlify_pid)${NC}"
    echo -e "   Log file: $NETLIFY_LOG"
}

# Function to start FastAPI server
start_fastapi() {
    echo -e "${BLUE}🚀 Starting PandaAGI FastAPI client...${NC}"
    
    # Start FastAPI server using the PandaAGI version
    nohup python3 pandaagi_main.py > "$FASTAPI_LOG" 2>&1 &
    local fastapi_pid=$!
    echo $fastapi_pid > "$FASTAPI_PID_FILE"
    
    echo -e "${GREEN}✅ FastAPI server started (PID: $fastapi_pid)${NC}"
    echo -e "   Log file: $FASTAPI_LOG"
}

# Function to wait for services to be ready
wait_for_services() {
    echo -e "${YELLOW}⏳ Waiting for services to start up...${NC}"
    
    # Wait for Netlify (usually takes longer)
    echo -n "   Waiting for Netlify dev server..."
    for i in {1..30}; do
        if check_port 8888; then
            echo -e " ${GREEN}Ready!${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # Wait for FastAPI
    echo -n "   Waiting for FastAPI server..."
    for i in {1..15}; do
        if check_port 8001; then
            echo -e " ${GREEN}Ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
}

# Function to test services
test_services() {
    echo -e "${BLUE}🧪 Testing services...${NC}"
    
    # Test Netlify MCP server
    echo -n "   Testing PandaAGI MCP server..."
    if curl -s -X POST http://localhost:8888/mcp \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"mcp/init","params":{},"id":"1"}' \
        | grep -q "pandaagi-mcp-server"; then
        echo -e " ${GREEN}✅${NC}"
    else
        echo -e " ${RED}❌${NC}"
    fi
    
    # Test FastAPI client
    echo -n "   Testing FastAPI client..."
    if curl -s http://localhost:8001/health | grep -q "healthy"; then
        echo -e " ${GREEN}✅${NC}"
    else
        echo -e " ${RED}❌${NC}"
    fi
}

# Function to run the test suite
run_tests() {
    echo -e "${PURPLE}🧪 Running PandaAGI test suite...${NC}"
    python3 test_pandaagi_client.py
}

# Function to display service information
show_service_info() {
    echo ""
    echo -e "${GREEN}🎉 PandaAGI MCP Services are running!${NC}"
    echo "======================================"
    echo ""
    echo -e "${BLUE}📍 Service Endpoints:${NC}"
    echo "   🐼 PandaAGI MCP Server:  http://localhost:8888/mcp"
    echo "   🚀 FastAPI Client:       http://localhost:8001"
    echo "   📚 API Documentation:    http://localhost:8001/docs"
    echo "   📖 Alternative Docs:     http://localhost:8001/redoc"
    echo "   🌐 Landing Page:         http://localhost:8888"
    echo ""
    echo -e "${BLUE}🛠️ Available Tools:${NC}"
    echo "   • create-agent          - Create new PandaAGI agents"
    echo "   • run-agent-task        - Execute tasks with agents"
    echo "   • generate-analysis-report - Create analysis reports"
    echo "   • create-dashboard      - Build data dashboards"
    echo "   • deploy-web-app        - Deploy web applications"
    echo ""
    echo -e "${BLUE}📋 Management Commands:${NC}"
    echo "   • ./check_status.sh     - Check service status"
    echo "   • ./stop.sh             - Stop all services"
    echo "   • python3 test_pandaagi_client.py - Run tests"
    echo ""
    echo -e "${YELLOW}💡 Example Usage:${NC}"
    echo '   curl -X POST http://localhost:8001/agent/task \\'
    echo '     -H "Content-Type: application/json" \\'
    echo '     -d '"'"'{"task": "Create a market analysis report on electric vehicles"}'"'"''
    echo ""
    echo -e "${BLUE}🔗 Learn More:${NC}"
    echo "   • PandaAGI Platform: https://agi.pandas-ai.com/"
    echo "   • Documentation: https://agi-docs.pandas-ai.com/"
    echo "   • GitHub: https://github.com/sinaptik-ai/panda-agi"
}

# Main execution
main() {
    # Stop any existing services
    stop_existing_services
    
    # Start services
    start_netlify
    start_fastapi
    
    # Wait for services to be ready
    wait_for_services
    
    # Test services
    test_services
    
    # Run test suite
    if [ "$1" = "--test" ] || [ "$1" = "-t" ]; then
        run_tests
    fi
    
    # Show service information
    show_service_info
}

# Handle script termination
cleanup() {
    echo -e "\n${YELLOW}🛑 Received termination signal${NC}"
    if [ -f "$NETLIFY_PID_FILE" ]; then
        local netlify_pid=$(cat "$NETLIFY_PID_FILE")
        kill "$netlify_pid" 2>/dev/null || true
        rm -f "$NETLIFY_PID_FILE"
    fi
    if [ -f "$FASTAPI_PID_FILE" ]; then
        local fastapi_pid=$(cat "$FASTAPI_PID_FILE")
        kill "$fastapi_pid" 2>/dev/null || true
        rm -f "$FASTAPI_PID_FILE"
    fi
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check for required files
if [ ! -f "pandaagi_main.py" ]; then
    echo -e "${RED}❌ Error: pandaagi_main.py not found${NC}"
    echo "Please run this script from the mcp-client directory"
    exit 1
fi

if [ ! -f "../package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in parent directory${NC}"
    echo "Please run this script from the mcp-client directory"
    exit 1
fi

# Run main function
main "$@"