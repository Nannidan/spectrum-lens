import { AlertCircle, BookOpen, FlaskConical, RefreshCw } from 'lucide-react'
import type { FetchStatus, LiveTelemetryData } from '../types/telemetry'

interface LiveTelemetryPanelProps {
  status: FetchStatus
  data: LiveTelemetryData | null
  errorMessage: string | null
  onRetry: () => void
}

export function LiveTelemetryPanel({
  status,
  data,
  errorMessage,
  onRetry,
}: LiveTelemetryPanelProps) {
  if (status === 'loading' && !data) {
    return (
      <section
        aria-label="Loading live research telemetry"
        className="grid gap-4 lg:grid-cols-2"
      >
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className="soft-card rounded-2xl border p-5"
          >
            <div className="soft-skeleton h-4 w-48 rounded-md" />
            <div className="soft-skeleton mt-3 h-7 w-32 rounded-md" />
            <div className="mt-5 space-y-2.5">
              <div className="soft-skeleton h-3.5 w-full rounded-md" />
              <div className="soft-skeleton h-3.5 w-5/6 rounded-md" />
              <div className="soft-skeleton h-3.5 w-4/6 rounded-md" />
            </div>
          </div>
        ))}
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section
        role="alert"
        className="rounded-2xl border p-5"
        style={{
          backgroundColor: 'var(--caution-soft)',
          borderColor: 'var(--caution)',
        }}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--caution)' }} />
            <div>
              <h2 className="text-sm font-semibold">Live API Telemetry Unavailable</h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {errorMessage ?? 'Unable to reach external research APIs.'} Curated epidemiological
                dimensions below remain available offline.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--caution)',
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Live Fetch</span>
          </button>
        </div>
      </section>
    )
  }

  if (!data) return null

  const maxYearCount = Math.max(...data.openAlexByYear.map((y) => y.count), 1)

  return (
    <section
      aria-label="Live external API telemetry"
      className="grid gap-4 lg:grid-cols-2"
    >
      {/* Live OpenAlex Research Volume */}
      <div className="soft-card rounded-2xl border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--sage)' }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Live OpenAlex API
            </span>
            <h3 className="mt-1 text-base font-semibold">
              {data.openAlexTotal.toLocaleString()} Indexed ASD Works
            </h3>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
            style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
          >
            Synced {data.fetchedAt}
          </span>
        </div>

        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Annual peer-reviewed &amp; preprint output (2015–present) showing expanding research
          attention.
        </p>

        <div className="mt-4 flex h-24 items-end gap-1.5">
          {data.openAlexByYear.map((item) => {
            const pct = Math.max(Math.round((item.count / maxYearCount) * 100), 8)
            return (
              <div key={item.year} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: 'var(--sage)',
                    opacity: 0.82,
                  }}
                  title={`${item.year}: ${item.count.toLocaleString()} works`}
                />
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {String(item.year).slice(-2)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live ClinicalTrials.gov Feed */}
      <div className="soft-card rounded-2xl border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--slate-blue)' }}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Live ClinicalTrials.gov v2
            </span>
            <h3 className="mt-1 text-base font-semibold">
              {data.clinicalTrialsTotal.toLocaleString()} Registered Autism Studies
            </h3>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
            style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
          >
            Top {data.trials.length} sample
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {data.trials.slice(0, 4).map((trial) => (
            <li
              key={trial.nctId}
              className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs"
              style={{
                backgroundColor: 'var(--surface-alt)',
                borderColor: 'var(--border)',
              }}
            >
              <span className="line-clamp-1 font-medium">{trial.title}</span>
              <span
                className="shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px]"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-muted)',
                }}
              >
                {trial.sponsorClass}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
