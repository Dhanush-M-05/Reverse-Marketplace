import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './auth-forms.css'

export default function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const dashFor = (role) =>
    role === 'admin' ? '/admin' : role === 'seller' ? '/seller' : '/buyer'

  const submit = async (e) => {
    e.preventDefault()
    const res = await login(form)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast(`Welcome back, ${res.user.name}!`)
    navigate(dashFor(res.user.role))
  }

  const quick = async (email) => {
    const res = await login({ email, password: 'demo123' })
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast(`Logged in as ${res.user.name}`)
    navigate(dashFor(res.user.role))
  }

  return (
    <motion.div
      className="auth-card auth-form"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Welcome Back!</h2>
      <p className="auth-sub">Login to your account to continue</p>

      <div className="demo-hint">
        <strong>Demo accounts:</strong> buyer@demo.com · seller@demo.com · admin@demo.com — password <strong>demo123</strong>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Email Address</label>
          <div className="input-icon">
            <FiMail />
            <input
              className="input"
              type="email"
              required
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setError('') }}
            />
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError('') }}
            />
            <button type="button" className="toggle" onClick={() => setShow((s) => !s)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {error && <div className="badge badge-danger" style={{ marginBottom: 14 }}>{error}</div>}

        <div className="row-between mb-16">
          <label className="remember"><input type="checkbox" /> Remember me</label>
          <Link to="/login" style={{ color: 'var(--brand-500)', fontSize: '0.88rem', fontWeight: 600 }}>Forgot Password?</Link>
        </div>

        <button className="btn btn-primary btn-block btn-lg" type="submit">Login</button>
      </form>

      <div className="auth-divider">OR</div>
      <div className="social-row">
        <button className="social-btn" onClick={() => quick('google.com')}><FaGoogle /> Google</button>
        <button className="social-btn" onClick={() => quick('facebook.com')}><FaFacebookF /> Facebook</button>
        <button className="social-btn" onClick={() => quick('apple.com')}><FaApple /> Apple</button>
      </div>

      <p className="auth-foot">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </motion.div>
  )
}
