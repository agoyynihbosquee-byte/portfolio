import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

/* ══ HOOKS ══ */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

function useCountUp(target, inView, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView || typeof target !== 'number') return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

/* ══ TYPING ══ */
function TypingText({ words }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    if (waiting) {
      const t = setTimeout(() => { setWaiting(false); setDeleting(true) }, 1600)
      return () => clearTimeout(t)
    }
    const current = words[wordIndex]
    if (!deleting && displayed === current) { setWaiting(true); return }
    if (deleting && displayed === '') { setDeleting(false); setWordIndex(i => (i + 1) % words.length); return }
    const t = setTimeout(() => setDisplayed(
      deleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)
    ), deleting ? 40 : 85)
    return () => clearTimeout(t)
  }, [displayed, deleting, waiting, wordIndex, words])
  return <span className="typing">{displayed}<span className="tcursor">|</span></span>
}

/* ══ AGOY INTERACTIVE ══ */
function AgoyText() {
  const [burst, setBurst] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(null)
  const [particles, setParticles] = useState([])
  const letters = ['A', 'G', 'O', 'Y']
  const colors = ['#a855f7', '#7c3aed', '#c084fc', '#e879f9']

  const triggerBurst = () => {
    setBurst(true)
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 3,
    }))
    setParticles(pts)
    setTimeout(() => { setBurst(false); setParticles([]) }, 800)
  }

  return (
    <div className="agoy-wrap" onClick={triggerBurst}>
      {letters.map((l, i) => (
        <span
          key={i}
          className={`agoy-letter ${burst ? 'burst' : ''} ${hoverIdx === i ? 'hov' : ''}`}
          style={{ '--ai': i, '--ac': colors[i], animationDelay: `${i * 0.12}s` }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {l}
        </span>
      ))}
      {particles.map(p => (
        <span key={p.id} className="agoy-particle"
          style={{ '--px': `${p.x}px`, '--py': `${p.y}px`, background: p.color, width: p.size, height: p.size }} />
      ))}
      <span className="agoy-hint">click me</span>
    </div>
  )
}

/* ══ AGOY HERO (right side, replaces photo) ══ */
function AgoyHero() {
  const [active, setActive] = useState(null)
  const [ripples, setRipples] = useState([])
  const [glitch, setGlitch] = useState(false)
  const [mode, setMode] = useState(0) // 0=normal,1=fire,2=wave,3=glitch
  const letters = ['A','G','O','Y']
  const palettes = [
    ['#a855f7','#7c3aed','#c084fc','#e879f9'],
    ['#f97316','#ef4444','#fb923c','#fbbf24'],
    ['#06b6d4','#3b82f6','#8b5cf6','#06d6a0'],
    ['#00ff41','#ff0080','#ffff00','#00ffff'],
  ]
  const cols = palettes[mode]

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(r => [...r, { id, x, y }])
    setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 900)
    setGlitch(true)
    setTimeout(() => setGlitch(false), 400)
    setMode(m => (m + 1) % 4)
  }

  return (
    <div className="agoy-hero-outer">
      {/* bg glow */}
      <div className="ah-bg-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${cols[0]}33, ${cols[1]}22, transparent 70%)` }} />
      {/* rings */}
      <div className="ah-ring ah-r1" style={{ borderColor: `${cols[0]}22` }} />
      <div className="ah-ring ah-r2" style={{ borderColor: `${cols[1]}18` }} />
      <div className="ah-ring ah-r3" style={{ borderColor: `${cols[2]}12` }} />

      {/* main clickable area */}
      <div className={`agoy-hero-box ${glitch ? 'ag-glitch' : ''}`} onClick={handleClick}>
        {ripples.map(r => (
          <span key={r.id} className="ah-ripple" style={{ left: r.x, top: r.y, background: cols[0] }} />
        ))}
        <div className="agoy-letters-big">
          {letters.map((l, i) => (
            <span
              key={i}
              className={`abl ${active === i ? 'abl-active' : ''}`}
              style={{
                '--col': cols[i],
                '--col2': cols[(i + 1) % 4],
                animationDelay: `${i * 0.18}s`,
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {l}
              <span className="abl-shadow">{l}</span>
            </span>
          ))}
        </div>
        <div className="ah-mode-label" style={{ color: cols[0] }}>
          {['NEON PURPLE','FIRE MODE','CYBER BLUE','GLITCH MODE'][mode]}
        </div>
        <div className="ah-click-hint">
          <span className="ah-cursor-icon">⚡</span>
          <span>click to change mode</span>
        </div>
      </div>

      {/* badges */}
      <div className="avail-badge ah-avail">
        <span className="ab-dot" />
        <span>Available for work</span>
      </div>
      <div className="exp-badge ah-exp">
        <span className="eb-num">5+</span>
        <span className="eb-txt">Bulan<br/>Pengalaman</span>
      </div>

      {/* floating code snippets */}
      <div className="ah-code ah-c1" style={{ borderColor: `${cols[0]}30`, color: cols[0] }}>{'<dev/>'}</div>
      <div className="ah-code ah-c2" style={{ borderColor: `${cols[2]}30`, color: cols[2] }}>{'{ yoga }'}</div>
      <div className="ah-code ah-c3" style={{ borderColor: `${cols[1]}30`, color: cols[1] }}>{'() =>'}</div>
    </div>
  )
}

/* ══ MAGNETIC BTN ══ */
function MagBtn({ children, className, href, onClick, target, rel }) {
  const ref = useRef(null)
  const move = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.3
    const y = (e.clientY - r.top - r.height / 2) * 0.3
    ref.current.style.transform = `translate(${x}px,${y}px)`
  }, [])
  const leave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }, [])
  const Tag = href ? 'a' : 'button'
  return (
    <Tag ref={ref} className={className} href={href} onClick={onClick}
      target={target} rel={rel}
      onMouseMove={move} onMouseLeave={leave}>
      {children}
    </Tag>
  )
}

