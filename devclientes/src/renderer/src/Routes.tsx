 /* import { Router, Route } from 'electron-router-dom'

import { Home } from './pages/home'
import { Detail } from './pages/detail'
import { About } from './pages/about'
import { Novajanela } from './pages/novajanela'
import { Create } from './pages/create'
import { Layout } from './components/layout'

export function Routes(){
  return(
    <Router
      main={
        <Route path='/' element={ <Layout/> } >
          <Route path='/' element={<Home/>} />
          <Route path='/create' element={<Create/>} />
          <Route path='/about' element={<About/>} />
            <Route path='/novajanela' element={<Novajanela/>} />
          <Route path='/detail' element={<Detail/>} />
        </Route>
      }
    />
  )
}   */

  import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Create from './pages/create'
import Detail from './pages/detail'
import NovaJanela from './pages/novajanela' // 🚀 importa a nova janela

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<Create />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/novajanela" element={<NovaJanela />} /> {/* 🚀 nova rota */}
      </Routes>
    </Router>
  )
}
