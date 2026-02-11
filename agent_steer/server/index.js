import express from 'express';
import cors from 'cors';
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';
import { LangGraphAgent } from '@copilotkit/runtime/langgraph';

const app = express();
const PORT = process.env.COPILOT_PORT || 4000;

// Enable CORS for Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Create the service adapter
const serviceAdapter = new ExperimentalEmptyAdapter();

// Factory function to create fresh LangGraphAgent for each request
// This helps avoid "Thread already running" issues
function createRuntime() {
  return new CopilotRuntime({
    agents: {
      sample_agent: new LangGraphAgent({
        deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://127.0.0.1:2024',
        graphId: 'sample_agent',
        langsmithApiKey: process.env.LANGSMITH_API_KEY || '',
        streamTimeout: 60000,
        streamMode: 'events',
      }),
      broadcasting_agent: new LangGraphAgent({
        deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://127.0.0.1:2024',
        graphId: 'broadcasting_agent',
        langsmithApiKey: process.env.LANGSMITH_API_KEY || '',
        streamTimeout: 60000,
        streamMode: 'events',
      }),
    },
  });
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Info endpoint for CopilotKit
app.get('/info', (_req, res) => {
  res.json({
    agents: ['sample_agent', 'broadcasting_agent'],
    version: '1.0.0',
  });
});

// CopilotKit runtime endpoint - handle all methods
// Create fresh runtime for each request to avoid thread conflicts
app.all('*', async (req, res) => {
  // Skip non-POST requests for CopilotKit (they're likely health checks)
  if (req.method !== 'POST' && req.path !== '/health' && req.path !== '/info') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log(`📡 CopilotKit ${req.method} request to ${req.path}`);

    // Create fresh runtime for this request
    const runtime = createRuntime();

    // Create handler for this request
    const copilotHandler = copilotRuntimeNodeHttpEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/',
    });

    await copilotHandler(req, res);
  } catch (error) {
    console.error('❌ Error in CopilotKit endpoint:', error);

    // Handle "Thread already running" specifically
    if (error?.message?.includes('Thread already running')) {
      console.log('⚠️ Thread conflict detected, retrying with fresh runtime...');
      try {
        const freshRuntime = createRuntime();
        const freshHandler = copilotRuntimeNodeHttpEndpoint({
          runtime: freshRuntime,
          serviceAdapter,
          endpoint: '/',
        });
        await freshHandler(req, res);
        return;
      } catch (retryError) {
        console.error('❌ Retry also failed:', retryError);
      }
    }

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CopilotKit runtime server running on http://localhost:${PORT}`);
  console.log(`📡 LangGraph agent URL: ${process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://127.0.0.1:2024'}`);
});