/* ══ SCROLL PROGRESS ══ */
function ScrollBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement
      setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div className="scroll-bar" style={{ transform: `scaleX(${pct / 100})` }} />
}

/* ══ CURSOR ══ */
function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const lag = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move, { passive: true })
    let raf
    const tick = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.13
      lag.current.y += (pos.current.y - lag.current.y) * 0.13
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px)`
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    const on = () => { ring.current?.classList.add('h'); dot.current?.classList.add('h') }
    const off = () => { ring.current?.classList.remove('h'); dot.current?.classList.remove('h') }
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a,button,.skill-card,.pcard,.ccard')) on()
      else off()
    })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move) }
  }, [])
  return (
    <>
      <div ref={dot} className="cdot" />
      <div ref={ring} className="cring" />
    </>
  )
}

/* ══ REVEAL ══ */
function Reveal({ children, delay = 0, className = '', y = 30 }) {
  const ref = useRef(null)
  const inView = useInView(ref, 0.1)
  return (
    <div ref={ref} className={`rv ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, '--rv-y': `${y}px` }}>
      {children}
    </div>
  )
}

/* ══ DATA ══ */
const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = [
  { name: 'Node.js', icon: '⬡', color: '#68a063' },
  { name: 'React', icon: '⚛', color: '#61dafb' },
  { name: 'JavaScript', icon: 'JS', color: '#f7df1e' },
  { name: 'TypeScript', icon: 'TS', color: '#3178c6' },
  { name: 'Express.js', icon: '⚡', color: '#ffffff' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
  { name: 'REST API', icon: '⇄', color: '#ff6b6b' },
  { name: 'Git', icon: '⎇', color: '#f05032' },
  { name: 'HTML', icon: '</>', color: '#e34f26' },
  { name: 'CSS', icon: '✦', color: '#1572b6' },
  { name: 'Tailwind', icon: '🌊', color: '#38bdf8' },
  { name: 'Docker', icon: '🐳', color: '#2496ed' },
]

const PROJECT = {
  title: 'Portfolio Website',
  desc: 'Website portfolio personal yang dibangun dengan React + Vite. Menampilkan keahlian, pengalaman, dan cara menghubungi saya. Desain modern, responsif, dan penuh animasi.',
  tech: ['React', 'Vite', 'CSS3', 'Vercel'],
  link: 'https://yogabimaportfolio.vercel.app',
  year: '2025',
}

/* ══ MAIN ══ */
export default function App() {
  const [active, setActive] = useState('Home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120)
    const fn = () => {
      setScrolled(window.scrollY > 50)
      NAV.forEach(({ label, href }) => {
        const el = document.getElementById(href.slice(1))
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= 120 && r.bottom >= 120) setActive(label)
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const aboutRef = useRef(null); const aboutIn = useInView(aboutRef, 0.2)
  const statsRef = useRef(null); const statsIn = useInView(statsRef, 0.3)
  const projRef = useRef(null); const projIn = useInView(projRef, 0.2)
  const skillsRef = useRef(null); const skillsIn = useInView(skillsRef, 0.1)
  const contactRef = useRef(null); const contactIn = useInView(contactRef, 0.2)

  const exp = useCountUp(5, statsIn)
  const proj = useCountUp(1, statsIn)

  return (
    <div className={`app ${loaded ? 'loaded' : ''}`}>
      <Cursor />
      <ScrollBar />

      {/* ══ NAV ══ */}
      <nav className={`nav ${scrolled ? 'solid' : ''}`}>
        <div className="nav-wrap">
          <a href="#home" className="brand">
            <span className="brand-box">Y</span>
            <span className="brand-name">YOGA<span className="brand-dot">.</span></span>
          </a>
          <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
            {NAV.map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  className={`nl ${active === label ? 'act' : ''}`}
                  onClick={() => { setActive(label); setMenuOpen(false) }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <MagBtn href="#contact" className="nav-btn">
            Download CV
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </MagBtn>
          <button className={`ham ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
          <div className="grid" />
        </div>
        <div className={`hero-wrap ${loaded ? 'in' : ''}`}>
          {/* LEFT */}
          <div className="hl">
            <div className="hello-badge">
              <span className="hb-wave">👋</span>
              <span>HELLO, I'M</span>
            </div>
            <h1 className="htitle">
              <span className="ht-name">Yoga Bima</span>
              <span className="ht-last">Anggara Putra</span>
              <span className="ht-role">
                <TypingText words={['Full-Stack Engineer', 'Node.js Developer', 'React Specialist', 'Web Creator']} />
              </span>
            </h1>
            <p className="hdesc">
              Saya membangun aplikasi web modern yang elegan, performa tinggi,
              dan berfokus pada pengalaman pengguna terbaik.
            </p>
            <div className="hbtns">
              <MagBtn href="#projects" className="btn-main">
                View My Work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </MagBtn>
              <MagBtn href="#contact" className="btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Contact Me
              </MagBtn>
            </div>
            <div className="hsocials">
              <MagBtn href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="sicon" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </MagBtn>
              <MagBtn href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="sicon" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </MagBtn>
              <MagBtn href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="sicon" title="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg>
              </MagBtn>
            </div>
          </div>
          {/* RIGHT — AGOY HERO */}
          <div className="hr">
            <AgoyHero />
          </div>
        </div>
        <div className="scroll-hint">
          <div className="sm"><div className="sw" /></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="about">
        <div className="about-wrap">
          <div className="about-stats-row" ref={statsRef}>
            <div className="about-blurb">
              <span className="ab-tag">ABOUT ME</span>
              <h2 className="ab-title">Pelajar. Kreator. <span className="accent">Problem Solver.</span></h2>
              <p className="ab-desc">Saya adalah Full-Stack Software Engineer yang passionate membangun solusi digital berdampak. Saya percaya kode yang baik bukan hanya tentang fungsi, tapi juga tentang kejelasan dan pengalaman pengguna yang luar biasa.</p>
              <MagBtn href="#projects" className="ab-btn">More About Me <span>↗</span></MagBtn>
            </div>
            <div className="stats-grid">
              {[
                { icon: '</>', val: proj, suf: '+', label: 'Projects Completed' },
                { icon: '😊', val: 1, suf: '+', label: 'Happy Clients' },
                { icon: '🏆', val: exp, suf: '', label: 'Bulan Experience' },
                { icon: '🚀', val: 100, suf: '%', label: 'Commitment' },
              ].map((s, i) => (
                <div key={i} className="scard">
                  <span className="sc-icon">{s.icon}</span>
                  <span className="sc-val">{statsIn ? s.val : 0}{s.suf}</span>
                  <span className="sc-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" className="projects">
        <div className="projects-wrap">
          <Reveal>
            <span className="sec-tag">MY WORK</span>
            <div className="sec-head-row">
              <h2 className="sec-title">Selected <span className="accent">Projects</span></h2>
              <a href="#contact" className="view-all">View All Projects ↗</a>
            </div>
          </Reveal>
          <div ref={projRef} className="proj-grid">
            <div className={`pcard ${projIn ? 'in' : ''}`}>
              <div className="pc-top">
                <div className="pc-mockup">
                  <div className="pcm-bar"><span/><span/><span/></div>
                  <div className="pcm-content">
                    <div className="pcm-nav" />
                    <div className="pcm-hero" />
                    <div className="pcm-row"><div/><div/><div/></div>
                  </div>
                </div>
              </div>
              <div className="pc-body">
                <div className="pc-year">{PROJECT.year}</div>
                <h3 className="pc-title">{PROJECT.title}</h3>
                <p className="pc-desc">{PROJECT.desc}</p>
                <div className="pc-tech">
                  {PROJECT.tech.map(t => <span key={t} className="pc-tag">{t}</span>)}
                </div>
                <a href={PROJECT.link} target="_blank" rel="noreferrer" className="pc-link">
                  Live Demo ↗
                </a>
              </div>
            </div>
            {/* Placeholder card */}
            <div className="pcard pcard-empty">
              <div className="pce-inner">
                <span className="pce-icon">+</span>
                <span className="pce-txt">More projects<br/>coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" className="skills">
        <div className="skills-wrap">
          <Reveal>
            <span className="sec-tag">SKILLS</span>
            <h2 className="sec-title">Tech <span className="accent">Stack</span></h2>
          </Reveal>
          <div ref={skillsRef} className="sk-grid">
            {SKILLS.map((s, i) => (
              <div key={s.name} className="skcard"
                style={{
                  opacity: skillsIn ? 1 : 0,
                  transform: skillsIn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                  transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms`,
                  '--sk-color': s.color,
                }}>
                <span className="sk-icon">{s.icon}</span>
                <span className="sk-name">{s.name}</span>
                <div className="sk-glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" ref={contactRef} className={`contact ${contactIn ? 'in' : ''}`}>
        <div className="contact-orb c1" /><div className="contact-orb c2" />
        <div className="contact-wrap">
          <Reveal>
            <span className="sec-tag light">CONTACT</span>
            <h2 className="sec-title light">Let's <span className="accent2">Work Together</span></h2>
            <p className="contact-sub">Punya proyek menarik? Saya siap membantu mewujudkannya!</p>
          </Reveal>
          <div className="contact-list">
            {[
              { href: 'https://wa.me/6288226547130', bg: '#25D366', label: 'WhatsApp', val: '088226547130', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              { href: 'https://instagram.com/ygbmaagptr_', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', label: 'Instagram', val: '@ygbmaagptr_', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
              { href: 'https://tiktok.com/@bimaa_e', bg: '#010101', label: 'TikTok', val: 'bimaa_e', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg> },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 100}>
                <a href={c.href} target="_blank" rel="noreferrer" className="ccard">
                  <div className="cc-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div className="cc-info">
                    <div className="cc-lbl">{c.label}</div>
                    <div className="cc-val">{c.val}</div>
                  </div>
                  <div className="cc-arr">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer-wrap">
          <div className="fl">
            <span className="brand-box sm">Y</span>
            <span className="fn">YOGA<span className="brand-dot">.</span></span>
          </div>
          <p className="fc">© 2026 Yoga Bima Anggara Putra &nbsp;·&nbsp; Dibuat dari hati ❤️</p>
          <div className="flinks">
            <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="flink">WA</a>
            <span className="fd">·</span>
            <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="flink">IG</a>
            <span className="fd">·</span>
            <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="flink">TT</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
