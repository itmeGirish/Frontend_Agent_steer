import { useState, useEffect, useRef } from 'react'
import { useRenderToolCall } from '@copilotkit/react-core'
import { sendMessageToChat } from '../../shared/hooks/useChatHelpers'
import {
  WorkflowLoginForm,
  WorkflowJobForm,
  WorkflowReviewForm,
  WorkflowSuccess,
} from '../components'

interface WorkflowState {
  loginSubmitted: boolean
  jobSubmitted: boolean
  reviewSubmitted: boolean
  loginData: { name: string; email: string; mobile: string } | null
  jobData: {
    full_name: string
    position_applied: string
    years_of_experience: number
    skills: string
    resume_url?: string
    cover_letter?: string
  } | null
}

export function useJobApplicationWorkflow(themeColor: string, agentId: string) {
  // State refs for CopilotKit callbacks
  const loginSubmittedRef = useRef(false)
  const jobSubmittedRef = useRef(false)
  const reviewSubmittedRef = useRef(false)
  const loginDataRef = useRef<WorkflowState['loginData']>(null)
  const jobDataRef = useRef<WorkflowState['jobData']>(null)

  // State for React re-renders
  const [loginSubmitted, setLoginSubmitted] = useState(false)
  const [jobSubmitted, setJobSubmitted] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Reset on agent change
  useEffect(() => {
    loginSubmittedRef.current = false
    jobSubmittedRef.current = false
    reviewSubmittedRef.current = false
    loginDataRef.current = null
    jobDataRef.current = null
    setLoginSubmitted(false)
    setJobSubmitted(false)
    setReviewSubmitted(false)
  }, [agentId])

  // STEP 1: Login Form
  useRenderToolCall(
    {
      name: 'show_workflow_login_form',
      description: 'Display login form as first step of job application workflow.',
      render: ({ status }) => {
        if (
          status === 'executing' &&
          !loginSubmittedRef.current &&
          (jobSubmittedRef.current || reviewSubmittedRef.current)
        ) {
          jobSubmittedRef.current = false
          setJobSubmitted(false)
          reviewSubmittedRef.current = false
          setReviewSubmitted(false)
          jobDataRef.current = null
        }

        if (loginSubmittedRef.current) {
          return <></>
        }

        return (
          <WorkflowLoginForm
            themeColor={themeColor}
            onSubmit={(data) => {
              loginSubmittedRef.current = true
              setLoginSubmitted(true)
              loginDataRef.current = data
              sendMessageToChat(
                `Workflow login submitted: name=${data.name}, email=${data.email}, mobile=${data.mobile}`
              )
            }}
          />
        )
      },
    },
    [themeColor, loginSubmitted]
  )

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
        const { name = '', email = '', mobile = '' } = args

        if (name && email && mobile) {
          loginDataRef.current = { name, email, mobile }
        }

        if (jobSubmittedRef.current) {
          return <></>
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
                jobSubmittedRef.current = true
                setJobSubmitted(true)
                jobDataRef.current = data

                const login = loginDataRef.current
                sendMessageToChat(
                  `Workflow job application submitted: name=${login?.name || name}, email=${login?.email || email}, mobile=${login?.mobile || mobile}, full_name=${data.full_name}, position_applied=${data.position_applied}, years_of_experience=${data.years_of_experience}, skills=${data.skills}${data.resume_url ? `, resume_url=${data.resume_url}` : ''}${data.cover_letter ? `, cover_letter=${data.cover_letter}` : ''}`
                )
              }}
            />
          </div>
        )
      },
    },
    [themeColor, loginSubmitted, jobSubmitted]
  )

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
        const {
          name = '',
          email = '',
          mobile = '',
          full_name = '',
          position_applied = '',
          years_of_experience = 0,
          skills = '',
          resume_url,
          cover_letter,
        } = args

        if (full_name && position_applied) {
          jobDataRef.current = {
            full_name,
            position_applied,
            years_of_experience,
            skills,
            resume_url,
            cover_letter,
          }
        }

        if (reviewSubmittedRef.current) {
          return <></>
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
                reviewSubmittedRef.current = true
                setReviewSubmitted(true)

                const login = loginDataRef.current
                sendMessageToChat(
                  `Workflow review submitted: name=${login?.name || name}, email=${login?.email || email}, mobile=${login?.mobile || mobile}, full_name=${full_name}, position_applied=${position_applied}, years_of_experience=${years_of_experience}, skills=${skills}, availability=${data.availability}, expected_salary=${data.expected_salary}, willing_to_relocate=${data.willing_to_relocate}${resume_url ? `, resume_url=${resume_url}` : ''}${cover_letter ? `, cover_letter=${cover_letter}` : ''}`
                )
              }}
            />
          </div>
        )
      },
    },
    [themeColor, reviewSubmitted]
  )

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
        const {
          name = '',
          email = '',
          mobile = '',
          full_name = '',
          position_applied = '',
          years_of_experience = 0,
          skills = '',
          availability = '',
          expected_salary = '',
          willing_to_relocate = '',
          resume_url,
          cover_letter,
        } = args

        if (status === 'executing') {
          return (
            <div className="p-5 bg-orange-100 rounded-lg text-center">
              <p className="text-orange-600 font-semibold">Submitting final application...</p>
              <p className="text-xs text-gray-600">
                Applicant: {full_name} | Position: {position_applied}
              </p>
            </div>
          )
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
        )
      },
    },
    [themeColor]
  )
}
