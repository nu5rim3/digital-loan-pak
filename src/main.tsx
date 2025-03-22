import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import "antd/dist/reset.css";

const baseUrl = import.meta.env.VITE_TENET + "-" + import.meta.env.VITE_BASE_URL || '/';

console.log('[baseUrl] - ', baseUrl)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={`/`}>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
)
