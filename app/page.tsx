import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100svh] flex flex-col items-center justify-center space-y-4">
      <h1 className="text-5xl md:text-6xl lg:text-7xl bold">ChatPDF</h1>
      <Button variant={'default'}>Get Started</Button> 
    </div>
  )
}
