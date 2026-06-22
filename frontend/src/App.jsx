import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { buyerNav, sellerNav, adminNav } from './routes/navConfig'

// Public
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import FAQ from './pages/public/FAQ'
import NotFound from './pages/NotFound'

// Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import PostRequirement from './pages/buyer/PostRequirement'
import MyRequirements from './pages/buyer/MyRequirements'
import RequirementDetails from './pages/buyer/RequirementDetails'
import QuotesReceived from './pages/buyer/QuotesReceived'
import QuoteComparison from './pages/buyer/QuoteComparison'
import Orders from './pages/buyer/Orders'
import Messages from './pages/buyer/Messages'
import Notifications from './pages/buyer/Notifications'
import Profile from './pages/buyer/Profile'
import Settings from './pages/buyer/Settings'
import AIFeatures from './pages/buyer/AIFeatures'

// Seller
import SellerDashboard from './pages/seller/SellerDashboard'
import BrowseRequirements from './pages/seller/BrowseRequirements'
import SubmitQuote from './pages/seller/SubmitQuote'
import SubmittedQuotes from './pages/seller/SubmittedQuotes'
import Reviews from './pages/seller/Reviews'
import SellerProfile from './pages/seller/SellerProfile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import RequirementManagement from './pages/admin/RequirementManagement'
import QuoteManagement from './pages/admin/QuoteManagement'
import OrderManagement from './pages/admin/OrderManagement'
import ReviewManagement from './pages/admin/ReviewManagement'
import Disputes from './pages/admin/Disputes'
import Analytics from './pages/admin/Analytics'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Buyer */}
        <Route
          element={
            <ProtectedRoute role="buyer">
              <DashboardLayout navItems={buyerNav} basePath="/buyer" />
            </ProtectedRoute>
          }
        >
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/buyer/post" element={<PostRequirement />} />
          <Route path="/buyer/requirements" element={<MyRequirements />} />
          <Route path="/buyer/requirements/:id" element={<RequirementDetails />} />
          <Route path="/buyer/quotes" element={<QuotesReceived />} />
          <Route path="/buyer/compare/:id" element={<QuoteComparison />} />
          <Route path="/buyer/orders" element={<Orders role="buyer" />} />
          <Route path="/buyer/ai" element={<AIFeatures />} />
          <Route path="/buyer/messages" element={<Messages />} />
          <Route path="/buyer/notifications" element={<Notifications />} />
          <Route path="/buyer/profile" element={<Profile />} />
          <Route path="/buyer/settings" element={<Settings />} />
        </Route>

        {/* Seller */}
        <Route
          element={
            <ProtectedRoute role="seller">
              <DashboardLayout navItems={sellerNav} basePath="/seller" />
            </ProtectedRoute>
          }
        >
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/browse" element={<BrowseRequirements />} />
          <Route path="/seller/requirements/:id" element={<SubmitQuote />} />
          <Route path="/seller/quotes" element={<SubmittedQuotes />} />
          <Route path="/seller/orders" element={<Orders role="seller" />} />
          <Route path="/seller/messages" element={<Messages />} />
          <Route path="/seller/reviews" element={<Reviews />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout navItems={adminNav} basePath="/admin" />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/requirements" element={<RequirementManagement />} />
          <Route path="/admin/quotes" element={<QuoteManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/reviews" element={<ReviewManagement />} />
          <Route path="/admin/disputes" element={<Disputes />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}
