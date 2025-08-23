import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../hooks/useWorkflow.js'
import WorkflowLayout from '../components/WorkflowLayout.jsx'

const isNumericType = (t) => typeof t === 'string' && (t.includes('float') || t.includes('int'))

export default function Outliers() {
  const { summary, config, setConfig, nextStep } = useWorkflow()
  const navigate = useNavigate()

  const numericColumns = useMemo(() => {
    if (!summary) return []
    return summary.column_names.filter((c) => isNumericType(summary.data_types[c]))
  }, [summary])

  const handleContinue = () => {
    nextStep()
    navigate('/weights')
  }

  if (!summary) {
    return (
      <WorkflowLayout>
        <div className="outliers-page" style={{ 
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
                <p>Please upload a file first to configure outlier detection.</p>
              </div>
            </div>
          </div>
        </div>
      </WorkflowLayout>
    )
  }

  return (
    <WorkflowLayout>
      <div className="outliers-page" style={{ 
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
              <h1><i className="fas fa-exclamation-triangle"></i> Outlier Detection & Handling</h1>
              <p>Configure outlier detection methods and handling strategies</p>
            </div>

            {/* Detection Methods */}
            <div className="detection-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #e74c3c'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-search me-2"></i> Detection Methods
              </h3>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Detection Method</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.outliers.detection_method} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      outliers: { ...c.outliers, detection_method: e.target.value }
                    }))}
                  >
                    <option value="iqr">Interquartile Range (IQR)</option>
                    <option value="zscore">Z-Score</option>
                    <option value="isolation_forest">Isolation Forest</option>
                    <option value="local_outlier_factor">Local Outlier Factor</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Threshold</label>
                  <input 
                    type="number" 
                    className="form-control form-control-lg" 
                    value={config.outliers.threshold} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      outliers: { ...c.outliers, threshold: parseFloat(e.target.value) }
                    }))}
                    min="1.5" 
                    max="5" 
                    step="0.1"
                    placeholder="2.0"
                  />
                  <small className="text-muted">Higher values = more outliers detected</small>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Columns to Check</label>
                  <select 
                    multiple 
                    className="form-select form-select-lg" 
                    value={config.outliers.columns} 
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setConfig(c => ({
                        ...c, 
                        outliers: { ...c.outliers, columns: selected }
                      }))
                    }}
                    style={{ height: '120px' }}
                  >
                    {numericColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                </div>
              </div>
            </div>

            {/* Handling Methods */}
            <div className="handling-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #f39c12'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-tools me-2"></i> Handling Strategies
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Handling Method</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.outliers.handling_method} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      outliers: { ...c.outliers, handling_method: e.target.value }
                    }))}
                  >
                    <option value="remove">Remove Outliers</option>
                    <option value="cap">Cap at Threshold</option>
                    <option value="winsorize">Winsorize (Replace with Percentiles)</option>
                    <option value="transform">Log/Box-Cox Transform</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Replacement Value</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    value={config.outliers.replacement_value} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      outliers: { ...c.outliers, replacement_value: e.target.value }
                    }))}
                    placeholder="mean, median, or custom value"
                  />
                  <small className="text-muted">For capping/winsorizing (optional)</small>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-eye me-2"></i> Configuration Preview
              </h3>
              <div className="row">
                <div className="col-md-6">
                  <h5>Selected Columns</h5>
                  {config.outliers.columns.length > 0 ? (
                    <div className="selected-columns">
                      {config.outliers.columns.map(col => (
                        <span key={col} className="badge bg-primary me-2 mb-2">{col}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No columns selected</p>
                  )}
                </div>
                <div className="col-md-6">
                  <h5>Settings Summary</h5>
                  <ul className="list-unstyled">
                    <li><strong>Method:</strong> {config.outliers.detection_method}</li>
                    <li><strong>Threshold:</strong> {config.outliers.threshold}</li>
                    <li><strong>Handling:</strong> {config.outliers.handling_method}</li>
                    {config.outliers.replacement_value && (
                      <li><strong>Replacement:</strong> {config.outliers.replacement_value}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section text-center" style={{ marginTop: '30px' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleContinue}
                disabled={config.outliers.columns.length === 0}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Continue to Survey Weights
              </button>
              {config.outliers.columns.length === 0 && (
                <p className="text-warning mt-2">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Please select at least one column for outlier detection
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  )
}
