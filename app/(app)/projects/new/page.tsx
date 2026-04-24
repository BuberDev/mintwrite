import { ProjectSetupForm } from "@/components/forms/ProjectSetupForm"

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Set up your project</h1>
        <p className="text-dark-400 mt-4 text-lg">
          We need a few details about your project to generate high-quality Web3 content.
        </p>
      </header>
      
      <ProjectSetupForm />
      
      <p className="text-center text-dark-500 mt-8 text-sm">
        You can always update these details later in Settings.
      </p>
    </div>
  )
}
