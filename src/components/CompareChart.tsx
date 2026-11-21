import { useState } from 'react'
import { COMPARE_TIMELINE } from '../data/autismDimensions'

export function CompareChart() {
  const [activeIdx, setActiveIdx] = useState<number>(COMPARE_TIMELINE.length - 1)

  const maxPrev = 30 // per 1,000
  const maxFund = 520 // $M
  const active = COMPARE_TIMELINE[activeIdx]

  return (
    <section
      aria-labelledby="compare-chart-heading"
      className="soft-card rounded-2xl border p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="compare-chart-heading" className="text-base font-semibold tracking-tight">
            Prevalence vs. Research Funding &amp; Criteria Milestones (2000–2023)
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            Select any year below to compare CDC 8-year-old diagnosis prevalence against NIH/IACC
            funding and diagnostic shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: 'var(--sage)' }}
            />
            Prevalence (per 1,000)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: 'var(--slate-blue)' }}
            />
            Funding ($M / yr)
          </span>
        </div>
      </div>

      {/* Calm dual-bar comparison */}
      <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
        {COMPARE_TIMELINE.map((pt, idx) => {
          const prevPct = Math.round((pt.prevalencePer1k / maxPrev) * 100)
          const fundPct = Math.round((pt.fundingMillions / maxFund) * 100)
          const isSelected = idx === activeIdx

          return (
            <button
              key={pt.year}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-colors focus:outline-none focus-visible:ring-2 ${
                isSelected ? 'soft-selected' : 'border-transparent hover:border-[var(--border)]'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--surface-alt)' : 'transparent',
              }}
            >
              <div className="flex h-28 w-full items-end justify-center gap-1.5 px-1">
                <div
                  className="w-3 rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(prevPct, 8)}%`,
                    backgroundColor: 'var(--sage)',
                    opacity: isSelected ? 1 : 0.72,
                  }}
                  title={`Prevalence: ${pt.prevalencePer1k} per 1,000`}
                />
                <div
                  className="w-3 rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(fundPct, 8)}%`,
                    backgroundColor: 'var(--slate-blue)',
                    opacity: isSelected ? 1 : 0.72,
                  }}
                  title={`Funding: $${pt.fundingMillions}M`}
                />
              </div>

              <span className="mt-2 font-mono text-xs font-semibold">{pt.year}</span>
              <span
                className="mt-0.5 text-[10px] leading-tight"
                style={{ color: 'var(--text-muted)' }}
              >
                {pt.milestone ? 'Milestone' : '\u00A0'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected year readout */}
      <div
        className="mt-4 flex flex-col justify-between gap-2 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center"
        style={{
          backgroundColor: 'var(--surface-alt)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="font-mono font-semibold">{active.year}</span>
          <span>
            Prevalence:{' '}
            <strong style={{ color: 'var(--sage)' }}>{active.prevalencePer1k} / 1,000</strong>
          </span>
          <span>
            Funding:{' '}
            <strong style={{ color: 'var(--slate-blue)' }}>${active.fundingMillions}M</strong>
          </span>
        </div>
        {active.milestone && (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--lavender-soft)',
              color: 'var(--lavender-ink)',
            }}
          >
            {active.milestone}
          </span>
        )}
      </div>
    </section>
  )
}
