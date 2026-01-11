import { useState, useEffect, useRef } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar, type CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { useFrontendTool, useRenderToolCall } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

import type { AgentConfig } from '@/config/agents';
import { AgentHeader } from './AgentHeader';
import { AgentActionButton } from './AgentActionButton';
import { sendMessageToChat } from '@/features/copilot/hooks/useChatHelpers';
import {
  WorkflowLoginForm,
  WorkflowJobForm,
  WorkflowReviewForm,
  WorkflowSuccess,
} from '@/features/copilot/components/workflow';

interface AgentWorkspaceProps {
  agent: AgentConfig;
}

export function AgentWorkspace({ agent }: AgentWorkspaceProps) {
  const [themeColor, setThemeColor] = useState(getThemeColorFromAgent(agent));

  // Update theme color when agent changes
  useEffect(() => {
    setThemeColor(getThemeColorFromAgent(agent));
  }, [agent.id]);

  // Hide CopilotKit version banner
  useEffect(() => {
    const hideBanner = () => {
      const allElements = document.querySelectorAll('div, span, a');
      allElements.forEach((el) => {
        if (
          el.textContent?.includes('CopilotKit v') &&
          el.textContent?.includes('now live')
        ) {
          let parent = el.parentElement;
          while (parent && parent.tagName !== 'BODY') {
            if (parent.children.length <= 3) {
              (parent as HTMLElement).style.display = 'none';
              return;
            }
            parent = parent.parentElement;
          }
          (el as HTMLElement).style.display = 'none';
        }
      });
    };

    hideBanner();
    const timer1 = setTimeout(hideBanner, 100);
    const timer2 = setTimeout(hideBanner, 500);

    const observer = new MutationObserver(hideBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, []);

  const suggestions = agent.actions.slice(0, 4).map((action) => ({
    title: action.label,
    message: action.prompt,
  }));

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent={agent.copilotAgentName}>
      <div
        style={{ '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties}
        className="h-screen flex flex-col"
      >
        <AgentHeader agent={agent} />
        <div className="flex-1 flex overflow-hidden">
          <CopilotSidebar
            clickOutsideToClose={false}
            defaultOpen={true}
            labels={{
              title: agent.name,
              initial: `Hi! I'm your ${agent.name}. ${agent.description}`,
            }}
            suggestions={suggestions}
          >
            <AgentMainContent
              agent={agent}
              themeColor={themeColor}
              setThemeColor={setThemeColor}
            />
          </CopilotSidebar>
        </div>
      </div>
    </CopilotKit>
  );
}

interface AgentMainContentProps {
  agent: AgentConfig;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

function AgentMainContent({ agent, themeColor, setThemeColor }: AgentMainContentProps) {
  // Workflow state refs
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

  // Reset workflow state when agent changes
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

  // Frontend tool: Set theme color
  useFrontendTool({
    name: 'setThemeColor',
    parameters: [
      {
        name: 'themeColor',
        description: 'The theme color to set.',
        required: true,
      },
    ],
    handler({ themeColor: newColor }: { themeColor: string }) {
      setThemeColor(newColor);
    },
  });

  // Register all workflow tools
  useWorkflowTools({
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
        {/* Welcome Section */}
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
            Use the chat sidebar on the right to interact with {agent.name}.
            Click any quick action above or type your own message to get started.
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

// Extract theme color from agent config
function getThemeColorFromAgent(agent: AgentConfig): string {
  const colorMap: Record<string, string> = {
    'text-green-500': '#22c55e',
    'text-blue-500': '#3b82f6',
    'text-purple-500': '#a855f7',
    'text-amber-500': '#f59e0b',
  };
  return colorMap[agent.color] || '#6366f1';
}

// Workflow tools hook
interface WorkflowToolsProps {
  themeColor: string;
  workflowLoginSubmittedRef: React.MutableRefObject<boolean>;
  workflowJobSubmittedRef: React.MutableRefObject<boolean>;
  workflowReviewSubmittedRef: React.MutableRefObject<boolean>;
  workflowLoginDataRef: React.MutableRefObject<{ name: string; email: string; mobile: string } | null>;
  workflowJobDataRef: React.MutableRefObject<{
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

function useWorkflowTools(props: WorkflowToolsProps) {
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

  // STEP 1: Workflow Login Form
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
          workflowJobSubmittedRef.current = false;
          setWorkflowJobSubmitted(false);
          workflowReviewSubmittedRef.current = false;
          setWorkflowReviewSubmitted(false);
          workflowJobDataRef.current = null;
        }

        if (workflowLoginSubmittedRef.current) {
          return <></>;
        }

        return (
          <WorkflowLoginForm
            themeColor={themeColor}
            onSubmit={(data) => {
              workflowLoginSubmittedRef.current = true;
              setWorkflowLoginSubmitted(true);
              workflowLoginDataRef.current = data;
              const message = `Workflow login submitted: name=${data.name}, email=${data.email}, mobile=${data.mobile}`;
              sendMessageToChat(message);
            }}
          />
        );
      },
    },
    [themeColor, workflowLoginSubmitted]
  );

  // STEP 2: Process login AND show job application form
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
          workflowLoginDataRef.current = { name, email, mobile };
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
                workflowJobSubmittedRef.current = true;
                setWorkflowJobSubmitted(true);
                workflowJobDataRef.current = data;

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

  // STEP 3: Process job application and show review form
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
          workflowJobDataRef.current = {
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
                workflowReviewSubmittedRef.current = true;
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

  // STEP 4: Final submission success
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
