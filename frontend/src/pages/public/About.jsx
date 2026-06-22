import { motion } from 'framer-motion'
import { FiTarget, FiHeart, FiShield, FiZap } from 'react-icons/fi'
import Avatar from '../../components/Avatar'
import { team } from '../../data/site'
import './public-pages.css'

const stats = [
  { val: '50K+', label: 'Requirements Posted' },
  { val: '25K+', label: 'Verified Sellers' },
  { val: '₹120Cr+', label: 'Business Value' },
  { val: '95%', label: 'Satisfaction Rate' },
]

const values = [
  { icon: <FiTarget />, title: 'Buyer First', desc: 'We put buyers in control. Post once, get competing offers, choose the best.' },
  { icon: <FiShield />, title: 'Trust & Safety', desc: 'Every seller is verified. Ratings, reviews and disputes keep quality high.' },
  { icon: <FiZap />, title: 'Powered by AI', desc: 'Smart price suggestions, seller matching and scam detection built in.' },
  { icon: <FiHeart />, title: 'Fair for Sellers', desc: 'Sellers win on merit — quality, price and reliability, not ad spend.' },
]

export default function About() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>Reinventing how buyers and sellers connect</h1>
          <p>We flipped the marketplace. Instead of endless searching, buyers post what they need and the best sellers come to them.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-stats">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="card about-stat" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="as-val gradient-text">{s.val}</div>
                <div className="muted">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="grid cols-2" style={{ alignItems: 'center', gap: 48 }}>
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 style={{ fontSize: '2rem', margin: '16px 0' }}>Make procurement effortless and transparent</h2>
              <p className="muted">
                Traditional marketplaces force buyers to browse thousands of listings and chase vendors.
                We believe it should be the other way around. Describe your requirement once and let
                verified sellers compete with their best quotes — saving you time and money.
              </p>
              <p className="muted mt-16">
                With AI-driven insights, real-time chat and a transparent review system, we make every
                transaction confident and fair for both sides.
              </p>
            </div>
            <div className="grid cols-2" style={{ gap: 16 }}>
              {values.map((v, i) => (
                <motion.div key={v.title} className="card value-card card-hover" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <span className="v-icon">{v.icon}</span>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{v.title}</h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our Team</span>
            <h2>The people behind the platform</h2>
          </div>
          <div className="grid cols-4">
            {team.map((m, i) => (
              <motion.div key={m.name} className="card team-card card-hover" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <Avatar name={m.name} size="lg" />
                </div>
                <strong>{m.name}</strong>
                <div className="muted" style={{ fontSize: '0.85rem' }}>{m.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
