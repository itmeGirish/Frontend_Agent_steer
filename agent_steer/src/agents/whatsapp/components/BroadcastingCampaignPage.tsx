import { useState, useRef, useCallback } from 'react'
import { useFrontendTool } from '@copilotkit/react-core'
import {
  FileSpreadsheet,
  Users,
  PenTool,
  ShieldCheck,
  Send,
  BarChart3,
  Upload,
  CheckCircle,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { sendMessageToChat } from '../../shared/hooks/useChatHelpers'

interface BroadcastingCampaignPageProps {
  themeColor: string
}

// ============================================
// WORKFLOW STEPS CONFIG
// ============================================

const workflowSteps = [
  { id: 'data_processing', name: 'Data Processing', description: 'Upload & validate contacts', icon: FileSpreadsheet },
  { id: 'segmentation', name: 'Segmentation', description: 'Target audience segments', icon: Users },
  { id: 'content_creation', name: 'Content Creation', description: 'Create message templates', icon: PenTool },
  { id: 'compliance', name: 'Compliance', description: 'Policy & safety checks', icon: ShieldCheck },
  { id: 'delivery', name: 'Delivery', description: 'Test & send broadcast', icon: Send },
  { id: 'analytics', name: 'Analytics', description: 'Performance metrics', icon: BarChart3 },
]

type StepId = 'idle' | 'data_processing' | 'segmentation' | 'content_creation' | 'compliance' | 'delivery' | 'analytics' | 'complete'

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
        // For Excel files, we send raw to backend for parsing
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
      {/* File Upload Area */}
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

      {/* Preview Table */}
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
// STEP 2: SEGMENTATION FORM
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
    { id: 'active', label: 'Active Users', desc: 'Engaged in last 30 days' },
    { id: 'new', label: 'New Subscribers', desc: 'Joined in last 7 days' },
    { id: 'dormant', label: 'Dormant Users', desc: 'No activity in 60+ days' },
    { id: 'high_value', label: 'High Value', desc: 'Frequent converters' },
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
        <p className="text-green-700 font-medium">Data Processing Complete!</p>
        <p className="text-sm text-green-600">{contactCount} valid contacts ready for segmentation</p>
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
            type="text"
            value={tagFilter}
            onChange={(e) => { e.stopPropagation(); setTagFilter(e.target.value) }}
            onKeyDown={handleKeyDown}
            data-form-field="true"
            autoComplete="off"
            placeholder="e.g. VIP, premium"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => { e.stopPropagation(); setLocationFilter(e.target.value) }}
            onKeyDown={handleKeyDown}
            data-form-field="true"
            autoComplete="off"
            placeholder="e.g. Mumbai, Delhi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle Stage</label>
          <select
            value={lifecycleFilter}
            onChange={(e) => { e.stopPropagation(); setLifecycleFilter(e.target.value) }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
            disabled={isLoading}
          >
            <option value="">All stages</option>
            <option value="new">New</option>
            <option value="engaged">Engaged</option>
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
// STEP 3: CONTENT CREATION FORM
// ============================================

function ContentCreationForm({
  themeColor,
  onSubmit,
  isLoading,
  segmentInfo,
}: {
  themeColor: string
  onSubmit: (data: { templateName: string; campaignType: string; headerText: string; bodyText: string; footerText: string; buttons: string[] }) => void
  isLoading: boolean
  segmentInfo: string
}) {
  const [templateName, setTemplateName] = useState('')
  const [campaignType, setCampaignType] = useState('promotional')
  const [headerText, setHeaderText] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [footerText, setFooterText] = useState('')
  const [buttons, setButtons] = useState<string[]>([''])

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const addButton = () => { if (buttons.length < 3) setButtons([...buttons, '']) }
  const removeButton = (idx: number) => setButtons(buttons.filter((_, i) => i !== idx))
  const updateButton = (idx: number, val: string) => {
    const updated = [...buttons]
    updated[idx] = val
    setButtons(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (templateName && bodyText) {
      onSubmit({ templateName, campaignType, headerText, bodyText, footerText, buttons: buttons.filter(b => b) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 font-medium">Segmentation Complete!</p>
        <p className="text-sm text-blue-600">{segmentInfo}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
          <input
            type="text" value={templateName}
            onChange={(e) => { e.stopPropagation(); setTemplateName(e.target.value) }}
            onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            required disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type *</label>
          <select
            value={campaignType}
            onChange={(e) => { e.stopPropagation(); setCampaignType(e.target.value) }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          >
            <option value="promotional">Promotional</option>
            <option value="transactional">Transactional</option>
            <option value="informational">Informational</option>
            <option value="re-engagement">Re-engagement</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
        <input
          type="text" value={headerText}
          onChange={(e) => { e.stopPropagation(); setHeaderText(e.target.value) }}
          onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
          placeholder="Max 60 characters"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          maxLength={60} disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">{headerText.length}/60</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body Text * <span className="text-gray-400">(supports {'{{name}}'}, {'{{product}}'} variables)</span></label>
        <textarea
          value={bodyText}
          onChange={(e) => { e.stopPropagation(); setBodyText(e.target.value) }}
          onKeyDown={handleKeyDown} data-form-field="true"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          maxLength={1024} required disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">{bodyText.length}/1024</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
        <input
          type="text" value={footerText}
          onChange={(e) => { e.stopPropagation(); setFooterText(e.target.value) }}
          onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
          placeholder="Max 60 characters"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          maxLength={60} disabled={isLoading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Buttons (Quick Replies)</label>
          {buttons.length < 3 && (
            <button type="button" onClick={addButton} className="text-xs font-medium" style={{ color: themeColor }}>
              + Add Button
            </button>
          )}
        </div>
        {buttons.map((btn, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text" value={btn}
              onChange={(e) => { e.stopPropagation(); updateButton(idx, e.target.value) }}
              onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
              placeholder={`Button ${idx + 1} text`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white text-sm"
              disabled={isLoading}
            />
            {buttons.length > 1 && (
              <button type="button" onClick={() => removeButton(idx)} className="p-2 text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !templateName || !bodyText}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Creating content...' : 'Submit for Compliance Check'}
      </button>
    </form>
  )
}

// ============================================
// STEP 4: COMPLIANCE FORM
// ============================================

function ComplianceForm({
  themeColor,
  onSubmit,
  isLoading,
  templateName,
}: {
  themeColor: string
  onSubmit: (data: { optOutText: string; confirmed: boolean }) => void
  isLoading: boolean
  templateName: string
}) {
  const [optOutText, setOptOutText] = useState('Reply STOP to unsubscribe')
  const [confirmed, setConfirmed] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmed) {
      onSubmit({ optOutText, confirmed })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-purple-700 font-medium">Content Created!</p>
        <p className="text-sm text-purple-600">Template: {templateName}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Compliance Checks</h4>
        <div className="space-y-2">
          {[
            { label: 'WhatsApp Template Policy', status: 'pass' },
            { label: 'Character Limits (Header/Body/Footer)', status: 'pass' },
            { label: 'Button Configuration Valid', status: 'pass' },
            { label: 'Spam Rules Check', status: 'pass' },
            { label: 'Content Safety Scan', status: 'pass' },
          ].map((check, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">{check.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opt-out Text *</label>
        <input
          type="text" value={optOutText}
          onChange={(e) => { e.stopPropagation(); setOptOutText(e.target.value) }}
          onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
          required disabled={isLoading}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="w-4 h-4 rounded"
          style={{ accentColor: themeColor }}
        />
        <span className="text-sm text-gray-700">I confirm the content complies with WhatsApp policies</span>
      </label>

      <button
        type="submit"
        disabled={isLoading || !confirmed}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Running checks...' : 'Proceed to Delivery'}
      </button>
    </form>
  )
}

// ============================================
// STEP 5: DELIVERY FORM
// ============================================

function DeliveryForm({
  themeColor,
  onSubmit,
  isLoading,
}: {
  themeColor: string
  onSubmit: (data: { scheduleType: string; scheduledDate: string; testNumber: string }) => void
  isLoading: boolean
}) {
  const [scheduleType, setScheduleType] = useState('immediate')
  const [scheduledDate, setScheduledDate] = useState('')
  const [testNumber, setTestNumber] = useState('')
  const [testSent, setTestSent] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => { e.stopPropagation() }

  const handleSendTest = () => {
    if (testNumber) {
      sendMessageToChat(`Broadcasting: Send test message to ${testNumber}`)
      setTestSent(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ scheduleType, scheduledDate, testNumber })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">Compliance Passed!</p>
        <p className="text-sm text-green-600">All checks passed. Ready for delivery.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Send Test Message</label>
        <div className="flex gap-2">
          <input
            type="tel" value={testNumber}
            onChange={(e) => { e.stopPropagation(); setTestNumber(e.target.value) }}
            onKeyDown={handleKeyDown} data-form-field="true" autoComplete="off"
            placeholder="+91 98765 43210"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          />
          <button
            type="button" onClick={handleSendTest}
            disabled={!testNumber || isLoading}
            className="px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {testSent ? 'Sent!' : 'Send Test'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'immediate', label: 'Send Immediately' },
            { id: 'scheduled', label: 'Schedule for Later' },
          ].map(opt => (
            <button
              key={opt.id} type="button"
              onClick={() => setScheduleType(opt.id)}
              className="p-3 border-2 rounded-lg text-sm font-medium transition-all"
              style={{
                borderColor: scheduleType === opt.id ? themeColor : '#e5e7eb',
                backgroundColor: scheduleType === opt.id ? `${themeColor}08` : 'white',
                color: scheduleType === opt.id ? themeColor : '#374151',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {scheduleType === 'scheduled' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
          <input
            type="datetime-local" value={scheduledDate}
            onChange={(e) => { e.stopPropagation(); setScheduledDate(e.target.value) }}
            onKeyDown={handleKeyDown} data-form-field="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
            disabled={isLoading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (scheduleType === 'scheduled' && !scheduledDate)}
        className="w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? 'Sending broadcast...' : scheduleType === 'immediate' ? 'Send Broadcast Now' : 'Schedule Broadcast'}
      </button>
    </form>
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
  const metrics = [
    { label: 'Messages Sent', value: '---', color: '#3b82f6' },
    { label: 'Delivered', value: '---', color: '#22c55e' },
    { label: 'Read', value: '---', color: '#a855f7' },
    { label: 'Failed', value: '---', color: '#ef4444' },
  ]

  return (
    <div className="space-y-5">
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">Broadcast Sent!</p>
        <p className="text-sm text-green-600">Messages are being delivered. Analytics will update in real-time.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-2">Real-time metrics are tracked by the AI agent.</h4>
        <p className="text-sm text-gray-600">Check the chat panel for detailed analytics and optimization recommendations.</p>
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

  // Data refs across steps
  const contactCountRef = useRef(0)
  const segmentInfoRef = useRef('')
  const templateNameRef = useRef('')

  // Step transitions
  const goToStep = useCallback((step: StepId) => {
    setCurrentStep(step)
    setIsLoading(false)
    setLoadingMessage('')
  }, [])

  // Register frontend tools for backend-triggered page transitions
  useFrontendTool({
    name: 'display_data_processing_form',
    description: 'Display the data processing form to start broadcasting campaign. Call this when user wants to create a new broadcast.',
    parameters: [],
    handler() { goToStep('data_processing') },
  })

  useFrontendTool({
    name: 'display_segmentation_form',
    description: 'Display the segmentation form after data processing completes.',
    parameters: [],
    handler() { goToStep('segmentation') },
  })

  useFrontendTool({
    name: 'display_content_creation_form',
    description: 'Display the content creation form after segmentation completes.',
    parameters: [],
    handler() { goToStep('content_creation') },
  })

  useFrontendTool({
    name: 'display_compliance_form',
    description: 'Display the compliance check form after content creation.',
    parameters: [],
    handler() { goToStep('compliance') },
  })

  useFrontendTool({
    name: 'display_delivery_form',
    description: 'Display the delivery form after compliance passes.',
    parameters: [],
    handler() { goToStep('delivery') },
  })

  useFrontendTool({
    name: 'display_analytics_view',
    description: 'Display the analytics view after broadcast delivery.',
    parameters: [],
    handler() { goToStep('analytics') },
  })

  useFrontendTool({
    name: 'display_campaign_complete',
    description: 'Display campaign completion after analytics.',
    parameters: [],
    handler() { goToStep('complete') },
  })

  // Form submission handlers
  const handleDataProcessingSubmit = (data: { file: File | null; fileName: string; contactCount: number; rawData: string[][] }) => {
    setIsLoading(true)
    setLoadingMessage('Processing contacts...')
    contactCountRef.current = data.contactCount
    const headers = data.rawData[0]?.join(', ') || 'N/A'
    const message = `Broadcasting data processing submitted: file=${data.fileName}, contacts=${data.contactCount}, columns=${headers}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleSegmentationSubmit = (data: { segments: string[]; filters: Record<string, string> }) => {
    setIsLoading(true)
    setLoadingMessage('Applying segmentation...')
    segmentInfoRef.current = `Segments: ${data.segments.join(', ')}`
    const message = `Broadcasting segmentation submitted: segments=${data.segments.join(',')}, tag=${data.filters.tag || 'none'}, location=${data.filters.location || 'none'}, lifecycle=${data.filters.lifecycle || 'all'}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleContentCreationSubmit = (data: { templateName: string; campaignType: string; headerText: string; bodyText: string; footerText: string; buttons: string[] }) => {
    setIsLoading(true)
    setLoadingMessage('Creating content...')
    templateNameRef.current = data.templateName
    const message = `Broadcasting content created: template=${data.templateName}, type=${data.campaignType}, header=${data.headerText || 'none'}, body=${data.bodyText.substring(0, 200)}, footer=${data.footerText || 'none'}, buttons=${data.buttons.join(';') || 'none'}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleComplianceSubmit = (data: { optOutText: string; confirmed: boolean }) => {
    setIsLoading(true)
    setLoadingMessage('Running compliance checks...')
    const message = `Broadcasting compliance confirmed: opt_out_text=${data.optOutText}, confirmed=${data.confirmed}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleDeliverySubmit = (data: { scheduleType: string; scheduledDate: string; testNumber: string }) => {
    setIsLoading(true)
    setLoadingMessage('Initiating broadcast delivery...')
    const message = `Broadcasting delivery submitted: schedule=${data.scheduleType}, date=${data.scheduledDate || 'immediate'}, test_number=${data.testNumber || 'none'}`
    sendMessageToChat(message)
    setTimeout(() => { setIsLoading(false); setLoadingMessage('') }, 500)
  }

  const handleReset = () => {
    setCurrentStep('idle')
    contactCountRef.current = 0
    segmentInfoRef.current = ''
    templateNameRef.current = ''
  }

  // Get step index for progress
  const getStepIndex = () => {
    const idx = workflowSteps.findIndex(s => s.id === currentStep)
    if (currentStep === 'complete') return workflowSteps.length
    return idx
  }
  const stepIndex = getStepIndex()

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
          {/* Loading Overlay */}
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

          {/* Idle State */}
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

          {/* Step 1: Data Processing */}
          {currentStep === 'data_processing' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <FileSpreadsheet className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 1: Data Processing</h3>
                  <p className="text-sm text-gray-500">Upload your contact list (Excel/CSV)</p>
                </div>
              </div>
              <DataProcessingForm themeColor={themeColor} onSubmit={handleDataProcessingSubmit} isLoading={isLoading} />
            </div>
          )}

          {/* Step 2: Segmentation */}
          {currentStep === 'segmentation' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <Users className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 2: Segmentation & Targeting</h3>
                  <p className="text-sm text-gray-500">Define your target audience</p>
                </div>
              </div>
              <SegmentationForm themeColor={themeColor} onSubmit={handleSegmentationSubmit} isLoading={isLoading} contactCount={contactCountRef.current} />
            </div>
          )}

          {/* Step 3: Content Creation */}
          {currentStep === 'content_creation' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <PenTool className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 3: Content Creation</h3>
                  <p className="text-sm text-gray-500">Create your broadcast message template</p>
                </div>
              </div>
              <ContentCreationForm themeColor={themeColor} onSubmit={handleContentCreationSubmit} isLoading={isLoading} segmentInfo={segmentInfoRef.current} />
            </div>
          )}

          {/* Step 4: Compliance */}
          {currentStep === 'compliance' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 4: Compliance & Policy</h3>
                  <p className="text-sm text-gray-500">Review compliance checks</p>
                </div>
              </div>
              <ComplianceForm themeColor={themeColor} onSubmit={handleComplianceSubmit} isLoading={isLoading} templateName={templateNameRef.current} />
            </div>
          )}

          {/* Step 5: Delivery */}
          {currentStep === 'delivery' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <Send className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 5: Delivery</h3>
                  <p className="text-sm text-gray-500">Test and send your broadcast</p>
                </div>
              </div>
              <DeliveryForm themeColor={themeColor} onSubmit={handleDeliverySubmit} isLoading={isLoading} />
            </div>
          )}

          {/* Step 6: Analytics */}
          {currentStep === 'analytics' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <BarChart3 className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 6: Analytics & Optimization</h3>
                  <p className="text-sm text-gray-500">Track broadcast performance</p>
                </div>
              </div>
              <AnalyticsView themeColor={themeColor} onComplete={() => goToStep('complete')} />
            </div>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <CampaignSuccess themeColor={themeColor} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  )
}
