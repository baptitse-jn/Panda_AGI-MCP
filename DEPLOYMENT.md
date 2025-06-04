# 🚀 PandaAGI MCP Server Deployment Guide

This guide walks you through deploying your PandaAGI MCP server to Netlify for global availability.

## Prerequisites

- Node.js 14+ installed
- npm or yarn
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deployment

### Option 1: Deploy from Git (Recommended)

1. **Push to Git Repository**
   ```bash
   git push origin main
   ```

2. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your Git provider and repository
   - Configure build settings:
     - **Build command**: (leave empty)
     - **Publish directory**: `public`
     - **Functions directory**: `netlify/functions`
   - Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Configuration

### Build Settings

Your `netlify.toml` is already configured:

```toml
[build]
  publish = "public"
  functions = "netlify/functions"

[[redirects]]
  from = "/mcp"
  to = "/.netlify/functions/pandaagi-mcp"
  status = 200
  force = true

[[redirects]]
  from = "/pandaagi"
  to = "/.netlify/functions/pandaagi-mcp"
  status = 200
  force = true
```

### Environment Variables

If you plan to extend the server with external APIs, you can set environment variables in Netlify:

1. Go to your site's dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add any required API keys or configuration

## Testing Your Deployed Server

Once deployed, your PandaAGI MCP server will be available at:
- **MCP Endpoint**: `https://your-site-name.netlify.app/mcp`
- **Landing Page**: `https://your-site-name.netlify.app`

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx mcp-remote@next https://your-site-name.netlify.app/mcp
```

### Test with curl

```bash
# Initialize server
curl -X POST https://your-site-name.netlify.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp/init","params":{},"id":"1"}'

# List tools
curl -X POST https://your-site-name.netlify.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp/listTools","params":{},"id":"2"}'
```

## Integration with Claude Desktop

Add your deployed server to Claude Desktop configuration:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pandaagi": {
      "command": "npx",
      "args": [
        "mcp-remote@next",
        "https://your-site-name.netlify.app/mcp"
      ]
    }
  }
}
```

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json` with the same configuration.

## Available Tools After Deployment

Your deployed PandaAGI MCP server provides these tools:

1. **create-agent** - Initialize new PandaAGI agents
2. **run-agent-task** - Execute any task using agents
3. **generate-analysis-report** - Create comprehensive reports
4. **create-dashboard** - Build interactive visualizations
5. **deploy-web-app** - Deploy web applications

## Performance Optimization

### Function Cold Starts

Netlify functions may experience cold starts. For better performance:

1. Use the serverless function warming techniques
2. Consider upgrading to Netlify Pro for faster function execution
3. Implement caching where appropriate

### CORS Configuration

The server is configured with CORS headers for browser compatibility:

```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
```

## Monitoring and Debugging

### Function Logs

View function logs in Netlify dashboard:
1. Go to **Functions** tab
2. Click on `pandaagi-mcp`
3. View real-time logs

### Debug Mode

For local debugging, run:

```bash
netlify dev --debug
```

## Custom Domain

To use a custom domain:

1. Go to **Site settings** > **Domain management**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update your MCP client configurations

## Security Considerations

### Rate Limiting

Consider implementing rate limiting for production use:

```javascript
// Add to function handler
const rateLimiter = new Map();
const RATE_LIMIT = 100; // requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, [now]);
    return true;
  }
  
  const requests = rateLimiter.get(ip).filter(time => time > windowStart);
  
  if (requests.length >= RATE_LIMIT) {
    return false;
  }
  
  requests.push(now);
  rateLimiter.set(ip, requests);
  return true;
}
```

### Input Validation

The server includes basic input validation. For production, consider:
- Adding more strict parameter validation
- Implementing request size limits
- Adding authentication if needed

## Troubleshooting

### Common Issues

1. **Function not found**
   - Verify `netlify.toml` configuration
   - Check function file exists in `netlify/functions/`

2. **CORS errors**
   - Ensure CORS headers are properly set
   - Check for OPTIONS method handling

3. **Timeout errors**
   - Netlify functions have a 10-second timeout on free plan
   - Consider upgrading for longer execution time

### Getting Help

- [Netlify Documentation](https://docs.netlify.com/)
- [PandaAGI Discord](https://discord.gg/KYKj9F2FRH)
- [Model Context Protocol Docs](https://modelcontextprotocol.io/)

## Next Steps

1. **Extend Functionality**: Add custom tools for your specific use case
2. **Integration**: Connect with your existing applications
3. **Monitoring**: Set up monitoring and alerting
4. **Scaling**: Consider upgrading Netlify plan for higher limits

Your PandaAGI MCP server is now ready for production use! 🎉