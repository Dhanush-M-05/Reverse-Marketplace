import { useState } from 'react'
import { FiSun, FiMoon, FiBell, FiLock, FiGlobe, FiTrash2 } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import '../dashboard.css'

function Toggle({ on, onChange }) {
  return (
    <button className={`switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="knob" />
    </button>
  )
}

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [prefs, setPrefs] = useState({ email: true, push: true, sms: false, marketing: false })

  const set = (k) => (v) => { setPrefs((p) => ({ ...p, [k]: v })); toast('Preference updated') }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="muted">Manage your account preferences.</p>
        </div>
      </div>

      <div className="stack gap-24" style={{ maxWidth: 720 }}>
        <div className="card panel">
          <h3 className="mb-16"><FiGlobe style={{ verticalAlign: '-2px' }} /> Appearance</h3>
          <div className="flex gap-12">
            <button className={`theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
              <FiSun /> Light
            </button>
            <button className={`theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
              <FiMoon /> Dark
            </button>
          </div>
        </div>

        <div className="card panel">
          <h3 className="mb-16"><FiBell style={{ verticalAlign: '-2px' }} /> Notifications</h3>
          {[
            ['email', 'Email notifications'],
            ['push', 'Push notifications'],
            ['sms', 'SMS alerts'],
            ['marketing', 'Marketing emails'],
          ].map(([k, label]) => (
            <div className="flex justify-between items-center" key={k} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{label}</span>
              <Toggle on={prefs[k]} onChange={set(k)} />
            </div>
          ))}
        </div>

        <div className="card panel">
          <h3 className="mb-16"><FiLock style={{ verticalAlign: '-2px' }} /> Security</h3>
          <div className="field"><label>Current Password</label><input className="input" type="password" placeholder="••••••••" /></div>
          <div className="field"><label>New Password</label><input className="input" type="password" placeholder="••••••••" /></div>
          <button className="btn btn-primary" onClick={() => toast('Password updated')}>Update Password</button>
        </div>

        <div className="card panel" style={{ borderColor: 'var(--danger)' }}>
          <h3 className="mb-8" style={{ color: 'var(--danger)' }}><FiTrash2 style={{ verticalAlign: '-2px' }} /> Danger Zone</h3>
          <p className="muted mb-16">Permanently delete your account and all associated data.</p>
          <button className="btn btn-danger" onClick={() => toast('Account deletion is disabled in demo', 'error')}>Delete Account</button>
        </div>
      </div>
    </div>
  )
}
