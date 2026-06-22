import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../utils/storage'

const DataContext = createContext(null)

const EMPTY = { requirements: [], quotes: [], orders: [], notifications: [], reviews: [] }

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
const today = () => new Date().toISOString().slice(0, 10)

export function DataProvider({ children }) {
  const [data, setData] = useState(() => ({ ...EMPTY, ...storage.get('data', EMPTY) }))

  const API_BASE = '/api'

  const fetchData = async () => {
    try {
      const [reqs, qts, ords, notifs, revs] = await Promise.all([
        fetch(`${API_BASE}/requirements`).then((r) => r.json()),
        fetch(`${API_BASE}/quotes`).then((r) => r.json()),
        fetch(`${API_BASE}/orders`).then((r) => r.json()),
        fetch(`${API_BASE}/notifications`).then((r) => r.json()),
        fetch(`${API_BASE}/reviews`).then((r) => r.json())
      ])

      setData({
        requirements: reqs,
        quotes: qts,
        orders: ords,
        notifications: notifs,
        reviews: revs
      })
    } catch (err) {
      // Backend is offline, ignore and rely on local memory/storage
    }
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, 3000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    storage.set('data', data)
  }, [data])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'rm_data' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setData(parsed)
        } catch (err) {
          console.error('Failed to sync storage data:', err)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  /* ---------- Requirements ---------- */
  const addRequirement = async (form, user) => {
    try {
      const res = await fetch(`${API_BASE}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          subCategory: form.subCategory || '',
          budget: Number(form.budget) || 0,
          deadline: form.deadline,
          location: form.location || 'Remote',
          priority: form.priority || 'medium',
          postedBy: user?.id,
          buyerName: user?.name || 'Buyer',
          description: form.description || '',
          uploadedImages: form.uploadedImages || []
        })
      })
      const created = await res.json()
      fetchData()
      return created
    } catch (err) {
      console.error(err)
      const req = {
        id: uid('REQ'),
        title: form.title,
        category: form.category,
        subCategory: form.subCategory || '',
        budget: Number(form.budget) || 0,
        deadline: form.deadline,
        location: form.location || 'Remote',
        priority: form.priority || 'medium',
        status: 'open',
        postedBy: user?.id,
        buyerName: user?.name || 'Buyer',
        postedAt: today(),
        quotesCount: 0,
        description: form.description || '',
        uploadedImages: form.uploadedImages || [],
        images: form.uploadedImages ? form.uploadedImages.length : 0,
        aiRiskScore: Math.floor(Math.random() * 18) + 4,
      }
      setData((d) => ({ ...d, requirements: [req, ...d.requirements] }))
      return req
    }
  }

  const updateRequirement = async (id, patch) => {
    setData((d) => ({ ...d, requirements: d.requirements.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  }

  const deleteRequirement = async (id) => {
    try {
      await fetch(`${API_BASE}/requirements/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => ({
        ...d,
        requirements: d.requirements.filter((r) => r.id !== id),
        quotes: d.quotes.filter((q) => q.requirementId !== id),
      }))
    }
  }

  /* ---------- Quotes ---------- */
  const addQuote = async (form, req, seller) => {
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirementId: req.id,
          requirementTitle: req.title,
          buyerId: req.postedBy,
          buyer: req.buyerName,
          sellerId: seller?.id,
          seller: seller?.name || 'Seller',
          price: Number(form.price) || 0,
          deliveryDays: Number(form.deliveryDays) || 5,
          rating: seller?.rating || 0,
          reviews: seller?.reviews || 0,
          experience: seller?.experience || 'New seller',
          note: form.note || ''
        })
      })
      const created = await res.json()
      fetchData()
      return created
    } catch (err) {
      console.error(err)
      const quote = {
        id: uid('Q'),
        requirementId: req.id,
        requirementTitle: req.title,
        buyerId: req.postedBy,
        buyer: req.buyerName,
        sellerId: seller?.id,
        seller: seller?.name || 'Seller',
        price: Number(form.price) || 0,
        deliveryDays: Number(form.deliveryDays) || 5,
        rating: seller?.rating || 0,
        reviews: seller?.reviews || 0,
        experience: seller?.experience || 'New seller',
        note: form.note || '',
        status: 'pending',
        submittedAt: today(),
      }
      setData((d) => ({
        ...d,
        quotes: [quote, ...d.quotes],
        requirements: d.requirements.map((r) => (r.id === req.id ? { ...r, quotesCount: (r.quotesCount || 0) + 1 } : r)),
      }))
      return quote
    }
  }

  const updateQuote = (id, patch) =>
    setData((d) => ({ ...d, quotes: d.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) }))

  const deleteQuote = async (id) => {
    try {
      await fetch(`${API_BASE}/quotes/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => {
        const q = d.quotes.find((x) => x.id === id)
        return {
          ...d,
          quotes: d.quotes.filter((x) => x.id !== id),
          requirements: q
            ? d.requirements.map((r) => (r.id === q.requirementId ? { ...r, quotesCount: Math.max(0, (r.quotesCount || 1) - 1) } : r))
            : d.requirements,
        }
      })
    }
  }

  const acceptQuote = async (quoteId) => {
    try {
      const res = await fetch(`${API_BASE}/quotes/${quoteId}/accept`, { method: 'POST' })
      const order = await res.json()
      fetchData()
      return order
    } catch (err) {
      console.error(err)
      let created = null
      setData((d) => {
        const quote = d.quotes.find((q) => q.id === quoteId)
        if (!quote) return d
        const eta = new Date(Date.now() + (quote.deliveryDays || 5) * 86400000)
          .toISOString()
          .slice(0, 10)
        const order = {
          id: uid('ORD'),
          title: quote.requirementTitle,
          requirementId: quote.requirementId,
          seller: quote.seller,
          sellerId: quote.sellerId,
          buyer: quote.buyer,
          buyerId: quote.buyerId,
          amount: quote.price,
          status: 'accepted',
          date: today(),
          eta,
          progress: 10,
        }
        created = order
        return {
          ...d,
          quotes: d.quotes.map((q) =>
            q.requirementId === quote.requirementId
              ? { ...q, status: q.id === quoteId ? 'accepted' : 'rejected' }
              : q,
          ),
          requirements: d.requirements.map((r) => (r.id === quote.requirementId ? { ...r, status: 'in_progress' } : r)),
          orders: [order, ...d.orders],
        }
      })
      return created
    }
  }

  /* ---------- Orders ---------- */
  const updateOrder = async (id, patch) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }))
    }
  }

  /* ---------- Reviews ---------- */
  const addReview = async (review) => {
    try {
      await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => ({ ...d, reviews: [{ id: uid('rv'), date: today(), helpful: 0, ...review }, ...d.reviews] }))
    }
  }

  const deleteReview = (id) =>
    setData((d) => ({ ...d, reviews: d.reviews.filter((r) => r.id !== id) }))

  /* ---------- Notifications ---------- */
  const addNotification = async (n) => {
    try {
      await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n)
      })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => ({
        ...d,
        notifications: [
          { id: uid('n'), time: 'Just now', date: 'Today', read: false, ...n },
          ...d.notifications,
        ],
      }))
    }
  }

  const markNotificationsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-read`, { method: 'POST' })
      fetchData()
    } catch (err) {
      console.error(err)
      setData((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) }))
    }
  }

  const resetData = () => setData({ ...EMPTY })

  /* ---------- Selectors ---------- */
  const selectors = useMemo(() => ({
    requirementById: (id) => data.requirements.find((r) => r.id === id),
    quotesForRequirement: (reqId) => data.quotes.filter((q) => q.requirementId === reqId),
    myRequirements: (userId) => data.requirements.filter((r) => r.postedBy === userId),
    openRequirements: () => data.requirements.filter((r) => r.status === 'open'),
    quotesBySeller: (sellerId) => data.quotes.filter((q) => q.sellerId === sellerId),
    quotesForBuyer: (buyerId) => data.quotes.filter((q) => q.buyerId === buyerId),
    ordersForBuyer: (buyerId) => data.orders.filter((o) => o.buyerId === buyerId),
    ordersForSeller: (sellerId) => data.orders.filter((o) => o.sellerId === sellerId),
    reviewsForSeller: (sellerName) => data.reviews.filter((r) => r.target === sellerName),
  }), [data])

  return (
    <DataContext.Provider
      value={{
        ...data,
        addRequirement,
        updateRequirement,
        deleteRequirement,
        addQuote,
        updateQuote,
        deleteQuote,
        acceptQuote,
        updateOrder,
        addReview,
        deleteReview,
        addNotification,
        markNotificationsRead,
        resetData,
        ...selectors,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
