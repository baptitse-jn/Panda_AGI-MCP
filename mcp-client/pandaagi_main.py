from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import requests
import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MCP server URL from environment variables
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8888/mcp")

app = FastAPI(
    title="PandaAGI MCP Client API",
    description="A FastAPI client for interacting with PandaAGI through Model Context Protocol (MCP)",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models for request and response
class MCPServerInfo(BaseModel):
    name: str
    version: str
    description: Optional[str] = None

class MCPInitResponse(BaseModel):
    protocolVersion: str
    capabilities: Dict[str, Any]
    serverInfo: MCPServerInfo

class CreateAgentRequest(BaseModel):
    name: str
    environment: Optional[str] = "local"
    workspace_path: Optional[str] = "./agent_workspace"

class RunTaskRequest(BaseModel):
    task: str
    agent_name: Optional[str] = "default"
    environment: Optional[str] = "local"
    workspace_path: Optional[str] = "./agent_workspace"

class GenerateReportRequest(BaseModel):
    topic: str
    data_sources: Optional[List[str]] = []
    report_type: Optional[str] = "general"

class CreateDashboardRequest(BaseModel):
    data_description: str
    dashboard_type: Optional[str] = "custom"
    chart_types: Optional[List[str]] = ["line", "bar"]

class DeployWebAppRequest(BaseModel):
    app_description: str
    app_type: Optional[str] = "streamlit"
    features: Optional[List[str]] = []

class ToolRequest(BaseModel):
    name: str
    args: Dict[str, Any] = {}

class ResourceRequest(BaseModel):
    uri: str

class ToolContentItem(BaseModel):
    type: str
    text: str

class ToolResponse(BaseModel):
    content: List[ToolContentItem]

class ResourceContentItem(BaseModel):
    uri: str
    text: str

class ResourceResponse(BaseModel):
    contents: List[ResourceContentItem]

class ToolInfo(BaseModel):
    name: str
    description: str
    schema: Dict[str, Any]

class ResourceInfo(BaseModel):
    name: str
    uri: str
    metadata: Dict[str, Any]

class ToolsListResponse(BaseModel):
    tools: List[ToolInfo]

class ResourcesListResponse(BaseModel):
    resources: List[ResourceInfo]

# Helper function to make MCP requests
def make_mcp_request(method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a request to the MCP server"""
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params or {},
        "id": 1
    }
    
    try:
        response = requests.post(MCP_SERVER_URL, json=payload)
        response.raise_for_status()
        
        result = response.json()
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])
        
        return result.get("result", {})
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to MCP server: {str(e)}")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main page with API documentation"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>PandaAGI MCP Client</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            h1 { color: #2d3748; text-align: center; }
            .panda { font-size: 3em; text-align: center; margin-bottom: 20px; }
            .api-section { background: #f7fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .endpoint { background: #e2e8f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
            code { background: #1a202c; color: #e2e8f0; padding: 2px 4px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="panda">🐼</div>
            <h1>PandaAGI MCP Client API</h1>
            <p>Welcome to the PandaAGI MCP Client! This API provides easy access to PandaAGI's agentic capabilities.</p>
            
            <div class="api-section">
                <h2>Quick Start</h2>
                <p>Visit <code>/docs</code> for interactive API documentation with Swagger UI.</p>
                <p>Visit <code>/redoc</code> for alternative API documentation.</p>
            </div>
            
            <div class="api-section">
                <h2>Main Endpoints</h2>
                <div class="endpoint"><strong>GET /server</strong> - Get PandaAGI server information</div>
                <div class="endpoint"><strong>GET /tools</strong> - List available PandaAGI tools</div>
                <div class="endpoint"><strong>POST /agent/create</strong> - Create a new PandaAGI agent</div>
                <div class="endpoint"><strong>POST /agent/task</strong> - Run a task with PandaAGI agent</div>
                <div class="endpoint"><strong>POST /analysis/report</strong> - Generate analysis report</div>
                <div class="endpoint"><strong>POST /dashboard/create</strong> - Create data dashboard</div>
                <div class="endpoint"><strong>POST /webapp/deploy</strong> - Deploy web application</div>
                <div class="endpoint"><strong>GET /resources</strong> - List available documentation</div>
            </div>
            
            <div class="api-section">
                <h2>Example Usage</h2>
                <p>Try creating an agent: <code>POST /agent/create</code> with <code>{"name": "my-agent"}</code></p>
                <p>Run a task: <code>POST /agent/task</code> with <code>{"task": "Tell me a joke about pandas"}</code></p>
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/server", response_model=MCPInitResponse)
async def get_server_info():
    """Get information about the PandaAGI MCP server"""
    result = make_mcp_request("mcp/init")
    return MCPInitResponse(**result)

@app.get("/tools", response_model=ToolsListResponse)
async def list_tools():
    """List all available PandaAGI tools"""
    result = make_mcp_request("mcp/listTools")
    return ToolsListResponse(**result)

@app.post("/agent/create")
async def create_agent(request: CreateAgentRequest):
    """Create a new PandaAGI agent with specified configuration"""
    params = {
        "name": "create-agent",
        "args": {
            "name": request.name,
            "environment": request.environment,
            "workspace_path": request.workspace_path
        }
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return {"status": "success", "result": result}

@app.post("/agent/task")
async def run_agent_task(request: RunTaskRequest):
    """Execute a task using a PandaAGI agent"""
    params = {
        "name": "run-agent-task",
        "args": {
            "task": request.task,
            "agent_name": request.agent_name,
            "environment": request.environment,
            "workspace_path": request.workspace_path
        }
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return {"status": "success", "result": result}

@app.post("/analysis/report")
async def generate_analysis_report(request: GenerateReportRequest):
    """Generate a comprehensive analysis report using PandaAGI"""
    params = {
        "name": "generate-analysis-report",
        "args": {
            "topic": request.topic,
            "data_sources": request.data_sources,
            "report_type": request.report_type
        }
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return {"status": "success", "result": result}

@app.post("/dashboard/create")
async def create_dashboard(request: CreateDashboardRequest):
    """Create an interactive data visualization dashboard"""
    params = {
        "name": "create-dashboard",
        "args": {
            "data_description": request.data_description,
            "dashboard_type": request.dashboard_type,
            "chart_types": request.chart_types
        }
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return {"status": "success", "result": result}

@app.post("/webapp/deploy")
async def deploy_web_app(request: DeployWebAppRequest):
    """Deploy a web application using PandaAGI"""
    params = {
        "name": "deploy-web-app",
        "args": {
            "app_description": request.app_description,
            "app_type": request.app_type,
            "features": request.features
        }
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return {"status": "success", "result": result}

@app.post("/tools/call", response_model=ToolResponse)
async def call_tool(request: ToolRequest):
    """Call any PandaAGI tool with custom parameters"""
    params = {
        "name": request.name,
        "args": request.args
    }
    
    result = make_mcp_request("mcp/callTool", params)
    return ToolResponse(**result)

@app.get("/resources", response_model=ResourcesListResponse)
async def list_resources():
    """List all available PandaAGI documentation resources"""
    result = make_mcp_request("mcp/listResources")
    return ResourcesListResponse(**result)

@app.post("/resources/read", response_model=ResourceResponse)
async def read_resource(request: ResourceRequest):
    """Read a specific PandaAGI documentation resource"""
    params = {"uri": request.uri}
    result = make_mcp_request("mcp/readResource", params)
    return ResourceResponse(**result)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test connection to MCP server
        make_mcp_request("mcp/init")
        return {"status": "healthy", "mcp_server": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)