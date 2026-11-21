import { useState } from 'react'
import { Bot, RotateCcw, Send, ShieldCheck, Sparkles } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'agent' | 'user'
  text: string
  probability?: number
}

interface TraitRule {
  domain: string
  weight: number
  keywords: string[]
}

const TRAIT_RULES: TraitRule[] = [
  {
    domain: 'Sensory Sensitivity',
    weight: 18,
    keywords: [
      'noise',
      'loud',
      'sound',
      'light',
      'bright',
      'texture',
      'tag',
      'smell',
      'overwhelm',
      'overstim',
      'sensory',
      'crowd',
    ],
  },
  {
    domain: 'Social Masking & Camouflaging',
    weight: 20,
    keywords: [
      'mask',
      'exhaust',
      'drain',
      'script',
      'rehearse',
      'eye contact',
      'small talk',
      'pretend',
      'burnout',
      'social',
      'awkward',
    ],
  },
  {
    domain: 'Hyperfocus & Deep Interests',
    weight: 16,
    keywords: [
      'hyperfocus',
      'obsess',
      'special interest',
      'deep dive',
      'hours',
      'rabbit hole',
      'pattern',
      'detail',
      'focus',
      'adhd',
    ],
  },
  {
    domain: 'Routine & Predictability',
    weight: 16,
    keywords: [
      'routine',
      'change',
      'unexpected',
      'plan',
      'schedule',
      'predictable',
      'transition',
      'rigidity',
      'same',
    ],
  },
  {
    domain: 'Stimming & Regulation',
    weight: 14,
    keywords: [
      'stim',
      'fidget',
      'pace',
      'rock',
      'tap',
      'chew',
      'hand',
      'leg bounce',
      'repeat',
      'calm',
    ],
  },
  {
    domain: 'Literal & Direct Communication',
    weight: 14,
    keywords: [
      'literal',
      'sarcasm',
      'direct',
      'blunt',
      'misunderstand',
      'subtext',
      'cue',
      'tone',
    ],
  },
]

const QUICK_PROMPTS = [
  'Bright lights and loud rooms drain me fast, and I rehearse conversations.',
  'I hyperfocus for hours on patterns or coding, but struggle with sudden plan changes.',
  'I feel comfortable in most social settings and rarely notice sensory overload.',
]

function evaluateNeurodivergence(messages: ChatMessage[]): {
  probability: number
  band: string
  matchedDomains: string[]
} {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.text.toLowerCase())
    .join(' ')

  if (!userText.trim()) {
    return { probability: 18, band: 'Baseline (share traits to estimate)', matchedDomains: [] }
  }

  let score = 15
  const matchedDomains: string[] = []

  for (const rule of TRAIT_RULES) {
    const hits = rule.keywords.filter((kw) => userText.includes(kw)).length
    if (hits > 0) {
      matchedDomains.push(rule.domain)
      score += Math.min(rule.weight, Math.round(rule.weight * (0.65 + hits * 0.25)))
    }
  }

  // Mildly dampen if user explicitly reports low/no sensory or social friction
  if (
    userText.includes('rarely') ||
    userText.includes('never') ||
    userText.includes('comfortable in most')
  ) {
    score = Math.max(12, score - 14)
  }

  const probability = Math.min(94, Math.max(10, score))
  const band =
    probability >= 72
      ? 'High Trait Alignment'
      : probability >= 45
        ? 'Moderate Trait Alignment'
        : 'Lower Trait Alignment'

  return { probability, band, matchedDomains }
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'agent',
  text: 'Hi — I am a calm trait-reflection assistant. Share how you experience sensory input, social energy, focus, or routines, and I will estimate a probabilistic neurodivergent trait alignment.',
}

export function NeuroChatAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')

  const assessment = evaluateNeurodivergence(messages)

  const sendMessage = (rawText: string) => {
    const trimmed = rawText.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }
    const nextMessages = [...messages, userMsg]
    const nextEval = evaluateNeurodivergence(nextMessages)

    const domainNote =
      nextEval.matchedDomains.length > 0
        ? `Signals noticed in: ${nextEval.matchedDomains.join(', ')}.`
        : 'No strong sensory, masking, or routine-friction markers matched yet—feel free to share more specific everyday examples.'

    const agentMsg: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'agent',
      probability: nextEval.probability,
      text: `Updated estimate: ${nextEval.probability}% (${nextEval.band}). ${domainNote} You can add more details or ask about sensory, masking, or executive-function traits.`,
    }

    setMessages([...nextMessages, agentMsg])
    setInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section
      aria-labelledby="neuro-agent-heading"
      className="soft-card rounded-2xl border p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: 'var(--sage)' }}
          >
            <Bot className="h-3.5 w-3.5" />
            AI Trait-Reflection Agent
          </span>
          <h2 id="neuro-agent-heading" className="mt-1 text-base font-semibold tracking-tight">
            Neurodivergent Probability Estimator
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--sage-soft)',
              borderColor: 'var(--sage)',
              color: 'var(--sage)',
            }}
          >
            Estimated Chance: <span className="font-mono">{assessment.probability}%</span> •{' '}
            {assessment.band}
          </div>
          <button
            type="button"
            onClick={() => setMessages([INITIAL_MESSAGE])}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderColor: 'var(--border)',
            }}
            title="Reset conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Meter */}
      <div className="mt-4">
        <div
          className="h-2.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'var(--surface-alt)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${assessment.probability}%`,
              backgroundColor: 'var(--sage)',
            }}
          />
        </div>
      </div>

      {/* Chat Transcript */}
      <div
        className="mt-4 max-h-60 space-y-2.5 overflow-y-auto rounded-xl border p-3.5"
        style={{
          backgroundColor: 'var(--surface-alt)',
          borderColor: 'var(--border)',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] rounded-xl border px-3.5 py-2 text-sm"
              style={{
                backgroundColor:
                  msg.role === 'user' ? 'var(--sage-soft)' : 'var(--surface)',
                borderColor: msg.role === 'user' ? 'var(--sage)' : 'var(--border)',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-left text-xs"
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <Sparkles className="h-3 w-3 shrink-0" style={{ color: 'var(--sage)' }} />
            <span className="line-clamp-1">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe sensory, masking, focus, or routine experiences..."
          aria-label="Describe traits to estimate neurodivergent probability"
          className="flex-1 rounded-xl border px-3.5 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: 'var(--surface-alt)',
            borderColor: 'var(--border)',
          }}
        />
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: 'var(--sage-soft)',
            borderColor: 'var(--sage)',
            color: 'var(--sage)',
          }}
        >
          <Send className="h-4 w-4" />
          <span>Analyze</span>
        </button>
      </form>

      <p
        className="mt-3 flex items-center gap-1.5 text-[11px]"
        style={{ color: 'var(--text-muted)' }}
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--sage)' }} />
        Educational trait-reflection estimator only — not a medical or clinical diagnosis.
      </p>
    </section>
  )
}
