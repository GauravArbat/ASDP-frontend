import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Register(){
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const navigate = useNavigate()

	async function onSubmit(e){
		e.preventDefault()
		setError(''); setSuccess('')
		try{
			const res = await fetch('/api/auth/register', { 
				method:'POST', 
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password, confirm }),
				credentials: 'include'
			})
			const data = await res.json()
			if(!res.ok){
				throw new Error(data.error || `HTTP ${res.status}`)
			}
			setSuccess('Account created')
			navigate('/')
		}catch(err){ setError(err.message) }
	}

	return (
		<div>
			<Navbar />
			<div className="container d-flex align-items-center justify-content-center" style={{minHeight:'80vh'}}>
			<div className="card shadow" style={{maxWidth:520, width:'100%', borderRadius:18}}>
				<div className="card-header bg-success text-white d-flex align-items-center justify-content-between">
					<div className="fw-bold"><i className="fas fa-user-plus me-2"></i>Create account</div>
					<button type="button" className="btn btn-sm btn-outline-light" onClick={()=>navigate(-1)}>Back</button>
				</div>
				<div className="card-body">
					{error && <div className="alert alert-danger">{error}</div>}
					{success && <div className="alert alert-success">{success}</div>}
					<form onSubmit={onSubmit} noValidate>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
							<input className="form-control" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
						</div>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-envelope"></i></span>
							<input className="form-control" type="email" placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
						</div>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
							<input className="form-control" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
						</div>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-check"></i></span>
							<input className="form-control" type="password" placeholder="Confirm password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
						</div>
						<button className="btn btn-success w-100" type="submit">Create account</button>
					</form>
					<div className="text-center mt-3">
						<Link to="/login">Already have an account? Sign in</Link>
					</div>
				</div>
			</div>
			</div>
		</div>
	)
}



