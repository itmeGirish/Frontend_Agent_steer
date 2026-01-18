import { useState } from 'react'

interface WorkflowReviewFormProps {
  themeColor: string
  applicantName: string
  position: string
  onSubmit: (data: {
    availability: string
    expected_salary: string
    willing_to_relocate: string
  }) => void
}

export function WorkflowReviewForm({ themeColor, applicantName, position, onSubmit }: WorkflowReviewFormProps) {
  const [availability, setAvailability] = useState('')
  const [salary, setSalary] = useState('')
  const [relocate, setRelocate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (availability && salary && relocate) {
      onSubmit({
        availability,
        expected_salary: salary,
        willing_to_relocate: relocate,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-2" style={{ color: themeColor }}>
        Step 3: Final Review
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {applicantName} applying for {position}
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          >
            <option value="">Select availability</option>
            <option value="immediate">Immediate</option>
            <option value="2_weeks">2 Weeks</option>
            <option value="1_month">1 Month</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., $80,000 - $100,000"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Willing to Relocate?</label>
          <select
            value={relocate}
            onChange={(e) => setRelocate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          >
            <option value="">Select option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="remote_only">Remote Only</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-lg font-medium"
          style={{ backgroundColor: themeColor }}
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}
