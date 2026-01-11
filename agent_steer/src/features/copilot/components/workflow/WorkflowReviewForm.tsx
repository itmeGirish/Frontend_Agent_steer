import { useState } from 'react';
import type { ReviewData } from '@/types';

interface WorkflowReviewFormProps {
  themeColor?: string;
  applicantName: string;
  position: string;
  onSubmit: (data: ReviewData) => void;
}

const AVAILABILITY_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  'Within 1 month',
  'Within 2 months',
  'More than 2 months',
];

const RELOCATE_OPTIONS = ['Yes', 'No', 'Depends on location'];

export function WorkflowReviewForm({
  themeColor = '#6366f1',
  applicantName,
  position,
  onSubmit,
}: WorkflowReviewFormProps) {
  const [availability, setAvailability] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [willingToRelocate, setWillingToRelocate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = availability && expectedSalary && willingToRelocate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      availability,
      expected_salary: expectedSalary,
      willing_to_relocate: willingToRelocate,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-green-600">
          Review Submitted!
        </h2>
        <p className="text-sm text-gray-600">
          Your application is being processed...
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-5 bg-white rounded-lg max-w-md"
      style={{ border: `2px solid ${themeColor}` }}
    >
      <h3
        className="mb-3 text-lg font-semibold"
        style={{ color: themeColor }}
      >
        Step 3: Submission & Review
      </h3>
      <p className="mb-4 text-xs text-gray-500">
        Hi {applicantName}, please answer these final questions for the{' '}
        <strong>{position}</strong> position.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Availability */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            1. When can you start? <span className="text-red-500">*</span>
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select availability</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Expected Salary */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            2. What is your expected salary (per year)?{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            placeholder="e.g., $80,000 or Negotiable"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Willing to Relocate */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            3. Are you willing to relocate if required?{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {RELOCATE_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center cursor-pointer text-sm"
              >
                <input
                  type="radio"
                  name="relocate"
                  value={option}
                  checked={willingToRelocate === option}
                  onChange={(e) => setWillingToRelocate(e.target.value)}
                  className="mr-2"
                />
                {option === 'Depends on location' ? 'Depends' : option}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 text-sm font-semibold text-white rounded-md transition-opacity ${
            isValid ? 'hover:opacity-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ backgroundColor: isValid ? themeColor : '#ccc' }}
        >
          Submit & Complete Application
        </button>
      </form>
    </div>
  );
}
