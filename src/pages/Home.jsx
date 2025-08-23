import { useCallback, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { API_BASE_URL } from '../config.js'

const isNumericType = (t) => typeof t === 'string' && (t.includes('float') || t.includes('int'))

export default function Home(){
	const [summary, setSummary] = useState(null)
	const [config, setConfig] = useState({
		imputation: { method: 'mean', columns: [] },
		outliers: { detection_method: 'iqr', handling_method: 'winsorize', columns: [] },
		weights: { column: '' },
		estimate_columns: []
	})
	const [datasetId, setDatasetId] = useState(null)
	const [busy, setBusy] = useState(false)
	const [results, setResults] = useState(null)
	const [toasts, setToasts] = useState([])
	const fileInputRef = useRef(null)

	const numericColumns = useMemo(() => {
		if (!summary) return []
		return summary.column_names.filter((c) => isNumericType(summary.data_types[c]))
	}, [summary])

	const notify = useCallback((type, message) => {
		const id = Math.random().toString(36).slice(2)
		setToasts((t) => [...t, { id, type, message }])
		setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
	}, [])

	const handleDrop = useCallback(async (evt) => {
		evt.preventDefault()
		const file = evt.dataTransfer?.files?.[0]
		if (!file) return
		
		const form = new FormData()
		form.append('file', file)
		setBusy(true)
		try {
			const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: form, credentials:'include' })
			const text = await res.text()
			const data = (() => { try { return JSON.parse(text) } catch { return { success: false, error: text } } })()
			if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`)
			// Use the summary from the backend response
			setSummary(data.summary)
			setDatasetId(data.dataset.id)
			notify('success', 'File uploaded successfully')
		} catch (e) {
			notify('error', `Upload failed: ${e.message}`)
		} finally {
			setBusy(false)
		}
	}, [notify])

	const uploadFile = useCallback(async (file) => {
		const form = new FormData()
		form.append('file', file)
		setBusy(true)
		try {
			const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: form, credentials:'include' })
			const text = await res.text()
			const data = (() => { try { return JSON.parse(text) } catch { return { success: false, error: text } } })()
			if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`)
			// Use the summary from the backend response
			setSummary(data.summary)
			setDatasetId(data.dataset.id)
			notify('success', 'File uploaded successfully')
		} catch (e) {
			notify('error', `Upload failed: ${e.message}`)
		} finally {
			setBusy(false)
		}
	}, [notify])

	const startProcessing = useCallback(async () => {
		setBusy(true)
		setResults(null)
		const payload = {
			config: {
				imputation: { method: config.imputation.method, columns: config.imputation.columns.length ? config.imputation.columns : null },
				outliers: { detection_method: config.outliers.detection_method, handling_method: config.outliers.handling_method, columns: config.outliers.columns.length ? config.outliers.columns : null },
				weights: { column: config.weights.column || null },
				estimate_columns: config.estimate_columns.length ? config.estimate_columns : null
			}
		}
		if (datasetId) payload.dataset_id = datasetId
		try {
			const res = await fetch(`${API_BASE_URL}/clean`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials:'include' })
			const data = await res.json()
			if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
			setResults(data)
			notify('success', 'Processing completed')
		} catch (e) {
			notify('error', `Processing failed: ${e.message}`)
		} finally {
			setBusy(false)
		}
	}, [config, datasetId, notify])

	const generateReport = useCallback(async (format) => {
		if (!datasetId) {
			notify('error', 'No dataset selected. Please upload a file first.')
			return
		}
		try {
			const res = await fetch(`${API_BASE_URL}/report`, { 
				method: 'POST', 
				headers: { 'Content-Type': 'application/json' }, 
				body: JSON.stringify({ dataset_id: datasetId, format }), 
				credentials:'include' 
			})
			
			if (format === 'pdf') {
				if (!res.ok) {
					const errorText = await res.text()
					throw new Error(errorText || `HTTP ${res.status}`)
				}
				
				const contentType = res.headers.get('content-type') || ''
				if (!contentType.includes('application/pdf')) {
					console.warn('Expected PDF but got:', contentType)
				}
				
				const blob = await res.blob()
				if (blob.size === 0) {
					throw new Error('Received empty PDF file')
				}
				
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = `survey_report_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.pdf`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
				notify('success', 'PDF report downloaded successfully')
			} else {
				const data = await res.json()
				if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
				const w = window.open()
				w.document.write(data.html_content)
				w.document.close()
			}
		} catch (e) {
			console.error('Report generation error:', e)
			notify('error', `Report failed: ${e.message}`)
		}
	}, [notify, datasetId])

	const downloadData = useCallback(async () => {
		if (!datasetId) {
			notify('error', 'No dataset selected. Please upload a file first.')
			return
		}
		try {
			const res = await fetch(`${API_BASE_URL}/download_data`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataset_id: datasetId }), credentials:'include' })
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			const blob = await res.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `processed_data_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`
			a.click()
		} catch (e) {
			notify('error', `Download failed: ${e.message}`)
		}
	}, [notify, datasetId])

	return (
		<div className="container-fluid">
			<Navbar />
			<div className="main-container" style={{background:'rgba(255,255,255,.95)', borderRadius:20, margin:20, padding:30, boxShadow:'0 20px 40px rgba(0,0,0,.1)'}}>
				{/* Toasts */}
				<div style={{position:'fixed', top:20, right:20, display:'flex', flexDirection:'column', gap:10, zIndex:1080}}>
					{toasts.map(t => (
						<div key={t.id} className="toast-item" style={{background:'#fff', borderLeft:`5px solid ${t.type==='success'?'#27ae60':'#e74c3c'}`, borderRadius:10, boxShadow:'0 10px 30px rgba(0,0,0,.12)', padding:'12px 14px', minWidth:280, display:'flex', alignItems:'center', gap:10}}>
							<div className="icon" style={{width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', background:t.type==='success'?'#27ae60':'#e74c3c'}}>
								<i className={`fas ${t.type==='success'?'fa-check':'fa-triangle-exclamation'}`}></i>
							</div>
							<div>{t.message}</div>
						</div>
					))}
				</div>

				{/* Header */}
				<div className="header position-relative" style={{textAlign:'center', marginBottom:40, padding:20, background:'linear-gradient(135deg,#2c3e50,#3498db)', color:'#fff', borderRadius:15}}>
					<h1><i className="fas fa-chart-line"></i> ASDP (AI Survey Data Processor)</h1>
					<p>Ministry of Statistics and Programme Implementation (MoSPI)</p>
					<p className="mb-0">Automated Data Preparation, Estimation and Report Writing</p>
				</div>

				{/* Step 1: Upload */}
				<div className="step-card" style={{background:'#fff', borderRadius:15, padding:25, marginBottom:25, boxShadow:'0 10px 30px rgba(0,0,0,.1)', borderLeft:'5px solid #3498db'}}>
					<div className="step-header" style={{display:'flex', alignItems:'center', marginBottom:20}}>
						<div className="step-number" style={{background:'#3498db', color:'#fff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', marginRight:15}}>1</div>
						<h3 className="step-title" style={{margin:0, color:'#2c3e50'}}>Upload Survey Data</h3>
					</div>

					<div
						className="upload-area"
						onDragOver={(e)=>{e.preventDefault();}}
						onDrop={handleDrop}
						style={{border:'3px dashed #3498db', borderRadius:15, padding:40, textAlign:'center', background:'#f8f9fa', cursor:'pointer'}}
						onClick={()=> fileInputRef.current?.click()}
					>
						<i className="fas fa-cloud-upload-alt feature-icon" style={{fontSize:'2rem', color:'#3498db'}}></i>
						<h4>Drag & Drop your survey data file here</h4>
						<p className="text-muted">Supports CSV, Excel (.xlsx, .xls) files up to 16MB</p>
						<input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{display:'none'}} onChange={(e)=>{ const f=e.target.files?.[0]; if(f) uploadFile(f) }} />
						<button className="btn btn-primary" disabled={busy}>
							<i className="fas fa-folder-open"></i> Choose File
						</button>
					</div>
				</div>

				{/* Step 2: Summary */}
				{summary && (
					<div className="step-card" style={{background:'#fff', borderRadius:15, padding:25, marginBottom:25, boxShadow:'0 10px 30px rgba(0,0,0,.1)', borderLeft:'5px solid #3498db'}}>
						<div className="step-header" style={{display:'flex', alignItems:'center', marginBottom:20}}>
							<div className="step-number" style={{background:'#3498db', color:'#fff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', marginRight:15}}>2</div>
							<h3 className="step-title" style={{margin:0, color:'#2c3e50'}}>Data Summary</h3>
						</div>
						<div className="row">
							<div className="col-md-3">
								<div className="stats-card" style={{background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'#fff', borderRadius:15, padding:20, textAlign:'center', margin:'10px 0'}}>
									<div className="stats-number" style={{fontSize:'2rem', fontWeight:'bold'}}>{summary.rows.toLocaleString()}</div>
									<div className="stats-label">Total Records</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="stats-card" style={{background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'#fff', borderRadius:15, padding:20, textAlign:'center', margin:'10px 0'}}>
									<div className="stats-number" style={{fontSize:'2rem', fontWeight:'bold'}}>{summary.columns}</div>
									<div className="stats-label">Variables</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="stats-card" style={{background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'#fff', borderRadius:15, padding:20, textAlign:'center', margin:'10px 0'}}>
									<div className="stats-number" style={{fontSize:'2rem', fontWeight:'bold'}}>{summary.missing_values.length}</div>
									<div className="stats-label">Columns with Missing Data</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="stats-card" style={{background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'#fff', borderRadius:15, padding:20, textAlign:'center', margin:'10px 0'}}>
									<div className="stats-number" style={{fontSize:'2rem', fontWeight:'bold'}}>{summary.column_names.filter(c=>isNumericType(summary.data_types[c])).length}</div>
									<div className="stats-label">Numeric Variables</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Step 3: Config */}
				{summary && (
					<div className="step-card" style={{background:'#fff', borderRadius:15, padding:25, marginBottom:25, boxShadow:'0 10px 30px rgba(0,0,0,.1)', borderLeft:'5px solid #3498db'}}>
						<div className="step-header" style={{display:'flex', alignItems:'center', marginBottom:20}}>
							<div className="step-number" style={{background:'#3498db', color:'#fff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', marginRight:15}}>3</div>
							<h3 className="step-title" style={{margin:0, color:'#2c3e50'}}>Processing Configuration</h3>
						</div>

						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<div className="d-flex align-items-center justify-content-between mb-2">
								<h5 className="mb-0"><i className="fas fa-magic me-2"></i> Missing Value Imputation</h5>
							</div>
							<div className="row g-3">
								<div className="col-md-4">
									<label className="form-label">Imputation Method</label>
									<select className="form-select form-select-sm" value={config.imputation.method} onChange={(e)=> setConfig(c=>({...c, imputation:{...c.imputation, method:e.target.value}}))}>
										<option value="mean">Mean</option>
										<option value="median">Median</option>
										<option value="knn">K-Nearest Neighbors (KNN)</option>
									</select>
								</div>
								<div className="col-md-8">
									<label className="form-label">Target Columns</label>
									<select className="form-select" multiple size="8" value={config.imputation.columns} onChange={(e)=>{
										const opts = Array.from(e.target.selectedOptions).map(o=>o.value)
										setConfig(c=>({...c, imputation:{...c.imputation, columns:opts}}))
									}}>
										{summary.column_names.map((c)=>(<option key={c} value={c}>{c}</option>))}
									</select>
									<small className="text-muted">Leave empty to process all numeric columns</small>
								</div>
							</div>
						</div>

						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<div className="d-flex align-items-center justify-content-between mb-2">
								<h5 className="mb-0"><i className="fas fa-exclamation-triangle me-2"></i> Outlier Detection & Handling</h5>
							</div>
							<div className="row g-3">
								<div className="col-md-4">
									<label className="form-label">Detection Method</label>
									<select className="form-select form-select-sm" value={config.outliers.detection_method} onChange={(e)=> setConfig(c=>({...c, outliers:{...c.outliers, detection_method:e.target.value}}))}>
										<option value="iqr">Interquartile Range (IQR)</option>
										<option value="zscore">Z-Score</option>
										<option value="isolation_forest">Isolation Forest</option>
									</select>
								</div>
								<div className="col-md-4">
									<label className="form-label">Handling Method</label>
									<select className="form-select form-select-sm" value={config.outliers.handling_method} onChange={(e)=> setConfig(c=>({...c, outliers:{...c.outliers, handling_method:e.target.value}}))}>
										<option value="winsorize">Winsorization</option>
										<option value="remove">Remove Outliers</option>
									</select>
								</div>
								<div className="col-md-4">
									<label className="form-label">Target Columns</label>
									<select className="form-select" multiple size="8" value={config.outliers.columns} onChange={(e)=>{
										const opts = Array.from(e.target.selectedOptions).map(o=>o.value)
										setConfig(c=>({...c, outliers:{...c.outliers, columns:opts}}))
									}}>
										{summary.column_names.map((c)=>(<option key={c} value={c}>{c}</option>))}
									</select>
								</div>
							</div>
						</div>

						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<div className="d-flex align-items-center justify-content-between mb-2">
								<h5 className="mb-0"><i className="fas fa-balance-scale me-2"></i> Survey Weights & Estimation</h5>
							</div>
							<div className="row g-3">
								<div className="col-md-6">
									<label className="form-label">Weight Column</label>
									<select className="form-select form-select-sm" value={config.weights.column} onChange={(e)=> setConfig(c=>({...c, weights:{ column:e.target.value }}))}>
										<option value="">No weights</option>
										{numericColumns.map((c)=>(<option key={c} value={c}>{c}</option>))}
									</select>
								</div>
								<div className="col-md-6">
									<label className="form-label">Estimation Columns</label>
									<select className="form-select" multiple size="8" value={config.estimate_columns} onChange={(e)=>{
										const opts = Array.from(e.target.selectedOptions).map(o=>o.value)
										setConfig(c=>({...c, estimate_columns:opts}))
									}}>
										{numericColumns.map((c)=>(<option key={c} value={c}>{c}</option>))}
									</select>
									<small className="text-muted">Leave empty to process all numeric columns</small>
								</div>
							</div>
						</div>

						<div className="text-center mt-4">
							<button className="btn btn-primary btn-lg" onClick={startProcessing} disabled={busy}>
								<i className="fas fa-cogs"></i> {busy? 'Processing...' : 'Process Data'}
							</button>
						</div>
					</div>
				)}

				{/* Step 4: Results */}
				{results && (
					<div className="step-card" style={{background:'#fff', borderRadius:15, padding:25, marginBottom:25, boxShadow:'0 10px 30px rgba(0,0,0,.1)', borderLeft:'5px solid #3498db'}}>
						<div className="step-header" style={{display:'flex', alignItems:'center', marginBottom:20}}>
							<div className="step-number" style={{background:'#3498db', color:'#fff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', marginRight:15}}>4</div>
							<h3 className="step-title" style={{margin:0, color:'#2c3e50'}}>Processing Results</h3>
						</div>

						{/* Log */}
						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<h5><i className="fas fa-list"></i> Processing Log</h5>
							<div style={{maxHeight:200, overflowY:'auto'}}>
								{results.cleaning_log.map((log, idx) => (
									<div key={idx} className="log-entry" style={{background:'#f8f9fa', borderLeft:'4px solid #3498db', padding:'10px 15px', margin:'5px 0', borderRadius:5}}>• {log}</div>
								))}
							</div>
						</div>

						{/* Estimates */}
						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<h5><i className="fas fa-calculator"></i> Statistical Estimates</h5>
							{Object.keys(results.estimates || {}).length > 0 ? (
								<div className="estimates-table" style={{background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 5px 15px rgba(0,0,0,.1)'}}>
									<table className="table table-striped">
										<thead>
											<tr>
												<th>Variable</th>
												<th>Mean</th>
												<th>Std Dev</th>
												<th>Standard Error</th>
												<th>95% CI Lower</th>
												<th>95% CI Upper</th>
											</tr>
										</thead>
										<tbody>
											{Object.entries(results.estimates).map(([variable, est]) => {
												const e = est.weighted || est.unweighted
												return (
													<tr key={variable}>
														<td><strong>{variable}</strong></td>
														<td>{Number(e.mean).toFixed(4)}</td>
														<td>{Number(e.std).toFixed(4)}</td>
														<td>{Number(e.se).toFixed(4)}</td>
														<td>{Number(e.ci_95_lower).toFixed(4)}</td>
														<td>{Number(e.ci_95_upper).toFixed(4)}</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							) : (<p className="text-muted">No estimates available</p>)}
						</div>

						{/* Visualizations */}
						<div className="config-section" style={{background:'#f8f9fa', borderRadius:10, padding:20, margin:'15px 0'}}>
							<h5><i className="fas fa-chart-bar"></i> Data Visualizations</h5>
							{Object.keys(results.plots || {}).length > 0 ? (
								<div>
									{Object.entries(results.plots).map(([name, html]) => (
										<div key={name} className="mb-4" dangerouslySetInnerHTML={{ __html: html }} />
									))}
								</div>
							) : (<p className="text-muted">No visualizations available</p>)}
						</div>

						{/* Actions */}
						<div className="text-center mt-4">
							<button className="btn btn-primary me-3" onClick={()=>generateReport('pdf')}><i className="fas fa-file-pdf"></i> Download PDF Report</button>
							<button className="btn btn-primary me-3" onClick={()=>generateReport('html')}><i className="fas fa-file-code"></i> Generate HTML Report</button>
							<button className="btn btn-primary" onClick={downloadData}><i className="fas fa-download"></i> Download Processed Data</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}



