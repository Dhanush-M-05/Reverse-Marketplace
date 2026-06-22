import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiBriefcase,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './auth-forms.css'

export default function Register() {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'buyer' })
  const [show, setShow] = useState(false)
  const [agree, setAgree] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!agree) {
      toast('Please accept the Terms & Conditions', 'error')
      return
    }
    const res = await register(form)
    if (!res.ok) {
      toast(res.error || 'Could not create account', 'error')
      return
    }
    if (res.pending) {
      toast('Account created! Your seller account is awaiting admin approval.', 'info')
      navigate('/login')
      return
    }
    toast('Account created successfully!')
    navigate(res.user.role === 'seller' ? '/seller' : '/buyer')
  }

  return (
    <motion.div
      className="auth-card auth-form"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Create Account</h2>
      <p className="auth-sub">Join as a Buyer or Seller</p>

      <form onSubmit={submit}>
        <div className="field">
          <label>Full Name</label>
          <div className="input-icon">
            <FiUser />
            <input className="input" required placeholder="John Doe" value={form.name} onChange={set('name')} />
          </div>
        </div>

        <div className="field">
          <label>Email Address</label>
          <div className="input-icon">
            <FiMail />
            <input className="input" type="email" required placeholder="john@example.com" value={form.email} onChange={set('email')} />
          </div>
        </div>

        <div className="field">
          <label>Phone Number</label>
          <div className="input-icon">
            <FiPhone />
            <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
          </div>
        </div>

        <div className="field">
          <label>Password</label>
          <div className="input-icon input-pass">
            <FiLock />
            <input
              className="input"
              type={show ? 'text' : 'password'}
              required
              placeholder="Create a strong password"
              value={form.password}
              onChange={set('password')}
            />
            <button type="button" className="toggle" onClick={() => setShow((s) => !s)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="field">
          <label>I want to join as</label>
          <div className="role-select">
            {[
              { id: 'buyer', icon: <FiShoppingBag />, title: 'Buyer', sub: 'Post requirements' },
              { id: 'seller', icon: <FiBriefcase />, title: 'Seller', sub: 'Send quotes' },
            ].map((r) => (
              <div
                key={r.id}
                className={`role-option ${form.role === r.id ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: r.id })}
              >
                <span className="ro-icon">{r.icon}</span>
                <strong>{r.title}</strong>
                <span>{r.sub}</span>
              </div>
            ))}
          </div>
          {form.role === 'seller' && (
            <p className="muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>
              Seller accounts require admin approval before you can log in.
            </p>
          )}
        </div>

        <label className="remember mb-16">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I agree to the Terms &amp; Conditions
        </label>

        <button className="btn btn-primary btn-block btn-lg" type="submit">Create Account</button>
      </form>

      <p className="auth-foot">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </motion.div>
  )
}
