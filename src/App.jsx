import { MotionConfig } from 'motion/react'
import Backdrop from './components/Backdrop'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import OrderSection from './components/order/OrderSection'
import WhatsAppButton from './components/WhatsAppButton'
import { OrderProvider } from './hooks/OrderContext'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <OrderProvider>
        <Backdrop />
        <Header />
        <main>
          <Hero />
          <OrderSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </OrderProvider>
    </MotionConfig>
  )
}
