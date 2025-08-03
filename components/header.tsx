import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signout } from "@/app/login/actions";

export default async function Header() {
    const supabase = await createClient();
    let status = true;

    const {data, error} = await supabase.auth.getUser();
    if (error || !data?.user) {
        status = false
    }
    return (
        <div className="flex flex-row items-center justify-between mx-6 my-2">
            <h1>ChatPDF</h1>
            <div className="flex flex-row space-x-4 items-center">
                {(
                    status ? 
                    <div className="flex flex-row space-x-4">
                    <Avatar>
                        <AvatarFallback>{data.user?.email?.toString().charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
        <Button onClick={signout} variant={'destructive'} className="rounded">Signout</Button>

                    </div> :
                    <>
                    <Button variant={'outline'}asChild>
                    <Link href='/login'>Login</Link>
                </Button>
                <Button asChild>
                    <Link href='/login'> Get Started</Link>
                </Button>
                    </>
            )}
            </div>
        </div>
    )
}