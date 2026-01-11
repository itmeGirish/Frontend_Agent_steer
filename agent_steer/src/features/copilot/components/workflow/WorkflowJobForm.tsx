import { useState } from 'react';
import type { JobApplicationData } from '@/types';

interface WorkflowJobFormProps {
  themeColor?: string;
  onSubmit?: (data: JobApplicationData) => void;
}

export function WorkflowJobForm({
  themeColor = '#6366f1',
  onSubmit,
}: WorkflowJobFormProps) {
  const [fullName, setFullName] = useState('');
  const [positionApplied, setPositionApplied] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [skills, setSkills] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!positionApplied.trim()) newErrors.positionApplied = 'Position is required';
    if (!skills.trim()) newErrors.skills = 'Skills are required';
    if (resumeUrl && !/^https?:\/\/.+/.test(resumeUrl)) {
      newErrors.resumeUrl = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit?.({
      full_name: fullName,
      position_applied: positionApplied,
      years_of_experience: yearsOfExperience,
      skills,
      resume_url: resumeUrl || undefined,
      cover_letter: coverLetter || undefined,
    });

    // Delay to allow message to be sent
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  if (isSubmitted) {
    return (
      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-green-600">
          Application Submitted!
        </h2>
        <p className="text-sm text-gray-600">
          Processing your job application...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-lg shadow-md max-w-md">
      <h2
        className="mb-2 text-lg font-semibold"
        style={{ color: themeColor }}
      >
        Step 2: Job Application
      </h2>
      <p className="mb-5 text-xs text-gray-500">
        Login successful! Now fill in your job application details.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Position Applied <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={positionApplied}
            onChange={(e) => setPositionApplied(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.positionApplied
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="e.g., Software Engineer"
          />
          {errors.positionApplied && (
            <p className="mt-1 text-xs text-red-500">{errors.positionApplied}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
            min="0"
            max="50"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Skills <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal"> (comma-separated)</span>
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.skills
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="e.g., Python, JavaScript, React"
          />
          {errors.skills && (
            <p className="mt-1 text-xs text-red-500">{errors.skills}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Resume URL <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.resumeUrl
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="https://example.com/resume.pdf"
          />
          {errors.resumeUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.resumeUrl}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Cover Letter <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            data-form-field="cover-letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-y"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
