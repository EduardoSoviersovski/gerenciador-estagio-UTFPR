import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

const path = window.location.pathname
const RootPage = path === '/dashboard' ? DashboardPage : LoginPage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)
