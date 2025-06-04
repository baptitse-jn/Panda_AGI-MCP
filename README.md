# 🐼 PandaAGI MCP Server for Netlify

This is a comprehensive Model Context Protocol (MCP) server for **PandaAGI** - an SDK for building Agentic General Intelligence applications. The server provides access to PandaAGI's powerful autonomous agent capabilities through the standardized MCP protocol.

PandaAGI redefines AGI as **Agentic General Intelligence**: AI that accomplishes tasks through tools rather than just conversation. This MCP server exposes those capabilities to any MCP-compatible client.

## Features

### 🚀 PandaAGI MCP Server
- **Agentic AI Tools**: Create and manage autonomous AI agents
- **Full Execution Environment**: Web access, file system, code execution, deployment
- **Serverless Deployment**: Deployed on Netlify for global availability
- **Comprehensive Documentation**: Built-in resources and examples

### 🛠️ Available Tools
- **create-agent**: Initialize new PandaAGI agents with custom configurations
- **run-agent-task**: Execute any task using autonomous agent capabilities  
- **generate-analysis-report**: Create comprehensive analysis reports with data research
- **create-dashboard**: Build interactive data visualization dashboards
- **deploy-web-app**: Deploy full-featured web applications from descriptions

### 🌐 Core Agent Capabilities
- **Internet Access**: Real-time information gathering from any source
- **File System Control**: Complete autonomy over digital assets
- **Code Execution**: Dynamic programming in multiple languages
- **Deployment**: Deploy web servers and APIs directly

### 📚 FastAPI Client
- RESTful API for easy integration with PandaAGI
- Interactive API documentation (Swagger UI)
- Specialized endpoints for common PandaAGI workflows
- Comprehensive testing suite

## 🛠️ Available PandaAGI Tools

### `create-agent`
**Create a new PandaAGI agent with specified configuration**

```json
{
  "name": "string",
  "environment": "local|docker", 
  "workspace_path": "./agent_workspace"
}
```

### `run-agent-task`  
**Execute any task using a PandaAGI agent**

```json
{
  "task": "Your instruction for the agent",
  "agent_name": "default",
  "environment": "local|docker",
  "workspace_path": "./agent_workspace"
}
```

**Example tasks:**
- "Create a comprehensive market analysis report for renewable energy"
- "Build an interactive dashboard from our sales data CSV"
- "Deploy a portfolio website for our startup"
- "Analyze competitor pricing and create a strategy document"

### `generate-analysis-report`
**Generate comprehensive analysis reports with data research**

```json
{
  "topic": "Subject for analysis",
  "data_sources": ["source1", "source2"],
  "report_type": "market_analysis|competitive_analysis|trend_analysis|general"
}
```

### `create-dashboard`
**Build interactive data visualization dashboards**

```json
{
  "data_description": "Description of data to visualize",
  "dashboard_type": "sales|analytics|performance|custom",
  "chart_types": ["line", "bar", "pie", "scatter", "heatmap", "table"]
}
```

### `deploy-web-app`
**Deploy full-featured web applications from descriptions**

```json
{
  "app_description": "Description of the web application",
  "app_type": "streamlit|flask|fastapi|static",
  "features": ["feature1", "feature2"]
}
```

## 📚 Documentation Resources

The MCP server provides comprehensive documentation accessible via the `mcp/readResource` method:

- **PandaAGI Documentation**: Complete SDK reference and API guide
- **Quick Start Guide**: Get up and running in minutes  
- **Agent Best Practices**: Optimize your agent workflows
- **Code Examples**: Real-world implementation patterns

## Getting Started

### Prerequisites
- Node.js 14+ 
- Python 3.8+
- npm or yarn

### Local Development

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd pandas_ai_mcp_deploy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start both services (recommended)**
   ```bash
   cd mcp-client
   ./start_pandaagi.sh
   ```
   
   This will start both the Netlify MCP server and FastAPI client.

4. **Or start services individually:**
   
   **MCP Server:**
   ```bash
   npx netlify dev --port 8888
   ```
   
   **FastAPI Client:**
   ```bash
   cd mcp-client
   python3 pandaagi_main.py
   ```

### 🌐 Service Endpoints

- **🐼 PandaAGI MCP Server**: http://localhost:8888/mcp
- **🚀 FastAPI Client**: http://localhost:8001
- **📚 API Documentation**: http://localhost:8001/docs
- **🌐 Landing Page**: http://localhost:8888

### Testing Your PandaAGI MCP Server

#### Using MCP Inspector

Test your MCP server using the official MCP inspector:

