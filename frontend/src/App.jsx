import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ─── useInView: fires once when element enters viewport ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── Animated counter ─────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, started] = useInView(0.3)
  useEffect(() => {
    if (!started) return
    let v = 0; const step = Math.ceil(target / 55)
    const id = setInterval(() => {
      v += step
      if (v >= target) { setCount(target); clearInterval(id) } else setCount(v)
    }, 20)
    return () => clearInterval(id)
  }, [started, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Reveal wrapper: fades + slides up on scroll ──────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={`reveal-wrap ${visible ? 'in-view' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── SVG Icons (animated) ─────────────────────────────── */
const ShieldIcon = ({ size = 20, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const CheckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const AlertIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const XCircleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const ZapIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const EyeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const ArrowRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

/* ─── Animated scanning icon for analyzing overlay ──────── */
function ScannerIcon() {
  return (
    <div className="scanner-wrap">
      <svg className="scanner-svg" viewBox="0 0 80 80" width="80" height="80">
        <circle className="scanner-ring scanner-ring-1" cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4"/>
        <circle className="scanner-ring scanner-ring-2" cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5"/>
        <circle className="scanner-dot" cx="40" cy="40" r="6" fill="currentColor"/>
        <line className="scanner-sweep" x1="40" y1="40" x2="40" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

/* ─── Floating particle background for hero ────────────── */
function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="particle" style={{
          '--x': `${Math.random() * 100}%`,
          '--y': `${Math.random() * 100}%`,
          '--size': `${2 + Math.random() * 3}px`,
          '--dur': `${4 + Math.random() * 6}s`,
          '--delay': `${Math.random() * 4}s`,
        }} />
      ))}
    </div>
  )
}

/* ─── ANALYSIS STEPS ─────────────────────────────────────── */
const ANALYZE_STEPS = [
  { text: 'Verifying company identity…',       icon: '🏢' },
  { text: 'Analyzing job posting integrity…',  icon: '📄' },
  { text: 'Checking recruiter authenticity…',  icon: '👤' },
  { text: 'Scanning communication channels…',  icon: '💬' },
  { text: 'Evaluating hiring process…',        icon: '⚙️' },
  { text: 'Calculating trust score…',          icon: '🔒' },
]

const CHECK_ICONS  = { company: '🏢', posting: '📄', recruiter: '👤', channel: '💬', process: '⚙️' }
const STATUS_LABEL = { pass: 'PASSED', warn: 'WARNING', fail: 'FAILED' }

async function analyze(form) {
  const res = await fetch('/api/v1/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: [form.description, form.salary && `Salary: ${form.salary}`, form.url && `Link: ${form.url}`].filter(Boolean).join('\n'),
      title: form.title, company: form.company, recruiter_email: form.recruiter, source: form.source,
    }),
  })
  if (!res.ok) throw new Error(res.status === 422 ? 'Please paste the job description.' : 'Analysis service error.')
  const d = await res.json()
  return { ...d, pct: d.trust_score, title: form.title || 'Job Posting', company: form.company || 'Unknown Company', recruiter: form.recruiter }
}

/* ─── SVG Confidence Ring ───────────────────────────────── */
function ConfidenceRing({ pct, verdict }) {
  const r = 30, circ = 2 * Math.PI * r
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t) }, [])
  const offset = animated ? circ - (circ * pct / 100) : circ
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 72 72" width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
        <circle className="ring-bg" cx="36" cy="36" r={r} />
        <circle className={`ring-fill ring-fill--${verdict}`} cx="36" cy="36" r={r}
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </svg>
      <div className="ring-label">
        <span className="ring-pct">{pct}%</span>
        <span className="ring-sub">confidence</span>
      </div>
    </div>
  )
}

/* ─── HOME PAGE ─────────────────────────────────────────── */
function HomePage({ onNavigate }) {
  const [quickDesc,     setQuickDesc]     = useState('')
  const [quickCompany,  setQuickCompany]  = useState('')
  const [quickRecruiter,setQuickRecruiter]= useState('')
  const [focused,       setFocused]       = useState(false)

  function handleQuickAnalyze() {
    if (!quickDesc.trim()) return
    onNavigate('detect', { description: quickDesc, company: quickCompany, recruiter: quickRecruiter, autoStart: true })
  }

  const howItWorks = [
    { n:'1', title:'Company Identity',      desc:'Domain intelligence, business registration checks, and official website corroboration to confirm the company actually exists.',       Icon: () => <span className="step-emoji">🏢</span> },
    { n:'2', title:'Job Posting Integrity', desc:'Scans for unrealistic salary claims, vague responsibilities, urgent language, and payment requests disguised as onboarding.',          Icon: () => <span className="step-emoji">📄</span> },
    { n:'3', title:'Recruiter Verification',desc:'Cross-references recruiter identity against LinkedIn profiles, company directories, and official career-page listings.',                Icon: () => <span className="step-emoji">👤</span> },
    { n:'4', title:'Communication Channel', desc:'Flags off-platform interviews, personal Gmail/Yahoo contacts, WhatsApp-only hiring, and suspicious redirect links.',                   Icon: () => <span className="step-emoji">💬</span> },
    { n:'5', title:'Hiring Process',        desc:'Detects red flags like upfront fees, equipment deposits, overpayment schemes, and requests for sensitive documents too early.',       Icon: () => <span className="step-emoji">⚙️</span> },
    { n:'✓', title:'Instant Verdict',       desc:'Get a clear Real / Suspicious / Fake verdict with a confidence score and actionable next steps tailored to the result.', highlight: true, Icon: () => <span className="step-emoji">🔒</span> },
  ]

  return (
    <div id="page-home">
      {/* ── Hero ── */}
      <div className="hero">
        <Particles />
        <div className="hero-badge anim-badge">
          <span className="badge-pulse" />
          🤖 AI-Assisted · Rules-Backed
        </div>
        <h1 className="hero-h1">
          Stop <span className="accent glow-text">Fake Jobs</span><br />
          Before They Stop You
        </h1>
        <p className="hero-p">
          Paste any job posting and TrustPath AI verifies company identity, recruiter authenticity,
          and hiring-process integrity in seconds.
        </p>

        <div className={`detect-box ${focused ? 'detect-box--focused' : ''}`}>
          <label>
            <SearchIcon size={13} /> Paste job description or URL
          </label>
          <textarea
            placeholder="Paste the job title, company name, description, or a link to the posting…"
            value={quickDesc}
            onChange={e => setQuickDesc(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <div className="detect-row">
            <input type="text" placeholder="Company name (optional)" value={quickCompany}   onChange={e => setQuickCompany(e.target.value)} />
            <input type="text" placeholder="Recruiter email (optional)" value={quickRecruiter} onChange={e => setQuickRecruiter(e.target.value)} />
            <button className="btn-analyze" onClick={handleQuickAnalyze}>
              <ZapIcon size={14} /> Analyze Now
            </button>
          </div>
        </div>

        {/* trust indicators */}
        <div className="hero-trust">
          {['No signup required', 'Results in &lt;10 seconds', 'Free forever'].map(t => (
            <span key={t} className="trust-pill">
              <CheckIcon size={11} />
              <span dangerouslySetInnerHTML={{ __html: t }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        {[
          { val: <Counter target={1} suffix=" in 7" />, lbl: 'Job postings are fraudulent' },
          { val: <span>AI + Rules</span>,             lbl: 'Hybrid detection engine' },
          { val: <Counter target={5} />,               lbl: 'Independent checks performed' },
          { val: <span>Seconds</span>,                lbl: 'Typical analysis time' },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="stat">
              <div className="stat-num accent">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── How it works ── */}
      <div className="section">
        <Reveal><div className="section-title">How TrustPath Works</div></Reveal>
        <Reveal delay={60}><div className="section-sub">Five independent verification checks run in parallel</div></Reveal>
        <div className="steps-grid">
          {howItWorks.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className={`step-card${s.highlight ? ' step-card--highlight' : ''}`}>
                <div className="step-card-top">
                  <div className="step-num">{s.n}</div>
                  <s.Icon />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── DETECT PAGE ─────────────────────────────────────────── */
function DetectPage({ initialData, onResult }) {
  const [form, setForm] = useState({
    title:       initialData?.title       || '',
    company:     initialData?.company     || '',
    source:      initialData?.source      || '',
    recruiter:   initialData?.recruiter   || '',
    salary:      initialData?.salary      || '',
    description: initialData?.description || '',
    url:         initialData?.url         || '',
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [stepIdx,   setStepIdx]   = useState(0)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState('')

  useEffect(() => { if (initialData?.autoStart) runAnalysis() }, [])

  function set(key) { return e => setForm(f => ({ ...f, [key]: e.target.value })) }

  async function runAnalysis() {
    setAnalyzing(true); setError(''); setStepIdx(0); setProgress(0)
    let i = 0
    const stepId = setInterval(() => { if (++i < ANALYZE_STEPS.length) setStepIdx(i); else clearInterval(stepId) }, 700)
    const progId = setInterval(() => setProgress(p => Math.min(p + 1.4, 97)), 60)
    try {
      // wait for both the API and the minimum animation time
      const [result] = await Promise.all([analyze(form), new Promise(r => setTimeout(r, ANALYZE_STEPS.length * 700))])
      setProgress(100)
      onResult(result)
    } catch (e) {
      setError(e instanceof TypeError ? 'Could not reach the analysis service.' : e.message)
      setAnalyzing(false)
    } finally {
      clearInterval(stepId); clearInterval(progId)
    }
  }

  function handleSubmit(e) { e.preventDefault(); runAnalysis() }

  return (
    <div id="page-detect">
      <div className="detect-page">
        <div className="breadcrumb">Home / <span>Detect</span></div>
        {!analyzing ? (
          <Reveal>
            <div className="detect-form-card">
              <div className="detect-form-header">
                <div className="detect-form-icon"><ShieldIcon size={22} /></div>
                <div>
                  <h2>Analyze a Job Posting</h2>
                  <p className="sub">Fill in what you know — the more detail, the more accurate the result.</p>
                </div>
              </div>
              {error && <div className="disclaimer" role="alert">❌ {error}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                  <label>Job Title *</label>
                  <input type="text" placeholder="e.g. Frontend Engineer — React" value={form.title} onChange={set('title')} required />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Company Name *</label>
                    <input type="text" placeholder="e.g. Stripe" value={form.company} onChange={set('company')} required />
                  </div>
                  <div className="form-field">
                    <label>Posting Source</label>
                    <select value={form.source} onChange={set('source')}>
                      <option value="">Select platform…</option>
                      {['LinkedIn','Indeed','Naukri','WhatsApp','Email','Telegram','Company Website','Other'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Recruiter Email / Contact</label>
                    <input type="text" placeholder="e.g. hr@company.com" value={form.recruiter} onChange={set('recruiter')} />
                  </div>
                  <div className="form-field">
                    <label>Salary Offered</label>
                    <input type="text" placeholder="e.g. ₹8–12 LPA or $80,000" value={form.salary} onChange={set('salary')} />
                  </div>
                </div>
                <div className="form-field">
                  <label>Full Job Description / Paste the Message</label>
                  <textarea placeholder="Paste the complete job description, message, or email you received…" value={form.description} onChange={set('description')} />
                </div>
                <div className="form-field">
                  <label>Job URL (if available)</label>
                  <input type="text" placeholder="https://…" value={form.url} onChange={set('url')} />
                </div>
                <button className="btn-full" type="submit">
                  <SearchIcon size={15} /> Run TrustPath Analysis
                </button>
              </form>
            </div>
          </Reveal>
        ) : (
          <div className="analyzing-overlay">
            <ScannerIcon />
            <div className="analyzing-title">Analyzing job posting…</div>

            {/* progress bar */}
            <div className="analyze-progress-track">
              <div className="analyze-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* step list */}
            <div className="analyze-steps-list">
              {ANALYZE_STEPS.map((s, i) => (
                <div key={i} className={`analyze-step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'pending'}`}>
                  <div className="analyze-step-icon">
                    {i < stepIdx ? <CheckIcon size={12} /> : <span>{s.icon}</span>}
                  </div>
                  <span className="analyze-step-text">{s.text}</span>
                  {i < stepIdx && <span className="analyze-step-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── RESULT PAGE ──────────────────────────────────────────── */
function ResultPage({ result, onCheckAnother, onHome }) {
  const { verdict, pct, title, company, engine } = result
  const trail = result.trail || []
  const draft = result.draft_message || ''
  const checks  = result.checks.map(c => ({ icon: CHECK_ICONS[c.id], name: c.label, status: STATUS_LABEL[c.status], cls: c.status, note: c.note }))
  const signals = result.signals.map(x => ({ dot: x.type, text: x.text }))
  const steps   = result.next_steps.map((x, i) => ({ n: i + 1, title: x.title, sub: x.detail }))
  const verdictLabel = verdict === 'real' ? '✓ Real Job' : verdict === 'fake' ? '✗ Likely Fake' : '⚠ Suspicious'
  const riskLabel    = verdict === 'real' ? 'Low risk'  : verdict === 'fake' ? 'High risk'     : 'Medium risk'

  return (
    <div id="page-result">
      <div className="result-page">
        <div className="breadcrumb">Home / Detect / <span>Result</span></div>

        {/* Verdict card */}
        <Reveal>
          <div className={`verdict-card verdict-card--${verdict}`}>
            {/* glow overlay */}
            <div className={`verdict-glow verdict-glow--${verdict}`} />
            <div className="verdict-header">
              <div>
                <div className={`verdict-label verdict-label--${verdict}`}>
                  {verdict === 'real' && <CheckIcon size={12} />}
                  {verdict === 'suspicious' && <AlertIcon size={12} />}
                  {verdict === 'fake' && <XCircleIcon size={12} />}
                  {verdictLabel}
                </div>
                <div className="verdict-title">{title}</div>
                <div className="verdict-company">{company}</div>
              </div>
              <ConfidenceRing pct={pct} verdict={verdict} />
            </div>
            <div className="confidence-bar-wrap">
              <div className="bar-labels">
                <span>Trust score</span>
                <span className={`risk-badge risk-badge--${verdict}`}>{riskLabel}</span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill bar-fill--${verdict}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="bar-labels" style={{ marginTop: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 5-check strip */}
        <div className="checks-grid">
          {checks.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className={`check-item check-item--${c.cls}`}>
                <div className="check-icon-wrap">
                  <span className="check-icon">{c.icon}</span>
                </div>
                <div className="check-name">{c.name}</div>
                <div className={`check-status check-status--${c.cls}`}>{c.status}</div>
                {c.note && <div className="check-name" title={c.note}>{c.note}</div>}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Signals + Next steps */}
        <div className="two-col">
          <Reveal>
            <div className="signal-card">
              <div className="card-title">
                <EyeIcon size={14} />
                {verdict === 'real' ? 'Positive signals found' : verdict === 'fake' ? 'Red flags detected' : 'Mixed signals'}
              </div>
              <div className="card-sub">
                {verdict === 'real' ? 'These patterns suggest a legitimate posting.' : verdict === 'fake' ? 'These patterns indicate fraud.' : 'Proceed with caution.'}
              </div>
              <ul className="signal-list">
                {signals.map((s, i) => (
                  <li key={i} style={{ animationDelay: `${i * 60}ms` }}>
                    <div className={`dot dot--${s.dot}`} />
                    {s.text}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="steps-card">
              <div className="card-title">
                <ArrowRightIcon size={14} /> Next steps
              </div>
              <div className="card-sub">
                {verdict === 'real' ? "This looks legitimate. Here's how to proceed." : verdict === 'fake' ? "Protect yourself — here's what to do now." : 'Take these precautions before proceeding.'}
              </div>
              <ul className="step-list">
                {steps.map((s, i) => (
                  <li key={i} style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="step-circle">{s.n}</div>
                    <div className="step-content">
                      <strong>{s.title}</strong>
                      <span>{s.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {trail.length > 0 && (
          <Reveal>
            <div className="signal-card" style={{ marginBottom: 20 }}>
              <div className="card-title"><SearchIcon size={14} /> What the agent investigated</div>
              <div className="card-sub">Live checks run for this posting.</div>
              <ul className="signal-list">
                {trail.map((t, i) => (<li key={i}><div className="dot dot--green" /><span><strong>{t.tool}</strong> {t.input}: {t.finding}</span></li>))}
              </ul>
            </div>
          </Reveal>
        )}

        {draft && (
          <Reveal>
            <div className="signal-card" style={{ marginBottom: 20 }}>
              <div className="card-title"><ArrowRightIcon size={14} /> Message to verify the recruiter</div>
              <div className="card-sub">Drafted by the agent. Copy and send it before sharing anything.</div>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{draft}</p>
              <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => navigator.clipboard.writeText(draft)}>Copy message</button>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="disclaimer">
            ⚠️ This result comes from {engine === 'rules+agent' ? 'rules plus an AI agent investigation' : 'rules only'} and is a risk signal, not proof. It can be wrong. Always use your own judgment before applying to any job or sharing personal information.
          </div>
        </Reveal>

        <div className="action-row">
          <button className="btn-secondary" onClick={onCheckAnother}>Check another job</button>
          <button className="btn-primary" onClick={onHome}>Back to home</button>
        </div>
      </div>
    </div>
  )
}

/* ─── ABOUT PAGE ─────────────────────────────────────────── */
function AboutPage() {
  const problems = [
    { tag:'PS-01', title:'Fake Company Creation',          desc:'Fraudsters create fictitious companies with fabricated websites, addresses, employee profiles, and job openings.',      sol:'Company existence verification, domain intelligence, business identity checks, and independent source corroboration.' },
    { tag:'PS-02', title:'Genuine Company Impersonation',  desc:'Scammers pretend to represent Google, Amazon, Microsoft, startups, or other legitimate employers.',                    sol:'Compare official domains, recruiter identities, company contact details, and career-page job listings.' },
    { tag:'PS-03', title:'Lookalike Websites & Domains',   desc:'Fraudsters use domains resembling genuine company sites (e.g. careers-stripe.com instead of stripe.com).',           sol:'Domain similarity scoring, WHOIS age checks, SSL validation, and typosquatting detection.' },
    { tag:'PS-04', title:'Payment & Deposit Scams',        desc:'Candidates are asked to pay for training materials, background checks, or equipment deposits before starting.',       sol:'NLP scanning for payment-related language, financial red-flag patterns, and urgency triggers.' },
    { tag:'PS-05', title:'Off-Platform Communication',     desc:'Recruiters move conversations to WhatsApp, Telegram, or personal emails to avoid platform moderation.',              sol:'Communication channel analysis and cross-platform recruiter identity matching.' },
    { tag:'PS-06', title:'Overpayment & Data Theft',       desc:"Fake 'employers' send overpayment checks or harvest Aadhaar/PAN/SSN during fake onboarding flows.",                   sol:'Hiring-process sequence analysis and sensitive-data request detection at abnormal stages.' },
  ]
  return (
    <div id="page-about">
      <div className="about-page">
        <Reveal><h1>About TrustPath AI</h1></Reveal>
        <Reveal delay={60}><p className="lead">1 in 7 job postings online is fraudulent. TrustPath AI independently verifies company authenticity, recruiter identity, and hiring-process integrity so job seekers can apply with confidence.</p></Reveal>
        <Reveal delay={80}><div className="section-title" style={{ textAlign:'left', marginBottom:8, fontSize:20 }}>Problem Catalogue</div></Reveal>
        <Reveal delay={100}><p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>Each fraud pattern is mapped to a specific AI detection solution.</p></Reveal>
        <div className="problem-grid">
          {problems.map((p, i) => (
            <Reveal key={p.tag} delay={i * 60}>
              <div className="problem-card">
                <div className="problem-tag">{p.tag}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="ai-sol"><strong>AI solution:</strong> {p.sol}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="about-checks-box">
            <div className="about-checks-title">What TrustPath independently verifies</div>
            <div className="about-checks-grid">
              {['Company authenticity','Job posting authenticity','Recruiter authenticity','Application & communication channel authenticity','Hiring-process authenticity'].map((item, i) => (
                <div className="about-check-item" key={item}>
                  <span className="about-check-num">{i+1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="about-checks-note">
              One important distinction: a legitimate company can have a fake job posting impersonating it. Therefore, verifying the company alone is insufficient — TrustPath verifies all five dimensions independently.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ─── APP ROOT ──────────────────────────────────────────── */
export default function App() {
  const [page,       setPage]       = useState('home')
  const [detectInit, setDetectInit] = useState(null)
  const [result,     setResult]     = useState(null)

  function goTo(id, init = null) {
    setPage(id); if (init) setDetectInit(init); window.scrollTo(0, 0)
  }
  function handleResult(r) { setResult(r); setPage('result'); window.scrollTo(0, 0) }
  function handleCheckAnother() { setDetectInit(null); setPage('detect'); window.scrollTo(0, 0) }

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo" onClick={() => goTo('home')} style={{ cursor:'pointer' }}>
          <div className="logo-shield"><ShieldIcon size={16} /></div>
          TrustPath AI
        </div>
        <ul className="nav-links">
          {[['home','Home'],['detect','Detect'],['about','About']].map(([id,label]) => (
            <li key={id}>
              <a href="#" className={page === id ? 'active' : ''} onClick={e => { e.preventDefault(); goTo(id) }}>{label}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => goTo('detect')}>
          <ZapIcon size={13} /> Analyze a Job
        </button>
      </nav>

      <div className="page-anim" key={page}>
        {page === 'home'   && <HomePage   onNavigate={goTo} />}
        {page === 'detect' && <DetectPage initialData={detectInit} onResult={handleResult} onNavigate={goTo} />}
        {page === 'result' && result && <ResultPage result={result} onCheckAnother={handleCheckAnother} onHome={() => goTo('home')} />}
        {page === 'about'  && <AboutPage />}
      </div>
    </div>
  )
}
