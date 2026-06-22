import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { faqs } from '../../data/site'
import './public-pages.css'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">FAQ</span>
          <h1>Frequently asked questions</h1>
          <p>Everything you need to know about how the reverse marketplace works.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  {f.q}
                  <FiChevronDown className="faq-chevron" />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="faq-a-inner">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-32">
            <p className="muted mb-16">Still have questions?</p>
            <Link to="/contact" className="btn btn-primary">Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