```bash
npx @modelcontextprotocol/inspector npx mcp-remote@next http://localhost:8888/mcp
```

#### Using FastAPI Client

The FastAPI client provides a user-friendly REST interface:

```bash
# Test agent creation
curl -X POST http://localhost:8001/agent/create \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent", "environment": "local"}'

# Run a task
curl -X POST http://localhost:8001/agent/task \
  -H "Content-Type: application/json" \
  -d '{"task": "Create a market analysis report on electric vehicles"}'

# Generate analysis report
curl -X POST http://localhost:8001/analysis/report \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI trends 2024", "report_type": "trend_analysis"}'
```

#### Using curl directly

```bash
# Initialize MCP server
curl -X POST http://localhost:8888/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp/init","params":{},"id":"1"}'

# List available tools
curl -X POST http://localhost:8888/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp/listTools","params":{},"id":"2"}'

# Call a tool
curl -X POST http://localhost:8888/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp/callTool","params":{"name":"run-agent-task","args":{"task":"Tell me a joke about pandas"}},"id":"3"}'
```

#### Running Tests

Run the comprehensive test suite:

```bash
cd mcp-client
python3 test_pandaagi_client.py
```

```
npx @modelcontextprotocol/inspector npx mcp-remote@next https://your-site-name.netlify.app/mcp
```

Then open http://localhost:6274/ in your browser to interact with the MCP inspector.

#### Using curl

You can also test the MCP server directly using curl commands:

1. Initialize the MCP server:
   ```
   curl -X POST http://localhost:8888/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"mcp/init","params":{},"id":"1"}'
   ```

2. List available tools:
   ```
   curl -X POST http://localhost:8888/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"mcp/listTools","params":{},"id":"2"}'
   ```

3. Call a tool:
   ```
   curl -X POST http://localhost:8888/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"mcp/callTool","params":{"name":"run-analysis-report","args":{"days":5}},"id":"3"}'
   ```

4. List available resources:
   ```
   curl -X POST http://localhost:8888/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"mcp/listResources","params":{},"id":"4"}'
   ```

5. Read a resource:
   ```
   curl -X POST http://localhost:8888/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"mcp/readResource","params":{"uri":"docs://interpreting-reports"},"id":"5"}'
   ```

## Deployment

### Deploying to Netlify

1. Push this repository to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: leave empty (no build required)
   - Publish directory: `public`
   
After deployment, your MCP server will be available at `https://your-site-name.netlify.app/mcp`

### Using with Claude Desktop

To use this MCP server with Claude Desktop:

1. Go to Claude Desktop settings
2. Enable the MCP Server configuration
3. Edit the configuration file:
   ```json
   {
     "mcpServers": {
       "my-mcp": {
         "command": "npx",
         "args": [
           "mcp-remote@next",
           "https://your-site-name.netlify.app/mcp"
         ]
       }
     }
   }
   ```
4. Restart Claude Desktop

## Using the MCP Client

The MCP client provides a REST API interface for interacting with the MCP server. It's built with FastAPI and offers a clean, modern API with automatic documentation.

### Starting the Client

```bash
cd mcp-client
pip install -r requirements.txt
uvicorn main:app --reload
```

This will start the FastAPI server at http://localhost:8001. You can access the API documentation at http://localhost:8001/docs.

### Managing the MCP Server and FastAPI Client

The template includes several scripts to manage both the MCP server and FastAPI client:

```bash
cd mcp-client
./start.sh    # Start both services in the background
./stop.sh     # Stop both services gracefully
./check_status.sh  # Check if services are running and view logs
./test_client.py   # Test the FastAPI client endpoints
```

These scripts ensure processes keep running in the background even after you close your terminal, properly manage log files, and provide clear status information.

### Testing the Client

You can test the client using the provided test script:

```bash
cd mcp-client
./test_client.py
```

This will run a series of tests against the API endpoints and display the results.

### API Endpoints

- `GET /server` - Get server information
- `GET /tools` - List available tools
- `POST /tools/call` - Call a tool
- `GET /resources` - List available resources
- `POST /resources/read` - Read a resource

For more details, refer to the [MCP Client README](./mcp-client/README.md).

## Extending

### Extending the MCP Server

You can extend this MCP server by adding more tools and resources to the `getServer` function in `netlify/functions/mcp-server.js`. Follow the existing examples and refer to the [Model Context Protocol documentation](https://modelcontextprotocol.io/) for more information.

### Extending the MCP Client

To add new endpoints to the MCP client, edit the `main.py` file in the `mcp-client` directory. The client is built with FastAPI, which makes it easy to add new routes and functionality.

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Claude Desktop Documentation](https://claude.ai/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)