import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AffiliateLanding from './pages/AffiliateLanding'
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AffiliateLanding />
    <Toaster />
  </React.StrictMode>,
)
