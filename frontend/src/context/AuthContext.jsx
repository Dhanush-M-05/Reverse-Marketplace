import { createContext, useContext, useEffect, useState } from 'react'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

// The 3 demo accounts kept so the app is easy to explore. These are NOT
// marketplace content — they're login credentials. The demo seller is
// pre-approved; new sellers who register must be approved by an admin.
const demoUsers = [
  {
    id: 'demo-buyer',
    name: 'Demo Buyer',
    email: 'buyer@demo.com',
    password: 'demo123',
    role: 'buyer',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'Just joined Reverse Marketplace.',
  },
  {
    id: 'demo-seller',
    name: 'Demo Seller',
    email: 'seller@demo.com',
    password: 'demo123',
    role: 'seller',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'Premium seller on Reverse Marketplace.',
    rating: 4.8,
    reviews: 12,
    completed: 25,
    experience: '3+ Years',
    skills: ['Web Design', 'React Development', 'UI/UX Design'],
  },
  {
    id: 'demo-admin',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'System Administrator.',
  },
  {
    id: 'google-user',
    name: 'Google User',
    email: 'google.com',
    password: 'demo123',
    role: 'buyer',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'Logged in via Google.',
  },
  {
    id: 'facebook-user',
    name: 'Facebook User',
    email: 'facebook.com',
    password: 'demo123',
    role: 'seller',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'Logged in via Facebook.',
    rating: 4.5,
    reviews: 5,
    completed: 10,
    experience: '1 Year',
    skills: ['HTML/CSS', 'Javascript'],
  },
  {
    id: 'apple-user',
    name: 'Apple User',
    email: 'apple.com',
    password: 'demo123',
    role: 'buyer',
    status: 'active',
    verified: true,
    location: 'India',
    joined: '2026-06-15',
    bio: 'Logged in via Apple.',
  },
]

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(() => storage.get('user', null))

  const API_BASE = '/api'

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch users from Java backend:', err)
      setUsers(demoUsers)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = (u) => {
    setUser(u)
    if (u) storage.set('user', u)
    else storage.remove('user')
  }

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.ok) {
        persist(data.user)
      }
      return data
    } catch (err) {
      // Local fallback
      const match = demoUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase())
      if (!match) return { ok: false, error: 'Cannot connect to Java backend. Make sure it is running on port 8080.' }
      if (password && match.password && match.password !== password) return { ok: false, error: 'Incorrect password.' }
      persist(match)
      return { ok: true, user: match }
    }
  }

  const register = async ({ name, email, password, role }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      if (data.ok && !data.pending) {
        persist(data.user)
      }
      fetchUsers()
      return data
    } catch (err) {
      return { ok: false, error: 'Cannot connect to Java backend. Make sure it is running on port 8080.' }
    }
  }

  const approveUser = async (id) => {
    try {
      await fetch(`${API_BASE}/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
      setUsers((list) => list.map((u) => (u.id === id ? { ...u, status: 'active', verified: true } : u)))
    }
  }

  const rejectUser = async (id) => {
    try {
      await fetch(`${API_BASE}/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
      setUsers((list) => list.map((u) => (u.id === id ? { ...u, status: 'rejected' } : u)))
    }
  }

  const removeUser = async (id) => {
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
      fetchUsers()
    } catch (err) {
      console.error(err)
      setUsers((list) => list.filter((u) => u.id !== id))
    }
  }

  const setUserStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
      setUsers((list) => list.map((u) => (u.id === id ? { ...u, status } : u)))
    }
  }

  const logout = () => persist(null)

  const updateProfile = async (patch) => {
    const updated = { ...user, ...patch }
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      if (res.ok) {
        const data = await res.json()
        persist(data)
      }
      fetchUsers()
    } catch (err) {
      console.error(err)
      persist(updated)
    }
  }

  const pendingSellers = users.filter((u) => u.role === 'seller' && u.status === 'pending')

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        updateProfile,
        approveUser,
        rejectUser,
        removeUser,
        setUserStatus,
        pendingSellers,
        isAuthed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
