"use client"

import { Loader2Icon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentInputProps {
  value: string
  onChange: (value: string) => void
  onAnalyze: () => void
  onLoadSample: () => void
  loading: boolean
}

export function DocumentInput({ value, onChange, onAnalyze, onLoadSample, loading }: DocumentInputProps) {
  return (
    <Card className="glow-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Input</CardTitle>
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample} disabled={loading}>
          Load Sample Filing
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste a filing excerpt, earnings call transcript, or research document..."
          disabled={loading}
          className="h-56 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{value.length.toLocaleString()} characters</span>
          <Button type="button" onClick={onAnalyze} disabled={loading || !value.trim()}>
            {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
