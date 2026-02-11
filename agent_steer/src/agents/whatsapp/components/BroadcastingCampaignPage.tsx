import { useState, useRef, useCallback } from 'react'
import { useFrontendTool } from '@copilotkit/react-core'
import {
  FileSpreadsheet,
  ShieldCheck,
  Users,
  PenTool,
  Send,
  BarChart3,
  Upload,
  CheckCircle,
  X,
  FileText,
  AlertCircle,
  Clock,
  Loader2,
  Eye,
  Edit3,
  Smartphone,
} from 'lucide-react'
import { sendMessageToChat } from '../../shared/hooks/useChatHelpers'
import { BROADCAST_USER_ID } from '../config'

interface BroadcastingCampaignPageProps {
  themeColor: string
}

// ============================================
// WORKFLOW STEPS - matches backend state machine
// INITIALIZED → DATA_PROCESSING → COMPLIANCE_CHECK → SEGMENTATION → CONTENT_CREATION → READY_TO_SEND → SENDING → COMPLETED
// ============================================

const workflowSteps = [
  { id: 'data_processing', name: 'Data', description: 'Upload & validate contacts', icon: FileSpreadsheet },
  { id: 'compliance', name: 'Comply', description: 'Opt-in & health checks', icon: ShieldCheck },
  { id: 'segmentation', name: 'Segment', description: 'Audience targeting', icon: Users },
  { id: 'content_creation', name: 'Content', description: 'Template management', icon: PenTool },
  { id: 'ready_to_send', name: 'Send', description: 'Final confirmation', icon: Send },
  { id: 'analytics', name: 'Analytics', description: 'Performance metrics', icon: BarChart3 },
]

type StepId =
  | 'idle'
  | 'data_processing'
  | 'compliance'
  | 'segmentation'
  | 'content_creation'
  | 'template_preview'
  | 'pending_approval'
  | 'ready_to_send'
  | 'sending'
  | 'scheduled'
  | 'analytics'
  | 'complete'

// ============================================
// STEP 1: DATA PROCESSING FORM
// ============================================

function DataProcessingForm({
  themeColor,
  onSubmit,
  isLoading,
}: {
  themeColor: string
  onSubmit: (data: { file: File | null; fileName: string; contactCount: number; rawData: string[][] }) => void
  isLoading: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [parsedData, setParsedData] = useState<string[][]>([])
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setParseError('')
    setParsing(true)

    try {
      const text = await selectedFile.text()
      const ext = selectedFile.name.split('.').pop()?.toLowerCase()

      if (ext === 'csv') {
        const rows = text.split('\n').filter(r => r.trim()).map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')))
        setParsedData(rows)
      } else if (ext === 'xlsx' || ext === 'xls') {
        setParsedData([['Excel file uploaded - will be parsed by backend']])
      } else {
        setParseError('Unsupported file format. Please upload CSV or Excel (.xlsx/.xls) files.')
      }
    } catch {
      setParseError('Failed to read file. Please try again.')
    } finally {
      setParsing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const fakeEvent = { target: { files: [droppedFile] }, stopPropagation: () => {} } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(fakeEvent)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && parsedData.length > 0) {
      onSubmit({ file, fileName, contactCount: Math.max(parsedData.length - 1, 0), rawData: parsedData })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-opacity-70"
        style={{ borderColor: file ? themeColor : '#d1d5db', backgroundColor: file ? `${themeColor}08` : '#f9fafb' }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          data-form-field="true"
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8" style={{ color: themeColor }} />
            <div className="text-left">
              <p className="font-medium text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500">
                {parsedData.length > 0 ? `${parsedData.length - 1} contacts found` : 'Processing...'}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setFileName(''); setParsedData([]) }}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="font-medium text-gray-700">Drop your contact file here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Supports CSV, Excel (.xlsx, .xls)</p>
          </>
        )}
      </div>

      {parsing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Parsing file...
        </div>
      )}

      {parseError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {parseError}
        </div>
      )}

      {parsedData.length > 1 && !parseError && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">Preview (first 5 rows)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {parsedData[0]?.map((header, i) => (
                    <th key={i} className="px-3 py-2 text-left font-medium text-gray-600 border-b">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(1, 6).map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100 last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedData.length > 6 && (
            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
              ...and {parsedData.length - 6} more rows
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !file || parsedData.length === 0}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Processing contacts...' : 'Process & Validate Contacts'}
      </button>
    </form>
  )
}

