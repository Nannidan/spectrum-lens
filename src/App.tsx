import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Moon,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
} from 'lucide-react'
import { CompareChart } from './components/CompareChart'
import { LiveTelemetryPanel } from './components/LiveTelemetryPanel'
import { NeuroChatAgent } from './components/NeuroChatAgent'
import { AUTISM_DATA_POINTS } from './data/autismDimensions'
import { fetchLiveAutismTelemetry } from './services/autismApis'
import type {
  DimensionCategory,
  EvidenceStatus,
  FetchStatus,
  LiveTelemetryData,
  SortOption,
} from './types/telemetry'

type BrightnessMode = 'light' | 'dark'

const CATEGORY_LABELS: Record<'all' | DimensionCategory, string> = {
  all: 'All Dimensions',
  epidemiology: 'Diagnosis & Screening',
  funding: 'Funding',
  criteria: 'Expanding Criteria',
  demographics: 'Gender & Equity',
  misinformation: 'Misinformation',
}

const STATUS_LABELS: Record<'all' | EvidenceStatus, string> = {
  all: 'All Evidence',
  'verified-consensus': 'Verified Consensus',
  'evolving-research': 'Evolving Research',
  'debunked-myth': 'Debunked Myth',
}

function readInitialParam(key: string, fallback: string): string {
  const params = new URLSearchParams(window.location.search)
  return params.get(key) ?? fallback
}

