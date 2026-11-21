# SPECTRUM // LENS — Sensory-Friendly Autism Epidemiology & Live API Telemetry

[![CI](https://github.com/Nannidan/spectrum-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/Nannidan/spectrum-lens/actions)
**Live Demo:** [https://nannidan.github.io/spectrum-lens/](https://nannidan.github.io/spectrum-lens/)

Sensory-friendly epidemiological dashboard comparing CDC ADDM diagnosis prevalence, NIH/IACC research funding, DSM-5 criteria shifts, demographic equity, and vaccine misinformation against live **OpenAlex** and **ClinicalTrials.gov v2** APIs.

---

## Architecture & Engineering Decisions

- **Sensory-Friendly Design System (`src/index.css`):** Engineered specifically with low-glare warm stone (`#f6f7f4`), calming sage (`#588674`), dusty slate blue (`#587b9e`), **Calm Twilight** dark mode, and a 1-click **Low-Stimulation Mode** (`data-motion="calm"`) that disables all CSS animations and transitions.
- **Live Dual-API Telemetry (`src/services/autismApis.ts`):** Parallel `AbortController`-managed fetches from `api.openalex.org/works` (annual publication volume) and `clinicaltrials.gov/api/v2/studies` (registered autism trials & sponsor classes), complete with loading skeletons and retryable error states.
- **Bidirectional URL Query Sync:** Search query (`?q=`), category (`cat=`), evidence status (`status=`), sort order (`sort=`), brightness mode (`mode=`), and stimulation preference (`stim=`) sync live with `window.history.replaceState`.
- **AI Trait-Reflection Probability Estimator (`src/components/NeuroChatAgent.tsx`):** Interactive 6-domain trait-reflection chat assistant with weighted domain scoring and clinical disclaimer.

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run build
```
