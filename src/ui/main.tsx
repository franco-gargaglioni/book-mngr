import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.tsx'
import { SelectedBookProvider } from './context/SelectedBookContext.tsx'

createRoot(document.getElementById('root')!).render(
    <SelectedBookProvider>
        <App />
    </SelectedBookProvider>,
)
