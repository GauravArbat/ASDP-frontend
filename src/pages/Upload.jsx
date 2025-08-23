import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../hooks/useWorkflow.js'
import { API_BASE_URL } from '../config.js'
import WorkflowLayout from '../components/WorkflowLayout.jsx'

export default function Upload() {
  const { setDatasetId, setSummary, notify, nextStep } = useWorkflow()
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const uploadFile = useCallback(async (file) => {
    const form = new FormData()
    form.append('file', file)
    setBusy(true)
    
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, { 
        method: 'POST', 
        body: form, 
        credentials: 'include' 
      })
      const text = await res.text()
      const data = (() => { 
        try { 
          return JSON.parse(text) 
        } catch { 
          return { success: false, error: text } 
        } 
      })()
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      
      setSummary(data.summary)
      setDatasetId(data.dataset.id)
      notify('success', 'File uploaded successfully')
      nextStep()
      navigate('/summary')
    } catch (e) {
      notify('error', `Upload failed: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }, [setDatasetId, setSummary, notify, nextStep, navigate])

  const handleDrop = useCallback(async (evt) => {
    evt.preventDefault()
    const file = evt.dataTransfer?.files?.[0]
    if (!file) return
    await uploadFile(file)
  }, [uploadFile])

  return (
    <WorkflowLayout>
      <div className="upload-page" style={{ 
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
              <h1><i className="fas fa-cloud-upload-alt"></i> Upload Survey Data</h1>
              <p>Upload your survey data file to begin processing</p>
            </div>

            {/* Upload Area */}
            <div className="upload-section" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 40, 
              marginBottom: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)', 
              borderLeft: '5px solid #3498db'
            }}>
              <div
                className="upload-area"
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={handleDrop}
                style={{
                  border: '3px dashed #3498db', 
                  borderRadius: 15, 
                  padding: 60, 
                  textAlign: 'center', 
                  background: '#f8f9fa', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-cloud-upload-alt" style={{
                  fontSize: '4rem', 
                  color: '#3498db',
                  marginBottom: '20px'
                }}></i>
                <h3>Drag & Drop your survey data file here</h3>
                <p className="text-muted mb-4">
                  Supports CSV, Excel (.xlsx, .xls) files up to 16MB
                </p>
                <button className="btn btn-primary btn-lg" disabled={busy}>
                  <i className="fas fa-folder-open me-2"></i>
                  {busy ? 'Uploading...' : 'Choose File'}
                </button>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  style={{ display: 'none' }} 
                  onChange={(e) => { 
                    const f = e.target.files?.[0]
                    if (f) uploadFile(f) 
                  }} 
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="instructions" style={{
              background: '#fff', 
              borderRadius: 15, 
              padding: 25, 
              boxShadow: '0 10px 30px rgba(0,0,0,.1)'
            }}>
              <h4><i className="fas fa-info-circle me-2"></i>Upload Instructions</h4>
              <div className="row">
                <div className="col-md-4">
                  <div className="instruction-item" style={{ textAlign: 'center', padding: '20px' }}>
                    <i className="fas fa-file-csv" style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}></i>
                    <h5>Supported Formats</h5>
                    <p className="text-muted">CSV, Excel (.xlsx, .xls)</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="instruction-item" style={{ textAlign: 'center', padding: '20px' }}>
                    <i className="fas fa-weight-hanging" style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}></i>
                    <h5>File Size</h5>
                    <p className="text-muted">Maximum 16MB</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="instruction-item" style={{ textAlign: 'center', padding: '20px' }}>
                    <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}></i>
                    <h5>Data Privacy</h5>
                    <p className="text-muted">Your data is secure and private</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  )
}
