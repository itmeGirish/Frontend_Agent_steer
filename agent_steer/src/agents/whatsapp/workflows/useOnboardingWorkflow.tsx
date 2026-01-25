import { useState, useEffect, useRef } from 'react'
import { useRenderToolCall } from '@copilotkit/react-core'
import { sendMessageToChat } from '../../shared/hooks/useChatHelpers'

// Types matching backend state.py
export interface CreateBusinessProfileState {
  display_name: string
  email: string
  company: string
  contact: string
  timezone: string
  currency: string
  company_size: string
  password: string
  user_id?: string
  onboarding_id?: string
}

export interface CreateProjectState {
  name: string
  user_id?: string
}

export interface EmbeddedSignupUrlState {
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

// Form Components

// STEP 1: Business Profile Form
export function BusinessProfileForm({
  themeColor,
  onSubmit,
  isLoading,
}: {
  themeColor: string
  onSubmit: (data: CreateBusinessProfileState) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<CreateBusinessProfileState>({
    display_name: '',
    email: '',
    company: '',
    contact: '',
    timezone: 'UTC',
    currency: 'USD',
    company_size: '',
    password: '',
  })

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore',
    'Asia/Calcutta GMT+05:30', 'Australia/Sydney'
  ]

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD']

  const companySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.display_name && formData.email && formData.company && formData.contact && formData.password) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
        Step 1: Business Profile
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
              required
              disabled={isLoading}
              placeholder="Your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
              placeholder="business@example.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
              placeholder="Company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone *</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              disabled={isLoading}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              disabled={isLoading}
            >
              {currencies.map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
            <select
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
            >
              <option value="">Select size</option>
              {companySizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
            disabled={isLoading}
            placeholder="Create a secure password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue to Project Setup'}
        </button>
      </div>
    </form>
  )
}

// STEP 2: Project Form
export function ProjectForm({
  themeColor,
  onSubmit,
  isLoading,
  businessName,
}: {
  themeColor: string
  onSubmit: (data: CreateProjectState) => void
  isLoading: boolean
  businessName: string
}) {
  const [projectName, setProjectName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName) {
      onSubmit({ name: projectName })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="mb-3 p-3 bg-green-100 rounded">
        <p className="text-green-600 font-semibold">Business Profile Created!</p>
        <p className="text-xs text-gray-600">Company: {businessName}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
        Step 2: Create Project
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
            required
            disabled={isLoading}
            placeholder="Enter your project name"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be the main project for your WhatsApp business integration.
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
          disabled={isLoading || !projectName}
        >
          {isLoading ? 'Creating Project...' : 'Continue to WhatsApp Setup'}
        </button>
      </div>
    </form>
  )
}

// STEP 3: Embedded Signup Form
export function EmbeddedSignupForm({
  themeColor,
  onSubmit,
  isLoading,
  projectName,
}: {
  themeColor: string
  onSubmit: (data: EmbeddedSignupUrlState) => void
  isLoading: boolean
  projectName: string
}) {
  const [formData, setFormData] = useState<EmbeddedSignupUrlState>({
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

  const categories = [
    'Retail', 'E-commerce', 'Healthcare', 'Education', 'Technology',
    'Finance', 'Food & Beverage', 'Travel', 'Real Estate', 'Other'
  ]

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'India', 'Singapore', 'Japan', 'Brazil'
  ]

  const phoneCodes = [
    { code: 1, country: 'US/CA' },
    { code: 44, country: 'UK' },
    { code: 91, country: 'IN' },
    { code: 61, country: 'AU' },
    { code: 49, country: 'DE' },
    { code: 33, country: 'FR' },
    { code: 81, country: 'JP' },
    { code: 65, country: 'SG' },
    { code: 55, country: 'BR' },
  ]

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore',
    'Asia/Kolkata', 'Australia/Sydney'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone_code' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.business_name && formData.business_email && formData.display_name && formData.category) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="mb-3 p-3 bg-blue-100 rounded">
        <p className="text-blue-600 font-semibold">Project Created Successfully!</p>
        <p className="text-xs text-gray-600">Project: {projectName}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
        Step 3: WhatsApp Business Setup
      </h3>
      <div className="space-y-3">
        {/* Business Information */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Business Information</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business Name *</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business Email *</label>
              <input
                type="email"
                name="business_email"
                value={formData.business_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Display Name *</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                required
                disabled={isLoading}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone Code *</label>
              <select
                name="phone_code"
                value={formData.phone_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              >
                {phoneCodes.map(({ code, country }) => (
                  <option key={code} value={code}>+{code} ({country})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Address</h4>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
            <input
              type="text"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State/Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                name="zip_postal"
                value={formData.zip_postal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                disabled={isLoading}
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
            rows={2}
            disabled={isLoading}
            placeholder="Brief description of your business"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
          disabled={isLoading}
        >
          {isLoading ? 'Setting up WhatsApp...' : 'Complete Onboarding'}
        </button>
      </div>
    </form>
  )
}

// Success Card
export function OnboardingSuccessCard({
  themeColor,
  businessProfile,
  project,
  embeddedSignup,
}: {
  themeColor: string
  businessProfile: CreateBusinessProfileState
  project: CreateProjectState
  embeddedSignup: EmbeddedSignupUrlState
}) {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${themeColor}20` }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: themeColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Onboarding Complete!</h3>
        <p className="text-gray-600 mt-1">Your WhatsApp Business is ready</p>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Business Profile</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Company: {businessProfile.company}</p>
            <p>Email: {businessProfile.email}</p>
            <p>Contact: {businessProfile.contact}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Project</h4>
          <div className="text-sm text-gray-600">
            <p>Name: {project.name}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Business</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Business: {embeddedSignup.business_name}</p>
            <p>Category: {embeddedSignup.category}</p>
            <p>Location: {embeddedSignup.city}, {embeddedSignup.country}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main hook for onboarding workflow
export function useOnboardingWorkflow(themeColor: string, agentId: string) {
  const businessProfileRef = useRef<CreateBusinessProfileState | null>(null)
  const projectRef = useRef<CreateProjectState | null>(null)
  const embeddedSignupRef = useRef<EmbeddedSignupUrlState | null>(null)

  const [businessSubmitted, setBusinessSubmitted] = useState(false)
  const [projectSubmitted, setProjectSubmitted] = useState(false)
  const [embeddedSubmitted, setEmbeddedSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reset on agent change
  useEffect(() => {
    businessProfileRef.current = null
    projectRef.current = null
    embeddedSignupRef.current = null
    setBusinessSubmitted(false)
    setProjectSubmitted(false)
    setEmbeddedSubmitted(false)
    setIsLoading(false)
  }, [agentId])

  // STEP 1: Business Profile Form - called by backend when user starts onboarding
  useRenderToolCall(
    {
      name: 'show_onboarding_business_profile_form',
      description: 'Display business profile form as the first step of onboarding workflow. Call this when user wants to start onboarding.',
      render: ({ status }) => {
        console.log('[useRenderToolCall] show_onboarding_business_profile_form called, status:', status)

        if (status === 'executing' && !businessProfileRef.current) {
          // Reset subsequent steps
          projectRef.current = null
          embeddedSignupRef.current = null
          setProjectSubmitted(false)
          setEmbeddedSubmitted(false)
        }

        if (businessProfileRef.current) {
          console.log('[useRenderToolCall] Business profile already submitted, returning empty')
          return <></>
        }

        console.log('[useRenderToolCall] Rendering BusinessProfileForm')

        return (
          <BusinessProfileForm
            themeColor={themeColor}
            isLoading={isLoading}
            onSubmit={async (data) => {
              setIsLoading(true)
              try {
                businessProfileRef.current = data
                setBusinessSubmitted(true)
                sendMessageToChat(
                  `Business profile submitted: display_name=${data.display_name}, email=${data.email}, company=${data.company}, contact=${data.contact}, timezone=${data.timezone}, currency=${data.currency}, company_size=${data.company_size}`
                )
              } finally {
                setIsLoading(false)
              }
            }}
          />
        )
      },
    },
    [themeColor, businessSubmitted, isLoading]
  )

  // STEP 2: Project Form - called by backend after business profile is submitted
  useRenderToolCall(
    {
      name: 'show_onboarding_project_form',
      description: 'Display project creation form after business profile is complete. Call this after receiving business profile data.',
      parameters: [
        { name: 'company', type: 'string', required: false },
      ],
      render: ({ args, status }) => {
        console.log('[useRenderToolCall] show_onboarding_project_form called, status:', status, 'args:', args)
        const { company = '' } = args

        if (company && !businessProfileRef.current) {
          businessProfileRef.current = {
            display_name: '', email: '', company, contact: '', timezone: '', currency: '', company_size: '', password: ''
          }
        }

        if (projectRef.current) {
          return <></>
        }

        return (
          <ProjectForm
            themeColor={themeColor}
            isLoading={isLoading}
            businessName={businessProfileRef.current?.company || company}
            onSubmit={async (data) => {
              setIsLoading(true)
              try {
                projectRef.current = data
                setProjectSubmitted(true)
                const bp = businessProfileRef.current
                sendMessageToChat(
                  `Project created: name=${data.name}, business_company=${bp?.company || company}, business_email=${bp?.email || ''}`
                )
              } finally {
                setIsLoading(false)
              }
            }}
          />
        )
      },
    },
    [themeColor, projectSubmitted, isLoading]
  )

  // STEP 3: Embedded Signup Form - called by backend after project is created
  useRenderToolCall(
    {
      name: 'show_onboarding_embedded_signup_form',
      description: 'Display WhatsApp embedded signup form after project is created. Call this after receiving project data.',
      parameters: [
        { name: 'project_name', type: 'string', required: false },
      ],
      render: ({ args, status }) => {
        console.log('[useRenderToolCall] show_onboarding_embedded_signup_form called, status:', status, 'args:', args)
        const { project_name = '' } = args

        if (project_name && !projectRef.current) {
          projectRef.current = { name: project_name }
        }

        if (embeddedSignupRef.current) {
          return <></>
        }

        return (
          <EmbeddedSignupForm
            themeColor={themeColor}
            isLoading={isLoading}
            projectName={projectRef.current?.name || project_name}
            onSubmit={async (data) => {
              setIsLoading(true)
              try {
                embeddedSignupRef.current = data
                setEmbeddedSubmitted(true)
                const bp = businessProfileRef.current
                const proj = projectRef.current
                sendMessageToChat(
                  `WhatsApp setup completed: business_name=${data.business_name}, business_email=${data.business_email}, category=${data.category}, display_name=${data.display_name}, project=${proj?.name || project_name}, company=${bp?.company}`
                )
              } finally {
                setIsLoading(false)
              }
            }}
          />
        )
      },
    },
    [themeColor, embeddedSubmitted, isLoading]
  )

  // STEP 4: Success - called by backend after all data is collected
  useRenderToolCall(
    {
      name: 'show_onboarding_success',
      description: 'Display onboarding success message. Call this after all WhatsApp setup data is received.',
      parameters: [
        { name: 'company', type: 'string', required: false },
        { name: 'project_name', type: 'string', required: false },
        { name: 'business_name', type: 'string', required: false },
        { name: 'category', type: 'string', required: false },
      ],
      render: ({ args, status }) => {
        console.log('[useRenderToolCall] show_onboarding_success called, status:', status, 'args:', args)
        const {
          company = '',
          project_name = '',
          business_name = '',
          category = '',
        } = args

        const businessProfile: CreateBusinessProfileState = businessProfileRef.current || {
          display_name: '', email: '', company, contact: '', timezone: '', currency: '', company_size: '', password: ''
        }

        const project: CreateProjectState = projectRef.current || { name: project_name }

        const embeddedSignup: EmbeddedSignupUrlState = embeddedSignupRef.current || {
          business_name, business_email: '', phone_code: 1, website: '',
          street_address: '', city: '', state: '', zip_postal: '',
          country: '', timezone: '', display_name: '', category, description: ''
        }

        if (status === 'executing') {
          return (
            <div className="p-5 bg-orange-100 rounded-lg text-center">
              <p className="text-orange-600 font-semibold">Completing onboarding...</p>
              <p className="text-xs text-gray-600">Setting up your WhatsApp Business</p>
            </div>
          )
        }

        return (
          <OnboardingSuccessCard
            themeColor={themeColor}
            businessProfile={businessProfile}
            project={project}
            embeddedSignup={embeddedSignup}
          />
        )
      },
    },
    [themeColor]
  )
}
