import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiAward, FiCheck, FiCreditCard, FiSmartphone, FiHome, FiChevronRight } from 'react-icons/fi'
import { formatINR } from '../utils/format'
import Avatar from './Avatar'
import StarRating from './StarRating'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

export default function QuoteCard({ quote, onAccept, onMessage, index = 0, accepted }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'upi' | 'netbank'
  const [sliderVal, setSliderVal] = useState(0)
  const [isPaid, setIsPaid] = useState(false)
  const paymentStarted = useRef(false)
  
  // Credit card fields
  const [cardNumber] = useState('4111 2222 3333 4444')
  const [cardName] = useState(user?.name || 'Demo Buyer')
  const [cardExpiry] = useState('12/29')

  // Cost breakdown
  const price = quote.price
  const serviceFee = Math.round(price * 0.025) // 2.5%
  const escrowFee = Math.round(price * 0.015) // 1.5%
  const grandTotal = price + serviceFee + escrowFee

  const handleCheckoutOpen = (e) => {
    e.stopPropagation()
    setSliderVal(0)
    setIsPaid(false)
    paymentStarted.current = false
    setShowCheckout(true)
  }

  const handlePaymentComplete = () => {
    if (paymentStarted.current) return
    paymentStarted.current = true
    setIsPaid(true)
    setTimeout(() => {
      onAccept() // Accepts quote in state
      setShowCheckout(false)
      navigate('/buyer/orders') // Redirects to Orders tracking
    }, 1800)
  }

  return (
    <motion.div
      className={`card quote-card ${quote.bestPrice ? 'best' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {quote.bestPrice && <span className="badge badge-success" style={{ position: 'absolute', top: 14, right: 14 }}>Best Price</span>}
      {quote.topRated && !quote.bestPrice && <span className="badge badge-brand" style={{ position: 'absolute', top: 14, right: 14 }}><FiAward /> Top Rated</span>}

      <div className="quote-top">
        <Avatar name={quote.seller} />
        <div>
          <div className="quote-name">{quote.seller}</div>
          <StarRating value={quote.rating} count={quote.reviews} size={13} />
        </div>
      </div>

      <p className="muted" style={{ fontSize: '0.88rem' }}>{quote.note}</p>

      <div className="quote-grid">
        <div>
          <div className="qg-val" style={{ color: 'var(--brand-500)' }}>{formatINR(quote.price)}</div>
          <div className="qg-label">Price</div>
        </div>
        <div>
          <div className="qg-val"><FiClock style={{ verticalAlign: '-2px' }} /> {quote.deliveryDays}d</div>
          <div className="qg-label">Delivery</div>
        </div>
        <div>
          <div className="qg-val">{quote.experience}</div>
          <div className="qg-label">Experience</div>
        </div>
      </div>

      <div className="flex gap-8">
        <button className="btn btn-ghost btn-sm w-full" onClick={onMessage}>Message</button>
        <button 
          className="btn btn-primary btn-sm w-full" 
          onClick={accepted ? undefined : handleCheckoutOpen} 
          disabled={accepted}
        >
          {accepted ? <><FiCheck /> Accepted</> : 'Proceed to Buy'}
        </button>
      </div>

      {/* Modern Checkout Modal */}
      <Modal 
        open={showCheckout} 
        onClose={() => !isPaid && setShowCheckout(false)} 
        title={isPaid ? "Processing Payment" : "Secured Checkout"}
        width="380px"
      >
        <AnimatePresence mode="wait">
          {isPaid ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '24px 0' }}
            >
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                </div>
              </div>
              <h3 style={{ marginTop: 16, color: '#4caf50' }}>Payment Successful!</h3>
              <p className="muted" style={{ fontSize: '0.88rem', marginTop: 8 }}>
                Quote from {quote.seller} accepted.
              </p>
              <p className="muted" style={{ fontSize: '0.82rem', marginTop: 4 }}>
                Creating order &amp; redirecting you...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Payment Methods tabs */}
              <div className="payment-tabs">
                <button 
                  type="button" 
                  className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FiCreditCard /> Card
                </button>
                <button 
                  type="button" 
                  className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <FiSmartphone /> UPI
                </button>
                <button 
                  type="button" 
                  className={`payment-tab-btn ${paymentMethod === 'netbank' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbank')}
                >
                  <FiHome /> Net Banking
                </button>
              </div>

              {/* Tab Contents */}
              {paymentMethod === 'card' && (
                <div style={{
                  width: '100%',
                  maxWidth: '280px',
                  height: '150px',
                  borderRadius: '16px',
                  background: 'var(--gradient-brand)',
                  color: '#fff',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 20px rgba(124, 77, 255, 0.25)',
                  margin: '0 auto 20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FiCreditCard size={22} style={{ opacity: 0.9 }} />
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: 1 }}>REVERSE PAY</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontFamily: 'monospace', letterSpacing: 2, margin: '8px 0' }}>
                    {cardNumber}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', opacity: 0.9 }}>
                    <div>
                      <div style={{ opacity: 0.6, fontSize: '0.55rem', textTransform: 'uppercase', marginBottom: 2 }}>Card Holder</div>
                      <div style={{ fontWeight: 600 }}>{cardName}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.6, fontSize: '0.55rem', textTransform: 'uppercase', marginBottom: 2 }}>Expires</div>
                      <div style={{ fontWeight: 600 }}>{cardExpiry}</div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div style={{ textAlign: 'center', margin: '0 auto 20px', maxWidth: '280px' }}>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', background: 'var(--surface-2)' }}>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Enter UPI ID (e.g., buyer@upi)" 
                      defaultValue={`${user?.email?.split('@')[0] || 'buyer'}@okaxis`}
                      style={{ textAlign: 'center', fontWeight: 600 }}
                    />
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
                      <span className="chip chip-soft" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>@okaxis</span>
                      <span className="chip chip-soft" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>@okhdfcbank</span>
                      <span className="chip chip-soft" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>@ybl</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbank' && (
                <div style={{ margin: '0 auto 20px', maxWidth: '280px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 8, 
                    border: '1px solid var(--border)', 
                    borderRadius: 8, 
                    padding: 8, 
                    background: 'var(--surface-2)' 
                  }}>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}>HDFC Bank</button>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}>SBI</button>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}>ICICI Bank</button>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}>Axis Bank</button>
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div style={{ padding: '0 8px 12px' }}>
                <div className="checkout-row">
                  <span className="dim">Quote Price</span>
                  <strong>{formatINR(price)}</strong>
                </div>
                <div className="checkout-row">
                  <span className="dim">Platform Fee (2.5%)</span>
                  <strong>{formatINR(serviceFee)}</strong>
                </div>
                <div className="checkout-row">
                  <span className="dim">Escrow Assurance Fee (1.5%)</span>
                  <strong>{formatINR(escrowFee)}</strong>
                </div>
                <div className="checkout-row">
                  <span>Grand Total</span>
                  <strong style={{ color: 'var(--brand-500)' }}>{formatINR(grandTotal)}</strong>
                </div>
              </div>

              {/* Swipe to Pay Slider */}
              <div className="swipe-container">
                <span className="swipe-text">Slide to Confirm &amp; Buy</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderVal} 
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setSliderVal(val)
                    if (val >= 95) {
                      handlePaymentComplete()
                    }
                  }} 
                  onMouseUp={() => {
                    if (sliderVal < 95) setSliderVal(0)
                  }}
                  onTouchEnd={() => {
                    if (sliderVal < 95) setSliderVal(0)
                  }}
                  className="swipe-slider"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </motion.div>
  )
}
