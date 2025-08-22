import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function Login(){
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const { login } = useAuth()

	async function onSubmit(e){
		e.preventDefault()
		setError('')
		try{
			await login(username, password)
			// Decide destination based on current user role
			try{
				const res = await fetch('/api/auth/me', { credentials:'include' })
				const data = await res.json()
				if(res.ok && data.is_authenticated){
					navigate(data.user.role === 'admin' ? '/admin' : '/')
					return
				}
			}catch{
				// Continue to home page if role check fails
			}
			navigate('/')
		}catch(err){ setError(err.message) }
	}

	return (
		<div>
			<Navbar />
			<div className="container d-flex align-items-center justify-content-center" style={{minHeight:'80vh'}}>
			<div className="card shadow" style={{maxWidth:460, width:'100%', borderRadius:18}}>
				<div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
					<div className="fw-bold"><i className="fas fa-lock me-2"></i>Sign in</div>
					<button type="button" className="btn btn-sm btn-outline-light" onClick={()=>navigate(-1)}>Back</button>
				</div>
				<div className="card-body">
					<p className="text-muted">Access your workspace. Admins can open the dashboard after sign-in.</p>
					{error && <div className="alert alert-danger">{error}</div>}
					<form onSubmit={onSubmit} noValidate>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
							<input className="form-control" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
						</div>
						<div className="mb-3 input-group">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
							<input className="form-control" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
						</div>
						<button className="btn btn-primary w-100" type="submit">Login</button>
					</form>
					<div className="d-flex justify-content-between align-items-center mt-3">
						<Link to="/register">Create account</Link>
						<Link to="/admin" className="btn btn-warning btn-sm">Admin</Link>
					</div>
				</div>
			</div>
			</div>
		</div>
	)
}



