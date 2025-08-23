import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../hooks/useWorkflow.js'
import WorkflowLayout from '../components/WorkflowLayout.jsx'

const isNumericType = (t) => typeof t === 'string' && (t.includes('float') || t.includes('int'))

export default function Summary() {
  const { summary, nextStep } = useWorkflow()
  const navigate = useNavigate()

  const numericColumns = useMemo(() => {
    if (!summary) return []
    return summary.column_names.filter((c) => isNumericType(summary.data_types[c]))
  }, [summary])

  const handleContinue = () => {
    nextStep()
    navigate('/configuration')
  }

  if (!summary) {
    return (
      <WorkflowLayout>
        <div className="summary-page" style={{ 
          padding: '20px',
          minHeight: '100vh',
          background: '#f8f9fa'
        }}>
          <div className="container-fluid">
            <div className="main-container" style={{
              background: 'rgba(255,255,255,.95)', 
              borderRadius: 20, 
              margin: 20, 
              padding: 30, 
              boxShadow: '0 20px 40px rgba(0,0,0,.1)'
            }}>
              <div className="text-center">
                <h2>No Data Available</h2>
                <p>Please upload a file first to view the summary.</p>
              </div>
            </div>
          </div>
        </div>
      </WorkflowLayout>
    )
  }

  return (
    <WorkflowLayout>
      <div className="summary-page" style={{ 
        padding: '20px',
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div className="container-fluid">
          <div className="main-container" style={{
            background: 'rgba(255,255,255,.95)', 
            borderRadius: 20, 
            margin: 20, 
            padding: 30, 
            boxShadow: '0 20px 40px rgba(0,0,0,.1)'
          }}>
            {/* Header */}
            <div className="header position-relative" style={{
              textAlign: 'center', 
              marginBottom: 40, 
              padding: 20, 
              background: 'linear-gradient(135deg,#2c3e50,#3498db)', 
              color: '#fff', 
              borderRadius: 15
            }}>
              <h1><i className="fas fa-chart-bar"></i> Data Summary</h1>
              <p>Overview of your uploaded survey data</p>
            </div>

            {/* Key Statistics */}
            <div className="stats-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #3498db'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-chart-pie me-2"></i>Key Statistics
              </h3>
              <div className="row">
                <div className="col-md-3">
                  <div className="stats-card" style={{
                    background: 'linear-gradient(135deg,#27ae60,#2ecc71)', 
                    color: '#fff', 
                    borderRadius: 15, 
                    padding: 20, 
                    textAlign: 'center', 
                    margin: '10px 0'
                  }}>
                    <div className="stats-number" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {summary.rows.toLocaleString()}
                    </div>
                    <div className="stats-label">Total Rows</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card" style={{
                    background: 'linear-gradient(135deg,#e74c3c,#c0392b)', 
                    color: '#fff', 
                    borderRadius: 15, 
                    padding: 20, 
                    textAlign: 'center', 
                    margin: '10px 0'
                  }}>
                    <div className="stats-number" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {summary.columns}
                    </div>
                    <div className="stats-label">Total Columns</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card" style={{
                    background: 'linear-gradient(135deg,#f39c12,#e67e22)', 
                    color: '#fff', 
                    borderRadius: 15, 
                    padding: 20, 
                    textAlign: 'center', 
                    margin: '10px 0'
                  }}>
                    <div className="stats-number" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {summary.missing_values.length}
                    </div>
                    <div className="stats-label">Columns with Missing Data</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card" style={{
                    background: 'linear-gradient(135deg,#27ae60,#2ecc71)', 
                    color: '#fff', 
                    borderRadius: 15, 
                    padding: 20, 
                    textAlign: 'center', 
                    margin: '10px 0'
                  }}>
                    <div className="stats-number" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {numericColumns.length}
                    </div>
                    <div className="stats-label">Numeric Variables</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Types Overview */}
            <div className="data-types-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-list me-2"></i>Data Types Overview
              </h3>
              <div className="row">
                <div className="col-md-6">
                  <h5>Column Names & Types</h5>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Data Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.column_names.map((col) => (
                          <tr key={col}>
                            <td>{col}</td>
                            <td>
                              <span className={`badge ${isNumericType(summary.data_types[col]) ? 'bg-success' : 'bg-info'}`}>
                                {summary.data_types[col]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-6">
                  <h5>Missing Values Summary</h5>
                  {summary.missing_values.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Column</th>
                            <th>Missing Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.missing_values.map((col) => (
                            <tr key={col}>
                              <td>{col}</td>
                              <td>
                                <span className="badge bg-warning">Has Missing Data</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle me-2"></i>
                      No missing values detected in your dataset!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section text-center" style={{ marginTop: '30px' }}>
              <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                <i className="fas fa-arrow-right me-2"></i>
                Continue to Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  )
}
