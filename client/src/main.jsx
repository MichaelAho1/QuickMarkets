import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './HeaderBar/header.jsx'
import NavBar from './NavBar/nav.jsx'
import MarketSection from './MarketPage/marketSection.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="appContainer">
      <NavBar className="navBar" />
      <div className="mainContent">
        <Header className="header" />
        <MarketSection />
      </div>
    </div>
  </StrictMode>,
)