export default function App() {
  const [query, setQuery] = useState(() => readInitialParam('q', ''))
  const [category, setCategory] = useState<'all' | DimensionCategory>(() => {
    const val = readInitialParam('cat', 'all')
    return val in CATEGORY_LABELS ? (val as 'all' | DimensionCategory) : 'all'
  })
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | EvidenceStatus>(() => {
    const val = readInitialParam('status', 'all')
    return val in STATUS_LABELS ? (val as 'all' | EvidenceStatus) : 'all'
  })
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const val = readInitialParam('sort', 'impact')
    return val === 'title' || val === 'category' || val === 'status' ? val : 'impact'
  })
  const [mode, setMode] = useState<BrightnessMode>(() =>
    readInitialParam('mode', 'light') === 'dark' ? 'dark' : 'light',
  )
  const [lowStim, setLowStim] = useState<boolean>(() => readInitialParam('stim', '1') === '1')

  const [telemetryStatus, setTelemetryStatus] = useState<FetchStatus>('loading')
  const [telemetryData, setTelemetryData] = useState<LiveTelemetryData | null>(null)
  const [telemetryError, setTelemetryError] = useState<string | null>(null)

  // Sync theme & low-stimulation attributes to <html>
  useEffect(() => {
    const root = document.documentElement
    root.dataset.mode = mode
    root.dataset.motion = lowStim ? 'calm' : 'gentle'
  }, [mode, lowStim])

  // Sync interactive controls to URL query string
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category !== 'all') params.set('cat', category)
    if (evidenceFilter !== 'all') params.set('status', evidenceFilter)
    if (sortBy !== 'impact') params.set('sort', sortBy)
    if (mode !== 'light') params.set('mode', mode)
    if (!lowStim) params.set('stim', '0')

    const qs = params.toString()
    const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', nextUrl)
  }, [query, category, evidenceFilter, sortBy, mode, lowStim])

  const loadTelemetry = useCallback(async (signal?: AbortSignal) => {
    setTelemetryStatus('loading')
    setTelemetryError(null)
    try {
      const result = await fetchLiveAutismTelemetry({ signal })
      setTelemetryData(result)
      setTelemetryStatus('success')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setTelemetryError(err instanceof Error ? err.message : 'Unexpected API error')
      setTelemetryStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    fetchLiveAutismTelemetry({
      signal: controller.signal,
    })
      .then((result) => {
        if (!active) return
        setTelemetryData(result)
        setTelemetryStatus('success')
      })
      .catch((err) => {
        if (!active || (err instanceof DOMException && err.name === 'AbortError')) return
        setTelemetryError(err instanceof Error ? err.message : 'Unexpected API error')
        setTelemetryStatus('error')
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const filteredPoints = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = AUTISM_DATA_POINTS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (evidenceFilter !== 'all' && item.status !== evidenceFilter) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.contrastNote.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      )
    })

    return [...list].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return a.rank - b.rank
    })
  }, [query, category, evidenceFilter, sortBy])

  const resetFilters = () => {
    setQuery('')
    setCategory('all')
    setEvidenceFilter('all')
    setSortBy('impact')
  }

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Sensory-Friendly Header */}
        <header className="soft-card rounded-2xl border p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: 'var(--sage-soft)', color: 'var(--sage)' }}
                >
                  <Activity className="h-3.5 w-3.5" />
                  SPECTRUM // LENS
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
                >
                  Soft Sensory UI • URL-Synced
                </span>
              </div>
              <h1 className="mt-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Autism Diagnoses, Funding &amp; Misinformation Telemetry
              </h1>
              <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
                Comparing CDC prevalence rates, NIH/IACC funding, expanding DSM-5 definitions, and 5
                key demographic &amp; evidence dimensions—paired with live OpenAlex and
                ClinicalTrials.gov APIs.
              </p>
            </div>

            {/* Sensory & Resilience Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLowStim((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  backgroundColor: lowStim ? 'var(--sage-soft)' : 'var(--surface-alt)',
                  borderColor: lowStim ? 'var(--sage)' : 'var(--border)',
                  color: lowStim ? 'var(--sage)' : 'var(--ink)',
                }}
                title="Toggle calm low-stimulation mode (disables animations)"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{lowStim ? 'Low-Stim: On' : 'Low-Stim: Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                }}
              >
                {mode === 'light' ? (
                  <>
                    <Moon className="h-3.5 w-3.5" />
                    <span>Calm Twilight</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5" />
                    <span>Soft Daylight</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  void loadTelemetry()
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh APIs</span>
              </button>
            </div>
          </div>
        </header>

        {/* Live API Telemetry (with Skeletons + Error Banner + Retry) */}
        <LiveTelemetryPanel
          status={telemetryStatus}
          data={telemetryData}
          errorMessage={telemetryError}
          onRetry={() => {
            void loadTelemetry()
          }}
        />

        {/* Interactive Compare & Contrast Timeline */}
        <CompareChart />

        {/* Calm AI Trait-Reflection & Probability Agent */}
        <NeuroChatAgent />

        {/* Interactive Search, Filter & Sort Toolbar */}
        <section
          aria-label="Filter and sort dimensions"
          className="soft-card rounded-2xl border p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search diagnoses, funding, DSM-5, masking, or vaccine myths..."
                aria-label="Search autism data points"
                className="w-full rounded-xl border py-2 pr-3 pl-9 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={evidenceFilter}
                onChange={(e) => setEvidenceFilter(e.target.value as 'all' | EvidenceStatus)}
                aria-label="Filter by evidence status"
                className="rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                }}
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                }}
              >
                <ArrowUpDown className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort dimensions"
                  className="bg-transparent font-medium focus:outline-none"
                >
                  <option value="impact">Sort: Core Order</option>
                  <option value="title">Sort: Title (A–Z)</option>
                  <option value="category">Sort: Category</option>
                  <option value="status">Sort: Evidence Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as ('all' | DimensionCategory)[]).map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(cat)}
                  className="cursor-pointer rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: active ? 'var(--sage-soft)' : 'transparent',
                    borderColor: active ? 'var(--sage)' : 'var(--border)',
                    color: active ? 'var(--sage)' : 'var(--text-muted)',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              )
            })}
          </div>
        </section>

        {/* 8 Compare & Contrast Dimensions Grid (or Empty State) */}
        {filteredPoints.length === 0 ? (
          <section className="soft-card rounded-2xl border p-8 text-center">
            <p className="text-base font-semibold">No matching dimensions found</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Try clearing your search query or resetting category and evidence filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: 'var(--sage-soft)',
                borderColor: 'var(--sage)',
                color: 'var(--sage)',
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Filters</span>
            </button>
          </section>
        ) : (
          <section
            aria-label="Compare and contrast data points"
            className="grid gap-4 md:grid-cols-2"
          >
            {filteredPoints.map((pt) => {
              const isMyth = pt.status === 'debunked-myth'
              return (
                <article key={pt.id} className="soft-card flex flex-col justify-between rounded-2xl border p-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor: 'var(--surface-alt)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        #{pt.rank} • {CATEGORY_LABELS[pt.category]}
                      </span>

                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor: isMyth ? 'var(--caution-soft)' : 'var(--sage-soft)',
                          color: isMyth ? 'var(--caution)' : 'var(--sage)',
                        }}
                      >
                        {isMyth ? (
                          <ShieldAlert className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {STATUS_LABELS[pt.status]}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-semibold">{pt.title}</h3>

                    <div
                      className="mt-3 flex flex-wrap items-baseline justify-between gap-2 rounded-xl border px-3.5 py-2.5"
                      style={{
                        backgroundColor: 'var(--surface-alt)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <div>
                        <span
                          className="block text-[11px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {pt.metricLabel}
                        </span>
                        <span className="text-lg font-semibold">{pt.metricValue}</span>
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: isMyth ? 'var(--caution)' : 'var(--slate-blue)' }}
                      >
                        {pt.trendDelta}
                      </span>
                    </div>

                    <p className="mt-3 text-sm">{pt.summary}</p>

                    <div
                      className="mt-3 rounded-xl border-l-2 px-3 py-2 text-xs"
                      style={{
                        backgroundColor: 'var(--lavender-soft)',
                        borderColor: 'var(--lavender-ink)',
                        color: 'var(--ink)',
                      }}
                    >
                      {pt.contrastNote}
                    </div>
                  </div>

                  <footer
                    className="mt-4 flex items-center justify-between gap-2 border-t pt-3 text-[11px]"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <a
                      href={pt.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                      style={{ color: 'var(--sage)' }}
                    >
                      <span>Source: {pt.source}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    <span className="shrink-0 font-mono">{pt.yearRange}</span>
                  </footer>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
