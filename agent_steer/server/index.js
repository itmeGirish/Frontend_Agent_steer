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
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

// Create the service adapter
const serviceAdapter = new ExperimentalEmptyAdapter();

// Create the CopilotRuntime with LangGraph agent (same as testing_ui)
const runtime = new CopilotRuntime({
  agents: {
    sample_agent: new LangGraphAgent({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://localhost:8123',
      graphId: 'sample_agent',
      langsmithApiKey: process.env.LANGSMITH_API_KEY || '',
      streamTimeout: 60000,
      agentInstanceId: undefined,
    }),
  },
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Info endpoint for CopilotKit
app.get('/info', (_req, res) => {
  res.json({
    agents: ['sample_agent'],
    version: '1.0.0',
  });
});

// Create the CopilotKit handler
const copilotHandler = copilotRuntimeNodeHttpEndpoint({
  runtime,
  serviceAdapter,
  endpoint: '/',
});

// CopilotKit runtime endpoint - handle all methods
app.all('*', async (req, res) => {
  try {
    console.log(`📡 CopilotKit ${req.method} request to ${req.path}`);
    await copilotHandler(req, res);
  } catch (error) {
    console.error('❌ Error in CopilotKit endpoint:', error);
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
  console.log(`📡 LangGraph agent URL: ${process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://localhost:8123'}`);
});
