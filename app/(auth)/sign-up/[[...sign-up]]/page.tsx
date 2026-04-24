import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900">
      <SignUp appearance={{
        elements: {
          card: "bg-dark-800 border border-dark-600 shadow-2xl rounded-2xl",
          headerTitle: "text-dark-100",
          headerSubtitle: "text-dark-400",
          socialButtonsBlockButton: "bg-dark-700 border-dark-600 text-dark-100 hover:bg-dark-600",
          formButtonPrimary: "bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold",
          footerActionLink: "text-brand-500 hover:text-brand-400"
        }
      }} />
    </div>
  )
}