// ============================================
// STEP 2: COMPLIANCE VIEW (auto-run by backend)
// ============================================

function ComplianceView({ themeColor }: { themeColor: string }) {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
          <p className="text-yellow-700 font-medium">Running Compliance Checks...</p>
        </div>
        <p className="text-sm text-yellow-600">The Compliance Agent is verifying opt-ins, suppression lists, time windows, and account health.</p>
      </div>
      <div className="space-y-2">
        {[
          'Opt-in verification (consent logs)',
          'Suppression list filtering',
          'Regional time window check (TRAI/GDPR)',
          'Account health & messaging tier',
        ].map((check, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: themeColor }} />
            <span className="text-sm text-gray-700">{check}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">Check the chat panel for real-time compliance results.</p>
    </div>
  )
}

// ============================================
// STEP 3: SEGMENTATION FORM
// ============================================

function SegmentationForm({
  themeColor,
  onSubmit,
  isLoading,
  contactCount,
}: {
  themeColor: string
  onSubmit: (data: { segments: string[]; filters: Record<string, string> }) => void
  isLoading: boolean
  contactCount: number
}) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [lifecycleFilter, setLifecycleFilter] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const segmentOptions = [
    { id: 'all', label: 'All Contacts', desc: `${contactCount} contacts` },
    { id: 'engaged', label: 'Engaged', desc: 'Active in last 30 days' },
    { id: 'new', label: 'New Subscribers', desc: 'Joined in last 7 days' },
    { id: 'at_risk', label: 'At Risk', desc: 'Declining engagement' },
    { id: 'dormant', label: 'Dormant', desc: 'No activity in 60+ days' },
  ]

  const toggleSegment = (id: string) => {
    setSelectedSegments(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      segments: selectedSegments.length > 0 ? selectedSegments : ['all'],
      filters: { tag: tagFilter, location: locationFilter, lifecycle: lifecycleFilter }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">Compliance Passed!</p>
        <p className="text-sm text-green-600">{contactCount} contacts ready for segmentation</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Segments</label>
        <div className="grid grid-cols-2 gap-3">
          {segmentOptions.map(seg => (
            <button
              key={seg.id}
              type="button"
              onClick={() => toggleSegment(seg.id)}
              className="p-3 border-2 rounded-lg text-left transition-all"
              style={{
                borderColor: selectedSegments.includes(seg.id) ? themeColor : '#e5e7eb',
                backgroundColor: selectedSegments.includes(seg.id) ? `${themeColor}08` : 'white',
              }}
            >
              <p className="font-medium text-gray-900 text-sm">{seg.label}</p>
              <p className="text-xs text-gray-500">{seg.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Filter</label>
          <input
            type="text" value={tagFilter}
            onChange={(e) => { e.stopPropagation(); setTagFilter(e.target.value) }}
            onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
            placeholder="e.g. VIP, premium"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text" value={locationFilter}
            onChange={(e) => { e.stopPropagation(); setLocationFilter(e.target.value) }}
            onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
            placeholder="e.g. Mumbai, Delhi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle</label>
          <select
            value={lifecycleFilter}
            onChange={(e) => { e.stopPropagation(); setLifecycleFilter(e.target.value) }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          >
            <option value="">All stages</option>
            <option value="new">New (&lt;7d)</option>
            <option value="engaged">Engaged (&lt;30d)</option>
            <option value="active">Active (&lt;60d)</option>
            <option value="at_risk">At Risk</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Segmenting audience...' : 'Apply Segmentation'}
      </button>
    </form>
  )
}

// ============================================
// STEP 4: CONTENT CREATION FORM
// ============================================

function ContentCreationForm({
  themeColor,
  onSubmit,
  isLoading,
}: {
  themeColor: string
  onSubmit: (data: { broadcastPurpose: string; category: string; language: string }) => void
  isLoading: boolean
}) {
  const [broadcastPurpose, setBroadcastPurpose] = useState('')
  const [category, setCategory] = useState('MARKETING')
  const [language, setLanguage] = useState('en_US')

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (broadcastPurpose.trim()) {
      onSubmit({ broadcastPurpose: broadcastPurpose.trim(), category, language })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 font-medium">Segmentation Complete!</p>
        <p className="text-sm text-blue-600">Audience segments ready. Describe what you want to broadcast and the AI will create a Meta-compliant template for you.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to broadcast? *</label>
        <textarea
          value={broadcastPurpose}
          onChange={(e) => { e.stopPropagation(); setBroadcastPurpose(e.target.value) }}
          onKeyDown={handleKeyDown} data-form-field="true"
          rows={4}
          placeholder="e.g. Announce our summer sale with 20% off all products, send investment report updates to clients, remind customers about their upcoming appointments..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          required disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">The AI agent will create the template name, header, body, footer, and buttons automatically</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => { e.stopPropagation(); setCategory(e.target.value) }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => { e.stopPropagation(); setLanguage(e.target.value) }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            <option value="en_US">English (US)</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !broadcastPurpose.trim()}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Creating template...' : 'Generate & Submit Template'}
      </button>
    </form>
  )
}

// ============================================
// TEMPLATE PREVIEW VIEW (WhatsApp-style)
// ============================================

interface TemplatePreviewData {
  templateName: string
  category: string
  language: string
  headerText?: string
  bodyText: string
  footerText?: string
  buttons?: string[]
}

function TemplatePreviewView({
  themeColor,
  preview,
  onConfirm,
  onEdit,
  isLoading,
}: {
  themeColor: string
  preview: TemplatePreviewData
  onConfirm: () => void
  onEdit: () => void
  isLoading: boolean
}) {
  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
        <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-blue-700 font-medium text-sm">Template Preview</p>
          <p className="text-xs text-blue-600">Review how your message will look on WhatsApp before submitting to Meta for approval.</p>
        </div>
      </div>

      {/* Template metadata */}
      <div className="flex gap-3 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">{preview.templateName}</span>
        <span className="px-2 py-1 bg-purple-50 rounded-full text-purple-600 font-medium">{preview.category}</span>
        <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">{preview.language}</span>
      </div>

      {/* WhatsApp phone mockup */}
      <div className="flex justify-center">
        <div className="w-[320px] bg-[#e5ddd5] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
          {/* WhatsApp header bar */}
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">WhatsApp Preview</p>
              <p className="text-white/70 text-[10px]">Template message</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="p-4 min-h-[200px]">
            {/* Message bubble */}
            <div className="bg-white rounded-lg rounded-tl-none shadow-sm p-3 max-w-[280px]">
              {/* Header */}
              {preview.headerText && (
                <p className="font-bold text-gray-900 text-sm mb-1">{preview.headerText}</p>
              )}

              {/* Body */}
              <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                {preview.bodyText.replace(/\{\{(\d+)\}\}/g, (_, n) => {
                  const samples = ['John', '12345', 'Product X', 'Company']
                  return `[${samples[parseInt(n) - 1] || `var${n}`}]`
                })}
              </p>

              {/* Footer */}
              {preview.footerText && (
                <p className="text-gray-400 text-[11px] mt-2">{preview.footerText}</p>
              )}

              {/* Timestamp */}
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-gray-400">10:30 AM</span>
              </div>
            </div>

            {/* Buttons (outside bubble, WhatsApp style) */}
            {preview.buttons && preview.buttons.length > 0 && (
              <div className="mt-1 max-w-[280px] space-y-1">
                {preview.buttons.map((btn, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm py-2 text-center">
                    <span className="text-[#00a5f4] text-sm font-medium">{btn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          disabled={isLoading}
          className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Edit3 className="w-4 h-4" />
          Change
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-3 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit to Meta
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ============================================
// PENDING APPROVAL VIEW
// ============================================

function PendingApprovalView({
  themeColor,
  templateInfo,
  onCheckStatus,
}: {
  themeColor: string
  templateInfo: { templateId: string; templateName: string; status: string; rejectedReason?: string } | null
  onCheckStatus: () => void
}) {
  const status = templateInfo?.status || 'PENDING'
  const isPending = status === 'PENDING'
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'

  return (
    <div className="space-y-5">
      {/* Animated waiting visual */}
      <div className="flex flex-col items-center py-8">
        <div className="relative mb-6">
          {/* Outer pulsing ring */}
          {isPending && (
            <div className="absolute inset-0 w-20 h-20 rounded-full animate-ping opacity-20" style={{ backgroundColor: themeColor }} />
          )}
          {/* Inner circle */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isApproved ? 'bg-green-100' : isRejected ? 'bg-red-100' : 'bg-amber-100'
            }`}
          >
            {isPending && <Clock className="w-8 h-8 text-amber-600 animate-pulse" />}
            {isApproved && <CheckCircle className="w-8 h-8 text-green-600" />}
            {isRejected && <AlertCircle className="w-8 h-8 text-red-600" />}
          </div>
        </div>

        <h3 className={`text-lg font-semibold ${isApproved ? 'text-green-700' : isRejected ? 'text-red-700' : 'text-amber-700'}`}>
          {isPending && 'Waiting for Meta Approval...'}
          {isApproved && 'Template Approved!'}
          {isRejected && 'Template Rejected'}
        </h3>

        <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
          {isPending && 'Your template has been submitted to WhatsApp (Meta) for review. The agent is actively monitoring status.'}
          {isApproved && 'Your template has been approved by Meta. Proceeding to final review...'}
          {isRejected && (templateInfo?.rejectedReason || 'Check the chat panel for rejection details and suggested fixes.')}
        </p>
      </div>

      {/* Template info card */}
      {templateInfo && (templateInfo.templateId || templateInfo.templateName) && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {templateInfo.templateName && (
                <p className="text-sm font-medium text-gray-900">Template: {templateInfo.templateName}</p>
              )}
              {templateInfo.templateId && (
                <p className="text-xs text-gray-400 mt-0.5">ID: {templateInfo.templateId}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isApproved ? 'bg-green-100 text-green-700' :
              isRejected ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {status}
            </span>
          </div>
        </div>
      )}

      {/* Polling indicator for pending */}
      {isPending && (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="flex gap-1">
            {[0, 150, 300].map(delay => (
              <div
                key={delay}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: themeColor, animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">Polling template status...</p>
        </div>
      )}

      {/* Check Status button */}
      {isPending && (
        <button
          onClick={onCheckStatus}
          className="w-full py-3 font-medium rounded-lg border-2 transition-colors hover:bg-gray-50"
          style={{ borderColor: themeColor, color: themeColor }}
        >
          Check Status Now
        </button>
      )}

      {/* Approved auto-transition message */}
      {isApproved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-600">Auto-redirecting to final review...</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// STEP 5: READY TO SEND / DELIVERY
// ============================================

function ReadyToSendView({
  themeColor,
  onConfirm,
  isLoading,
}: {
  themeColor: string
  onConfirm: (action: 'send' | 'cancel') => void
  isLoading: boolean
}) {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-medium">Ready to Send!</p>
        </div>
        <p className="text-sm text-green-600">All checks passed. Template approved. Review the summary in chat and confirm.</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">The broadcast summary is shown in the chat panel. Review contacts, template, and segments before confirming.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onConfirm('cancel')}
          disabled={isLoading}
          className="py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel Broadcast
        </button>
        <button
          onClick={() => onConfirm('send')}
          disabled={isLoading}
          className="py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          {isLoading ? 'Sending...' : 'Confirm & Send'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// SENDING VIEW
// ============================================

function SendingView() {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <p className="text-blue-700 font-medium">Broadcasting in Progress...</p>
        </div>
        <p className="text-sm text-blue-600">The Delivery Agent is dispatching messages. Check chat for real-time progress.</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Queued', color: '#6b7280' },
          { label: 'Sent', color: '#3b82f6' },
          { label: 'Delivered', color: '#22c55e' },
          { label: 'Failed', color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <p className="text-2xl font-bold" style={{ color: m.color }}>---</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">Live delivery stats are shown in the chat panel.</p>
    </div>
  )
}

// ============================================
// SCHEDULED VIEW
// ============================================

function ScheduledView() {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <p className="text-indigo-700 font-medium">Broadcast Scheduled</p>
        </div>
        <p className="text-sm text-indigo-600">Your broadcast passed compliance but is outside the allowed sending window. It has been scheduled for the next valid time.</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">Check the chat panel for the exact scheduled time. You can cancel at any time.</p>
      </div>
    </div>
  )
}

// ============================================
// STEP 6: ANALYTICS VIEW
// ============================================

function AnalyticsView({
  themeColor,
  onComplete,
}: {
  themeColor: string
  onComplete: () => void
}) {
  return (
    <div className="space-y-5">
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">Broadcast Complete!</p>
        <p className="text-sm text-green-600">Messages have been processed. Analytics are being generated.</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sent', color: '#3b82f6' },
          { label: 'Delivered', color: '#22c55e' },
          { label: 'Read', color: '#a855f7' },
          { label: 'Failed', color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <p className="text-2xl font-bold" style={{ color: m.color }}>---</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">The Analytics Agent is generating detailed metrics and optimization recommendations in the chat panel.</p>
      </div>
      <button
        onClick={onComplete}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors"
        style={{ backgroundColor: themeColor }}
      >
        Complete Campaign
      </button>
    </div>
  )
}

// ============================================
// CAMPAIGN SUCCESS
// ============================================

function CampaignSuccess({ themeColor, onReset }: { themeColor: string; onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <CheckCircle className="w-10 h-10" style={{ color: themeColor }} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Campaign Complete!</h3>
      <p className="text-gray-600 mb-6">Your broadcast has been successfully processed.</p>
      <button
        onClick={onReset}
        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Start New Campaign
      </button>
    </div>
  )
}

// ============================================
// MAIN BROADCASTING CAMPAIGN PAGE
// ============================================

export function BroadcastingCampaignPage({ themeColor }: BroadcastingCampaignPageProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // Template approval tracking
  const [templateInfo, setTemplateInfo] = useState<{
    templateId: string
    templateName: string
    status: string
    rejectedReason?: string
  } | null>(null)

  // Template preview data (agent generates, user reviews before submit)
  const [templatePreview, setTemplatePreview] = useState<TemplatePreviewData | null>(null)

  const contactCountRef = useRef(0)

  const goToStep = useCallback((step: StepId) => {
    setCurrentStep(step)
    setIsLoading(false)
    setLoadingMessage('')
  }, [])

  // ---- Frontend tools matching backend state machine phases ----

  useFrontendTool({
    name: 'display_data_processing_form',
    description: 'Show the data processing form (Step 1). Call after broadcast initialization to let user upload contacts.',
    parameters: [],
    handler() { goToStep('data_processing') },
  })

  useFrontendTool({
    name: 'display_compliance_view',
    description: 'Show the compliance check view (Step 2). Call when entering COMPLIANCE_CHECK phase.',
    parameters: [],
    handler() { goToStep('compliance') },
  })

  useFrontendTool({
    name: 'display_segmentation_form',
    description: 'Show the segmentation form (Step 3). Call when entering SEGMENTATION phase after compliance passes.',
    parameters: [],
    handler() { goToStep('segmentation') },
  })

  useFrontendTool({
    name: 'display_content_creation_form',
    description: 'Show the content creation form (Step 4). Call when entering CONTENT_CREATION phase.',
    parameters: [],
    handler() { goToStep('content_creation') },
  })

  useFrontendTool({
    name: 'display_template_preview',
    description: 'Show a WhatsApp-style preview of the generated template. Call AFTER generating template components but BEFORE calling submit_template. The user will review and either confirm (submit) or request changes.',
    parameters: [
      { name: 'template_name', type: 'string', description: 'Template name (lowercase_underscores)', required: true },
      { name: 'category', type: 'string', description: 'MARKETING, UTILITY, or AUTHENTICATION', required: true },
      { name: 'language', type: 'string', description: 'Language code e.g. en_US', required: true },
      { name: 'header_text', type: 'string', description: 'Header text (empty if no header)', required: false },
      { name: 'body_text', type: 'string', description: 'Body text with {{1}} variables', required: true },
      { name: 'footer_text', type: 'string', description: 'Footer text (empty if no footer)', required: false },
      { name: 'buttons', type: 'string', description: 'Comma-separated button labels (empty if no buttons)', required: false },
    ],
    handler({ template_name, category, language, header_text, body_text, footer_text, buttons }: {
      template_name: string; category: string; language: string;
      header_text?: string; body_text: string; footer_text?: string; buttons?: string
    }) {
      setTemplatePreview({
        templateName: template_name,
        category,
        language,
        headerText: header_text || undefined,
        bodyText: body_text,
        footerText: footer_text || undefined,
        buttons: buttons ? buttons.split(',').map(b => b.trim()).filter(Boolean) : undefined,
      })
      goToStep('template_preview')
    },
  })

  useFrontendTool({
    name: 'display_pending_approval',
    description: 'Show the pending approval view. Call when template is pending WhatsApp approval. Pass template_id and template_name so the frontend can track status.',
    parameters: [
      { name: 'template_id', type: 'string', description: 'The WhatsApp template ID being monitored', required: false },
      { name: 'template_name', type: 'string', description: 'The template name submitted', required: false },
    ],
    handler({ template_id, template_name }: { template_id?: string; template_name?: string }) {
      setTemplateInfo({
        templateId: template_id || '',
        templateName: template_name || '',
        status: 'PENDING',
      })
      goToStep('pending_approval')
    },
  })

  // Backend calls this to push real-time template status updates
  useFrontendTool({
    name: 'update_template_status',
    description: 'Update the template approval status on the frontend. Call whenever template status changes (PENDING, APPROVED, REJECTED). If APPROVED, frontend will auto-transition to ready_to_send.',
    parameters: [
      { name: 'template_id', type: 'string', description: 'Template ID', required: true },
      { name: 'status', type: 'string', description: 'New status: PENDING, APPROVED, REJECTED, PAUSED, DISABLED', required: true },
      { name: 'rejected_reason', type: 'string', description: 'Rejection reason if status is REJECTED', required: false },
    ],
    handler({ template_id, status, rejected_reason }: { template_id: string; status: string; rejected_reason?: string }) {
      setTemplateInfo(prev => ({
        templateId: template_id || prev?.templateId || '',
        templateName: prev?.templateName || '',
        status: status,
        rejectedReason: rejected_reason,
      }))
      // Auto-transition to ready_to_send when APPROVED
      if (status === 'APPROVED') {
        setTimeout(() => goToStep('ready_to_send'), 1500)
      }
    },
  })

  useFrontendTool({
    name: 'display_ready_to_send',
    description: 'Show the ready to send view (Step 5). Call when entering READY_TO_SEND phase for final confirmation. Only call AFTER template is confirmed APPROVED via get_template_by_id.',
    parameters: [],
    handler() { goToStep('ready_to_send') },
  })

  useFrontendTool({
    name: 'display_sending_view',
    description: 'Show the sending progress view. Call when entering SENDING phase.',
    parameters: [],
    handler() { goToStep('sending') },
  })

  useFrontendTool({
    name: 'display_scheduled_view',
    description: 'Show the scheduled view. Call when broadcast is scheduled due to time window restriction.',
    parameters: [],
    handler() { goToStep('scheduled') },
  })

  useFrontendTool({
    name: 'display_analytics_view',
    description: 'Show the analytics view (Step 6). Call when entering COMPLETED phase.',
    parameters: [],
    handler() { goToStep('analytics') },
  })

  useFrontendTool({
    name: 'display_campaign_complete',
    description: 'Show the campaign complete success screen.',
    parameters: [],
    handler() { goToStep('complete') },
  })

  // ---- Form submission handlers ----

  const handleDataProcessingSubmit = (data: { file: File | null; fileName: string; contactCount: number; rawData: string[][] }) => {
    setIsLoading(true)
    setLoadingMessage('Processing contacts...')
    contactCountRef.current = data.contactCount

    // Extract phone numbers from CSV for backend
    const phoneColumnIndex = data.rawData[0]?.findIndex(h =>
      /phone|mobile|number|contact/i.test(h)
    ) ?? 0
    const phones = data.rawData.slice(1).map(row => row[phoneColumnIndex] || '').filter(Boolean)

    const message = `Broadcasting: user_id=${BROADCAST_USER_ID}, Contacts extracted from CSV "${data.fileName}". Total: ${data.contactCount}. Call process_broadcast_contacts with these phone_numbers: ${JSON.stringify(phones.slice(0, 50))}${phones.length > 50 ? `... and ${phones.length - 50} more` : ''}. Do NOT ask for the file again - the numbers are already extracted above.`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleSegmentationSubmit = (data: { segments: string[]; filters: Record<string, string> }) => {
    setIsLoading(true)
    setLoadingMessage('Applying segmentation...')
    const message = `Broadcasting: user_id=${BROADCAST_USER_ID}, Segmentation applied. Segments: ${data.segments.join(', ')}. Filters - tag: ${data.filters.tag || 'none'}, location: ${data.filters.location || 'none'}, lifecycle: ${data.filters.lifecycle || 'all'}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleContentCreationSubmit = (data: { broadcastPurpose: string; category: string; language: string }) => {
    setIsLoading(true)
    setLoadingMessage('Creating template...')

    const message = `Broadcasting: user_id=${BROADCAST_USER_ID}, CREATE TEMPLATE NOW.
The user wants to broadcast the following:
"${data.broadcastPurpose}"

Category: ${data.category}
Language: ${data.language}

Create a Meta-compliant WhatsApp template for this broadcast. Generate the template name, header, body (with personalization variables like {{1}} for name), footer (with opt-out for MARKETING), and buttons as appropriate. Then call display_template_preview to show it to the user. Do NOT submit yet — wait for user to confirm the preview first.`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handlePreviewConfirm = () => {
    if (!templatePreview) return
    setIsLoading(true)
    setLoadingMessage('Submitting template to Meta...')
    const message = `Broadcasting: user_id=${BROADCAST_USER_ID}, CONFIRM TEMPLATE SUBMIT. The user approved the preview. Submit the template now using submit_template with the exact details you generated. Then proceed to STEP 3 (approval workflow).`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handlePreviewEdit = () => {
    setTemplatePreview(null)
    goToStep('content_creation')
  }

  const handleReadyToSendConfirm = (action: 'send' | 'cancel') => {
    setIsLoading(true)
    setLoadingMessage(action === 'send' ? 'Initiating broadcast...' : 'Cancelling...')
    const message = action === 'send'
      ? `Broadcasting: user_id=${BROADCAST_USER_ID}, User confirmed. Send the broadcast now.`
      : `Broadcasting: user_id=${BROADCAST_USER_ID}, User cancelled the broadcast.`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleReset = () => {
    setCurrentStep('idle')
    contactCountRef.current = 0
  }

  // ---- Progress indicator ----
  const getStepIndex = () => {
    const stepMap: Record<string, number> = {
      data_processing: 0, compliance: 1, segmentation: 2,
      content_creation: 3, template_preview: 3, pending_approval: 3,
      ready_to_send: 4, sending: 4, scheduled: 4,
      analytics: 5, complete: 6,
    }
    return stepMap[currentStep] ?? -1
  }
  const stepIndex = getStepIndex()

  // ---- Step header helper ----
  const StepHeader = ({ icon: Icon, stepNum, title, subtitle }: { icon: typeof FileSpreadsheet; stepNum: number; title: string; subtitle: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
        <Icon className="w-5 h-5" style={{ color: themeColor }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Step {stepNum}: {title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 p-6 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Broadcasting Campaign</h2>
          <p className="text-gray-600 mt-1">Create and send WhatsApp broadcast messages</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      index <= stepIndex ? 'text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{ backgroundColor: index <= stepIndex ? themeColor : undefined }}
                  >
                    {index < stepIndex || currentStep === 'complete' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-xs font-medium ${index <= stepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.name}
                    </p>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div
                      className={`h-0.5 rounded-full ${index < stepIndex ? '' : 'bg-gray-200'}`}
                      style={{ backgroundColor: index < stepIndex ? themeColor : undefined }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <div className="mb-4 flex justify-center gap-2">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: themeColor, animationDelay: `${delay}ms` }} />
                  ))}
                </div>
                <p className="text-lg font-medium text-gray-900">{loadingMessage}</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we process your request</p>
              </div>
            </div>
          )}

          {currentStep === 'idle' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${themeColor}15` }}>
                <FileSpreadsheet className="w-10 h-10" style={{ color: themeColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Create a Campaign?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Click <strong>"New Campaign"</strong> in the chat panel to start your broadcasting workflow.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Waiting for campaign to start...</span>
              </div>
            </div>
          )}

          {currentStep === 'data_processing' && (
            <div>
              <StepHeader icon={FileSpreadsheet} stepNum={1} title="Data Processing" subtitle="Upload your contact list (Excel/CSV)" />
              <DataProcessingForm themeColor={themeColor} onSubmit={handleDataProcessingSubmit} isLoading={isLoading} />
            </div>
          )}

          {currentStep === 'compliance' && (
            <div>
              <StepHeader icon={ShieldCheck} stepNum={2} title="Compliance Check" subtitle="Opt-in, suppression, time windows, account health" />
              <ComplianceView themeColor={themeColor} />
            </div>
          )}

          {currentStep === 'segmentation' && (
            <div>
              <StepHeader icon={Users} stepNum={3} title="Segmentation & Targeting" subtitle="Define your target audience segments" />
              <SegmentationForm themeColor={themeColor} onSubmit={handleSegmentationSubmit} isLoading={isLoading} contactCount={contactCountRef.current} />
            </div>
          )}

          {currentStep === 'content_creation' && (
            <div>
              <StepHeader icon={PenTool} stepNum={4} title="Content Creation" subtitle="Create or select a WhatsApp template" />
              <ContentCreationForm themeColor={themeColor} onSubmit={handleContentCreationSubmit} isLoading={isLoading} />
            </div>
          )}

          {currentStep === 'template_preview' && templatePreview && (
            <div>
              <StepHeader icon={Eye} stepNum={4} title="Template Preview" subtitle="Review your WhatsApp message before submitting" />
              <TemplatePreviewView
                themeColor={themeColor}
                preview={templatePreview}
                onConfirm={handlePreviewConfirm}
                onEdit={handlePreviewEdit}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentStep === 'pending_approval' && (
            <div>
              <StepHeader icon={Clock} stepNum={4} title="Pending Approval" subtitle="Waiting for WhatsApp template review" />
              <PendingApprovalView
                themeColor={themeColor}
                templateInfo={templateInfo}
                onCheckStatus={() => {
                  sendMessageToChat(`Broadcasting: user_id=${BROADCAST_USER_ID}, Check template status now. Template ID: ${templateInfo?.templateId || 'unknown'}`)
                }}
              />
            </div>
          )}

          {currentStep === 'ready_to_send' && (
            <div>
              <StepHeader icon={Send} stepNum={5} title="Review & Send" subtitle="Final confirmation before broadcasting" />
              <ReadyToSendView themeColor={themeColor} onConfirm={handleReadyToSendConfirm} isLoading={isLoading} />
            </div>
          )}

          {currentStep === 'sending' && (
            <div>
              <StepHeader icon={Send} stepNum={5} title="Sending" subtitle="Messages being dispatched" />
              <SendingView />
            </div>
          )}

          {currentStep === 'scheduled' && (
            <div>
              <StepHeader icon={Clock} stepNum={5} title="Scheduled" subtitle="Broadcast waiting for valid send window" />
              <ScheduledView />
            </div>
          )}

          {currentStep === 'analytics' && (
            <div>
              <StepHeader icon={BarChart3} stepNum={6} title="Analytics & Optimization" subtitle="Broadcast performance metrics" />
              <AnalyticsView themeColor={themeColor} onComplete={() => goToStep('complete')} />
            </div>
          )}

          {currentStep === 'complete' && (
            <CampaignSuccess themeColor={themeColor} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  )
}
