import { FormEvent, useMemo, useState } from 'react'
import { activeQuestions, Question, Role } from './questions'

type Answers = Record<string, string | string[]>
const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined

function sectionFor(question: Question) {
  const n = Number(question.id.slice(1))
  if (n <= 6) return 'About you'
  if (n <= 16) return 'Your training'
  if (n <= 26) return 'Your coaching'
  return 'BarLock feedback'
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null)
  const questions = useMemo(() => activeQuestions(role), [role])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'ready' | 'sending' | 'done' | 'failed'>('ready')
  const current = questions[step]
  const progress = Math.round(((step + 1) / questions.length) * 100)

  const change = (question: Question, value: string) => {
    setError('')
    if (question.id === 'q6') {
      const nextRole: Role = value.includes('trainer') ? 'coach' : 'client'
      setRole(nextRole)
      setAnswers(prev => ({ ...prev, q6: value }))
      return
    }
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }
  const toggle = (question: Question, value: string) => {
    setError('')
    const previous = (answers[question.id] as string[] | undefined) ?? []
    const exists = previous.includes(value)
    if (!exists && question.max && previous.length >= question.max) { setError(`Choose up to ${question.max} options.`); return }
    setAnswers(prev => ({ ...prev, [question.id]: exists ? previous.filter(item => item !== value) : [...previous, value] }))
  }
  const valid = () => Array.isArray(answers[current.id]) ? (answers[current.id] as string[]).length > 0 : Boolean(answers[current.id]?.toString().trim())
  const next = () => {
    if (!valid()) { setError('Please choose an answer before continuing.'); return }
    setError('')
    // Q6 determines the question path. Recalculate with the selected role before advancing.
    if (current.id === 'q6') { setStep(6); return }
    setStep(value => Math.min(value + 1, questions.length - 1))
  }
  const back = () => { setError(''); setStep(value => Math.max(value - 1, 0)) }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!valid()) { setError('Please add your answer before submitting.'); return }
    setStatus('sending'); setError('')
    const payload = { responseId: crypto.randomUUID(), submittedAt: new Date().toISOString(), role, answers, source: 'barlock-survey', website: '' }
    if (!endpoint) { setStatus('failed'); setError('Survey storage has not been configured yet. Add VITE_GOOGLE_APPS_SCRIPT_URL before publishing.'); return }
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to save response')
      setStatus('done')
    } catch { setStatus('failed'); setError('We could not save your response. Please check your connection and try again.') }
  }

  if (status === 'done') return <main className="shell"><section className="thank-you"><span className="check">✓</span><p className="eyebrow">Response recorded</p><h1>Thank you for helping shape BarLock.</h1><p>Your perspective matters. We’re building a stronger way to train, coach, and make progress visible.</p><button onClick={() => { setAnswers({}); setRole(null); setStep(0); setStatus('ready') }}>Share another response</button></section></main>
  if (!current) return null
  const isLast = step === questions.length - 1
  return <main className="shell"><header><div className="brand"><span className="mark">B</span><span>BARLOCK</span></div><p>Market validation survey</p></header><section className="hero"><p className="eyebrow">Own the Weight.</p><h1>Build the future of fitness with us.</h1><p>Answer a few focused questions about how you train or coach. It takes about 6 minutes.</p></section><section className="survey" aria-live="polite"><div className="progress-meta"><span>{sectionFor(current)}</span><span>Question {step + 1} of {questions.length}</span></div><div className="progress"><i style={{ width: `${progress}%` }} /></div><form onSubmit={submit}><fieldset><legend>{current.prompt}</legend>{current.helper && <small>{current.helper}</small>}<div className={current.type === 'scale' ? 'options scale' : 'options'}>{current.type === 'text' ? <textarea autoFocus value={(answers[current.id] as string) ?? ''} onChange={e => change(current, e.target.value)} placeholder="Write your thoughts here…" rows={5} /> : current.options?.map(option => <label key={option} className={(Array.isArray(answers[current.id]) ? answers[current.id].includes(option) : answers[current.id] === option) ? 'selected' : ''}><input type={current.type === 'multi' ? 'checkbox' : 'radio'} name={current.id} value={option} checked={current.type === 'multi' ? ((answers[current.id] as string[] | undefined) ?? []).includes(option) : answers[current.id] === option} onChange={() => current.type === 'multi' ? toggle(current, option) : change(current, option)} /> <span>{option}</span></label>)}</div></fieldset>{error && <p className="error" role="alert">{error}</p>}<div className="actions">{step > 0 ? <button className="secondary" type="button" onClick={back}>Back</button> : <span />}{isLast ? <button disabled={status === 'sending'}>{status === 'sending' ? 'Saving…' : 'Submit response'}</button> : <button type="button" onClick={next}>Continue <span>→</span></button>}</div></form></section><footer>Your answers are used only to help evaluate the BarLock concept.</footer></main>
}
