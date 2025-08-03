import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { signout } from '../login/actions'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
        <p>Hello {data.user.email}</p>
        <Button onClick={signout} variant={'destructive'}>Signout</Button>
    </div>
  )
}