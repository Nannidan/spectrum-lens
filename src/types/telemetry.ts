export type DimensionCategory =
  | 'epidemiology'
  | 'funding'
  | 'criteria'
  | 'demographics'
  | 'misinformation'

export type EvidenceStatus =
  | 'verified-consensus'
  | 'evolving-research'
  | 'debunked-myth'

export type SortOption = 'impact' | 'title' | 'category' | 'status'

export interface AutismDataPoint {
  id: string
  rank: number
  title: string
  category: DimensionCategory
  status: EvidenceStatus
  metricLabel: string
  metricValue: string
  trendDelta: string
  summary: string
  contrastNote: string
  source: string
  yearRange: string
}

export interface TimelinePoint {
  year: number
  prevalencePer1k: number
  fundingMillions: number
  milestone?: string
}

/* ================= LIVE API RESPONSE INTERFACES ================= */

export interface OpenAlexGroupByItem {
  key: string
  key_display_name: string
  count: number
}

export interface OpenAlexWorksResponse {
  meta: {
    count: number
    db_response_time_ms: number
  }
  group_by?: OpenAlexGroupByItem[]
}

export interface ClinicalTrialStudyRaw {
  protocolSection?: {
    identificationModule?: {
      nctId?: string
      briefTitle?: string
    }
    statusModule?: {
      overallStatus?: string
    }
    sponsorCollaboratorsModule?: {
      leadSponsor?: {
        class?: string
      }
    }
  }
}

export interface ClinicalTrialsApiResponse {
  totalCount?: number
  studies?: ClinicalTrialStudyRaw[]
}

export interface ClinicalTrialSummary {
  nctId: string
  title: string
  status: string
  sponsorClass: string
}

export interface LiveTelemetryData {
  openAlexTotal: number
  openAlexByYear: { year: number; count: number }[]
  clinicalTrialsTotal: number
  trials: ClinicalTrialSummary[]
  fetchedAt: string
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'
