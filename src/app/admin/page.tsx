import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>
              You are signed in as <span className="font-medium">{data.user.email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Next step is wiring role-based access (admin/editor) to the `users` table and adding content management screens.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link className="text-sm font-medium text-primary hover:underline" href="/trails">
                View trails
              </Link>
              <Link className="text-sm font-medium text-primary hover:underline" href="/guides">
                View guides
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


