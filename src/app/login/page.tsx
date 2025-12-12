import { LoginForm } from './ui'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Use your email and password to access your account.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}


