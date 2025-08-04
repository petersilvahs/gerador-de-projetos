import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ProjectForm } from './pages/ProjectForm'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-tarefa" element={<ProjectForm />} />
        <Route path="/edit/:id" element={<ProjectForm />} />
      </Routes>
    </Router>
  )
}
