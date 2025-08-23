import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ currentStep = 1 }) {
  const location = useLocation()
  
  const steps = [
    { id: 1, path: '/upload', title: 'Upload Survey Data', icon: 'fa-cloud-upload-alt', description: 'Upload your survey data file' },
    { id: 2, path: '/summary', title: 'Data Summary', icon: 'fa-chart-bar', description: 'View data overview and statistics' },
    { id: 3, path: '/configuration', title: 'Processing Configuration', icon: 'fa-cogs', description: 'Configure data processing settings' },
    { id: 4, path: '/outliers', title: 'Outlier Detection', icon: 'fa-exclamation-triangle', description: 'Detect and handle outliers' },
    { id: 5, path: '/weights', title: 'Survey Weights', icon: 'fa-balance-scale', description: 'Configure survey weights and estimation' },
    { id: 6, path: '/results', title: 'Results & Reports', icon: 'fa-file-alt', description: 'View results and generate reports' }
  ]

  const isActive = (path) => location.pathname === path
  const isCompleted = (stepId) => stepId < currentStep
  const isCurrent = (stepId) => stepId === currentStep

  return (
    <div className="sidebar" style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
      color: '#fff',
      padding: '20px 0',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      <div className="sidebar-header" style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 style={{ margin: 0, color: '#fff' }}>
          <i className="fas fa-chart-line me-2"></i>
          ASDP Workflow
        </h4>
        <p style={{ margin: '10px 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
          Survey Data Processing
        </p>
      </div>

      <nav className="sidebar-nav" style={{ padding: '20px 0' }}>
        {steps.map((step) => (
          <Link
            key={step.id}
            to={step.path}
            className={`sidebar-item ${isActive(step.path) ? 'active' : ''} ${isCompleted(step.id) ? 'completed' : ''} ${isCurrent(step.id) ? 'current' : ''}`}
            style={{
              display: 'block',
              padding: '15px 20px',
              margin: '5px 0',
              textDecoration: 'none',
              color: '#fff',
              borderLeft: '4px solid transparent',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div className="step-icon" style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                background: isCompleted(step.id) ? '#27ae60' : 
                           isCurrent(step.id) ? '#3498db' : 
                           'rgba(255,255,255,0.2)',
                color: '#fff'
              }}>
                {isCompleted(step.id) ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <i className={`fas ${step.icon}`}></i>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: isActive(step.path) ? 'bold' : 'normal',
                  fontSize: '0.95rem'
                }}>
                  {step.title}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  opacity: 0.7,
                  marginTop: '2px'
                }}>
                  {step.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ 
        padding: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          Progress: {Math.round((currentStep / steps.length) * 100)}%
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '2px',
          marginTop: '8px'
        }}>
          <div style={{
            width: `${(currentStep / steps.length) * 100}%`,
            height: '100%',
            background: '#3498db',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>
    </div>
  )
}
