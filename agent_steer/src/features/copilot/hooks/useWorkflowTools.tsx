import { useRef, useState } from 'react';
import { useRenderToolCall } from '@copilotkit/react-core';
import {
  WorkflowLoginForm,
  WorkflowJobForm,
  WorkflowReviewForm,
  WorkflowSuccess,
} from '../components/workflow';
import { sendMessageToChat } from './useChatHelpers';
import type {
  UserData,
  JobApplicationData,
  ReviewData,
  WorkflowCompleteData,
} from '@/types';

interface UseWorkflowToolsOptions {
  themeColor?: string;
}

/**
 * Custom hook that registers all workflow-related tool renderers
 * for the CopilotKit multi-step job application workflow
 */
export function useWorkflowTools({ themeColor = '#6366f1' }: UseWorkflowToolsOptions = {}) {
  // Refs to track workflow state across renders
  const workflowLoginSubmittedRef = useRef(false);
  const workflowJobSubmittedRef = useRef(false);
  const workflowReviewSubmittedRef = useRef(false);
  const workflowLoginDataRef = useRef<UserData | null>(null);
  const workflowJobDataRef = useRef<JobApplicationData | null>(null);

  // State for triggering re-renders
  const [workflowLoginSubmitted, setWorkflowLoginSubmitted] = useState(false);
  const [workflowJobSubmitted, setWorkflowJobSubmitted] = useState(false);
  const [workflowReviewSubmitted, setWorkflowReviewSubmitted] = useState(false);

  // STEP 1: Workflow Login Form
  useRenderToolCall(
    {
      name: 'show_workflow_login_form',
      description: 'Display login form as first step of job application workflow.',
      render: ({ status }) => {
        // Reset for new workflow
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
            onSubmit={(data: UserData) => {
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
        if (args.name && args.email && args.mobile) {
          workflowLoginDataRef.current = {
            name: args.name,
            email: args.email,
            mobile: args.mobile,
          };
        }

        if (workflowJobSubmittedRef.current) {
          return <></>;
        }

        return (
          <div>
            <div className="mb-3 p-3 bg-green-100 rounded">
              <p className="text-green-600 font-semibold">
                Login successful for {args.name}
              </p>
              <p className="text-xs text-gray-600">
                Email: {args.email} | Mobile: {args.mobile}
              </p>
            </div>
            <WorkflowJobForm
              themeColor={themeColor}
              onSubmit={(data: JobApplicationData) => {
                workflowJobSubmittedRef.current = true;
                setWorkflowJobSubmitted(true);
                workflowJobDataRef.current = data;

                const loginData = workflowLoginDataRef.current;
                const message = `Workflow job application submitted: name=${loginData?.name || args.name}, email=${loginData?.email || args.email}, mobile=${loginData?.mobile || args.mobile}, full_name=${data.full_name}, position_applied=${data.position_applied}, years_of_experience=${data.years_of_experience}, skills=${data.skills}${data.resume_url ? `, resume_url=${data.resume_url}` : ''}${data.cover_letter ? `, cover_letter=${data.cover_letter}` : ''}`;
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

        if (full_name && position_applied) {
          workflowJobDataRef.current = {
            full_name,
            position_applied,
            years_of_experience,
            skills,
            resume_url: args.resume_url,
            cover_letter: args.cover_letter,
          };
        }

        if (workflowReviewSubmittedRef.current) {
          return <></>;
        }

        return (
          <div>
            <div className="mb-3 p-3 bg-blue-100 rounded">
              <p className="text-blue-600 font-semibold">
                Job Application Saved
              </p>
              <p className="text-xs text-gray-600">
                Position: {position_applied} | Experience:{' '}
                {years_of_experience} years
              </p>
            </div>
            <WorkflowReviewForm
              themeColor={themeColor}
              applicantName={full_name}
              position={position_applied}
              onSubmit={(data: ReviewData) => {
                workflowReviewSubmittedRef.current = true;
                setWorkflowReviewSubmitted(true);

                const loginData = workflowLoginDataRef.current;
                const message = `Workflow review submitted: name=${loginData?.name || name}, email=${loginData?.email || email}, mobile=${loginData?.mobile || mobile}, full_name=${full_name}, position_applied=${position_applied}, years_of_experience=${years_of_experience}, skills=${skills}, availability=${data.availability}, expected_salary=${data.expected_salary}, willing_to_relocate=${data.willing_to_relocate}${args.resume_url ? `, resume_url=${args.resume_url}` : ''}${args.cover_letter ? `, cover_letter=${args.cover_letter}` : ''}`;
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

        if (status === 'executing') {
          return (
            <div className="p-5 bg-orange-100 rounded-lg text-center">
              <p className="text-orange-600 font-semibold">
                Submitting final application...
              </p>
              <p className="text-xs text-gray-600">
                Applicant: {full_name} | Position: {position_applied}
              </p>
            </div>
          );
        }

        const completeData: WorkflowCompleteData = {
          user: {
            name,
            email,
            mobile,
          },
          job: {
            full_name,
            position_applied,
            years_of_experience,
            skills,
            resume_url: args.resume_url,
            cover_letter: args.cover_letter,
          },
          review: {
            availability,
            expected_salary,
            willing_to_relocate,
          },
        };

        return <WorkflowSuccess themeColor={themeColor} data={completeData} />;
      },
    },
    [themeColor]
  );

  // Return reset function for external use
  const resetWorkflow = () => {
    workflowLoginSubmittedRef.current = false;
    workflowJobSubmittedRef.current = false;
    workflowReviewSubmittedRef.current = false;
    workflowLoginDataRef.current = null;
    workflowJobDataRef.current = null;
    setWorkflowLoginSubmitted(false);
    setWorkflowJobSubmitted(false);
    setWorkflowReviewSubmitted(false);
  };

  return { resetWorkflow };
}
