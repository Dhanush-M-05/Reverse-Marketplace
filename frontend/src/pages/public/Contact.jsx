import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { contactInfo } from '../../data/site'
import { useToast } from '../../context/ToastContext'
import './public-pages.css'

const icons = { mail: <FiMail />, phone: <FiPhone />, pin: <FiMapPin /> }

export default function Contact() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    toast('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact Us</span>
          <h1>Let&apos;s talk</h1>
          <p>Have a question or feedback? Our team is here to help you get the most out of the platform.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="stack gap-16">
            {contactInfo.map((c, i) => (
              <motion.div key={c.label} className="card contact-info-card" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <span className="ci-icon">{icons[c.icon]}</span>
                <div>
                  <div className="dim" style={{ fontSize: '0.78rem' }}>{c.label}</div>
                  <strong>{c.value}</strong>
                </div>
              </motion.div>
            ))}
            <div className="card card-pad">
              <h4 style={{ marginBottom: 8 }}>Support hours</h4>
              <p className="muted" style={{ fontSize: '0.9rem' }}>Mon–Sat · 9:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          <motion.form className="card card-pad" onSubmit={submit} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 style={{ marginBottom: 18 }}>Send us a message</h3>
            <div className="grid cols-2" style={{ gap: 16 }}>
              <div className="field"><label>Name</label><input className="input" required value={form.name} onChange={set('name')} placeholder="Your name" /></div>
              <div className="field"><label>Email</label><input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" /></div>
            </div>
            <div className="field"><label>Subject</label><input className="input" required value={form.subject} onChange={set('subject')} placeholder="How can we help?" /></div>
            <div className="field"><label>Message</label><textarea className="textarea" required value={form.message} onChange={set('message')} placeholder="Write your message..." /></div>
            <button className="btn btn-primary btn-lg" type="submit"><FiSend /> Send Message</button>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
