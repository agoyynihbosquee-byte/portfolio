import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { portfolioData } from './data/portfolioData'
import photoBase64 from './photo'

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

/* ══ COMPONENTS ══ */
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
      if (e.target.closest('a,button,.bento-item,.pcard,.skcard,.ccard')) on()
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

/* ══ MAIN APP ══ */
export default function App() {
  const [active, setActive] = useState('Home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const { profile, pillars, skills, projects } = portfolioData

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120)
    const fn = () => {
      setScrolled(window.scrollY > 50)
      const sections = ['home', 'about', 'projects', 'skills', 'contact']
      sections.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= 120 && r.bottom >= 120) setActive(id.charAt(0).toUpperCase() + id.slice(1))
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const statsRef = useRef(null)
  const statsIn = useInView(statsRef, 0.3)
  const expCount = useCountUp(parseInt(profile.experienceYears), statsIn)
  const projCount = useCountUp(parseInt(profile.completedProjects), statsIn)

  return (
    <div className={`app ${loaded ? 'loaded' : ''}`}>
      <Cursor />
      
      {/* NAV */}
      <nav className={`nav ${scrolled ? 'solid' : ''}`}>
        <div className="nav-wrap">
          <a href="#home" className="brand">
            <span className="brand-box">Y</span>
            <span className="brand-name">YOGA<span className="brand-dot">.</span></span>
          </a>
          <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map(label => (
              <li key={label}>
                <a href={`#${label.toLowerCase()}`}
                  className={`nl ${active === label ? 'act' : ''}`}
                  onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <MagBtn href={profile.resumeUrl} className="nav-btn">Download CV</MagBtn>
          <button className={`ham ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
          <div className="grid" />
        </div>
        <div className={`hero-wrap ${loaded ? 'in' : ''}`}>
          <div className="hl">
            <div className="hello-badge">
              <span className="hb-wave">👋</span>
              <span>HELLO, I'M</span>
            </div>
            <h1 className="htitle">
              <span className="ht-name">{profile.name.split(' ').slice(0,2).join(' ')}</span>
              <span className="ht-last">{profile.name.split(' ').slice(2).join(' ')}</span>
              <span className="ht-role">
                <TypingText words={profile.titles} />
              </span>
            </h1>
            <p className="hdesc">{profile.tagline}</p>
            <div className="hbtns">
              <MagBtn href="#projects" className="btn-main">View My Work</MagBtn>
              <MagBtn href="#contact" className="btn-ghost">Contact Me</MagBtn>
            </div>
            <div className="hsocials">
              <MagBtn href={profile.socials.instagram} target="_blank" className="sicon">IG</MagBtn>
              <MagBtn href={profile.socials.tiktok} target="_blank" className="sicon">TT</MagBtn>
              <MagBtn href={profile.socials.email} className="sicon">@</MagBtn>
            </div>
          </div>
          <div className="hr">
            <div className="agoy-hero-outer">
              <div className="ah-slideshow" />
              <div className="agoy-hero-box">
                <img src={photoBase64} alt={profile.name} className="hero-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT BENTO */}
      <section id="about" className="about">
        <div className="about-wrap">
          <div className="bento-grid">
            <Reveal className="bento-item b1">
              <span className="btag">ABOUT ME</span>
              <h2 className="btitle">Membangun Masa Depan Digital Melalui <span className="accent2">Kode.</span></h2>
              <p className="bdesc">{profile.aboutMe}</p>
              <div className="stats-row" ref={statsRef}>
                <div className="stat-item">
                  <span className="st-val">{statsIn ? expCount : 0}+</span>
                  <span className="st-lbl">Bulan Exp</span>
                </div>
                <div className="stat-item">
                  <span className="st-val">{statsIn ? projCount : 0}+</span>
                  <span className="st-lbl">Projects</span>
                </div>
              </div>
            </Reveal>
            {pillars.map((p, i) => (
              <Reveal key={i} delay={i * 100} className={`bento-item b${i + 2}`}>
                <span className="btag">{p.title}</span>
                <p className="bdesc">{p.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects">
        <div className="projects-wrap">
          <Reveal>
            <span className="sec-tag">PORTOFOLIO</span>
            <h2 className="sec-title">Proyek <span className="accent">Terpilih</span></h2>
          </Reveal>
          <div className="proj-grid">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 100} className="pcard">
                <div className="pc-img">
                   <div style={{fontSize: '4rem', opacity: 0.1, fontWeight: 900, fontFamily: 'var(--font-display)'}}>{p.title.charAt(0)}</div>
                </div>
                <div className="pc-content">
                  <h3 className="pc-title">{p.title}</h3>
                  <p className="pc-desc">{p.description}</p>
                  <div className="pc-tags">
                    {p.technologies.map(t => <span key={t} className="pc-tag">{t}</span>)}
                  </div>
                  <MagBtn href={p.liveUrl} target="_blank" className="pc-link">Live Demo ↗</MagBtn>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="skills">
        <div className="skills-wrap">
          <Reveal>
            <span className="sec-tag">KEAHLIAN</span>
            <h2 className="sec-title">Tech <span className="accent2">Stack</span></h2>
          </Reveal>
          <div className="sk-grid">
            {skills.flatMap(cat => cat.items).map((s, i) => (
              <Reveal key={i} delay={i * 30} className="skcard">
                <span className="sk-icon" style={{color: s.color}}>{s.icon}</span>
                <span className="sk-name">{s.name}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="contact-wrap">
          <Reveal>
            <span className="sec-tag">HUBUNGI SAYA</span>
            <h2 className="sec-title">Mari <span className="accent">Berkolaborasi</span></h2>
            <p className="hdesc" style={{margin: '0 auto 3rem'}}>Siap membawa proyek Anda ke level berikutnya dengan desain premium dan performa tinggi.</p>
          </Reveal>
          <div className="contact-grid">
            <MagBtn href={profile.socials.instagram} target="_blank" className="ccard">
              <span className="cc-icon">IG</span>
              <span className="cc-name">Instagram</span>
              <span className="cc-val">@ygbmaagptr_</span>
            </MagBtn>
            <MagBtn href={profile.socials.tiktok} target="_blank" className="ccard">
              <span className="cc-icon">TT</span>
              <span className="cc-name">TikTok</span>
              <span className="cc-val">@bimaa_e</span>
            </MagBtn>
            <MagBtn href={profile.socials.email} className="ccard">
              <span className="cc-icon">@</span>
              <span className="cc-name">Email</span>
              <span className="cc-val">Kirim Pesan</span>
            </MagBtn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-wrap">
          <div className="brand">
            <span className="brand-box sm">Y</span>
            <span>YOGA<span className="brand-dot">.</span></span>
          </div>
          <p className="copyright">© 2026 {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
