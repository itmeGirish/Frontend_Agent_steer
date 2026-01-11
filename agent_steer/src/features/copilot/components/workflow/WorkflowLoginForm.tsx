import { useState } from 'react';
import type { UserData } from '@/types';

interface WorkflowLoginFormProps {
  themeColor?: string;
  onSubmit?: (data: UserData) => void;
}

export function WorkflowLoginForm({
  themeColor = '#6366f1',
  onSubmit,
}: WorkflowLoginFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(mobile)) {
      newErrors.mobile = 'Invalid mobile format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit?.({ name, email, mobile });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-green-600">
          Login Submitted!
        </h2>
        <p className="text-sm text-gray-600">
          Processing your login... Please wait for the job application form.
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
        Step 1: Login
      </h2>
      <p className="mb-5 text-xs text-gray-500">
        Please login first to continue with your job application.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
              errors.mobile
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200'
            }`}
            placeholder="Enter your mobile"
          />
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          Login & Continue
        </button>
      </div>
    </div>
  );
}
