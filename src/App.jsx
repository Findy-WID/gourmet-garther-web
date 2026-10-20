import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ClosedNotice from './components/ClosedNotice'
import Toast from './components/Toast'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Product from './pages/Product'
import Workplace from './pages/Workplace'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'

// /admin is a separate app in public/admin — leave the React site to load it
function AdminRedirect() {
  useEffect(() => {
    window.location.replace('/admin/index.html')
  }, [])
  return null
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<Product />} />
          <Route path="/workplace" element={<Workplace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <ClosedNotice />
      <Toast />
    </>
  )
}
