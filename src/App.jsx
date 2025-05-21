import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
function App() {
 

  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/repos" element={<h1>Repos</h1>} />
          <Route path="/repos/:owner/:repo" element={<h1>Repo Details</h1>} />
          <Route path="/repos/:owner/:repo/commits" element={<h1>Repo Commits</h1>} />
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
