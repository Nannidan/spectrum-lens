import type {
  ClinicalTrialsApiResponse,
  ClinicalTrialSummary,
  LiveTelemetryData,
  OpenAlexWorksResponse,
} from '../types/telemetry'

const OPENALEX_URL =
  'https://api.openalex.org/works?search=autism+spectrum+disorder&group_by=publication_year'

const CLINICAL_TRIALS_URL =
  'https://clinicaltrials.gov/api/v2/studies?query.cond=autism&countTotal=true&pageSize=6&fields=NCTId,BriefTitle,OverallStatus,LeadSponsorClass'

export async function fetchLiveAutismTelemetry(options?: {
  signal?: AbortSignal
  simulateError?: boolean
}): Promise<LiveTelemetryData> {
  if (options?.simulateError) {
    await new Promise((resolve) => setTimeout(resolve, 450))
    throw new Error(
      'Simulated network interruption: unable to reach OpenAlex & ClinicalTrials.gov endpoints.',
    )
  }

  const [oaRes, ctRes] = await Promise.all([
    fetch(OPENALEX_URL, { signal: options?.signal }),
    fetch(CLINICAL_TRIALS_URL, { signal: options?.signal }),
  ])

  if (!oaRes.ok) {
    throw new Error(`OpenAlex API returned HTTP ${oaRes.status}`)
  }
  if (!ctRes.ok) {
    throw new Error(`ClinicalTrials.gov API returned HTTP ${ctRes.status}`)
  }

  const oaJson = (await oaRes.json()) as OpenAlexWorksResponse
  const ctJson = (await ctRes.json()) as ClinicalTrialsApiResponse

  const openAlexByYear = (oaJson.group_by ?? [])
    .map((g) => ({
      year: Number(g.key),
      count: g.count,
    }))
    .filter((item) => Number.isFinite(item.year) && item.year >= 2015 && item.year <= 2026)
    .sort((a, b) => a.year - b.year)

  const trials: ClinicalTrialSummary[] = (ctJson.studies ?? []).map((study) => {
    const idMod = study.protocolSection?.identificationModule
    const statusMod = study.protocolSection?.statusModule
    const sponsorMod = study.protocolSection?.sponsorCollaboratorsModule
    return {
      nctId: idMod?.nctId ?? 'UNKNOWN',
      title: idMod?.briefTitle ?? 'Untitled study',
      status: statusMod?.overallStatus ?? 'UNKNOWN',
      sponsorClass: sponsorMod?.leadSponsor?.class ?? 'OTHER',
    }
  })

  return {
    openAlexTotal: oaJson.meta?.count ?? 0,
    openAlexByYear,
    clinicalTrialsTotal: ctJson.totalCount ?? trials.length,
    trials,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}
