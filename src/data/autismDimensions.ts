import type { AutismDataPoint, TimelinePoint } from '../types/telemetry'

export const AUTISM_DATA_POINTS: AutismDataPoint[] = [
  {
    id: 'diagnosis-prevalence',
    rank: 1,
    title: 'Diagnosis Prevalence Rate (8-Year-Olds)',
    category: 'epidemiology',
    status: 'verified-consensus',
    metricLabel: 'CDC ADDM 2020',
    metricValue: '1 in 36 (2.76%)',
    trendDelta: '+312% since 2000 (1 in 150)',
    summary:
      'Surveillance across 11 U.S. ADDM sites shows identified ASD prevalence rose from 6.7 per 1,000 in 2000 to 27.6 per 1,000 in 2020.',
    contrastNote:
      'Contrast: Prevalence rose ~4.1x over two decades, largely tracking screening expansion and diagnostic catch-up rather than a sudden biological surge.',
    source: 'CDC ADDM Network (MMWR 2023)',
    yearRange: '2000 – 2020',
  },
  {
    id: 'research-funding',
    rank: 2,
    title: 'Federal & Private Autism Research Funding',
    category: 'funding',
    status: 'verified-consensus',
    metricLabel: 'NIH / IACC Annual',
    metricValue: '~$485M / yr',
    trendDelta: '+220% since 2008 ($150M)',
    summary:
      'U.S. federal and private autism research funding expanded significantly under the Autism CARES Act, though funding remains heavily weighted toward biology and early childhood.',
    contrastNote:
      'Contrast: While diagnosis rates quadrupled, adult services and lifespan support receive under 5% of total research dollars compared to pediatric/genetic studies.',
    source: 'NIH IACC Portfolio Analysis',
    yearRange: '2008 – 2023',
  },
  {
    id: 'expanding-definitions',
    rank: 3,
    title: 'Expanding Diagnostic Criteria (DSM-IV → DSM-5)',
    category: 'criteria',
    status: 'verified-consensus',
    metricLabel: 'Criteria Shift',
    metricValue: '4 → 1 Unified Spectrum',
    trendDelta: 'DSM-5 (2013) + ADHD co-diagnosis',
    summary:
      'DSM-5 merged Autistic Disorder, Asperger’s, and PDD-NOS into a single Autism Spectrum Disorder diagnosis and removed the ban on diagnosing ASD alongside ADHD.',
    contrastNote:
      'Contrast: Diagnostic substitution (shifting labels from intellectual disability or language delay to ASD) accounts for a substantial share of the 1990s–2010s rise.',
    source: 'APA DSM-5 / Keyes et al.',
    yearRange: '1994 – 2013+',
  },
  {
    id: 'universal-screening',
    rank: 4,
    title: 'Universal Pediatric Screening (M-CHAT)',
    category: 'epidemiology',
    status: 'verified-consensus',
    metricLabel: 'AAP Guidelines',
    metricValue: '18 & 24 Months',
    trendDelta: 'Median dx age dropping toward <4 yrs',
    summary:
      'Routine toddler developmental screening at well-child visits identifies traits years earlier than historical school-age referrals.',
    contrastNote:
      'Contrast: Earlier detection compresses multiple birth cohorts into earlier surveillance windows, temporarily amplifying apparent year-over-year incidence.',
    source: 'American Academy of Pediatrics',
    yearRange: '2007 – 2024',
  },
  {
    id: 'gender-masking',
    rank: 5,
    title: 'Sex Ratio & Female Masking Recognition',
    category: 'demographics',
    status: 'evolving-research',
    metricLabel: 'Male : Female Ratio',
    metricValue: '3.8 : 1 (narrowing)',
    trendDelta: 'Down from ~4.5 : 1 historically',
    summary:
      'Girls and women often camouflage social differences, leading to missed or misdiagnosed anxiety/eating-disorder labels under male-normed checklists.',
    contrastNote:
      'Contrast: Rising female diagnoses reflect improved clinician awareness of masking—not a new environmental trigger affecting one sex.',
    source: 'CDC ADDM / Loomes et al.',
    yearRange: '2012 – 2024',
  },
  {
    id: 'equity-access',
    rank: 6,
    title: 'Racial & Socioeconomic Access Equity',
    category: 'demographics',
    status: 'verified-consensus',
    metricLabel: '2020 ADDM Milestone',
    metricValue: 'Equity Gap Reversed',
    trendDelta: 'Black/Hispanic rates ≥ White in 2020',
    summary:
      'For the first time in 2020, Black (29.3), Hispanic (31.6), and Asian (33.4) per 1,000 rates matched or exceeded White (24.3) rates due to improved Medicaid/IDEA access.',
    contrastNote:
      'Contrast: Much of the recent "spike" is actually overdue catch-up in historically underserved communities gaining evaluation access.',
    source: 'CDC MMWR Surveillance 2023',
    yearRange: '2000 – 2020',
  },
  {
    id: 'adult-catchup',
    rank: 7,
    title: 'Adult & Late-Identified Catch-Up Wave',
    category: 'criteria',
    status: 'evolving-research',
    metricLabel: 'Adult Evaluations',
    metricValue: 'Fastest-Growing Cohort',
    trendDelta: 'Driven by neurodiversity literacy',
    summary:
      'Adults who grew up before DSM-5 or universal screening are increasingly seeking formal evaluations after recognizing lifelong sensory and executive-function traits.',
    contrastNote:
      'Contrast: Public awareness and destigmatization drive adult self-referral, whereas pediatric surveillance drives CDC prevalence headlines.',
    source: 'JAMA Network Open / Epic EHR',
    yearRange: '2015 – 2024',
  },
  {
    id: 'misinfo-vs-evidence',
    rank: 8,
    title: 'Vaccine Misinformation vs. Genetic Heritability',
    category: 'misinformation',
    status: 'debunked-myth',
    metricLabel: 'Retracted 1998 Claim',
    metricValue: '0 Causal Link (n > 1.8M)',
    trendDelta: '~80% heritability in twin/family studies',
    summary:
      'The 1998 Wakefield case series (n=12) was fully retracted in 2010 for data falsification; subsequent studies covering >1.8M children found zero MMR-autism link.',
    contrastNote:
      'Contrast: Misinformation thrives on temporal coincidence (vaccines occur at 12–18 mos, when developmental traits first become observable), while genetics explains ~80% of variance.',
    source: 'NEJM / JAMA / Lancet Retraction',
    yearRange: '1998 – 2024',
  },
]

export const COMPARE_TIMELINE: TimelinePoint[] = [
  { year: 2000, prevalencePer1k: 6.7, fundingMillions: 65, milestone: 'ADDM baseline (1 in 150)' },
  { year: 2004, prevalencePer1k: 8.0, fundingMillions: 98 },
  { year: 2008, prevalencePer1k: 11.3, fundingMillions: 150, milestone: 'AAP M-CHAT push' },
  { year: 2010, prevalencePer1k: 14.7, fundingMillions: 245, milestone: '1998 paper retracted' },
  { year: 2014, prevalencePer1k: 16.8, fundingMillions: 310, milestone: 'DSM-5 unified ASD' },
  { year: 2018, prevalencePer1k: 23.0, fundingMillions: 394 },
  { year: 2020, prevalencePer1k: 27.6, fundingMillions: 432, milestone: 'Equity gap reversed (1 in 36)' },
  { year: 2023, prevalencePer1k: 27.6, fundingMillions: 485, milestone: 'Adult catch-up wave' },
]
