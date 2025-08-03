import { Button } from "./ui/button";

export default function Header() {
    return (
        <div className="flex flex-row items-center justify-between mx-6 my-2">
            <h1>ChatPDF</h1>
            <div className="flex flex-row space-x-4">
                <Button variant={'outline'}>Log In</Button>
                <Button>Get Started</Button>
            </div>
        </div>
    )
}