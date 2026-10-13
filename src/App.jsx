import Collection from './components/Collection'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import HowItWorks from './components/HowItWorks'
import OrderSection from './components/order/OrderSection'
import WhatsAppButton from './components/WhatsAppButton'
import { OrderProvider } from './hooks/OrderContext'

export default function App() {
  return (
    <OrderProvider>
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Collection />
        <HowItWorks />
        <OrderSection />
        <Faq />
      </main>
      <Footer />
      <WhatsAppButton />
    </OrderProvider>
  )
}
