import { useFrontendTool, useCoAgent } from '@copilotkit/react-core';
import type { AgentState } from '@/types';

interface UseFrontendToolsOptions {
  onThemeChange?: (color: string) => void;
}

/**
 * Custom hook that registers frontend tools for CopilotKit
 * These are tools that the AI can call to modify the UI
 */
export function useFrontendTools({ onThemeChange }: UseFrontendToolsOptions = {}) {
  // Agent state management
  const { state, setState } = useCoAgent<AgentState>({
    name: 'sample_agent',
    initialState: {
      messages: [],
      currentStep: 'idle',
      userData: null,
      jobData: null,
      reviewData: null,
    },
  });

  // Tool to change theme color
  useFrontendTool({
    name: 'setThemeColor',
    parameters: [
      {
        name: 'themeColor',
        description: 'The theme color to set. Make sure to pick nice colors.',
        required: true,
      },
    ],
    handler({ themeColor }) {
      onThemeChange?.(themeColor);
    },
  });

  // Tool to update agent messages
  useFrontendTool({
    name: 'updateMessages',
    parameters: [
      {
        name: 'messages',
        description: 'The updated list of messages',
        type: 'string[]',
        required: true,
      },
    ],
    handler: ({ messages }) => {
      setState({
        ...state,
        messages,
      });
    },
  });

  return { state, setState };
}
