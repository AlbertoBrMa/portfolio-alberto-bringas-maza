import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Background     from './components/Background'
import Cursor         from './components/Cursor'
import ClickRipple    from './components/ClickRipple'
import ScrollProgress from './components/ScrollProgress'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Projects       from './components/Projects'
import Contact        from './components/Contact'
import ProjectDetail  from './pages/ProjectDetail'

function Home() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', '/')
      }, 80)
      return
    }
    const saved = sessionStorage.getItem('homeScroll')
    if (saved) {
      window.scrollTo(0, parseInt(saved))
      sessionStorage.removeItem('homeScroll')
    }
  }, [])

  return (
    <>
      <Background />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <>
      <ClickRipple />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
