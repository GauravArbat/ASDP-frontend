import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../hooks/useWorkflow.js'
import WorkflowLayout from '../components/WorkflowLayout.jsx'

const isNumericType = (t) => typeof t === 'string' && (t.includes('float') || t.includes('int'))

export default function Weights() {
  const { summary, config, setConfig, nextStep } = useWorkflow()
  const navigate = useNavigate()

  const numericColumns = useMemo(() => {
    if (!summary) return []
    return summary.column_names.filter((c) => isNumericType(summary.data_types[c]))
  }, [summary])

  const handleContinue = () => {
    nextStep()
    navigate('/results')
  }

  if (!summary) {
    return (
      <WorkflowLayout>
        <div className="weights-page" style={{ 
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
                <p>Please upload a file first to configure survey weights.</p>
              </div>
            </div>
          </div>
        </div>
      </WorkflowLayout>
    )
  }

  return (
    <WorkflowLayout>
      <div className="weights-page" style={{ 
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
              <h1><i className="fas fa-balance-scale"></i> Survey Weights & Estimation</h1>
              <p>Configure survey weights and statistical estimation parameters</p>
            </div>

            {/* Weight Configuration */}
            <div className="weights-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #f39c12'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-weight-hanging me-2"></i> Weight Configuration
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Weight Column</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.weights.column} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      weights: { column: e.target.value }
                    }))}
                  >
                    <option value="">No weights (Simple Random Sampling)</option>
                    {summary.column_names.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Select a column containing survey weights, or leave empty for unweighted analysis
                  </small>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Weight Normalization</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.weights.normalization} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      weights: { ...c.weights, normalization: e.target.value }
                    }))}
                  >
                    <option value="none">No normalization</option>
                    <option value="sum_to_n">Sum to sample size</option>
                    <option value="mean_one">Mean = 1</option>
                    <option value="min_one">Minimum = 1</option>
                  </select>
                  <small className="text-muted">
                    How to normalize the weights for analysis
                  </small>
                </div>
              </div>
            </div>

            {/* Estimation Configuration */}
            <div className="estimation-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #27ae60'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-calculator me-2"></i> Statistical Estimation
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Columns to Estimate</label>
                  <select 
                    multiple 
                    className="form-select form-select-lg" 
                    value={config.estimate_columns} 
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setConfig(c => ({
                        ...c, 
                        estimate_columns: selected
                      }))
                    }}
                    style={{ height: '120px' }}
                  >
                    {numericColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <small className="text-muted">Hold Ctrl/Cmd to select multiple columns</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Estimation Methods</label>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="estimateMean" 
                      checked={config.estimation_methods.includes('mean')}
                      onChange={(e) => {
                        const methods = e.target.checked 
                          ? [...config.estimation_methods, 'mean']
                          : config.estimation_methods.filter(m => m !== 'mean')
                        setConfig(c => ({
                          ...c, 
                          estimation_methods: methods
                        }))
                      }}
                    />
                    <label className="form-check-label" htmlFor="estimateMean">
                      Mean estimation
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="estimateTotal" 
                      checked={config.estimation_methods.includes('total')}
                      onChange={(e) => {
                        const methods = e.target.checked 
                          ? [...config.estimation_methods, 'total']
                          : config.estimation_methods.filter(m => m !== 'total')
                        setConfig(c => ({
                          ...c, 
                          estimation_methods: methods
                        }))
                      }}
                    />
                    <label className="form-check-label" htmlFor="estimateTotal">
                      Total estimation
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="estimateProportion" 
                      checked={config.estimation_methods.includes('proportion')}
                      onChange={(e) => {
                        const methods = e.target.checked 
                          ? [...config.estimation_methods, 'proportion']
                          : config.estimation_methods.filter(m => m !== 'proportion')
                        setConfig(c => ({
                          ...c, 
                          estimation_methods: methods
                        }))
                      }}
                    />
                    <label className="form-check-label" htmlFor="estimateProportion">
                      Proportion estimation
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="estimateRatio" 
                      checked={config.estimation_methods.includes('ratio')}
                      onChange={(e) => {
                        const methods = e.target.checked 
                          ? [...config.estimation_methods, 'ratio']
                          : config.estimation_methods.filter(m => m !== 'ratio')
                        setConfig(c => ({
                          ...c, 
                          estimation_methods: methods
                        }))
                      }}
                    />
                    <label className="form-check-label" htmlFor="estimateRatio">
                      Ratio estimation
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Intervals */}
            <div className="confidence-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #e74c3c'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <i className="fas fa-chart-line me-2"></i> Confidence Intervals
              </h3>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Confidence Level</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.confidence_level} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      confidence_level: parseFloat(e.target.value)
                    }))}
                  >
                    <option value="0.90">90%</option>
                    <option value="0.95">95% (Recommended)</option>
                    <option value="0.99">99%</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Bootstrap Method</label>
                  <select 
                    className="form-select form-select-lg" 
                    value={config.bootstrap_method} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      bootstrap_method: e.target.value
                    }))}
                  >
                    <option value="percentile">Percentile</option>
                    <option value="bca">Bias-Corrected Accelerated</option>
                    <option value="normal">Normal Approximation</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Bootstrap Samples</label>
                  <input 
                    type="number" 
                    className="form-control form-control-lg" 
                    value={config.bootstrap_samples} 
                    onChange={(e) => setConfig(c => ({
                      ...c, 
                      bootstrap_samples: parseInt(e.target.value)
                    }))}
                    min="100" 
                    max="10000" 
                    step="100"
                    placeholder="1000"
                  />
                  <small className="text-muted">Number of bootstrap iterations</small>
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
                  <h5>Weight Settings</h5>
                  <ul className="list-unstyled">
                    <li><strong>Weight Column:</strong> {config.weights.column || 'None (unweighted)'}</li>
                    <li><strong>Normalization:</strong> {config.weights.normalization}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Estimation Settings</h5>
                  <ul className="list-unstyled">
                    <li><strong>Columns:</strong> {config.estimate_columns.length} selected</li>
                    <li><strong>Methods:</strong> {config.estimation_methods.join(', ')}</li>
                    <li><strong>Confidence Level:</strong> {config.confidence_level * 100}%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section text-center" style={{ marginTop: '30px' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleContinue}
                disabled={config.estimate_columns.length === 0 || config.estimation_methods.length === 0}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Continue to Results
              </button>
              {(config.estimate_columns.length === 0 || config.estimation_methods.length === 0) && (
                <p className="text-warning mt-2">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Please select columns and estimation methods to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  )
}
