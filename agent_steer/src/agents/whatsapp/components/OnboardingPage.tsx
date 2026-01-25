import { useState, useRef, useCallback } from 'react'
import { useFrontendTool } from '@copilotkit/react-core'
import {
  UserPlus,
  CheckCircle,
  Building2,
  FolderPlus,
  Globe
} from 'lucide-react'
import { sendMessageToChat } from '../../shared/hooks/useChatHelpers'

interface OnboardingPageProps {
  themeColor: string
}

// Types for onboarding data
interface BusinessProfileData {
  display_name: string
  email: string
  company: string
  contact: string
  timezone: string
  currency: string
  company_size: string
  password: string
}

interface ProjectData {
  name: string
}

interface EmbeddedSignupData {
  business_name: string
  business_email: string
  phone_code: number
  website: string
  street_address: string
  city: string
  state: string
  zip_postal: string
  country: string
  timezone: string
  display_name: string
  category: string
  description?: string
}

// Workflow steps configuration
const workflowSteps = [
  {
    id: 'business_profile',
    name: 'Business Profile',
    description: 'Set up your business information',
    icon: Building2,
  },
  {
    id: 'project',
    name: 'Create Project',
    description: 'Create your first project',
    icon: FolderPlus,
  },
  {
    id: 'embedded_signup',
    name: 'Generate Signup URL',
    description: 'Get WhatsApp Business signup link',
    icon: Globe,
  },
]

// ============================================
// FORM COMPONENTS
// ============================================

function BusinessProfileForm({
  themeColor,
  onSubmit,
  isLoading,
}: {
  themeColor: string
  onSubmit: (data: BusinessProfileData) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<BusinessProfileData>({
    display_name: '',
    email: '',
    company: '',
    contact: '',
    timezone: 'UTC',
    currency: 'USD',
    company_size: '',
    password: '',
  })

  const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata', 'Asia/Calcutta GMT+05:30']
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY']
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('[BusinessProfileForm] handleChange:', e.target.name, '=', e.target.value)
    e.stopPropagation()
    setFormData(prev => {
      const newData = { ...prev, [e.target.name]: e.target.value }
      console.log('[BusinessProfileForm] formData updated:', newData)
      return newData
    })
  }

  // Stop propagation to prevent CopilotKit from capturing keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('[BusinessProfileForm] handleKeyDown:', e.key, 'target:', (e.target as HTMLElement).tagName)
    e.stopPropagation()
  }

  const handleFocus = (e: React.FocusEvent) => {
    console.log('[BusinessProfileForm] handleFocus:', (e.target as HTMLElement).tagName, (e.target as HTMLInputElement).name)
    e.stopPropagation()
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    console.log('[BusinessProfileForm] handleInput:', (e.target as HTMLInputElement).name, '=', (e.target as HTMLInputElement).value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.display_name && formData.email && formData.company) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onInput={handleInput}
            onClick={(e) => { console.log('[BusinessProfileForm] onClick display_name'); e.stopPropagation() }}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
          <select
            name="company_size"
            value={formData.company_size}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            <option value="">Select...</option>
            {companySizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-form-field="true"
          autoComplete="new-password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Processing...' : 'Continue to Project Setup'}
      </button>
    </form>
  )
}

function ProjectForm({
  themeColor,
  onSubmit,
  isLoading,
  companyName,
}: {
  themeColor: string
  onSubmit: (data: ProjectData) => void
  isLoading: boolean
  companyName: string
}) {
  const [projectName, setProjectName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName) {
      onSubmit({ name: projectName })
    }
  }

  // Stop propagation to prevent CopilotKit from capturing keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleFocus = (e: React.FocusEvent) => {
    e.stopPropagation()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">Business Profile Created!</p>
        <p className="text-sm text-green-600">Company: {companyName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => { e.stopPropagation(); setProjectName(e.target.value) }}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-form-field="true"
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          placeholder="My WhatsApp Project"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">This will be your main WhatsApp integration project.</p>
      </div>
      <button
        type="submit"
        disabled={isLoading || !projectName}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Creating...' : 'Continue to Signup URL'}
      </button>
    </form>
  )
}

