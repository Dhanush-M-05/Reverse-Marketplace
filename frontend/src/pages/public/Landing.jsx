import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight, FiZap, FiEdit3, FiUsers, FiBarChart2, FiCpu,
  FiMessageSquare, FiShield, FiCheckCircle,
} from 'react-icons/fi'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import { landingStats, features, steps, testimonials } from '../../data/site'
import { categories } from '../../data/categories'
import './landing.css'

const featureIcons = {
  post: <FiEdit3 />,
  compete: <FiUsers />,
  compare: <FiBarChart2 />,
  ai: <FiCpu />,
  chat: <FiMessageSquare />,
  secure: <FiShield />,
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
}

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="eyebrow"><FiZap /> Reverse Marketplace</span>
            <h1>
              Buyers Post. <span className="gradient-text">Sellers Compete.</span><br />
              You Choose Best.
            </h1>
            <p className="lead">
              Post your requirement, receive multiple competitive quotes from
              verified sellers, and choose the best offer — all in one premium platform.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Sign Up <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Login</Link>
            </div>
            <p className="hero-auth-hint muted">
              New here? <Link to="/register">Create an account</Link> to post a
              requirement or join as a seller — or <Link to="/login">log in</Link> to continue.
            </p>
            <div className="hero-trust">
              <div className="hero-avatars">
                {['John', 'Sara', 'Mike', 'Anya'].map((n) => (
                  <Avatar key={n} name={n} size="sm" />
                ))}
              </div>
              <span>Trusted by 25K+ verified sellers · 4.9/5 rating</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div>

              {[
              ].map((s) => (
                <div className="preview-seller" key={s.n}>
                  <Avatar name={s.n} size="sm" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.n}</div>
                    <StarRating value={s.rating} size={11} />
                  </div>
                  <span className="ps-price" style={{ color: s.best ? 'var(--success)' : 'var(--text)' }}>{s.p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="container">
          <div className="stats-strip">
            {landingStats.map((s, i) => (
              <motion.div
                key={s.label}
                className="card stat-pill"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="sp-val gradient-text">{s.value}</div>
                <div className="sp-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Reverse Marketplace</span>
            <h2>Everything you need to get the best deal</h2>
            <p>A complete reverse-marketplace experience powered by smart matching and AI insights.</p>
          </div>
          <div className="grid cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="card feature-card card-hover"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="feature-icon">{featureIcons[f.icon]}</span>
                <h3>{f.title}</h3>
                <p className="muted">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2>Four simple steps</h2>
            <p>From posting your requirement to choosing the winning quote.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="card step-card card-hover"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Categories</span>
            <h2>Post a requirement in any category</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                className="card cat-card card-hover"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="cat-emoji">{c.icon}</span>
                <strong>{c.name}</strong>
                <span className="cat-count">{c.count} requirements</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--surface)' }} id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Loved by buyers</span>
            <h2>What our users say</h2>
          </div>
          <div className="grid cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="card testi-card card-hover"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <StarRating value={t.rating} />
                <p>“{t.text}”</p>
                <div className="testi-author">
                  <Avatar name={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <div className="dim" style={{ fontSize: '0.82rem' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="section">
        <div className="container">
          <motion.div
            className="cta-band"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to get competitive quotes?</h2>
            <p>Post your first requirement in minutes and watch verified sellers compete for your business.</p>
            <div className="flex gap-12" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/about" className="btn btn-ghost btn-lg">Learn More</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
