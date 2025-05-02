import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Header from './reactComponents/layout/Header.jsx'
import Footer from './reactComponents/layout/Footer.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { ToastContainer } from 'react-toastify'

const publicKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
/* const proxyUrl = import.meta.env.VITE_CLERK_PROXY_URL
const frontendAPI = import.meta.env.VITE_FRONTEND_API_URL */

if (!publicKey) {
  throw new Error('Missing publishable key')
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={publicKey}
      >
        <div className="page-wrapper">
          <div className="overlay"></div>
          <Header />
          <App />
          <Footer />
        </div>
      </ClerkProvider>
    </BrowserRouter>
    <ToastContainer />
  </React.StrictMode>
)
