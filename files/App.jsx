import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

/* ══════════════════════════════════════
   HOOKS
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
function TypingText({ words }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    if (waiting) { const t = setTimeout(() => { setWaiting(false); setDeleting(true) }, 1400); return () => clearTimeout(t) }
    const current = words[wordIndex]
    if (!deleting && displayed === current) { setWaiting(true); return }
    if (deleting && displayed === '') { setDeleting(false); setWordIndex(i => (i + 1) % words.length); return }
    const t = setTimeout(() => setDisplayed(deleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)), deleting ? 45 : 90)
    return () => clearTimeout(t)
  }, [displayed, deleting, waiting, wordIndex, words])
  return <span className="typing-wrap">{displayed}<span className="cursor">_</span></span>
}

/* ══════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════ */
function MagneticBtn({ children, className, href, onClick }) {
  const ref = useRef(null)
  const handleMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`
  }, [])
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }, [])
  const Tag = href ? 'a' : 'button'
  return (
    <Tag ref={ref} className={className} href={href} onClick={onClick}
      onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </Tag>
  )
}

/* ══════════════════════════════════════
   NOISE CANVAS BACKGROUND
══════════════════════════════════════ */
function NoiseCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 256; canvas.height = 256
    const imgData = ctx.createImageData(256, 256)
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255
      imgData.data[i] = v; imgData.data[i+1] = v; imgData.data[i+2] = v
      imgData.data[i+3] = 18
    }
    ctx.putImageData(imgData, 0, 0)
  }, [])
  return <canvas ref={canvasRef} className="noise-canvas" />
}

/* ══════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════ */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div className="scroll-bar" style={{ transform: `scaleX(${pct / 100})` }} />
}

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move, { passive: true })
    let raf
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    const onEnter = () => { ringRef.current?.classList.add('hovered'); dotRef.current?.classList.add('hovered') }
    const onLeave = () => { ringRef.current?.classList.remove('hovered'); dotRef.current?.classList.remove('hovered') }
    document.querySelectorAll('a,button,.skill-chip,.contact-card').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move) }
  }, [])
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

/* ══════════════════════════════════════
   GLITCH TEXT
══════════════════════════════════════ */
function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text}>
      {text}
    </span>
  )
}

/* ══════════════════════════════════════
   REVEAL WRAPPER
══════════════════════════════════════ */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, 0.1)
  return (
    <div ref={ref} className={`reveal-wrap ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════
   ANIMATED STAT
══════════════════════════════════════ */
function AnimatedStat({ value, label, inView, delay = 0 }) {
  const isNum = typeof value === 'number'
  const count = useCountUp(isNum ? value : 0, inView)
  return (
    <div className="astat" style={{ transitionDelay: `${delay}ms` }}>
      <span className="astat-val">{isNum ? count : value}</span>
      <span className="astat-lbl">{label}</span>
    </div>
  )
}

/* ══════════════════════════════════════
   SKILLS
══════════════════════════════════════ */
const SKILLS = [
  { name: 'Node.js', icon: '⬡' },
  { name: 'React', icon: '⚛' },
  { name: 'JavaScript', icon: 'JS' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Express.js', icon: '⚡' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'REST API', icon: '⇄' },
  { name: 'Git', icon: '⎇' },
  { name: 'HTML', icon: '◈' },
  { name: 'CSS', icon: '✦' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Docker', icon: '🐳' },
]

function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, 0.1)
  return (
    <section id="skills" className="skills-section">
      <NoiseCanvas />
      <div className="skills-inner">
        <Reveal>
          <p className="section-label">— KEAHLIAN</p>
          <h2 className="section-title">Stack yang Saya <span className="accent">Kuasai</span></h2>
        </Reveal>
        <div ref={ref} className="skills-grid">
          {SKILLS.map((s, i) => (
            <div key={s.name} className="skill-card"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0) rotateX(0)' : 'translateY(40px) rotateX(20deg)',
                transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms`,
              }}>
              <span className="skill-icon">{s.icon}</span>
              <span className="skill-name">{s.name}</span>
              <div className="skill-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Kontak', href: '#contact' },
]

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState('Beranda')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    const fn = () => {
      setScrolled(window.scrollY > 50)
      NAV_LINKS.forEach(({ label, href }) => {
        const el = document.getElementById(href.slice(1))
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= 120 && r.bottom >= 120) setActive(label)
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const aboutRef = useRef(null)
  const aboutInView = useInView(aboutRef, 0.2)
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, 0.3)
  const contactRef = useRef(null)
  const contactInView = useInView(contactRef, 0.2)

  return (
    <div className={`portfolio ${loaded ? 'loaded' : ''}`}>
      <CustomCursor />
      <ScrollProgress />
      <NoiseCanvas />

      {/* ══ NAVBAR ══ */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="logo">
            <span className="logo-mark">Y</span>
            <span className="logo-name">YOGA<span className="logo-dot">.</span></span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  className={`nav-link ${active === label ? 'active' : ''}`}
                  onClick={() => { setActive(label); setMenuOpen(false) }}>
                  <span className="nav-label">{label}</span>
                  <span className="nav-hover">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <MagneticBtn href="#contact" className="btn-nav">
            <span>Hubungi Saya</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </MagneticBtn>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          <div className="grid-lines" />
        </div>

        <div className={`hero-content ${loaded ? 'visible' : ''}`}>
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot" />
              <TypingText words={['Full-Stack Engineer', 'Node.js Developer', 'React Specialist', 'Web Enthusiast']} />
            </div>

            <h1 className="hero-title">
              <span className="line line1">Halo, Saya</span>
              <span className="line line2"><GlitchText text="Yoga Bima" /></span>
              <span className="line line3">Anggara Putra<span className="title-dot">.</span></span>
            </h1>

            <p className="hero-desc">
              Membangun aplikasi web modern yang elegan,<br />
              performa tinggi, dan berfokus pada<br />
              pengalaman pengguna terbaik.
            </p>

            <div className="hero-cta">
              <MagneticBtn href="#skills" className="btn-primary">
                <span className="btn-text">Lihat Keahlian</span>
                <span className="btn-bg" />
              </MagneticBtn>
              <MagneticBtn href="#contact" className="btn-outline">
                <span>Kontak Saya</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </MagneticBtn>
            </div>

            <div className="hero-socials">
              <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="social-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="social-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @ygbmaagptr_
              </a>
              <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="social-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg>
                bimaa_e
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="card-glow" />
              <div className="card-avatar">YB</div>
              <div className="card-info">
                <div className="card-name">Yoga Bima Anggara Putra</div>
                <div className="card-role">Full-Stack Software Engineer</div>
              </div>
              <div className="card-stats">
                <div className="cstat"><span>5</span><small>Bulan</small></div>
                <div className="cstat-div" />
                <div className="cstat"><span>1</span><small>Proyek</small></div>
                <div className="cstat-div" />
                <div className="cstat"><span>∞</span><small>Semangat</small></div>
              </div>
              <div className="card-tags">
                {['Node.js', 'React', 'PostgreSQL'].map(t => (
                  <span key={t} className="ctag">{t}</span>
                ))}
              </div>
              <div className="card-online">
                <span className="online-dot" />
                <span>Available for work</span>
              </div>
            </div>
            <div className="hero-deco">
              <div className="deco-ring deco-ring1" />
              <div className="deco-ring deco-ring2" />
              <div className="deco-ring deco-ring3" />
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="about">
        <div className="about-inner">
          <div ref={aboutRef} className={`about-left ${aboutInView ? 'in' : ''}`}>
            <Reveal><p className="section-label">— TENTANG SAYA</p></Reveal>
            <Reveal delay={100}>
              <h2 className="section-title">Siapa <span className="accent">Yoga Bima?</span></h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="about-desc">
                Saya adalah Full-Stack Software Engineer yang bersemangat dalam membangun
                solusi digital yang berdampak. Dengan keahlian di Node.js dan React,
                saya membuat aplikasi web yang cepat, skalabel, dan mudah digunakan.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="about-desc">
                Saya percaya bahwa kode yang baik bukan hanya tentang fungsi — tapi juga
                tentang kejelasan, pemeliharaan, dan pengalaman pengguna yang luar biasa.
              </p>
            </Reveal>
            <div ref={statsRef} className="about-stats">
              <AnimatedStat value={5} label="Bulan Pengalaman" inView={statsInView} delay={0} />
              <AnimatedStat value={1} label="Proyek Selesai" inView={statsInView} delay={100} />
              <AnimatedStat value="∞" label="Semangat Belajar" inView={statsInView} delay={200} />
            </div>
          </div>
          <div className="about-right">
            <Reveal delay={150} className="h-full">
              <div className="about-visual">
                <div className="av-bg" />
                <div className="av-card">
                  <div className="av-icon">⚡</div>
                  <div className="av-title">Fast & Scalable</div>
                  <div className="av-sub">Aplikasi performa tinggi</div>
                </div>
                <div className="av-card av-card2">
                  <div className="av-icon">🎨</div>
                  <div className="av-title">Elegant UI</div>
                  <div className="av-sub">Desain yang memukau</div>
                </div>
                <div className="av-card av-card3">
                  <div className="av-icon">🔒</div>
                  <div className="av-title">Secure</div>
                  <div className="av-sub">Keamanan terjamin</div>
                </div>
                <div className="av-initials">YB</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <SkillsSection />

      {/* ══ CONTACT ══ */}
      <section id="contact" ref={contactRef} className={`contact-section ${contactInView ? 'in' : ''}`}>
        <div className="contact-bg">
          <div className="orb orb-c1" />
          <div className="orb orb-c2" />
        </div>
        <div className="contact-inner">
          <Reveal>
            <p className="section-label light">— KONTAK</p>
            <h2 className="section-title light">Mari <span style={{ color: '#ff6b6b' }}>Terhubung</span></h2>
            <p className="contact-sub">Punya proyek menarik? Saya siap membantu mewujudkannya!</p>
          </Reveal>
          <div className="contact-cards">
            {[
              { href: 'https://wa.me/6288226547130', color: '#25D366', label: 'WhatsApp', val: '088226547130',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              { href: 'https://instagram.com/ygbmaagptr_', color: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', label: 'Instagram', val: '@ygbmaagptr_',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
              { href: 'https://tiktok.com/@bimaa_e', color: '#010101', label: 'TikTok', val: 'bimaa_e',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg> },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 120}>
                <a href={c.href} target="_blank" rel="noreferrer" className="ccard">
                  <div className="ccard-icon" style={{ background: c.color }}>{c.icon}</div>
                  <div className="ccard-info">
                    <div className="ccard-label">{c.label}</div>
                    <div className="ccard-val">{c.val}</div>
                  </div>
                  <div className="ccard-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="logo-mark sm">Y</span>
            <span>YOGA<span className="logo-dot">.</span></span>
          </div>
          <p className="footer-copy">Website Yoga Bima Anggara Putra</p>
          <div className="footer-links">
            <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="footer-link">WA</a>
            <span className="fdot">·</span>
            <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="footer-link">IG</a>
            <span className="fdot">·</span>
            <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="footer-link">TT</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
