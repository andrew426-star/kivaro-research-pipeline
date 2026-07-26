import {
  AlertTriangleIcon,
  ArrowRightIcon,
  FileTextIcon,
  GaugeIcon,
  HelpCircleIcon,
  ListChecksIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Brief {
  summary: string
  keyMetrics: { label: string; value: string; context: string }[]
  notableChanges: string[]
  riskFlags: { severity: "low" | "medium" | "high"; description: string }[]
  sentiment: { tone: string; rationale: string }
  followUpQuestions: string[]
}

const SEVERITY_STYLES: Record<Brief["riskFlags"][number]["severity"], string> = {
  low: "border-primary/30 text-primary",
  medium: "border-accent/40 text-accent",
  high: "border-destructive/40 text-destructive",
}

export function ResearchBrief({ brief }: { brief: Brief }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <FileTextIcon className="size-4 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{brief.summary}</p>
        </CardContent>
      </Card>

      {brief.keyMetrics.length > 0 && (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {brief.keyMetrics.map((metric, i) => (
                <div key={i} className="glow-border-hover flex flex-col gap-0.5 rounded-lg p-2.5">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className="font-heading text-lg text-foreground">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">{metric.context}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <ListChecksIcon className="size-4 text-primary" />
              Notable Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brief.notableChanges.length === 0 ? (
              <p className="text-sm text-muted-foreground">None flagged.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {brief.notableChanges.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <ArrowRightIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <AlertTriangleIcon className="size-4 text-primary" />
              Risk Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brief.riskFlags.length === 0 ? (
              <p className="text-sm text-muted-foreground">None flagged.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {brief.riskFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className={`shrink-0 ${SEVERITY_STYLES[flag.severity]}`}>
                      {flag.severity}
                    </Badge>
                    <span className="text-foreground">{flag.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <GaugeIcon className="size-4 text-primary" />
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-heading text-lg text-foreground">{brief.sentiment.tone}</span>
            <span className="text-sm text-muted-foreground">{brief.sentiment.rationale}</span>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <HelpCircleIcon className="size-4 text-primary" />
              Follow-Up Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brief.followUpQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">None suggested.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {brief.followUpQuestions.map((question, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <ArrowRightIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {question}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
