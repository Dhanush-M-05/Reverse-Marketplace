import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUpload from '../../components/FileUpload'
import { AIPriceCard } from '../../components/AIInsights'
import { categories } from '../../data/categories'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function PostRequirement() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { addRequirement } = useData()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', category: 'electronics', budget: '', deadline: '', location: '', priority: 'medium', description: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    await addRequirement(form, user)
    toast('Requirement posted! Sellers can now see it and send quotes.')
    navigate('/buyer/requirements')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Post New Requirement</h1>
          <p className="muted">Fill in the details and let verified sellers compete for it.</p>
        </div>
      </div>

      <div className="dash-split">
        <motion.form className="card panel" onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="field">
            <label>Title *</label>
            <input className="input" required placeholder="Need Gaming PC under ₹25000" value={form.title} onChange={set('title')} />
          </div>

          <div className="grid cols-2" style={{ gap: 16 }}>
            <div className="field">
              <label>Category *</label>
              <select className="select" value={form.category} onChange={set('category')}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select className="select" value={form.priority} onChange={set('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid cols-2" style={{ gap: 16 }}>
            <div className="field">
              <label>Budget (₹) *</label>
              <input className="input" type="number" required placeholder="25000" value={form.budget} onChange={set('budget')} />
            </div>
            <div className="field">
              <label>Deadline *</label>
              <input className="input" type="date" required value={form.deadline} onChange={set('deadline')} />
            </div>
          </div>

          <div className="field">
            <label>Location</label>
            <input className="input" placeholder="Chennai, Tamil Nadu" value={form.location} onChange={set('location')} />
          </div>

          <div className="field">
            <label>Description *</label>
            <textarea className="textarea" required placeholder="Describe what you need in detail..." value={form.description} onChange={set('description')} />
          </div>

          <div className="field">
            <label>Reference Images / Files</label>
            <FileUpload onChange={(images) => setForm((f) => ({ ...f, uploadedImages: images }))} />
          </div>

          <div className="flex gap-12 mt-8">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Post Requirement</button>
          </div>
        </motion.form>

        <div className="stack gap-16">
          <AIPriceCard />
          <div className="card card-pad">
            <h4 style={{ marginBottom: 10 }}>Tips for better quotes</h4>
            <ul className="stack gap-8 muted" style={{ fontSize: '0.88rem' }}>
              <li>✓ Be specific about your needs</li>
              <li>✓ Set a realistic budget &amp; deadline</li>
              <li>✓ Add reference images where possible</li>
              <li>✓ Respond quickly to seller questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
