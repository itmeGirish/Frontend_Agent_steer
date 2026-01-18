import { CheckCircle } from 'lucide-react'

interface WorkflowSuccessProps {
  themeColor: string
  data: {
    user: { name: string; email: string; mobile: string }
    job: {
      full_name: string
      position_applied: string
      years_of_experience: number
      skills: string
      resume_url?: string
      cover_letter?: string
    }
    review: {
      availability: string
      expected_salary: string
      willing_to_relocate: string
    }
  }
}

export function WorkflowSuccess({ themeColor, data }: WorkflowSuccessProps) {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <CheckCircle className="w-8 h-8" style={{ color: themeColor }} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Application Submitted!
      </h3>
      <p className="text-gray-600 mb-6">
        Thank you, {data.job.full_name}! Your application for {data.job.position_applied} has been received.
      </p>
      <div className="text-left bg-gray-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-gray-900 mb-2">Application Summary</h4>
        <div className="space-y-1 text-gray-600">
          <p><strong>Email:</strong> {data.user.email}</p>
          <p><strong>Position:</strong> {data.job.position_applied}</p>
          <p><strong>Experience:</strong> {data.job.years_of_experience} years</p>
          <p><strong>Availability:</strong> {data.review.availability}</p>
          <p><strong>Expected Salary:</strong> {data.review.expected_salary}</p>
        </div>
      </div>
    </div>
  )
}
