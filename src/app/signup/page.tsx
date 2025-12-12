import { SignupForm } from './ui'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create an account to access admin/editor tools.
        </p>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}


