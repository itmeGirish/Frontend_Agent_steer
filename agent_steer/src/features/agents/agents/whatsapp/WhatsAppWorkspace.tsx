import { useState, useEffect, useRef } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat, type CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { useFrontendTool, useRenderToolCall } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

import type { AgentConfig } from '@/config/agents';
import { AgentHeader } from '../../components/AgentHeader';
import { AgentActionButton } from '../../components/AgentActionButton';
import { sendMessageToChat } from '@/features/copilot/hooks/useChatHelpers';
import { useHideCopilotBanner, useAutoScroll, useChatStyles } from '../../shared';
import { QuickActionButtons } from '../../shared/components/QuickActionButtons';
import {
  WorkflowLoginForm,
  WorkflowJobForm,
  WorkflowReviewForm,
  WorkflowSuccess,
} from '@/features/copilot/components/workflow';

interface WhatsAppWorkspaceProps {
  agent: AgentConfig;
}

// Theme color helper
function getThemeColor(agent: AgentConfig): string {
  const colorMap: Record<string, string> = {
    'text-green-500': '#22c55e',
    'text-blue-500': '#3b82f6',
    'text-purple-500': '#a855f7',
    'text-amber-500': '#f59e0b',
  };
  return colorMap[agent.color] || '#22c55e';
}

