import { ResearchConsole } from "@/components/research-console"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
      <header className="flex flex-col gap-1 py-2">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          AI Research Workflow Automation
        </span>
        <h1 className="font-heading text-2xl text-gradient-green sm:text-3xl">
          Structured Intelligence from Any Filing or Transcript
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste a real filing, earnings call, or research document — or use your own — and get back
          a structured brief: key metrics, notable changes, risk flags, sentiment, and follow-up
          questions.
        </p>
      </header>

      <ResearchConsole />
    </div>
  )
}
