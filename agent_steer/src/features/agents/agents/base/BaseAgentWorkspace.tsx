import { useState, useEffect } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat, type CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { useFrontendTool } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

import type { AgentConfig } from '@/config/agents';
import { AgentHeader } from '../../components/AgentHeader';
import { AgentActionButton } from '../../components/AgentActionButton';
import { sendMessageToChat } from '@/features/copilot/hooks/useChatHelpers';
import { useHideCopilotBanner, useAutoScroll, useChatStyles } from '../../shared';
import { QuickActionButtons } from '../../shared/components/QuickActionButtons';

interface BaseAgentWorkspaceProps {
  agent: AgentConfig;
  /** Optional custom main content component */
  MainContent?: React.ComponentType<{
    agent: AgentConfig;
    themeColor: string;
    setThemeColor: (color: string) => void;
  }>;
}

// Theme color helper
function getThemeColor(agent: AgentConfig): string {
  const colorMap: Record<string, string> = {
    'text-green-500': '#22c55e',
    'text-blue-500': '#3b82f6',
    'text-purple-500': '#a855f7',
    'text-amber-500': '#f59e0b',
  };
  return colorMap[agent.color] || '#6366f1';
}

/**
 * Base workspace component that can be used by any agent.
 * Provides standard layout with header, main content, and chat panel.
 *
 * Usage:
 * ```tsx
 * // Simple usage
 * <BaseAgentWorkspace agent={agent} />
 *
 * // With custom main content
 * <BaseAgentWorkspace agent={agent} MainContent={MyCustomContent} />
 * ```
 */
export function BaseAgentWorkspace({ agent, MainContent }: BaseAgentWorkspaceProps) {
  const [themeColor, setThemeColor] = useState(getThemeColor(agent));

  useEffect(() => {
    setThemeColor(getThemeColor(agent));
  }, [agent.id]);

  // Apply shared hooks
  useHideCopilotBanner();
  useChatStyles();
  useAutoScroll('.w-\\[550px\\]');

  const ContentComponent = MainContent || DefaultMainContent;

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent={agent.copilotAgentName}>
      <div
        style={{ '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties}
        className="h-screen flex flex-col bg-white"
      >
        <AgentHeader agent={agent} />
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            <ContentComponent
              agent={agent}
              themeColor={themeColor}
              setThemeColor={setThemeColor}
            />
          </div>
          {/* Chat Panel */}
          <div className="w-[550px] border-l border-gray-200 flex flex-col">
            <CopilotChat
              labels={{
                title: agent.name,
                initial: `Hi! I'm your ${agent.name}. ${agent.description}`,
              }}
              instructions={`You are ${agent.name}. ${agent.description}`}
              className="flex-1"
            />
            <QuickActionButtons actions={agent.actions} themeColor={themeColor} />
          </div>
        </div>
      </div>
    </CopilotKit>
  );
}

// Default main content component
interface MainContentProps {
  agent: AgentConfig;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

function DefaultMainContent({ agent, themeColor, setThemeColor }: MainContentProps) {
  // Theme color tool
  useFrontendTool({
    name: 'setThemeColor',
    parameters: [
      { name: 'themeColor', description: 'The theme color to set.', required: true },
    ],
    handler({ themeColor: newColor }: { themeColor: string }) {
      setThemeColor(newColor);
    },
  });

  const handleActionClick = (prompt: string) => {
    sendMessageToChat(prompt);
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to {agent.name}
          </h2>
          <p className="text-gray-600">{agent.description}</p>
        </div>

        {/* Actions Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agent.actions.map((action) => (
              <AgentActionButton
                key={action.id}
                action={action}
                themeColor={themeColor}
                onClick={handleActionClick}
              />
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: `${themeColor}08`,
            borderColor: `${themeColor}30`,
          }}
        >
          <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-sm text-gray-600 mb-4">
            Use the chat sidebar to interact with {agent.name}.
            Click any quick action or type your own message.
          </p>
          <div className="flex flex-wrap gap-2">
            {agent.actions.slice(0, 3).map((action) => (
              <span
                key={action.id}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${themeColor}15`,
                  color: themeColor,
                }}
              >
                {action.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
