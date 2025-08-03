import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className='flex flex-col space-y-6 items-center justify-center h-[80svh]'>
        <h1 className='text-lg'>Get Started</h1>
    <form className='flex flex-col space-y-4 w-full md:w-xl border-[1px] px-6 py-8'>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
    </div>
  )
}