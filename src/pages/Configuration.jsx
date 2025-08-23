import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../hooks/useWorkflow.js'
import WorkflowLayout from '../components/WorkflowLayout.jsx'



export default function Configuration() {
  const { summary, config, setConfig, nextStep } = useWorkflow()
  const navigate = useNavigate()

  // Filter columns for imputation
  const availableColumns = useMemo(() => {
    if (!summary) return []
    return summary.column_names
  }, [summary])

  const handleContinue = () => {
    nextStep()
    navigate('/outliers')
  }

  if (!summary) {
    return (
      <WorkflowLayout>
        <div className="configuration-page" style={{ 
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
                <p>Please upload a file first to configure processing settings.</p>
              </div>
            </div>
          </div>
        </div>
      </WorkflowLayout>
    )
  }

  return (
    <WorkflowLayout>
      <div className="configuration-page" style={{ 
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
              <h1><i className="fas fa-cogs"></i> Processing Configuration</h1>
              <p>Configure data processing settings and parameters</p>
            </div>

            {/* Missing Value Imputation */}
            <div className="config-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #3498db'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 style={{ margin: 0, color: '#2c3e50' }}>
                  <i className="fas fa-magic me-2"></i> Missing Value Imputation
                </h3>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Imputation Method</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.imputation.method} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      imputation: { ...c.imputation, method: e.target.value }
                    }))}
                  >
                    <option value="mean">Mean</option>
                    <option value="median">Median</option>
                    <option value="mode">Mode</option>
                    <option value="forward_fill">Forward Fill</option>
                    <option value="backward_fill">Backward Fill</option>
                    <option value="interpolation">Linear Interpolation</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Columns to Process</label>
                  <select 
                    multiple 
                    className="form-select form-select-lg" 
                    value={config.imputation.columns} 
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setConfig(c => ({
                        ...c, 
                        imputation: { ...c.imputation, columns: selected }
                      }))
                    }}
                    style={{ height: '120px' }}
                  >
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Advanced Options</label>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="preserveStructure" 
                      checked={config.imputation.preserve_structure}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        imputation: { ...c.imputation, preserve_structure: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="preserveStructure">
                      Preserve data structure
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="generateReport" 
                      checked={config.imputation.generate_report}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        imputation: { ...c.imputation, generate_report: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="generateReport">
                      Generate imputation report
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Quality Checks */}
            <div className="config-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #27ae60'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-shield-alt me-2"></i> Data Quality Checks
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="checkDuplicates" 
                      checked={config.quality_checks.check_duplicates}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        quality_checks: { ...c.quality_checks, check_duplicates: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="checkDuplicates">
                      Check for duplicate records
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="validateTypes" 
                      checked={config.quality_checks.validate_types}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        quality_checks: { ...c.quality_checks, validate_types: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="validateTypes">
                      Validate data types
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="checkOutliers" 
                      checked={config.quality_checks.check_outliers}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        quality_checks: { ...c.quality_checks, check_outliers: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="checkOutliers">
                      Check for outliers
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="generateQualityReport" 
                      checked={config.quality_checks.generate_report}
                      onChange={(e) => setConfig(c => ({
                        ...c, 
                        quality_checks: { ...c.quality_checks, generate_report: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="generateQualityReport">
                      Generate quality report
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section text-center" style={{ marginTop: '30px' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleContinue}
                disabled={config.imputation.columns.length === 0}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Continue to Outlier Detection
              </button>
              {config.imputation.columns.length === 0 && (
                <p className="text-warning mt-2">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Please select at least one column for imputation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  )
}
