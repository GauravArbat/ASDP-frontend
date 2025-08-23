import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { WorkflowProvider } from './context/WorkflowContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Upload from './pages/Upload.jsx'
import Summary from './pages/Summary.jsx'
import Configuration from './pages/Configuration.jsx'
import Outliers from './pages/Outliers.jsx'
import Weights from './pages/Weights.jsx'
import Results from './pages/Results.jsx'

function App() {
  return (
    <WorkflowProvider>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* Workflow Routes */}
        <Route path="/upload" element={<Upload />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/outliers" element={<Outliers />} />
        <Route path="/weights" element={<Weights />} />
        <Route path="/results" element={<Results />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WorkflowProvider>
  )
}

export default App
