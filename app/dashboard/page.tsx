import { redirect } from 'next/navigation'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className='px-6 py-8 h-[100svh]'>
      <div className='flex flex-row flex-wrap space-x-4 space-y-4'>
      <ChatCard filename='File1' />
      <ChatCard filename='File2' />
      <ChatCard filename='File3' />
      <ChatCard filename='File4' />
      </div>
    </div>
  )
}

type Props = {
  filename: string;
  description?: string;
};

function ChatCard({ filename }: Props) {
  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle>{filename}</CardTitle>
        <CardDescription>Updated</CardDescription>
        <CardAction>
          <Link href={`/dashboard/chat/${filename}`}>Open</Link>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <p>Created On: Monday</p>
      </CardFooter>
    </Card>
  );
}
