import { useState } from 'react'

interface WorkflowLoginFormProps {
  themeColor: string
  onSubmit: (data: { name: string; email: string; mobile: string }) => void
}

export function WorkflowLoginForm({ themeColor, onSubmit }: WorkflowLoginFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && mobile) {
      onSubmit({ name, email, mobile })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
        Step 1: Login Information
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            required
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
