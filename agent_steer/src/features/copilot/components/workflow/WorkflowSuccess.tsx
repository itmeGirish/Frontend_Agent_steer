import type { WorkflowCompleteData } from '@/types';
import { CheckCircle } from 'lucide-react';

interface WorkflowSuccessProps {
  themeColor?: string;
  data: WorkflowCompleteData;
}

export function WorkflowSuccess({
  themeColor = '#6366f1',
  data,
}: WorkflowSuccessProps) {
  const { user, job, review } = data;

  return (
    <div className="p-5 bg-green-50 rounded-lg border border-green-200 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-lg font-bold text-green-600">
          Application Submitted Successfully!
        </h2>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        {/* Personal Information */}
        <div>
          <h3
            className="font-semibold mb-1"
            style={{ color: themeColor }}
          >
            Personal Information:
          </h3>
          <p><strong>Name:</strong> {job.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
        </div>

        {/* Job Details */}
        <div>
          <h3
            className="font-semibold mb-1"
            style={{ color: themeColor }}
          >
            Job Details:
          </h3>
          <p><strong>Position:</strong> {job.position_applied}</p>
          <p><strong>Experience:</strong> {job.years_of_experience} years</p>
          <p><strong>Skills:</strong> {job.skills}</p>
          {job.resume_url && (
            <p><strong>Resume:</strong> {job.resume_url}</p>
          )}
        </div>

        {/* Review Responses */}
        <div>
          <h3
            className="font-semibold mb-1"
            style={{ color: themeColor }}
          >
            Review Responses:
          </h3>
          <p><strong>Availability:</strong> {review.availability}</p>
          <p><strong>Expected Salary:</strong> {review.expected_salary}</p>
          <p><strong>Willing to Relocate:</strong> {review.willing_to_relocate}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 italic">
        Thank you for completing your application! We will contact you at{' '}
        {user.email} with updates.
      </p>
    </div>
  );
}
