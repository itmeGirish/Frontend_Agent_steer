import { useState } from 'react'

interface WorkflowJobFormProps {
  themeColor: string
  onSubmit: (data: {
    full_name: string
    position_applied: string
    years_of_experience: number
    skills: string
    resume_url?: string
    cover_letter?: string
  }) => void
}

export function WorkflowJobForm({ themeColor, onSubmit }: WorkflowJobFormProps) {
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fullName && position && experience && skills) {
      onSubmit({
        full_name: fullName,
        position_applied: position,
        years_of_experience: parseInt(experience),
        skills,
        resume_url: resumeUrl || undefined,
        cover_letter: coverLetter || undefined,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
        Step 2: Job Application
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position Applied</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            rows={2}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (optional)</label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-lg font-medium"
          style={{ backgroundColor: themeColor }}
        >
          Continue
        </button>
      </div>
    </form>
  )
}
