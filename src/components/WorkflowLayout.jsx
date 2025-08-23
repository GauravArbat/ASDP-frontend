import { useWorkflow } from '../hooks/useWorkflow.js'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function WorkflowLayout({ children }) {
  const { currentStep, toasts } = useWorkflow()

  return (
    <div className="workflow-layout">
      {/* Sidebar */}
      <Sidebar currentStep={currentStep} />
      
      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: '280px' }}>
        {/* Navbar */}
        <Navbar currentStep={currentStep} />
        
        {/* Toast Notifications */}
        <div style={{
          position: 'fixed', 
          top: 20, 
          right: 20, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 10, 
          zIndex: 1080
        }}>
          {toasts.map(t => (
            <div key={t.id} className="toast-item" style={{
              background: '#fff', 
              borderLeft: `5px solid ${t.type === 'success' ? '#27ae60' : '#e74c3c'}`, 
              borderRadius: 10, 
              boxShadow: '0 10px 30px rgba(0,0,0,.12)', 
              padding: '12px 14px', 
              minWidth: 280, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10
            }}>
              <div className="icon" style={{
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                background: t.type === 'success' ? '#27ae60' : '#e74c3c'
              }}>
                <i className={`fas ${t.type === 'success' ? 'fa-check' : 'fa-triangle-exclamation'}`}></i>
              </div>
              <div>{t.message}</div>
            </div>
          ))}
        </div>
        
        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
