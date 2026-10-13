import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initPixel } from './services/pixel'
import './styles/global.css'

initPixel()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