export function WhatsAppWorkspace({ agent }: WhatsAppWorkspaceProps) {
  const [themeColor, setThemeColor] = useState(getThemeColor(agent));

  useEffect(() => {
    setThemeColor(getThemeColor(agent));
  }, [agent.id]);

  // Apply shared hooks
  useHideCopilotBanner();
  useChatStyles();
  useAutoScroll('.w-\\[550px\\]');

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
            <WhatsAppMainContent
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

interface WhatsAppMainContentProps {
  agent: AgentConfig;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

function WhatsAppMainContent({ agent, themeColor, setThemeColor }: WhatsAppMainContentProps) {
  // Workflow state
  const workflowLoginSubmittedRef = useRef(false);
  const workflowJobSubmittedRef = useRef(false);
  const workflowReviewSubmittedRef = useRef(false);
  const workflowLoginDataRef = useRef<{ name: string; email: string; mobile: string } | null>(null);
  const workflowJobDataRef = useRef<{
    full_name: string;
    position_applied: string;
    years_of_experience: number;
    skills: string;
    resume_url?: string;
    cover_letter?: string;
  } | null>(null);

  const [workflowLoginSubmitted, setWorkflowLoginSubmitted] = useState(false);
  const [workflowJobSubmitted, setWorkflowJobSubmitted] = useState(false);
  const [workflowReviewSubmitted, setWorkflowReviewSubmitted] = useState(false);

  // Reset on agent change
  useEffect(() => {
    workflowLoginSubmittedRef.current = false;
    workflowJobSubmittedRef.current = false;
    workflowReviewSubmittedRef.current = false;
    workflowLoginDataRef.current = null;
    workflowJobDataRef.current = null;
    setWorkflowLoginSubmitted(false);
    setWorkflowJobSubmitted(false);
    setWorkflowReviewSubmitted(false);
  }, [agent.id]);

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

  // Register WhatsApp-specific workflow tools
  useWhatsAppWorkflowTools({
    themeColor,
    workflowLoginSubmittedRef,
    workflowJobSubmittedRef,
    workflowReviewSubmittedRef,
    workflowLoginDataRef,
    workflowJobDataRef,
    workflowLoginSubmitted,
    workflowJobSubmitted,
    workflowReviewSubmitted,
    setWorkflowLoginSubmitted,
    setWorkflowJobSubmitted,
    setWorkflowReviewSubmitted,
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

// WhatsApp-specific workflow tools
interface WorkflowToolsProps {
  themeColor: string;
  workflowLoginSubmittedRef: React.RefObject<boolean | null>;
  workflowJobSubmittedRef: React.RefObject<boolean | null>;
  workflowReviewSubmittedRef: React.RefObject<boolean | null>;
  workflowLoginDataRef: React.RefObject<{ name: string; email: string; mobile: string } | null>;
  workflowJobDataRef: React.RefObject<{
    full_name: string;
    position_applied: string;
    years_of_experience: number;
    skills: string;
    resume_url?: string;
    cover_letter?: string;
  } | null>;
  workflowLoginSubmitted: boolean;
  workflowJobSubmitted: boolean;
  workflowReviewSubmitted: boolean;
  setWorkflowLoginSubmitted: (v: boolean) => void;
  setWorkflowJobSubmitted: (v: boolean) => void;
  setWorkflowReviewSubmitted: (v: boolean) => void;
}

function useWhatsAppWorkflowTools(props: WorkflowToolsProps) {
  const {
    themeColor,
    workflowLoginSubmittedRef,
    workflowJobSubmittedRef,
    workflowReviewSubmittedRef,
    workflowLoginDataRef,
    workflowJobDataRef,
    workflowLoginSubmitted,
    workflowJobSubmitted,
    workflowReviewSubmitted,
    setWorkflowLoginSubmitted,
    setWorkflowJobSubmitted,
    setWorkflowReviewSubmitted,
  } = props;

  // STEP 1: Login Form
  useRenderToolCall(
    {
      name: 'show_workflow_login_form',
      description: 'Display login form as first step of job application workflow.',
      render: ({ status }) => {
        if (
          status === 'executing' &&
          !workflowLoginSubmittedRef.current &&
          (workflowJobSubmittedRef.current || workflowReviewSubmittedRef.current)
        ) {
          (workflowJobSubmittedRef as React.MutableRefObject<boolean>).current = false;
          setWorkflowJobSubmitted(false);
          (workflowReviewSubmittedRef as React.MutableRefObject<boolean>).current = false;
          setWorkflowReviewSubmitted(false);
          (workflowJobDataRef as React.MutableRefObject<typeof workflowJobDataRef.current>).current = null;
        }

        if (workflowLoginSubmittedRef.current) {
          return <></>;
        }

        return (
          <WorkflowLoginForm
            themeColor={themeColor}
            onSubmit={(data) => {
              (workflowLoginSubmittedRef as React.MutableRefObject<boolean>).current = true;
              setWorkflowLoginSubmitted(true);
              (workflowLoginDataRef as React.MutableRefObject<typeof data>).current = data;
              const message = `Workflow login submitted: name=${data.name}, email=${data.email}, mobile=${data.mobile}`;
              sendMessageToChat(message);
            }}
          />
        );
      },
    },
    [themeColor, workflowLoginSubmitted]
  );

  // STEP 2: Job Application Form
  useRenderToolCall(
    {
      name: 'process_workflow_login_and_show_job_form',
      description: 'Process login and display job application form.',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true },
        { name: 'mobile', type: 'string', required: true },
      ],
      render: ({ args }) => {
        const name = args.name || '';
        const email = args.email || '';
        const mobile = args.mobile || '';

        if (name && email && mobile) {
          (workflowLoginDataRef as React.MutableRefObject<{ name: string; email: string; mobile: string }>).current = { name, email, mobile };
        }

        if (workflowJobSubmittedRef.current) {
          return <></>;
        }

        return (
          <div>
            <div className="mb-3 p-3 bg-green-100 rounded">
              <p className="text-green-600 font-semibold">Login successful for {name}</p>
              <p className="text-xs text-gray-600">Email: {email} | Mobile: {mobile}</p>
            </div>
            <WorkflowJobForm
              themeColor={themeColor}
              onSubmit={(data) => {
                (workflowJobSubmittedRef as React.MutableRefObject<boolean>).current = true;
                setWorkflowJobSubmitted(true);
                (workflowJobDataRef as React.MutableRefObject<typeof data>).current = data;

                const loginData = workflowLoginDataRef.current;
                const message = `Workflow job application submitted: name=${loginData?.name || name}, email=${loginData?.email || email}, mobile=${loginData?.mobile || mobile}, full_name=${data.full_name}, position_applied=${data.position_applied}, years_of_experience=${data.years_of_experience}, skills=${data.skills}${data.resume_url ? `, resume_url=${data.resume_url}` : ''}${data.cover_letter ? `, cover_letter=${data.cover_letter}` : ''}`;
                sendMessageToChat(message);
              }}
            />
          </div>
        );
      },
    },
    [themeColor, workflowLoginSubmitted, workflowJobSubmitted]
  );

  // STEP 3: Review Form
  useRenderToolCall(
    {
      name: 'process_job_application_and_show_review_form',
      description: 'Process job application and show review form.',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true },
        { name: 'mobile', type: 'string', required: true },
        { name: 'full_name', type: 'string', required: true },
        { name: 'position_applied', type: 'string', required: true },
        { name: 'years_of_experience', type: 'number', required: true },
        { name: 'skills', type: 'string', required: true },
        { name: 'resume_url', type: 'string', required: false },
        { name: 'cover_letter', type: 'string', required: false },
      ],
      render: ({ args }) => {
        const name = args.name || '';
        const email = args.email || '';
        const mobile = args.mobile || '';
        const full_name = args.full_name || '';
        const position_applied = args.position_applied || '';
        const years_of_experience = args.years_of_experience || 0;
        const skills = args.skills || '';
        const resume_url = args.resume_url;
        const cover_letter = args.cover_letter;

        if (full_name && position_applied) {
          (workflowJobDataRef as React.MutableRefObject<typeof workflowJobDataRef.current>).current = {
            full_name,
            position_applied,
            years_of_experience,
            skills,
            resume_url,
            cover_letter,
          };
        }

        if (workflowReviewSubmittedRef.current) {
          return <></>;
        }

        return (
          <div>
            <div className="mb-3 p-3 bg-blue-100 rounded">
              <p className="text-blue-600 font-semibold">Job Application Saved</p>
              <p className="text-xs text-gray-600">
                Position: {position_applied} | Experience: {years_of_experience} years
              </p>
            </div>
            <WorkflowReviewForm
              themeColor={themeColor}
              applicantName={full_name}
              position={position_applied}
              onSubmit={(data) => {
                (workflowReviewSubmittedRef as React.MutableRefObject<boolean>).current = true;
                setWorkflowReviewSubmitted(true);

                const loginData = workflowLoginDataRef.current;
                const message = `Workflow review submitted: name=${loginData?.name || name}, email=${loginData?.email || email}, mobile=${loginData?.mobile || mobile}, full_name=${full_name}, position_applied=${position_applied}, years_of_experience=${years_of_experience}, skills=${skills}, availability=${data.availability}, expected_salary=${data.expected_salary}, willing_to_relocate=${data.willing_to_relocate}${resume_url ? `, resume_url=${resume_url}` : ''}${cover_letter ? `, cover_letter=${cover_letter}` : ''}`;
                sendMessageToChat(message);
              }}
            />
          </div>
        );
      },
    },
    [themeColor, workflowReviewSubmitted]
  );

  // STEP 4: Final Submission
  useRenderToolCall(
    {
      name: 'submit_final_application_mcp',
      description: 'Submit final job application via MCP server.',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true },
        { name: 'mobile', type: 'string', required: true },
        { name: 'full_name', type: 'string', required: true },
        { name: 'position_applied', type: 'string', required: true },
        { name: 'years_of_experience', type: 'number', required: true },
        { name: 'skills', type: 'string', required: true },
        { name: 'availability', type: 'string', required: true },
        { name: 'expected_salary', type: 'string', required: true },
        { name: 'willing_to_relocate', type: 'string', required: true },
        { name: 'resume_url', type: 'string', required: false },
        { name: 'cover_letter', type: 'string', required: false },
      ],
      render: ({ args, status }) => {
        const name = args.name || '';
        const email = args.email || '';
        const mobile = args.mobile || '';
        const full_name = args.full_name || '';
        const position_applied = args.position_applied || '';
        const years_of_experience = args.years_of_experience || 0;
        const skills = args.skills || '';
        const availability = args.availability || '';
        const expected_salary = args.expected_salary || '';
        const willing_to_relocate = args.willing_to_relocate || '';
        const resume_url = args.resume_url;
        const cover_letter = args.cover_letter;

        if (status === 'executing') {
          return (
            <div className="p-5 bg-orange-100 rounded-lg text-center">
              <p className="text-orange-600 font-semibold">Submitting final application...</p>
              <p className="text-xs text-gray-600">
                Applicant: {full_name} | Position: {position_applied}
              </p>
            </div>
          );
        }

        return (
          <WorkflowSuccess
            themeColor={themeColor}
            data={{
              user: { name, email, mobile },
              job: {
                full_name,
                position_applied,
                years_of_experience,
                skills,
                resume_url,
                cover_letter,
              },
              review: {
                availability,
                expected_salary,
                willing_to_relocate,
              },
            }}
          />
        );
      },
    },
    [themeColor]
  );
}