function EmbeddedSignupForm({
  themeColor,
  onSubmit,
  isLoading,
  projectName,
}: {
  themeColor: string
  onSubmit: (data: EmbeddedSignupData) => void
  isLoading: boolean
  projectName: string
}) {
  const [formData, setFormData] = useState<EmbeddedSignupData>({
    business_name: '',
    business_email: '',
    phone_code: 1,
    website: '',
    street_address: '',
    city: '',
    state: '',
    zip_postal: '',
    country: 'United States',
    timezone: 'UTC',
    display_name: '',
    category: '',
    description: '',
  })

  const categories = ['Retail', 'E-commerce', 'Healthcare', 'Education', 'Technology', 'Finance', 'Other']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.name === 'phone_code' ? parseInt(e.target.value) : e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.business_name && formData.business_email && formData.category) {
      onSubmit(formData)
    }
  }

  // Stop propagation to prevent CopilotKit from capturing keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleFocus = (e: React.FocusEvent) => {
    e.stopPropagation()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 font-medium">Project Created!</p>
        <p className="text-sm text-blue-600">Project: {projectName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
          <input
            type="email"
            name="business_email"
            value={formData.business_email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          >
            <option value="">Select category...</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
        <input
          type="text"
          name="street_address"
          value={formData.street_address}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-form-field="true"
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code *</label>
          <input
            type="text"
            name="zip_postal"
            value={formData.zip_postal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-form-field="true"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-form-field="true"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Generating URL...' : 'Generate Signup URL'}
      </button>
    </form>
  )
}

function OnboardingSuccess({
  themeColor,
  businessData,
  projectData,
  signupData,
}: {
  themeColor: string
  businessData: BusinessProfileData
  projectData: ProjectData
  signupData: EmbeddedSignupData
}) {
  return (
    <div className="text-center py-8">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <CheckCircle className="w-10 h-10" style={{ color: themeColor }} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete!</h3>
      <p className="text-gray-600 mb-6">Your WhatsApp Business is ready to use</p>

      <div className="grid grid-cols-3 gap-4 text-left">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Business</h4>
          <p className="text-sm text-gray-600">{businessData.company}</p>
          <p className="text-sm text-gray-500">{businessData.email}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Project</h4>
          <p className="text-sm text-gray-600">{projectData.name}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">WhatsApp</h4>
          <p className="text-sm text-gray-600">{signupData.business_name}</p>
          <p className="text-sm text-gray-500">{signupData.category}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN ONBOARDING PAGE COMPONENT
// ============================================

export function OnboardingPage({ themeColor }: OnboardingPageProps) {
  // Workflow state - start with 'idle' state, form appears only after tool call
  const [currentStep, setCurrentStep] = useState<'idle' | 'business_profile' | 'project' | 'embedded_signup' | 'success'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // Form data refs
  const businessDataRef = useRef<BusinessProfileData | null>(null)
  const projectDataRef = useRef<ProjectData | null>(null)
  const signupDataRef = useRef<EmbeddedSignupData | null>(null)

  // Step change functions - use functional setState to avoid stale closure issues
  const goToBusinessProfile = useCallback(() => {
    console.log('[OnboardingPage] goToBusinessProfile called')
    setCurrentStep(prev => {
      console.log('[OnboardingPage] goToBusinessProfile prev:', prev)
      if (prev === 'idle') return 'business_profile'
      return prev
    })
  }, [])

  const goToProject = useCallback(() => {
    console.log('[OnboardingPage] goToProject called')
    setCurrentStep(prev => {
      console.log('[OnboardingPage] goToProject prev:', prev)
      if (prev === 'business_profile') return 'project'
      return prev
    })
  }, [])

  const goToEmbeddedSignup = useCallback(() => {
    console.log('[OnboardingPage] goToEmbeddedSignup called')
    setCurrentStep(prev => {
      console.log('[OnboardingPage] goToEmbeddedSignup prev:', prev)
      if (prev === 'project') return 'embedded_signup'
      return prev
    })
  }, [])

  const goToSuccess = useCallback(() => {
    console.log('[OnboardingPage] goToSuccess called')
    setCurrentStep('success')
  }, [])

  // Register frontend tools for displaying UI
  // These are separate from backend tools which create resources via MCP
  // Frontend tools have "display_" prefix to avoid naming conflicts

  // Initial form display (called when user starts onboarding)
  useFrontendTool({
    name: 'display_business_profile_form',
    description: 'Display the business profile form to start onboarding. Call this when user wants to begin the onboarding process.',
    parameters: [],
    handler() {
      console.log('[OnboardingPage] display_business_profile_form handler called')
      goToBusinessProfile()
    },
  })

  // Show project form after business profile is created
  useFrontendTool({
    name: 'display_project_form',
    description: 'Display the project form after business profile is created via MCP.',
    parameters: [],
    handler() {
      console.log('[OnboardingPage] display_project_form handler called')
      goToProject()
    },
  })

  // Show embedded signup form after project is created
  useFrontendTool({
    name: 'display_embedded_signup_form',
    description: 'Display the embedded signup form after project is created via MCP.',
    parameters: [],
    handler() {
      console.log('[OnboardingPage] display_embedded_signup_form handler called')
      goToEmbeddedSignup()
    },
  })

  // Show success message after all steps complete
  useFrontendTool({
    name: 'display_onboarding_success',
    description: 'Display the onboarding success message after all steps are complete.',
    parameters: [],
    handler() {
      console.log('[OnboardingPage] display_onboarding_success handler called')
      goToSuccess()
    },
  })

  // Form submission handlers - send complete data for backend tools
  // Backend expects "Workflow X submitted" format
  const handleBusinessProfileSubmit = (data: BusinessProfileData) => {
    setIsLoading(true)
    setLoadingMessage('Creating business profile...')
    businessDataRef.current = data
    // Send message in format expected by backend: "Workflow business profile submitted"
    const message = `Workflow business profile submitted: user_id=user_886182, display_name=${data.display_name}, email=${data.email}, company=${data.company}, contact=${data.contact}, timezone=${data.timezone}, currency=${data.currency}, company_size=${data.company_size}, password=${data.password}, onboarding_id=onb_user_45618516`
    console.log('[OnboardingPage] Sending business profile:', message)
    sendMessageToChat(message)
    setTimeout(() => {
      setIsLoading(false)
      setLoadingMessage('')
    }, 500)
  }

  const handleProjectSubmit = (data: ProjectData) => {
    setIsLoading(true)
    setLoadingMessage('Creating project...')
    projectDataRef.current = data
    // Send message in format expected by backend: "Workflow project submitted"
    const message = `Workflow project submitted: user_id=user_886182, name=${data.name}`
    console.log('[OnboardingPage] Sending project data:', message)
    sendMessageToChat(message)
    setTimeout(() => {
      setIsLoading(false)
      setLoadingMessage('')
    }, 500)
  }

  const handleEmbeddedSignupSubmit = (data: EmbeddedSignupData) => {
    setIsLoading(true)
    setLoadingMessage('Generating signup URL... This may take a moment.')
    signupDataRef.current = data
    // Send message in format expected by backend: "Workflow embedded signup submitted"
    // phone_number should include country code, phone_code should be integer
    const phoneCode = data.phone_code || 1
    const phoneNumber = `+${phoneCode}${data.business_email}` // TODO: Get actual phone from form
    const message = `Workflow embedded signup submitted: user_id=user_886182, business_name=${data.business_name}, business_email=${data.business_email}, phone_code=${phoneCode}, phone_number=${phoneNumber}, website=${data.website || ''}, street_address=${data.street_address || ''}, city=${data.city}, state=${data.state || ''}, zip_postal=${data.zip_postal || ''}, country=${data.country}, timezone=${data.timezone}, display_name=${data.display_name}, category=${data.category}, description=${data.description || ''}`
    console.log('[OnboardingPage] Sending embedded signup data:', message)
    sendMessageToChat(message)
    setTimeout(() => {
      setIsLoading(false)
      setLoadingMessage('')
    }, 500)
  }

  // Reset workflow - start fresh in idle state
  const handleReset = () => {
    setCurrentStep('idle')
    businessDataRef.current = null
    projectDataRef.current = null
    signupDataRef.current = null
  }

  // Get step index for progress indicator
  const getStepIndex = () => {
    switch (currentStep) {
      case 'idle': return -1
      case 'business_profile': return 0
      case 'project': return 1
      case 'embedded_signup': return 2
      case 'success': return 3
      default: return -1
    }
  }

  const stepIndex = getStepIndex()

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">WhatsApp Business Onboarding</h2>
          <p className="text-gray-600 mt-1">
            Complete the steps below to set up your WhatsApp Business
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      index <= stepIndex
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{
                      backgroundColor: index <= stepIndex ? themeColor : undefined
                    }}
                  >
                    {index < stepIndex || currentStep === 'success' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${index <= stepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-1 rounded-full ${
                        index < stepIndex ? '' : 'bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: index < stepIndex ? themeColor : undefined
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container - Form appears after clicking Onboarding in chat */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <div className="mb-4 flex justify-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColor,
                      animationDelay: '0ms',
                    }}
                  />
                  <div
                    className="w-3 h-3 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColor,
                      animationDelay: '150ms',
                    }}
                  />
                  <div
                    className="w-3 h-3 rounded-full animate-bounce"
                    style={{
                      backgroundColor: themeColor,
                      animationDelay: '300ms',
                    }}
                  />
                </div>
                <p className="text-lg font-medium text-gray-900 flex items-center justify-center gap-1">
                  {loadingMessage}
                  <span className="inline-flex gap-0.5">
                    <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we process your request</p>
              </div>
            </div>
          )}

          {currentStep === 'idle' && (
            <div className="text-center py-12">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <UserPlus className="w-10 h-10" style={{ color: themeColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Click the <strong>"Onboarding"</strong> button in the chat panel to begin setting up your WhatsApp Business account.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Waiting for onboarding to start...</span>
              </div>
            </div>
          )}

          {currentStep === 'business_profile' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <Building2 className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 1: Business Profile</h3>
                  <p className="text-sm text-gray-500">Enter your business information</p>
                </div>
              </div>
              <BusinessProfileForm
                themeColor={themeColor}
                onSubmit={handleBusinessProfileSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentStep === 'project' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <FolderPlus className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 2: Create Project</h3>
                  <p className="text-sm text-gray-500">Set up your WhatsApp project</p>
                </div>
              </div>
              <ProjectForm
                themeColor={themeColor}
                onSubmit={handleProjectSubmit}
                isLoading={isLoading}
                companyName={businessDataRef.current?.company || ''}
              />
            </div>
          )}

          {currentStep === 'embedded_signup' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <Globe className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 3: Generate WhatsApp Signup URL</h3>
                  <p className="text-sm text-gray-500">Generate embedded signup URL for Facebook verification</p>
                </div>
              </div>
              <EmbeddedSignupForm
                themeColor={themeColor}
                onSubmit={handleEmbeddedSignupSubmit}
                isLoading={isLoading}
                projectName={projectDataRef.current?.name || ''}
              />
            </div>
          )}

          {currentStep === 'success' && businessDataRef.current && projectDataRef.current && signupDataRef.current && (
            <div>
              <OnboardingSuccess
                themeColor={themeColor}
                businessData={businessDataRef.current}
                projectData={projectDataRef.current}
                signupData={signupDataRef.current}
              />
              <div className="text-center mt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Start New Onboarding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
