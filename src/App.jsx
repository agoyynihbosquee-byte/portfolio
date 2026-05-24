import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ── HOOKS ── */
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

function useCountUp(target, inView, duration = 1500) {
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

/* ── TYPING ANIMATION ── */
function TypingText({ words }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    if (waiting) {
      const t = setTimeout(() => setWaiting(false), 1200)
      return () => clearTimeout(t)
    }
    const current = words[wordIndex]
    if (!deleting && displayed === current) {
      setWaiting(true)
      setDeleting(true)
      return
    }
    if (deleting && displayed === '') {
      setDeleting(false)
      setWordIndex(i => (i + 1) % words.length)
      return
    }
    const speed = deleting ? 60 : 100
    const t = setTimeout(() => {
      setDisplayed(deleting
        ? current.slice(0, displayed.length - 1)
        : current.slice(0, displayed.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [displayed, deleting, waiting, wordIndex, words])

  return (
    <span className="typing-text">
      {displayed}<span className="typing-cursor">|</span>
    </span>
  )
}

/* ── PARTICLES ── */
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const pts = Array.from({ length: 38 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      o: Math.random() * 0.4 + 0.1,
    }))
    let raf
    function draw() {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,26,26,${p.o})`
        ctx.fill()
      })
      // draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(13,33,55,${0.06 * (1 - d / 100)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particles-canvas" />
}

/* ── SCROLL PROGRESS ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div className="scroll-progress" style={{ width: `${pct}%` }} />
}

/* ── CURSOR GLOW ── */
function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const fn = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

/* ── ANIMATED STAT ── */
function AnimatedStat({ value, label, inView }) {
  const isNumber = typeof value === 'number'
  const count = useCountUp(isNumber ? value : 0, inView)
  return (
    <div className="astat">
      <span className="astat-val">{isNumber ? count : value}</span>
      <span className="astat-lbl">{label}</span>
    </div>
  )
}

/* ── SKILLS SECTION ── */
const SKILLS = [
  'Node.js', 'React', 'JavaScript', 'TypeScript',
  'Express.js', 'PostgreSQL', 'REST API', 'Git',
  'HTML', 'CSS', 'Tailwind CSS', 'Docker',
]

function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, 0.1)
  return (
    <section id="skills" className="skills-section">
      <div className="skills-inner">
        <div className="section-head">
          <p className="section-label">KEAHLIAN</p>
          <h2 className="section-title">Teknologi yang <span className="hero-accent">Saya Kuasai</span></h2>
        </div>
        <div ref={ref} className="skills-chips">
          {SKILLS.map((s, i) => (
            <span key={s} className="skill-chip" style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
              transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── NAV LINKS ── */
const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Kontak', href: '#contact' },
]

/* ── MAIN APP ── */
export default function App() {
  const [activeNav, setActiveNav] = useState('Beranda')
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 150)
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = ['home', 'about', 'skills', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          const link = NAV_LINKS.find(n => n.href === `#${id}`)
          if (link) setActiveNav(link.label)
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const aboutRef = useRef(null)
  const aboutInView = useInView(aboutRef)
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, 0.3)
  const contactRef = useRef(null)
  const contactInView = useInView(contactRef)

  return (
    <div className="portfolio">
      <ScrollProgress />
      <CursorGlow />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="logo">
            <span className="logo-box">Y</span>
            <span className="logo-text">YOGA</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href}
                  className={`nav-link ${activeNav === link.label ? 'active' : ''}`}
                  onClick={() => { setActiveNav(link.label); setMenuOpen(false) }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-cta">Hubungi Saya</a>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span style={menuOpen ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
            <span style={menuOpen ? { opacity: 0, transform: 'translateX(-8px)' } : {}} />
            <span style={menuOpen ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <Particles />
        <div className={`hero-left ${heroVisible ? 'visible' : ''}`}>
          <p className="hero-label">
            <TypingText words={['FULL-STACK SOFTWARE ENGINEER', 'NODE.JS DEVELOPER', 'REACT DEVELOPER', 'WEB ENTHUSIAST']} />
          </p>
          <h1 className="hero-title">
            Halo, Saya<br />
            <span className="hero-accent">Yoga Bima</span><br />
            Anggara Putra.
          </h1>
          <p className="hero-desc">
            Membangun aplikasi web modern yang elegan, performa tinggi,
            dan berfokus pada pengalaman pengguna terbaik.
          </p>
          <div className="hero-actions">
            <a href="#skills" className="btn-primary">Lihat Keahlian</a>
            <a href="#contact" className="btn-secondary">
              <span className="play-icon">✉</span> Kontak Saya
            </a>
          </div>
          <div className="hero-socials">
            <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="social-chip wa">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="social-chip ig">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              @ygbmaagptr_
            </a>
            <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="social-chip tt">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg>
              bimaa_e
            </a>
          </div>
        </div>

        <div className={`hero-right ${heroVisible ? 'visible' : ''}`}>
          <div className="hero-visual">
            <div className="shape shape-blue" />
            <div className="shape shape-maroon" />
            <div className="shape shape-cream" />
            <div className="shape shape-dark" />
            <div className="shape-ring" />
          </div>
          <div className="badge-card">
            <div className="badge-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div className="badge-text">
              <strong>Full-Stack Dev</strong>
              <span>Node.js · React · PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Badge mobile only */}
        <div className="badge-card badge-mobile">
          <div className="badge-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div className="badge-text">
            <strong>Full-Stack Dev</strong>
            <span>Node.js · React · PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" ref={aboutRef} className={`about ${aboutInView ? 'visible' : ''}`}>
        <div className="about-inner">
          <div className="about-left">
            <p className="section-label">TENTANG SAYA</p>
            <h2 className="section-title">Siapa <span className="hero-accent">Yoga Bima?</span></h2>
            <p className="about-desc">
              Saya adalah Full-Stack Software Engineer yang bersemangat dalam membangun solusi digital yang berdampak. Dengan keahlian di Node.js dan React, saya membuat aplikasi web yang cepat, skalabel, dan mudah digunakan.
            </p>
            <p className="about-desc">
              Saya percaya bahwa kode yang baik bukan hanya tentang fungsi — tapi juga tentang kejelasan, pemeliharaan, dan pengalaman pengguna yang luar biasa.
            </p>
            <div ref={statsRef} className="about-stats">
              <AnimatedStat value={5} label="Bulan Pengalaman" inView={statsInView} />
              <AnimatedStat value={1} label="Proyek Selesai" inView={statsInView} />
              <AnimatedStat value="∞" label="Semangat Belajar" inView={statsInView} />
            </div>
          </div>
          <div className="about-right">
            <div className="about-card">
              <div className="about-avatar">YB</div>
              <div className="about-name">Yoga Bima Anggara Putra</div>
              <div className="about-role">Full-Stack Software Engineer</div>
              <div className="about-tags">
                {['Node.js', 'React', 'JavaScript', 'TypeScript', 'REST API', 'PostgreSQL'].map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <SkillsSection />

      {/* ── CONTACT ── */}
      <section id="contact" ref={contactRef} className={`contact-section ${contactInView ? 'visible' : ''}`}>
        <div className="contact-inner">
          <div className="section-head light">
            <p className="section-label light">KONTAK</p>
            <h2 className="section-title light">Hubungi <span style={{ color: '#C9363A' }}>Saya</span></h2>
            <p className="contact-subtitle">Tertarik bekerja sama? Jangan ragu untuk menghubungi saya!</p>
          </div>
          <div className="contact-cards">
            <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="contact-card">
              <div className="contact-card-icon" style={{ background: '#25D366' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div className="contact-card-label">WhatsApp</div>
                <div className="contact-card-val">088226547130</div>
              </div>
            </a>
            <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="contact-card">
              <div className="contact-card-icon" style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
              <div>
                <div className="contact-card-label">Instagram</div>
                <div className="contact-card-val">@ygbmaagptr_</div>
              </div>
            </a>
            <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="contact-card">
              <div className="contact-card-icon" style={{ background: '#000' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/></svg>
              </div>
              <div>
                <div className="contact-card-label">TikTok</div>
                <div className="contact-card-val">bimaa_e</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="footer-logo-box">Y</span>
            <span className="footer-logo-text">YOGA</span>
          </div>
          <p className="footer-copy">Website Yoga Bima Anggara Putra</p>
          <div className="footer-links">
            <a href="https://wa.me/6288226547130" target="_blank" rel="noreferrer" className="footer-link">WhatsApp</a>
            <span className="footer-dot">·</span>
            <a href="https://instagram.com/ygbmaagptr_" target="_blank" rel="noreferrer" className="footer-link">Instagram</a>
            <span className="footer-dot">·</span>
            <a href="https://tiktok.com/@bimaa_e" target="_blank" rel="noreferrer" className="footer-link">TikTok</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
