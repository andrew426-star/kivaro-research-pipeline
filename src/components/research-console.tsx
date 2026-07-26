"use client"

import { useState } from "react"
import { AlertTriangleIcon } from "lucide-react"

import { DocumentInput } from "@/components/document-input"
import { ResearchBrief, type Brief } from "@/components/research-brief"
import { SAMPLE_DOCUMENT_SOURCE, SAMPLE_DOCUMENT_TEXT, SAMPLE_DOCUMENT_TITLE } from "@/lib/sample-document"

export function ResearchConsole() {
  const [text, setText] = useState(SAMPLE_DOCUMENT_TEXT)
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to analyze document.")
      setBrief(data.brief)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze document.")
      setBrief(null)
    } finally {
      setLoading(false)
    }
  }

  function handleLoadSample() {
    setText(SAMPLE_DOCUMENT_TEXT)
    setBrief(null)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glow-border rounded-lg bg-secondary/40 px-4 py-2 text-xs text-muted-foreground">
        Sample document loaded: <span className="text-foreground">{SAMPLE_DOCUMENT_TITLE}</span>
        <br />
        Source: {SAMPLE_DOCUMENT_SOURCE}
      </div>

      <DocumentInput
        value={text}
        onChange={setText}
        onAnalyze={handleAnalyze}
        onLoadSample={handleLoadSample}
        loading={loading}
      />

      {error && (
        <div className="glow-border flex items-center gap-2 rounded-lg p-3 text-sm text-destructive">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {brief && <ResearchBrief brief={brief} />}
    </div>
  )
}
